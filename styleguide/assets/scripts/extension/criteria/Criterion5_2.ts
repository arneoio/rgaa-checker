/**
Copyright 2024 - Arneo.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import BaseCriterion from '../common/BaseCriterion';
import TableUtils from '../utils/TableUtils';

/**
 * Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion5_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'table';
    this.initHighlight();
  }

  getHighlightedElements() {
    return TableUtils.getComplexTableList();
  }

  runTest() {
    let status = 'NA';

    let $complexTableList = TableUtils.getComplexTableList();
    let describedTableList: any = [];
    if ($complexTableList.length) {

      $complexTableList.forEach(($table: HTMLTableElement) => {
        let tableDescription = TableUtils.getComplexTableDescription($table);
        if (tableDescription) {
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

    if (describedTableList.length > 0) {
      this.logResults('5.2 - Description des tableaux complexes', describedTableList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('summary');
  }
}

