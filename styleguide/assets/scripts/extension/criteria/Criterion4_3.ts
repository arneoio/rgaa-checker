/**
Copyright 2024 - Arneo.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?
 * Traite: NA, NT
 */
export default class Criterion4_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = `audio, video, object, svg, canvas, [type='application/x-shockwave-flash'], bgsound`;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun média temporel.";

    let $temporalMediaList = MediaUtils.getTemporalMediaList();
    if ($temporalMediaList.length) {
      status = 'NT';
      message = "Des médias temporels sont présents.";
    }

    this.updateCriteria('4.3', status, message);
    this.updateTest('4.3.1', status);
    this.updateTest('4.3.2', status);

    if ($temporalMediaList.length > 0) {
      this.logResults('4.3 - Médias temporels', $temporalMediaList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

