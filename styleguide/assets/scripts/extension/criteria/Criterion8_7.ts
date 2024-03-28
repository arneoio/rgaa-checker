/*
 * Criterion8_7.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion8_7 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = '*[lang]:not(html), *[xml\\:lang]:not(html)';
    this.messageList = {
      'NT': 'Vérifiez si les changements de langue sont correctement indiqués.',
      'NA': "Aucun changement de langue n'a été détecté. Vérifiez si les changements de langue sont correctement indiqués."
    }
  }

  runTest() {
    this.status = 'NT';
    let $elementList = document.querySelectorAll(this.querySelector);

    if($elementList.length > 0) {
      this.logResults('8.7 - Liste des changements de langue', $elementList);
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = Array.from($elementList) as Array<HTMLElement>;

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('lang') || $element.getAttribute('xml:lang');
  }
}

