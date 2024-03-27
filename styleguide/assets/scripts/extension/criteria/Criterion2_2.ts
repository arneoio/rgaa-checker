/*
 * Criterion2_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion2_2 extends BaseCriterion {
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.querySelector = 'iframe, frame';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun cadre n'a été trouvé.";
    let frameTitleList: Array<any> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if ($frameList.length) {
      $frameList.forEach(($frame: HTMLElement) => {
        if ($frame.title) {
          frameTitleList.push({
            title: $frame.title,
            frame: $frame
          });
          status = 'NT';
        }
      });
    }

    this.updateCriteria('2.2', status);
    this.updateTest('2.2.1', status);

    if (frameTitleList.length > 0) {
      this.logResults('2.2 - Liste des titres des cadres', frameTitleList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

