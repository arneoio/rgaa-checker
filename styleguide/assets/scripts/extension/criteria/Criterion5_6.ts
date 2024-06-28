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
 * Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?
 * Traite: NA, NT
 */
export default class Criterion5_6 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table:not([role="presentation"])';
    this.messageList = {
      'NT': "Vérifiez si les tableaux de données ont un titre pertinent.",
      'NA': "Aucun tableau de données n'a été trouvé."
    }
  }

  runTest() {
    this.status = 'NA';

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
      this.status = 'NT';
    }

    if ($tableList.length > 0) {
      this.logResults('5.5 - Liste des tableaux de données', $tableList);
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = Array.from($tableList) as Array<HTMLElement>;

    return this.status;
  }
}
