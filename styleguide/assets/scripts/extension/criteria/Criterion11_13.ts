import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_13 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun formulaire n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll('form'));

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez le critère manuellement.";
    }

    this.updateCriteria('11.13', status, message);
    this.updateTest('11.13.1', status);

    return status;
  }
}

