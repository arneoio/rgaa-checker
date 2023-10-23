import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);

    // // Désactive toutes les feuilles de style
    // function disableStyles() {
    //   const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    //   stylesheets.forEach((stylesheet) => {
    //     stylesheet.disabled = true;
    //   });
    // }

    // // Réactive toutes les feuilles de style
    // function enableStyles() {
    //   const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    //   stylesheets.forEach((stylesheet) => {
    //     stylesheet.disabled = false;
    //   });
    // }

  }

  runTest() {
  }
}

