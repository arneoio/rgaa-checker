/*
 * Criterion11_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = FormUtils.getFormFieldQuerySelector();
    this.messageList = {
      'NA': "Aucun champ de formulaire n'a été trouvé",
      'NT': "Vérifiez si les étiquettes des champs de formulaire sont pertinentes."
    };
  }

  runTest() {
    this.status = 'NA';
    let $elementList = document.querySelectorAll(this.querySelector);
    const labelFieldList: any = [];

    $elementList.forEach(($formField: HTMLElement) => {
      let label = FormUtils.getFormFieldLabel($formField);
      labelFieldList.push({ label: label, field: $formField });
    });

    if ($elementList.length > 0) {
      this.status = 'NT';
    }

    this.testList = {
      '1': this.status,
      '2': this.status,
      '3': this.status,
      '4': this.status,
      '5': this.status,
      '6': this.status
    };

    if ($elementList.length > 0) {
      this.logResults('11.2 - Liste des étiquettes de formulaire', labelFieldList);
    }

    this.elementList = Array.from($elementList) as HTMLElement[];

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

