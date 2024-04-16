/*
 * Criterion10_4.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_4 extends BaseCriterion {
  zoomFactor: number = 1;

  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'NT': "Zoomez le texte à 200% et vérifiez s'il reste lisible.",
      'C': "Le texte reste lisible à 200%.",
      'NC': "Le texte n'est pas lisible à 200%."
    };
  }

  getHighlightSwitchLabel() {
    return "Zoomer à 200%";
  }

  activateHighlight(): void {
    console.log('activate highlight');
    chrome.runtime.sendMessage({ action: "zoomIn" });
  }

  resetHighlight(): void {
    console.log('resetHighlight highlight');
    chrome.runtime.sendMessage({ action: "zoomBack" });
  }

  runTest() {
    this.status = 'NT';

    this.testList = {
      '1': this.status,
      '2': this.status
    };

    return 'NT';
  }
}

