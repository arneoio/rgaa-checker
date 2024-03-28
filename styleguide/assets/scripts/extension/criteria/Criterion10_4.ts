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
  }

  getHighlightSwitchLabel() {
    return "Zoomer à 200%";
  }

  activateHighlight(): void {
    this.sendActionMessage('zoomIn');
  }

  resetHighlight(): void {
    this.sendActionMessage('zoomBack');
  }

  runTest() {
    this.status = 'NT';
    let message = "Zoomez le texte à 200% et vérifiez s'il reste lisible.";

    this.updateCriteria('10.4', status, message);
    this.updateTest('10.4.1', status);
    this.updateTest('10.4.2', status);

    return 'NT';
  }
}

