/*
 * Criterion2_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque cadre a-t-il un titre de cadre ?
 * Traite: NA, C, NC
 */
export default class Criterion2_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'iframe, frame';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun cadre n'a été trouvé.";
    let untitledFrameList: Array<HTMLTableElement> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if ($frameList.length) {
      $frameList.forEach(($frame: HTMLTableElement) => {
        if (!$frame.title) {
          untitledFrameList.push($frame);
        }
      });

      status = untitledFrameList.length === 0 ? 'C' : 'NC';
      message = untitledFrameList.length === 0 ? "Tous les cadres ont un titre." : "Certains cadres n'ont pas de titre.";
    }

    this.updateCriteria('2.1', status, message);
    this.updateTest('2.1.1', status);

    if (untitledFrameList.length > 0) {
      this.logResults('2.1 - Cadres sans titre', untitledFrameList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

