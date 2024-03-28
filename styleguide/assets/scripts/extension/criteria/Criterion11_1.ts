/*
 * Criterion11_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque champ de formulaire a-t-il une étiquette ?
 * Traite: NC, C, NA, NT (validation manuelle)
 */
export default class Criterion11_1 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = FormUtils.getFormFieldQuerySelector();
  }

  runTest() {
    this.status = 'NA';
    let statusTest1 = 'NA';
    let message = "Aucun champ de formulaire n'a été trouvé";
    let $elementList = document.querySelectorAll(this.querySelector);
    let isCriteriaValid = true;
    let areLabelsValid = true;
    let hasInvisibleLabel = false;

    $elementList.forEach(($formField: HTMLElement) => {
      let label = FormUtils.getFormFieldLabel($formField);
      if (label.trim() === '') {
        isCriteriaValid = false;
      }

      // 11.1.2: on vérifie si les identifiants des champs de formulaire sont correctement associés à leurs étiquettes par un attribut for
      const id = $formField.getAttribute('id');
      if (id) {
        const labelElement: HTMLElement = document.querySelector(`label[for="${id}"]`);
        if (!labelElement) {
          areLabelsValid = false;
        }
      }

      // 11.1.3: Si l'étiquette est invisible pour les utilisateurs, on vérifie qu'il y a quand même une étiquette visible
      const ariaLabel = $formField.getAttribute('aria-label');
      const ariaLabelledby = $formField.getAttribute('aria-labelledby');
      const titleAttribute = $formField.getAttribute('title');

      if (!ariaLabel && !ariaLabelledby && !titleAttribute) {
      } else {
        hasInvisibleLabel = true;
      }
    });

    if ($elementList.length > 0) {
      if (isCriteriaValid) {
        statusTest1 = 'C';
        if (hasInvisibleLabel) {
          status = 'NT';
          message = "Certains champs de formulaire ont une étiquette invisible pour les utilisateurs, vérifiez les manuellement";
        } else {
          status = 'C';
          message = 'Tous les champs de formulaire ont une étiquette';
        }
      } else {
        status = 'NC';
        statusTest1 = 'NC';
        message = "Certains champs de formulaire n'ont pas d'étiquette";
      }
    }

    this.updateCriteria('11.1', status, message);
    this.updateTest('11.1.1', statusTest1);
    this.updateTest('11.1.2', $elementList.length > 0 ? (areLabelsValid ? 'C' : 'NC') : 'NA');

    if ($elementList.length > 0) {
      this.logResults('11.1 - Liste des champs de formulaire', $elementList);
    }

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche l'étiquette du champ de formulaire
    return FormUtils.getFormFieldLabel($element);
  }
}

