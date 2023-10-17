import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion8_8 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = '*[lang]:not(html), *[xml\\:lang]:not(html)';
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les changements de langue indiqués sont pertinents.";
    let $elementList = document.querySelectorAll(this.querySelector);

    if($elementList.length === 0) {
      status = 'NA';
      message = "Aucun changement de langue n'a été détecté.";
    }

    this.updateCriteria('8.8', status, message);
    this.updateTest('8.8.1', status);

    if($elementList.length > 0) {
      this.logResults('8.8 - Liste des changements de langue', $elementList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('lang') || $element.getAttribute('xml:lang');
  }
}

