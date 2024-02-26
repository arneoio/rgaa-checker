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

/**
 * Chaque page web a-t-elle un titre de page ?
 * Traite: C, NC
 */
export default class Criterion8_5 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    // Retrouver dans le document le titre structuré au moyen d’un élément <title> ;
    let isCriteriaValid = true;
    const pageTitleElement = document.querySelector('title');

    if (!pageTitleElement) {
      isCriteriaValid = false;
    } else {
    }

    let status = isCriteriaValid ? 'C' : 'NC';
    let message = isCriteriaValid ? "La page a un titre." : "La page n'a pas de titre.";
    this.updateCriteria('8.5', status, message);
    this.updateTest('8.5.1', status);

    return status;
  }
}
