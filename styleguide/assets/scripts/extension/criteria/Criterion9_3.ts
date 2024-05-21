/*
 * Criterion9_3.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, chaque liste est-elle correctement structurée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion9_3 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'ul, ol, dl, [role="list"]';
    this.messageList = {
      'NT': 'Vérifiez si les éléments mis en liste sont corrects et s\'il n\'en manque pas.',
      'NA': "Aucune liste n'a été trouvée"
    };
  }

  runTest() {
    this.status = 'NT';
    let $elementList = document.querySelectorAll(this.querySelector);

    // 9.3.1: ul et [role="list"]
    let $ulList = document.querySelectorAll('ul, [role="list"]');
    // 9.3.2: ol et [role="list"]
    let $olList = document.querySelectorAll('ol, [role="list"]');
    // 9.3.3: dl
    let $dlList = document.querySelectorAll('dl');

    this.testList = {
      '1': $ulList.length > 0 ? 'NT' : 'NA',
      '2': $olList.length > 0 ? 'NT' : 'NA',
      '3': $dlList.length > 0 ? 'NT' : 'NA'
    };

    this.elementList = Array.from($elementList) as HTMLElement[];

    if($elementList.length > 0) {
      this.logResults('9.3 - Liste des listes', $elementList);
    }

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

