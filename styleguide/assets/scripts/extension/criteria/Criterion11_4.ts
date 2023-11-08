import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = FormUtils.getFormFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun champ de formulaire n'a été trouvé";
    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les étiquettes sont accolées aux champs.";
    }

    this.updateCriteria('11.4', status, message);
    this.updateTest('11.4.1', status);
    this.updateTest('11.4.2', status);
    this.updateTest('11.4.3', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

