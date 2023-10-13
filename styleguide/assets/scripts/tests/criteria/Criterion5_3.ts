import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
 * Traite: NA, NT
 */
export default class Criterion5_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let status = 'NA';

    let $presentationTableList = document.querySelectorAll('table[role="presentation"]');
    if($presentationTableList.length) {
      status = 'NT';
    }

    this.updateCriteria('5.3', status);
    this.updateTest('5.3.1', status);

    if($presentationTableList.length > 0) {
      this.logResults('5.3 - Liste des tableaux de présentation', $presentationTableList);
    }
  }
}

