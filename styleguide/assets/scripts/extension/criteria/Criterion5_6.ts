/*
 * Criterion5_6.ts - Copyright (c) 2023-2024 - Arneo
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
export default class Criterion5_6 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table:not([role="presentation"]), [role="table"]';
    this.messageList = {
      'NT': "Vérifiez si les tableaux de données ont des entêtes de colonne et/ou de ligne.",
      'NC': "Tous les tableaux de données n'ont pas d'en-tête de colonne ou de ligne correctement déclaré.",
      'NA': "Aucun tableau de données n'a été trouvé.",
      'C': 'Tous les tableaux de données ont des en-têtes de colonne et/ou de ligne correctement déclarés.'
    }
  }

  runTest() {
    this.status = 'NA';

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
      // Checks if table has at least one header
      Array.from($tableList).forEach(($table: HTMLTableElement) => {
        if ($table.querySelectorAll('th, [role="columnheader"], [role="rowheader"]').length > 0) {
          this.status = 'NT';
        } else {
          this.status = 'NC';
        }
      });
    }

    if ($tableList.length > 0) {
      this.logResults('5.6 - Liste des tableaux de données', $tableList);
    }

    this.testList = {
      '1': this.status,
      '2': this.status,
      '3': this.status,
      '4': this.status,
    }

    this.elementList = Array.from($tableList) as Array<HTMLElement>;

    return this.status;
  }
}
