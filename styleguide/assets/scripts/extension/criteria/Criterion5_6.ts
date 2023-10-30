import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?
 * Traite: NA, NT
 */
export default class Criterion5_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'table:not([role="presentation"])';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau de données n'a été trouvé.";

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
    }

    this.updateCriteria('5.5', status, message);
    this.updateTest('5.5.1', status);

    if ($tableList.length > 0) {
      this.logResults('5.5 - Liste des tableaux de données', $tableList);
    }

    return status;
  }
}
