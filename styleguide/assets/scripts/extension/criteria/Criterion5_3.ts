/*
 * Criterion5_3.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
 * Traite: NA, NT
 */
export default class Criterion5_3 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table[role="presentation"]';
    this.messageList = {
      'NT': "Vérifiez si les tableaux de présentation ont un contenu linéarisé compréhensible.",
      'NA': "Aucun tableau de présentation n'a été trouvé."
    }
  }

  runTest() {
    this.status = 'NA';

    let $presentationTableList = document.querySelectorAll('table[role="presentation"]');
    if ($presentationTableList.length) {
      this.status = 'NT';
    }

    if ($presentationTableList.length > 0) {
      this.logResults('5.3 - Liste des tableaux de présentation', $presentationTableList);
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = Array.from($presentationTableList) as Array<HTMLElement>;

    return this.status;
  }
}

