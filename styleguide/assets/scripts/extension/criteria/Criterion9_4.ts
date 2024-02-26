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
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion9_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'q, blockquote';
    this.initHighlight();
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les citations sont correctes et s'il n'en manque pas.";
    let $elementList = document.querySelectorAll(this.querySelector);

    // 9.4.1: q
    let $qList = document.querySelectorAll('q');
    // 9.4.2: blockquote
    let $blockquoteList = document.querySelectorAll('blockquote');

    this.updateCriteria('9.4', status, message);
    this.updateTest('9.4.1', $qList.length > 0 ? 'NT' : 'NA');
    this.updateTest('9.4.2', $blockquoteList.length > 0 ? 'NT' : 'NA');

    if($elementList.length > 0) {
      this.logResults('9.4 - Liste des citations', $elementList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

