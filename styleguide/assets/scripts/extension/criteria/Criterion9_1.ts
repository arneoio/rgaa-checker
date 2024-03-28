/*
 * Criterion9_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?
 * Traite: NA, NC, NT (validation manuelle)
 */
export default class Criterion9_1 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]';
    this.messageList = {
      'NT': 'Vérifiez si les titres sont présents et correctement balisés.',
      'NA': "Aucun titre n'a été trouvé",
      'NC': 'La hiérarchie des titres n\'est pas respectée.',
      'C': 'La hiérarchie des titres est respectée.'
    };
  }

  runTest() {
    this.status = 'NA';
    let headingList: Array<any> = [];

    const $headingList = document.querySelectorAll(this.querySelector);

    if($headingList.length > 0) {
      this.status = 'NT';
    }

    // Récupère le niveau et le titre de chaque heading
    $headingList.forEach(($heading) => {
      const level = $heading.getAttribute('aria-level') || parseInt($heading.tagName.charAt(1), 10);
      const title = $heading.textContent;
      headingList.push({ level, title, isValid: true });
    });

    // Vérifie que la hiérarchie des headings est respectée
    for (let i = 0; i < headingList.length; i++) {
      const currentHeading = headingList[i];
      const nextHeading = headingList[i + 1];

      if (nextHeading && nextHeading.level - currentHeading.level > 1) {
        nextHeading.isValid = false;
        this.status = 'NC';
      }
    }

    if(headingList.length > 0) {
      this.logResults('9.1 - Liste des heading', headingList);
    }

    this.testList = {
      '1': this.status,
      '2': this.status === 'NA' ? 'NA' : 'NT',
      '3': this.status
    };

    this.elementList = headingList;

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le niveau du heading
    return `h${$element.getAttribute('aria-level') || $element.tagName.charAt(1)}`;
  }
}

