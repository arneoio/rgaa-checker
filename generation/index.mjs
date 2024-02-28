/*
 * index.mjs - Copyright (c) 2023-2024 - Arneo
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

import console from './utils/console.mjs';
import fs from 'fs';
import * as path from 'path';
import markdown from 'markdown-it';
import Template from './templates.mjs';

const Builder = () => {
  let __dirname = path.resolve();
  let criterieFilePath = path.join(__dirname, 'generation/data/criteres.json');
  // set path from current directory

  let GLOSSARY_URL = 'https://accessibilite.numerique.gouv.fr/methode/glossaire/';
  let criteriaList = {};
  console.warn("Génération de l'extension d'accessibilité...");

  console.warn('Chargement des critères...');

  fs.readFile(criterieFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur de lecture du fichier JSON :', err);
      return;
    }

    try {
      criteriaList = JSON.parse(data);

      // Vous pouvez maintenant utiliser l'objet JSON chargé
      console.warn('Critères chargés avec succès');
      // Build l'extension
      let params = formatData(criteriaList);
      Template.buildExtension(params);
    } catch (erreur) {
      console.error('Erreur de parsing JSON :', erreur);
    }
  });

  /**
   * Format data to be used in templates
   * @param {object} criteriaList
   */
  const formatData = (criteriaList) => {
    // Set title and tests from markdown to html
    criteriaList.topics.forEach((topic) => {
      topic.slug = getSlug(topic.number);
      topic.criteria.forEach((criterium) => {
        criterium.criterium.title = formatCriteriaText(criterium.criterium.title);
        // loop through tests object entries
        Object.entries(criterium.criterium.tests).forEach(([key, test]) => {
          // test is a string or an array of string
          if (typeof test === 'string') {
            criterium.criterium.tests[key] = formatCriteriaText(test);
          } else {
            test.forEach((t, testKey) => {
              criterium.criterium.tests[key][testKey] = formatCriteriaText(t);
            });
          }
        });
      });
    });

    let params = {
      filterList: {
        filterList: [
          {
            slug: 'C',
            title: 'Conforme',
          },
          {
            slug: 'NC',
            title: 'Non Conforme',
          },
          {
            slug: 'NA',
            title: 'Non Applicable',
          },
          {
            slug: 'NT',
            title: 'Non Traité',
          },
        ],
      },
      topicList: criteriaList.topics,
    };
    return params;
  };

  const formatCriteriaText = (criteriaText) => {
    const md = new markdown();
    // Format md text to html, then replace anchor links to glossary url and add target blank
    return md.render(criteriaText).replace(/<a href="#([^"]*)">([^<]*)<\/a>/g, `<a href="${GLOSSARY_URL}#$1" target="_blank">$2</a>`);
  }

  /**
   * Get slug from title
   * @param {string} title
   */
  const getSlug = (topicNumber) => {
    // Based on RGAA topics, but translated in englishd
    switch (topicNumber) {
      case 1:
        return 'images';
      case 2:
        return 'frames';
      case 3:
        return 'colors';
      case 4:
        return 'multimedia';
      case 5:
        return 'tables';
      case 6:
        return 'links';
      case 7:
        return 'scripts';
      case 8:
        return 'mandatory';
      case 9:
        return 'structure';
      case 10:
        return 'presentation';
      case 11:
        return 'forms';
      case 12:
        return 'navigation';
      case 13:
        return 'consultation';
      default:
        return '';
    }
  };
};

export default Builder();
