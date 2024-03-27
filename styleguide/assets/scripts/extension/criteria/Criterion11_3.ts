/*
 * Criterion11_3.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion11_3 extends BaseCriterion {
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.querySelector = FormUtils.getFormFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun champ de formulaire n'a été trouvé";
    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si les étiquettes des champs de formulaire ayant la même fonction et répétées dans la page sont pertinentes.";
    }

    this.updateCriteria('11.3', status, message);
    this.updateTest('11.3.1', status);
    this.updateTest('11.3.2', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

