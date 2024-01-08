import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, la langue par défaut est-elle présente ?
 * Traite: C, NC
 */
export default class Criterion8_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    let isCriteriaValid = true;

    const htmlElement = document.documentElement;
    const langAttribute = htmlElement.getAttribute('lang');
    const xmlLangAttribute = htmlElement.getAttribute('xml:lang');

    // L'indication de la langue de la page (attribut lang et/ou xml:lang) est donnée pour l'élément html.
    if (langAttribute || xmlLangAttribute) {
      isCriteriaValid = true;
    } else {
      // L'indication de la langue de la page (attribut lang et/ou xml:lang) est donnée sur chaque élément de texte ou sur l'un des éléments parents.
      const textElements = document.querySelectorAll('p, span, div'); // Sélectionnez les éléments de texte pertinents
      let isLanguageDefinedForAllTextElements = true;

      textElements.forEach((element) => {
        const langAttribute = element.getAttribute('lang');
        const xmlLangAttribute = element.getAttribute('xml:lang');

        if (!langAttribute && !xmlLangAttribute) {
          isLanguageDefinedForAllTextElements = false;
        }
      });

      isCriteriaValid = isLanguageDefinedForAllTextElements;
    }

    let status = isCriteriaValid ? 'C' : 'NC';
    let message = isCriteriaValid ? "La langue par défaut est présente." : "La langue par défaut n'est pas présente.";
    this.updateCriteria('8.3', status, message);
    this.updateTest('8.3.1', status);

    return status;
  }
}
