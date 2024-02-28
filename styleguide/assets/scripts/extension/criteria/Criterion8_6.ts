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
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    // Pour chaque page web ayant un titre de page (balise <title>), le contenu de cette balise est-il pertinent ?
    let title = '';
    let status = 'NT';
    let message = "Aucun titre n'est défini, le critère n'est pas applicable.";
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      status = 'NA';

    } else {
      title = pageTitleElement.innerText;
      message = `Titre de la page: <strong>${title}</strong>.<br />Vériﬁez que le titre de la page est pertinent et unique.`;
    }

    this.updateCriteria('8.6', status, message);
    this.updateTest('8.6.1', status);

    return status;
  }
}
