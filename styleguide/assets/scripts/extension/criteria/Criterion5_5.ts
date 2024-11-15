/*
 * Criterion5_5.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?
 * Traite: NA, NT
 */
export default class Criterion5_5 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table:not([role="presentation"]), [role="table"]';
    this.messageList = {
      'NT': "Vérifiez si les tableaux de données ont un titre pertinent.",
      'NA': "Aucun tableau de données n'a été trouvé."
    }
  }

  getHighlightedElements(): HTMLElement[] {
    let $tableList = document.querySelectorAll(this.querySelector);
    let $tableListWithCaption: HTMLElement[] = [];

    Array.from($tableList).forEach(($table: HTMLTableElement) => {
      let title = TableUtils.getTableDescription($table);

      if (title) {
        $tableListWithCaption.push($table);
      }
    });

    return $tableListWithCaption;
  }

  runTest() {
    this.status = 'NA';

    let $tableList = document.querySelectorAll(this.querySelector);

    let $tableListWithCaption = this.getHighlightedElements();
    if ($tableListWithCaption.length > 0) {
      this.logResults('5.4 - Liste des tableaux de données sans titre associé', $tableListWithCaption);
      this.status = 'NT';
    } else {
      if ($tableList.length) {
        this.status = 'NA';
        this.messageList['NA'] = "Les tableaux de données n'ont pas de titre associé.";
      }
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = Array.from($tableList) as Array<HTMLElement>;

    return this.status;
  }
}
