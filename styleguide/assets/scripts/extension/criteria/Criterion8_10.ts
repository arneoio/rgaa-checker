import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, les changements du sens de lecture sont-ils signalés ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion8_10 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    // Détecte le changement de direction du texte
    this.querySelector = '*[dir]:not(html)';
    this.initHighlight();
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les changements de direction du texte indiqués sont pertinents.";
    let $elementList = document.querySelectorAll(this.querySelector);

    if($elementList.length === 0) {
      message = "Aucun changement de direction du texte n'a été détecté. Vérifiez si il devrait y en avoir.";
    } else {
      // Vérifie si l'attribut dir est correctement renseigné
      Array.from($elementList).forEach(($element: HTMLElement) => {
        let dir = $element.getAttribute('dir');
        if(dir !== 'ltr' && dir !== 'rtl') {
          status = 'NC';
          message = `L'attribut dir <span>${dir}</span> n'est pas valide.`;
        }
      });
    }

    this.updateCriteria('8.10', status, message);
    this.updateTest('8.10.1', $elementList.length > 0 ? 'NT' : 'NA');
    this.updateTest('8.10.2', $elementList.length > 0 ? status : 'NA');

    if($elementList.length > 0) {
      this.logResults('8.10 - Liste des changements de direction du texte', $elementList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('dir');
  }
}

