import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_11 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun formulaire n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll('form'));

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les controles de saisie sont pertinents";
    }

    this.updateCriteria('11.11', status, message);
    this.updateTest('11.11.1', status);
    this.updateTest('11.11.2', status);

    return status;
  }
}

