/*
 * Criterion5_7.ts - Copyright (c) 2023-2024 - Arneo
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

/**
 * Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?
 * Traite: NA, NC, NT
 */
export default class Criterion5_7 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table:not([role="presentation"]), [role="table"]';
    this.messageList = {
      'NT': "Les tableaux ont bien des entêtes associés. Vérifiez si ils correctement associés aux cellules.",
      'NC': "Tous les tableaux de données n'ont pas d'en-tête de colonne ou de ligne correctement associés.",
      'NA': "Aucun tableau de données n'a été trouvé.",
      'C': 'Tous les tableaux de données ont des en-têtes de colonne et/ou de ligne correctement associés.'
    }
  }

  runTest() {
    this.status = 'NA';

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
      Array.from($tableList).forEach(($table: HTMLTableElement) => {
        let isValid = false;
        let hasTh = false;

        // Check if <th> is present in the table
        let thElements = $table.querySelectorAll('th');
        hasTh = thElements.length > 0;

        if (hasTh) {
          // Check if the table has a single row or a single column of <th>
          const rows = $table.querySelectorAll('tr');
          const columns = $table.querySelectorAll('tr > th');

          // If all cells in a row or column are <th>, then the table is valid for this case
          const isSingleRowOfTh = rows.length === 1 && columns.length === rows[0].children.length;
          const isSingleColumnOfTh = columns.length === 1 && rows.length === $table.rows.length;

          if (isSingleRowOfTh || isSingleColumnOfTh) {
            isValid = true;
          }

          // Check if each <th> has a unique id, a scope attribute or a correct WAI-ARIA role
          thElements.forEach(($th: HTMLTableCellElement) => {
            if ($th.id) {
              isValid = true;
            } else if ($th.hasAttribute('scope')) {
              isValid = true;
              // Checks if the scope attribute is valid: row for lines, col for columns
              if ($th.getAttribute('scope') !== 'row' && $th.getAttribute('scope') !== 'col') {
                isValid = false;
              }
            } else if ($th.getAttribute('role') === 'rowheader' || $th.getAttribute('role') === 'columnheader') {
              isValid = true;
            }
          });
        }

        if (isValid) {
          this.status = 'NT';
        } else {
          this.status = 'NC';
        }
      });
    }

    if ($tableList.length > 0) {
      this.logResults('5.7 - Liste des tableaux de données', $tableList);
    }

    this.testList = {
      '1': this.status,
      '2': this.status,
      '3': this.status,
      '4': this.status,
      '5': this.status,
    }

    this.elementList = Array.from($tableList) as Array<HTMLElement>;

    return this.status;
  }
}
