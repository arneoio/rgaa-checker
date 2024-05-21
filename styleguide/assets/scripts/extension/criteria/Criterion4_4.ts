/*
 * Criterion4_4.ts - Copyright (c) 2023-2024 - Arneo
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
import MediaUtils from '../utils/MediaUtils';

/**
 * Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?
 * Traite: NA, NT
 */
export default class Criterion4_4 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = `audio, video, object, svg, canvas, [type='application/x-shockwave-flash'], bgsound`;
    this.messageList = {
      'NT': 'Des médias temporels sont présents.',
      'NA': "Aucun média temporel n'est présent dans la page"
    };
  }

  runTest() {
    this.status = 'NA';

    let $temporalMediaList = MediaUtils.getTemporalMediaList();
    if ($temporalMediaList.length) {
      this.status = 'NT';
    }

    this.testList = {
      '1': this.status,
    };

    if ($temporalMediaList.length > 0) {
      this.logResults('4.4 - Médias temporels', $temporalMediaList);
    }

    this.elementList = $temporalMediaList;

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

