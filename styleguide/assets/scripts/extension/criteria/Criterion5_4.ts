/*
 * Criterion5_4.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?
 * Traite: NA, C, NC
 */
export default class Criterion5_4 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table:not([role="presentation"])';
    this.messageList = {
      'C': 'Tous les tableaux de données ont un titre correctement associé.',
      'NC': "Tous les tableaux de données n'ont pas de titre correctement associé.",
      'NA': "Aucun tableau de données n'a été trouvé."
    }
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
    this.status = 'NA';

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
      this.status = 'C';
    }

    let $tableListWithoutCaption = this.getHighlightedElements();
    if ($tableListWithoutCaption.length > 0) {
      this.status = 'NC';
    }

    if ($tableListWithoutCaption.length > 0) {
      this.logResults('5.4 - Liste des tableaux de données sans titre', $tableListWithoutCaption);
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = $tableListWithoutCaption;

    return this.status;
  }
}

