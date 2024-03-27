/*
 * Criterion5_1.ts - Copyright (c) 2023-2024 - Arneo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Chaque tableau de données complexe a-t-il un résumé ?
 * Traite: NA, C, NC
 */
export default class Criterion5_1 extends BaseCriterion {
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
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

