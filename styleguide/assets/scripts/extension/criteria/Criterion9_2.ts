/*
 * Criterion9_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion9_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'main, header, footer, nav';
    this.messageList = {
      'NT': 'Vérifiez si les éléments structurants sont présents et correctement balisés.',
      'NC': 'La balise &lt;main&gt; est absente.',
      'C': 'La structure du document est cohérente.'
    };
  }

  runTest() {
    this.status = 'NT';
    let $elementList = document.querySelectorAll(this.querySelector);
    let $main = document.querySelectorAll('main');

    if($main.length === 0) {
      this.status = 'NC';
    } else if($main.length > 1) {
      this.status = 'NC';
    }

    this.testList = {
      '1': this.status,
    };

    this.elementList = Array.from($elementList) as HTMLElement[];

    if($elementList.length > 0) {
      this.logResults('9.2 - Liste des éléments structurant', $elementList);
    }

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

