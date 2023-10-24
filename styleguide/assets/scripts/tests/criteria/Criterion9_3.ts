import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque liste est-elle correctement structurée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion9_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'ul, ol, dl, [role="list"]';
    this.initHighlight();
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les éléments mis en liste sont corrects et s'il n'en manque pas.";
    let $elementList = document.querySelectorAll(this.querySelector);

    // 9.3.1: ul et [role="list"]
    let $ulList = document.querySelectorAll('ul, [role="list"]');
    // 9.3.2: ol et [role="list"]
    let $olList = document.querySelectorAll('ol, [role="list"]');
    // 9.3.3: dl
    let $dlList = document.querySelectorAll('dl');

    this.updateCriteria('9.3', status, message);
    this.updateTest('9.3.1', $ulList.length > 0 ? 'NT' : 'NA');
    this.updateTest('9.3.2', $olList.length > 0 ? 'NT' : 'NA');
    this.updateTest('9.3.3', $dlList.length > 0 ? 'NT' : 'NA');

    if($elementList.length > 0) {
      this.logResults('9.3 - Liste des listes', $elementList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

