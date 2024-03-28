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
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'iframe, frame';
    this.messageList = {
      'C': 'Tous les cadres ont un titre.',
      'NC': "Certains cadres n'ont pas de titre.",
      'NA': "Aucun cadre n'a été trouvé."
    }
  }

  runTest() {
    this.status = 'NA';
    let untitledFrameList: Array<HTMLTableElement> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if ($frameList.length) {
      $frameList.forEach(($frame: HTMLTableElement) => {
        if (!$frame.title) {
          untitledFrameList.push($frame);
        }
      });

      this.status = untitledFrameList.length === 0 ? 'C' : 'NC';
    }

    if (untitledFrameList.length > 0) {
      this.logResults('2.1 - Cadres sans titre', untitledFrameList);
    }

    this.testList = {
      '1': this.status
    }

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

