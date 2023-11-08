import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_3 extends BaseCriterion {
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
      message = "Vérifiez si les étiquettes des champs de formulaire ayant la même fonction et répétées dans la page sont pertinentes.";
    }

    this.updateCriteria('11.3', status, message);
    this.updateTest('11.3.1', status);
    this.updateTest('11.3.2', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

