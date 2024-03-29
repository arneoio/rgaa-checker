/*
 * templates.mjs - Copyright (c) 2023-2024 - Arneo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dotenv from 'dotenv';
import Twig from 'twig';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

let BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}`;

const args = process.argv.slice(2);
const applicationType = args[0];
if(applicationType) {
  BUILDER_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}/${applicationType}`;
}

const ASSETS_FOLDER = `${process.env.WEBPACK_BUILDER_FOLDER}`;

Twig.extendFilter('path', function (path) {
  path = path.replace('icons.svg', '');
  return path.replace(`/${ASSETS_FOLDER}/`, '');
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// set styleguide templates file path
const panelTemplate = `../styleguide/components/25-templates/panel/panel.html.twig`;

/**
 * Build Index page
 */
const buildExtension = (params) => {
  console.warn('Build extension template...');
  buildTemplate(panelTemplate, 'panel.html', params);
  updateManifestVersion();
};

/**
 * Build a template with header, footer and data
 * @param {string} templatePath path to the template in styleguide
 * @param {string} outputFileName name of the file to create
 * @param {object} params additional data to pass to the template
 */
const buildTemplate = (templateName, outputFileName, params = {}) => {
  const templatePath = path.join(__dirname, templateName);
  fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Cannot read file: ${templatePath}`, err);
      return;
    }

    let template = Twig.twig({
      base: '/',
      namespaces: {
        layout: path.join(__dirname, '../styleguide/components/05-layout'),
        atom: path.join(__dirname, '../styleguide/components/10-atoms'),
        molecule: path.join(__dirname, '../styleguide/components/15-molecules'),
        organism: path.join(__dirname, '../styleguide/components/20-organisms'),
      },
      data: data,
    });

    let templateRender = getHtmlHeader();

    // Adds footer params to every templates
    params.footer = {
      generationDate: getCurrentFormattedDate(),
      versionNumber: getAppVersion(),
    };
    templateRender += template.render(params);
    templateRender += getHtmlFooter();

    fs.mkdirSync(`./${BUILDER_FOLDER}/pages`, { recursive: true });

    fs.writeFile(
      `./${BUILDER_FOLDER}/pages/${outputFileName}`,
      templateRender,
      (err) => {
        if (err) {
          console.error('Template creation failed', err);
        } else {
          console.warn(`Template generated successfully: ${outputFileName}`);
        }
      },
    );
  });
};

/**
 * Gets the HTML for pages header, like in preview.html.twig
 */
let htmlHeader;
const getHtmlHeader = () => {
  if (!htmlHeader) {
    // Includes icons sprite inline
    const icons = fs.readFileSync(`./${BUILDER_FOLDER}/icons.svg`, {
      encoding: 'utf8',
      flag: 'r',
    });
    // Inject app.css content inline
    const appCss = fs.readFileSync(`./${BUILDER_FOLDER}/app.css`, {
      encoding: 'utf8',
      flag: 'r',
    });
    htmlHeader = `
          <style>${appCss}</style>
          <div class="-hidden">${icons}</div>
          <div id="arneo-browser-highlight"></div>
        `;
  }
  return htmlHeader;
};

/**
 * Gets the HTML for pages footer, like in preview.html.twig
 */
const getHtmlFooter = () => {
  return `
        <script src="../app.js"></script>
    `;
};

/**
 * Get app version from package.json
 */
let appVersion;
const getAppVersion = () => {
  if (!appVersion) {
    let packageFile = fs.readFileSync('./package.json', {
      encoding: 'utf8',
      flag: 'r',
    });
    let packageJson = JSON.parse(packageFile);
    appVersion = packageJson.version;
  }
  return appVersion;
};

/**
 * Update manifest version from package.json
 */
const updateManifestVersion = () => {
  let manifestFile = `./${BUILDER_FOLDER}/manifest.json`;
  let appVersion = getAppVersion();
  let manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.version = appVersion;
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
};

/**
 * Get current date in dd/mm/yyyy format
 *
 * @return  {string} current date in dd/mm/yyyy format
 */
const getCurrentFormattedDate = () => {
  let date = new Date();
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map((n) => (n < 10 ? `0${n}` : `${n}`))
    .join('/');
};

export default {
  buildExtension,
  getAppVersion,
};
