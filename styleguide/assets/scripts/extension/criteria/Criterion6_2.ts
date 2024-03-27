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
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.querySelector = 'a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"])';
    this.initHighlight();
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
    let status = 'NA';
    let message = "Aucun lien n'a été trouvé dans la page.";

    let isCriteriaValid = true;
    // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);

    if ($linkList.length) {
      const $linkListWithoutLabel = this.getHighlightedElements();

      if ($linkListWithoutLabel.length > 0) {
        this.logResults('6.2 - Liens sans intitulé ', $linkListWithoutLabel);
      }

      isCriteriaValid = $linkListWithoutLabel.length === 0;
      status = isCriteriaValid ? 'C' : 'NC';
      message = isCriteriaValid ? "Tous les liens ont un intitulé." : "Certains liens n'ont pas d'intitulé.";
    }

    this.updateCriteria('6.2', status, message);
    this.updateTest('6.2.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return ''; // Le lien n'a pas d'intitulé
  }
}
