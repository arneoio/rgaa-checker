/*
 * Criterion11_5.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_5 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
  }

  runTest() {
    this.status = 'NT';
    let message = "Aucun regroupement de champ n'a été trouvé. Vérifiez s'i devrait y en avoir.";


    let $fieldList = document.querySelectorAll(FormUtils.getFormFieldQuerySelector());
    if ($fieldList.length === 0) {
      status = 'NA';
      message = "Aucun champ de formulaire n'a été trouvé";
    }

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      message = "Vérifiez si les regroupements de champs sont pertinents.";
    }

    this.updateCriteria('11.5', status, message);
    this.updateTest('11.5.1', status);

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le type de regroupement de champ
    return $element.tagName === 'FIELDSET' ? $element.tagName : $element.getAttribute('role');
  }
}

