/*
 * Criterion6_1.ts - Copyright (c) 2023-2024 - Arneo
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
import LinkUtils from '../utils/LinkUtils';

/**
 * Chaque lien est-il explicite (hors cas particuliers) ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion6_1 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'a:not([role]), [role="link"]';
    this.messageList = {
      'NT': 'Vérifiez la pertinence des intitulés des liens.',
      'NA': "Aucun lien n'a été trouvé dans la page."
    }
  }

  runTest() {
    this.status = 'NA';

    let isCriteriaValid = true;
    // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);
    const linkListWithLabel: any = [];
    if ($linkList.length) {

      $linkList.forEach(($link: HTMLElement) => {
        let linkLabel = LinkUtils.getLinkLabel($link);

        if (linkLabel.trim() !== '') {
          linkListWithLabel.push({ $link, label: linkLabel });
        }
      });

      if (linkListWithLabel.length > 0) {
        this.logResults('6.1 - Intitulé des liens', linkListWithLabel);
        this.status = 'NT';
      }
    }

    this.testList = {
      '1': this.status,
      '2': this.status,
      '3': this.status,
      '4': this.status,
      '5': this.status
    }

    this.elementList = linkListWithLabel;

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return LinkUtils.getLinkLabel($element) + ($element.getAttribute('aria-hidden') === 'true' ? ' (aria-hidden)' : '');
  }

  getHighlightListContent($element: HTMLElement) {
    return this.getHighlightLabel($element);
  }
}
