import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Chaque tableau de données complexe a-t-il un résumé ?
 * Traite: NA, C, NC
 */
export default class Criterion5_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let status = 'NA';

    let $complexTableList = TableUtils.getComplexTableList();
    let notDescribedTableList: Array<HTMLTableElement> = [];
    if($complexTableList.length) {

      $complexTableList.forEach(($table: HTMLTableElement) => {
        let tableDescription = TableUtils.getComplexTableDescription($table);
        if(!tableDescription) {
          notDescribedTableList.push($table);
        }
      });

      status = notDescribedTableList.length === 0 ? 'C' : 'NC';
    }

    this.updateCriteria('5.1', status);
    this.updateTest('5.1.1', status);

    if(notDescribedTableList.length > 0) {
      this.logResults('5.1 - Tableaux complexes non décrits', notDescribedTableList);
    }
  }
}

