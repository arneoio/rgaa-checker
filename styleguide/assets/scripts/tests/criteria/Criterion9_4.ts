import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion9_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'q, blockquote';
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les citations correctes et s'il n'en manque pas.";
    let $elementList = document.querySelectorAll(this.querySelector);

    // 9.4.1: q
    let $qList = document.querySelectorAll('q');
    // 9.4.2: blockquote
    let $blockquoteList = document.querySelectorAll('blockquote');

    this.updateCriteria('9.4', status, message);
    this.updateTest('9.4.1', $qList.length > 0 ? 'NT' : 'NA');
    this.updateTest('9.4.2', $blockquoteList.length > 0 ? 'NT' : 'NA');

    if($elementList.length > 0) {
      this.logResults('9.4 - Liste des citations', $elementList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

