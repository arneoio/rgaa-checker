import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion8_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    // Pour chaque page web ayant un titre de page (balise <title>), le contenu de cette balise est-il pertinent ?
    let title = '';
    let status = 'NT';
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      status = 'NA';
    } else {
      title = pageTitleElement.innerText;
    }

    this.updateCriteria('8.6', status, `Titre de la page: <span>${title}</span>.`);
    this.updateTest('8.6.1', status);
  }
}
