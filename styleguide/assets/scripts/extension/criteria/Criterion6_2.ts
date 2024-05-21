/*
 * Criterion6_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, chaque lien a-t-il un intitulé ?
 * Traite: NA, C, NC
 */
export default class Criterion6_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"])';
    this.messageList = {
      'C': 'Tous les liens ont un intitulé.',
      'NC': "Certains liens n'ont pas d'intitulé.",
      'NA': "Aucun lien n'a été trouvé dans la page."
    }
  }

  getHighlightedElements(): Array<HTMLElement> {
    // Sélectionnez tous les liens sans intitulé
    const linkListWithoutLabel: any = [];
    const $linkList = document.querySelectorAll(this.querySelector);

    if ($linkList.length) {

      $linkList.forEach(($link: HTMLElement) => {
        let linkLabel = LinkUtils.getLinkLabel($link);

        if (linkLabel.trim() === '') {
          linkListWithoutLabel.push($link);
        }
      });
    }

    return linkListWithoutLabel;
  }

  runTest() {
    this.status = 'NA';

    let isCriteriaValid = true;
    // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);

    if ($linkList.length) {
      const $linkListWithoutLabel = this.getHighlightedElements();

      if ($linkListWithoutLabel.length > 0) {
        this.logResults('6.2 - Liens sans intitulé ', $linkListWithoutLabel);
      }

      isCriteriaValid = $linkListWithoutLabel.length === 0;
      this.status = isCriteriaValid ? 'C' : 'NC';
    }

    this.testList = {
      '1': this.status
    }

    this.elementList = Array.from($linkList) as HTMLElement[];

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return ''; // Le lien n'a pas d'intitulé
  }
}
