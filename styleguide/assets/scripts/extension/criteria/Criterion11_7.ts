import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_7 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun regroupement de champ n'a été trouvé.";

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les légendes associés aux regroupements de champs sont pertinentes.";
    }

    this.updateCriteria('11.7', status, message);
    this.updateTest('11.7.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé du regroupement de champ
    let label = '';
    if ($element.tagName === 'FIELDSET') {
      label = $element.querySelector('legend')?.textContent || '';
    } else if ($element.getAttribute('aria-label')) {
      label = $element.getAttribute('aria-label') || '';
    } else if ($element.getAttribute('aria-labelledby')) {
      const id = $element.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      if (labelElement) {
        label = labelElement.textContent || '';
      }
    }

    return label;
  }
}

