import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque page web est-elle définie par un type de document ?
 * Traite: C, NC
 */
export default class Criterion8_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let isCriteriaValid = true;
    const htmlDocument = document.documentElement;
    let isDoctypeBeforeHtml = false;
    let isValidDoctype = false;

    // Vérifiez la présence de la balise DOCTYPE
    const hasDoctype = document.doctype !== null;
    if(!hasDoctype) {
      isCriteriaValid = false;
    } else {
      // Vérifiez que la balise DOCTYPE est placée avant la balise <html>
      isDoctypeBeforeHtml = htmlDocument.compareDocumentPosition(document.doctype) === Node.DOCUMENT_POSITION_PRECEDING;
      // Vérifiez que le type de document est valide (par exemple, <!DOCTYPE html>)
      isValidDoctype = document.doctype.name === 'html';
      if(!isDoctypeBeforeHtml || !isValidDoctype) {
        isCriteriaValid = false;
      }
    }
    let status = isCriteriaValid ? 'C' : 'NC';
    let $criteriaCard = this.$wrapper.querySelector('.js-criteriaCard[data-criteria="8.1"') as HTMLElement;
    if(!$criteriaCard) {
      return;
    }

    // Pour chaque page web, le type de document (balise doctype) est-il présent ?
    this.updateTest('8.1.1', !hasDoctype ? 'NC' : 'C');
    // Pour chaque page web, le type de document (balise doctype) est-il valide ?
    this.updateTest('8.1.2', isDoctypeBeforeHtml ? 'C' : 'NC');
    // Pour chaque page web possédant une déclaration de type de document, celle-ci est-elle située avant la balise <html> dans le code source ?
    this.updateTest('8.1.3', isValidDoctype ? 'C' : 'NC');
    this.updateCriteria('8.1', status);
  }
}
