/*
 * Criterion11_6.ts - Copyright (c) 2023-2024 - Arneo
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
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?
 * Traite: C, NC, NA
 */
export default class Criterion11_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun regroupement de champ n'a été trouvé.";

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'C';
      message = "Les regroupements de champs ont bien un label.";
      // Vérifie si les fieldset ont une légende, ou si les éléments de type role="group" ont un aria-label ou un aria-labelledby
      let $fieldsetList = document.querySelectorAll('fieldset');

      Array.from($fieldsetList).forEach(($fieldset: HTMLElement) => {
        if (!$fieldset.querySelector('legend')) {
          status = 'NC';
        }
      });

      let $groupList = document.querySelectorAll('[role="group"], [role="radiogroup"]');
      Array.from($groupList).forEach(($group: HTMLElement) => {
        // Vérifie si aria-label est défini
        if (!$group.getAttribute('aria-label')) {
          // Sinon vérifie si aria-labelledby est défini et que l'élément référencé existe
          const ariaLabelledby = $group.getAttribute('aria-labelledby');
          if (!ariaLabelledby || !document.getElementById(ariaLabelledby)) {
            status = 'NC';
          }
        }
      });

      if (status === 'NC') {
        message = "Certains regroupements de champs n'ont pas de légende.";
      }
    }

    this.updateCriteria('11.6', status, message);
    this.updateTest('11.6.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé du regroupement de champ
    return $element.tagName === 'FIELDSET' ? $element.tagName : $element.getAttribute('role');
  }
}

