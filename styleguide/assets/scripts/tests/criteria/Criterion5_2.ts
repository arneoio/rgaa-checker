import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion5_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let status = 'NA';

    let $complexTableList = TableUtils.getComplexTableList();
    let describedTableList: any = [];
    if($complexTableList.length) {

      $complexTableList.forEach(($table: HTMLTableElement) => {
        let tableDescription = TableUtils.getComplexTableDescription($table);
        if(tableDescription) {
          describedTableList.push({
            caption: tableDescription,
            table: $table
          });
        }
      });
      status = 'NT';
    }

    this.updateCriteria('5.2', status);
    this.updateTest('5.2.1', status);

    if(describedTableList.length > 0) {
      this.logResults('5.2 - Description des tableaux complexes', describedTableList);
    }
  }
}

