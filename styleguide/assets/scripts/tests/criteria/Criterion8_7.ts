import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion8_7 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = '*[lang]:not(html), *[xml\\:lang]:not(html)';
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les changements de langue sont correctement indiqués.";
    let $elementList = document.querySelectorAll(this.querySelector);

    if($elementList.length === 0) {
      message = "Aucun changement de langue n'a été détecté. Vérifiez si les changements de langue sont correctement indiqués.";
    }

    // 8.7.1
    this.updateCriteria('8.7', status, message);
    this.updateTest('8.7.1', $elementList.length > 0 ? 'NT' : 'NA');

    if($elementList.length > 0) {
      this.logResults('8.7 - Liste des changements de langue', $elementList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('lang') || $element.getAttribute('xml:lang');
  }
}

