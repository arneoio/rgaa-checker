import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?
 * Traite: NA, C, NC
 */
export default class Criterion5_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'table:not([role="presentation"])';
    this.initHighlight();
  }

  getHighlightedElements(): HTMLElement[] {
    let $tableList = document.querySelectorAll(this.querySelector);
    let $tableListWithoutCaption: HTMLElement[] = [];

    Array.from($tableList).forEach(($table: HTMLTableElement) => {
      let title = TableUtils.getTableDescription($table);

      if (!title) {
        $tableListWithoutCaption.push($table);
      }
    });

    return $tableListWithoutCaption;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau de données n'a été trouvé.";

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
      status = 'C';
      message = "Tous les tableaux de données ont un titre.";
    }

    let $tableListWithoutCaption = this.getHighlightedElements();
    if ($tableListWithoutCaption.length > 0) {
      status = 'NC';
      message = "Tous les tableaux de données n'ont pas de titre.";
    }

    this.updateCriteria('5.4', status, message);
    this.updateTest('5.4.1', status);

    if ($tableListWithoutCaption.length > 0) {
      this.logResults('5.4 - Liste des tableaux de données sans titre', $tableListWithoutCaption);
    }

    return status;
  }
}

