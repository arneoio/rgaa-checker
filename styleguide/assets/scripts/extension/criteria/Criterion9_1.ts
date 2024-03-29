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
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let headingList: Array<any> = [];
    let message = 'Vérifiez si les titres sont présents et correctement balisés.';

    const $headingList = document.querySelectorAll(this.querySelector);

    if($headingList.length > 0) {
      status = 'NT';
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
        status = 'NC';
        message = 'La hiérarchie des titres n\'est pas respectée.';
      }
    }

    this.updateCriteria('9.1', status, message);
    this.updateTest('9.1.1', status);
    this.updateTest('9.1.2', status === 'NA' ? 'NA' : 'NT');
    this.updateTest('9.1.3', status);

    if(headingList.length > 0) {
      this.logResults('9.1 - Liste des heading', headingList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le niveau du heading
    return `h${$element.getAttribute('aria-level') || $element.tagName.charAt(1)}`;
  }
}

