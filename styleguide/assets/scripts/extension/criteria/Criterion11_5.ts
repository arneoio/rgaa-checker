import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_5 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NT';
    let message = "Aucun regroupement de champ n'a été trouvé. Vérifiez s'i devrait y en avoir.";


    let $fieldList = document.querySelectorAll(FormUtils.getFormFieldQuerySelector());
    if ($fieldList.length === 0) {
      status = 'NA';
      message = "Aucun champ de formulaire n'a été trouvé";
    }

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      message = "Vérifiez si les regroupements de champs sont pertinents.";
    }

    this.updateCriteria('11.5', status, message);
    this.updateTest('11.5.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le type de regroupement de champ
    return $element.tagName === 'FIELDSET' ? $element.tagName : $element.getAttribute('role');
  }
}

