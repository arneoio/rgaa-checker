/*
 * Criterion11_7.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_7 extends BaseCriterion {
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun regroupement de champ n'a été trouvé.";

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les légendes associés aux regroupements de champs sont pertinentes.";
    }

    this.updateCriteria('11.7', status, message);
    this.updateTest('11.7.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé du regroupement de champ
    let label = '';
    if ($element.tagName === 'FIELDSET') {
      label = $element.querySelector('legend')?.textContent || '';
    } else if ($element.getAttribute('aria-label')) {
      label = $element.getAttribute('aria-label') || '';
    } else if ($element.getAttribute('aria-labelledby')) {
      const id = $element.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      if (labelElement) {
        label = labelElement.textContent || '';
      }
    }

    return label;
  }
}

