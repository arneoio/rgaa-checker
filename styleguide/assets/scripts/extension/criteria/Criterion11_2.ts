import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = FormUtils.getFormFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun champ de formulaire n'a été trouvé";
    let $elementList = document.querySelectorAll(this.querySelector);
    const labelFieldList: any = [];

    $elementList.forEach(($formField: HTMLElement) => {
      let label = FormUtils.getFormFieldLabel($formField);
      labelFieldList.push({ label: label, field: $formField });
    });

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les étiquettes des champs de formulaire sont pertinentes.";
    }

    this.updateCriteria('11.2', status, message);
    this.updateTest('11.2.1', status);
    this.updateTest('11.2.2', status);
    this.updateTest('11.2.3', status);
    this.updateTest('11.2.4', status);
    this.updateTest('11.2.5', status);
    this.updateTest('11.2.6', status);

    if ($elementList.length > 0) {
      this.logResults('11.2 - Liste des étiquettes de formulaire', labelFieldList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

