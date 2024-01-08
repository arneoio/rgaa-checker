import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque page web est-elle définie par un type de document ?
 * Traite: C, NC
 */
export default class Criterion8_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
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
    let message = isCriteriaValid ? "Le type de document est valide."
      : !hasDoctype ? "La balise DOCTYPE est manquante."
      : !isDoctypeBeforeHtml ? "La balise DOCTYPE n'est pas placée avant la balise <html>."
      : "Le type de document n'est pas valide.";

    this.updateCriteria('8.1', status, message);
    // Pour chaque page web, le type de document (balise doctype) est-il présent ?
    this.updateTest('8.1.1', !hasDoctype ? 'NC' : 'C');
    // Pour chaque page web, le type de document (balise doctype) est-il valide ?
    this.updateTest('8.1.2', isValidDoctype ? 'C' : 'NC');
    // Pour chaque page web possédant une déclaration de type de document, celle-ci est-elle située avant la balise <html> dans le code source ?
    this.updateTest('8.1.3', isDoctypeBeforeHtml ? 'C' : 'NC');

    return status;
  }
}
