require('dotenv').config();
const { resolve } = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;

const COMPONENTS_PREVIEW_FOLDER = '/components/preview';
const STYLEGUIDE_FOLDER = `./${process.env.FRACTAL_BUILDER_FOLDER}${COMPONENTS_PREVIEW_FOLDER}`;
const PREVIEW_URL = `${process.env.STYLEGUIDE_URL}${COMPONENTS_PREVIEW_FOLDER}`;

const scenarioDefaultConfig = {
  label: 'Config name',
  url: 'http://localhost:3000/components/preview/component-name',
  referenceUrl: '',
  readyEvent: '',
  readySelector: '',
  delay: 0,
  hideSelectors: [],
  removeSelectors: [],
  hoverSelector: '',
  clickSelector: '',
  postInteractionWait: 0,
  selectors: [],
  selectorExpansion: true,
  expect: 0,
  misMatchThreshold: 0.1,
  requireSameDimensions: true,
};

let backstopConfig = fs.readFileSync('backstop-default.json');
let backstopJson = JSON.parse(backstopConfig);

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
  fs.writeFile(
    './backstop.json',
    JSON.stringify(backstopJson, null, 4),
    (err) => {
      if (err) {
        throw err;
      }
      console.log('Backstop config generated!');
    },
  );
}

(async () => {
  for await (const fileName of getFiles(STYLEGUIDE_FOLDER)) {
    if (fileName.endsWith('.html')) {
      var htmlFileRegex = /[-a-z0-9]+\.html/g;
      var htmlFile = htmlFileRegex.exec(fileName)[0];
      appendScenario(htmlFile);
    }
  }
})();

function appendScenario(htmlFile) {
  htmlFile = htmlFile.replace('.html', '');
  let scenarioConfig = Object.assign({}, scenarioDefaultConfig);
  let scenarioName = `${htmlFile[0].toUpperCase()}${htmlFile
    .slice(1)
    .replace(/-/g, ' ')
    .replace(/ {2}/g, ' - ')}`;
  scenarioConfig.label = scenarioName;
  scenarioConfig.url = `${PREVIEW_URL}/${htmlFile}`;
  backstopJson.scenarios.push(scenarioConfig);
}
