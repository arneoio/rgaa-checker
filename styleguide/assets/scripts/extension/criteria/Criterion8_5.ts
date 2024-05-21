/*
 * Criterion8_5.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque page web a-t-elle un titre de page ?
 * Traite: C, NC
 */
export default class Criterion8_5 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'C': 'La page a un titre.',
      'NC': "La page n'a pas de titre."
    }
  }

  runTest() {
    // Retrouver dans le document le titre structuré au moyen d’un élément <title> ;
    let isCriteriaValid = true;
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      isCriteriaValid = false;
    }

    this.status = isCriteriaValid ? 'C' : 'NC';

    this.testList = {
      '1': this.status
    }

    return this.status;
  }
}
