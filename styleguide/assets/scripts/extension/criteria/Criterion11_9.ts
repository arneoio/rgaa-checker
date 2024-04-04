/*
 * Criterion11_9.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion11_9 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = FormUtils.getButtonQuerySelector();
    this.messageList = {
      'NC': "Certains boutons n’ont pas d’intitulé ou l’intitulé n'est pas pertinent.",
      'NA': "Aucun bouton de formulaire n'a été trouvé.",
      'NT': "Vérifiez si l'intitulé des boutons est pertinent."
    };
  }

  runTest() {
    this.status = 'NA';

    let $elementList = Array.from(document.querySelectorAll(this.querySelector));
    let noLabelElementList: Array<HTMLElement> = [];
    let noConcordantElementList: any = [];

    if ($elementList.length > 0) {
      this.status = 'NT';

      $elementList.forEach(($element: HTMLElement) => {
        const accessibleLabel = FormUtils.getButtonAccessibleLabel($element);
        const visibleLabel = FormUtils.getButtonVisibleLabel($element);

        if (!accessibleLabel) {
          this.status = 'NC';
          noLabelElementList.push($element);
        }

        // Le nom accessible doit contenir au minimum le nom visible
        if (accessibleLabel && visibleLabel && !accessibleLabel.includes(visibleLabel.trim())) {
          this.status = 'NC';
          noConcordantElementList.push({ $element, visibleLabel, accessibleLabel });
        }
      });
    }

    this.testList = {
      '1': noLabelElementList.length ? 'NC' : 'NT',
      '2': noConcordantElementList.length ? 'NC' : 'C'
    };

    if (noLabelElementList.length) {
      this.logResults('11.9.1 - Liste des boutons sans intitulé', noLabelElementList);
    }

    if (noConcordantElementList.length) {
      this.logResults('11.9.2 - Liste des boutons dont l\'intitulé accessible ne contient pas le libellé visible', noConcordantElementList);
    }

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé visible du bouton, et le libellé accessible s'il est différent
    let label = '';

    const accessibleLabel = FormUtils.getButtonAccessibleLabel($element);
    const visibleLabel = FormUtils.getButtonVisibleLabel($element);

    label += visibleLabel;
    if (accessibleLabel && accessibleLabel !== visibleLabel) {
      label += ' (' + accessibleLabel + ')';
    }

    return label;
  }
}

