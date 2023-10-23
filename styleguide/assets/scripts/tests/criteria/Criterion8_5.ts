import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque page web a-t-elle un titre de page ?
 * Traite: C, NC
 */
export default class Criterion8_5 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    // Retrouver dans le document le titre structuré au moyen d’un élément <title> ;
    let isCriteriaValid = true;
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      isCriteriaValid = false;
    } else {
    }

    let status = isCriteriaValid ? 'C' : 'NC';
    let message = isCriteriaValid ? "La page a un titre." : "La page n'a pas de titre.";
    this.updateCriteria('8.5', status, message);
    this.updateTest('8.5.1', status);
  }
}
