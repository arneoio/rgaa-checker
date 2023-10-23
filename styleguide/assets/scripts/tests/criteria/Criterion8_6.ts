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
    let message = "Aucun titre n'est défini, le critère n'est pas applicable.";
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      status = 'NA';

    } else {
      title = pageTitleElement.innerText;
      message = `Titre de la page: <strong>${title}</strong>.<br />Vériﬁez que le titre de la page est pertinent et unique.`;
    }

    this.updateCriteria('8.6', status, message);
    this.updateTest('8.6.1', status);
  }
}
