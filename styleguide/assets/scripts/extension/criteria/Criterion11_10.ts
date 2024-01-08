import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_10 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun formulaire n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll('form'));

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les controles de saisie sont pertinents";
    }

    this.updateCriteria('11.10', status, message);
    this.updateTest('11.10.1', status);
    this.updateTest('11.10.2', status);
    this.updateTest('11.10.3', status);
    this.updateTest('11.10.4', status);
    this.updateTest('11.10.5', status);
    this.updateTest('11.10.6', status);
    this.updateTest('11.10.7', status);

    return status;
  }
}

