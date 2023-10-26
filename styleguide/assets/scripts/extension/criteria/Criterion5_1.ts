import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Chaque tableau de données complexe a-t-il un résumé ?
 * Traite: NA, C, NC
 */
export default class Criterion5_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'table, [role="table"]';
    this.initHighlight();
  }

  getHighlightedElements(): Array<HTMLElement> {
    // Sélectionnez tous les tableaux complexes sans résumé
    const complexTableListWithoutDescription: any = [];

    const $complexTableList = TableUtils.getComplexTableList();
    if ($complexTableList.length) {
      $complexTableList.forEach(($table: HTMLTableElement) => {
        let tableDescription = TableUtils.getComplexTableDescription($table);
        if (!tableDescription) {
          complexTableListWithoutDescription.push($table);
        }
      });
    }

    return complexTableListWithoutDescription;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau complexe n'a été trouvé.";

    let $complexTableList = TableUtils.getComplexTableList();
    let notDescribedTableList: Array<HTMLTableElement> = [];
    if ($complexTableList.length) {

      $complexTableList.forEach(($table: HTMLTableElement) => {
        let tableDescription = TableUtils.getComplexTableDescription($table);
        if (!tableDescription) {
          notDescribedTableList.push($table);
        }
      });

      status = notDescribedTableList.length === 0 ? 'C' : 'NC';
      message = notDescribedTableList.length === 0 ? "Tous les tableaux complexes ont un résumé." : "Certains tableaux complexes n'ont pas de résumé.";
    }

    this.updateCriteria('5.1', status, message);
    this.updateTest('5.1.1', status);

    if (notDescribedTableList.length > 0) {
      this.logResults('5.1 - Tableaux complexes non décrits', notDescribedTableList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('summary');
  }
}

