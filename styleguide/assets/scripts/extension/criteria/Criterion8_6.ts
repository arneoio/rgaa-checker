/*
 * Criterion8_6.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion8_6 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'NT': 'Vériﬁez que le titre de la page est pertinent et unique.',
      'NA': "Aucun titre n'est défini, le critère n'est pas applicable."
    }
  }

  runTest() {
    // Pour chaque page web ayant un titre de page (balise <title>), le contenu de cette balise est-il pertinent ?
    let title = '';
    this.status = 'NT';
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      this.status = 'NA';

    } else {
      title = pageTitleElement.innerText;
      this.messageList['NT'] = `Titre de la page: <strong>${title}</strong>.<br />Vériﬁez que le titre de la page est pertinent et unique.`;
      this.messageList['C'] = `Le titre de la page: <strong>${title}</strong> est pertinent et unique.`;
      this.messageList['NC'] = `Le titre de la page: <strong>${title}</strong> n'est pas pertinent ou unique.`;
    }

    this.testList = {
      '1': this.status
    }

    return this.status;
  }
}
