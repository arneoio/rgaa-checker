import console from './utils/console.mjs';
import fs from 'fs';
import * as path from 'path';
import markdown from 'markdown-it';
import Template from './templates.mjs';

const Builder = () => {
  let __dirname = path.resolve();
  let criterieFilePath = path.join(__dirname, 'generation/data/criteres.json');
  // set path from current directory

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
      console.log('Critères chargés avec succès');
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
    const md = new markdown();
    // Set title and tests from markdown to html
    criteriaList.topics.forEach((topic) => {
      topic.slug = getSlug(topic.number);
      topic.criteria.forEach((criterium) => {
        criterium.criterium.title = md.render(criterium.criterium.title);
        // loop through tests object entries
        Object.entries(criterium.criterium.tests).forEach(([key, test]) => {
          // test is a string or an array of string
          if (typeof test === 'string') {
            criterium.criterium.tests[key] = md.render(test);
          } else {
            test.forEach((t, testKey) => {
              criterium.criterium.tests[key][testKey] = md.render(t);
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
