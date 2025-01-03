/*
 * Criterion5_8.ts - Copyright (c) 2023-2024 - Arneo
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

/**
 * Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ? ?
 * Traite: NA, NT, C
 */
export default class Criterion5_8 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = 'table';
    this.messageList = {
      'NT': 'Des tableaux ont des éléments propres aux tableaux de données. Vérifier que ce ne sont pas des tableaux de mises en formes.',
      'NA': 'Aucun tableau n\'a été trouvé.',
      'C': 'Les tableaux de mises en forme ne contiennent pas d\'éléments propres aux tableaux de données.',
    };
  }

  runTest() {
    this.status = 'NA';

    const $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length > 0) {
      this.status = 'C';

      Array.from($tableList).forEach(($table)=> {
        // Vérifier l'absence de l'attribut summary
        const hasSummary = $table.getAttribute('summary') !== null;

        // Vérifier l'absence d’éléments enfant <caption>, <thead>, <th>, <tfoot> ou d’éléments pourvus d’un attribut WAI-ARIA role=“rowheader” ou role=“columnheader”
        const hasSpecificAttributes = $table.querySelector('caption, thead, th, tfoot, [role="rowheader"], [role="columnheader"]') !== null;

        // Les éléments <td> ne possèdent pas d’attributs scope, headers et axis.
        const cells = $table.querySelectorAll('td');
        const hasCellsSpecificAttributes = Array.from(cells).some(cells => {
          return cells.hasAttribute('scope') ||
            cells.hasAttribute('headers') ||
            cells.hasAttribute('axis');
        });

        // Si une des conditions n'est pas remplie, le test échoue
        if (hasSummary || hasSpecificAttributes || hasCellsSpecificAttributes) {
          this.status = 'NT';
        }
      });
    }

    if ($tableList.length > 0) {
      this.logResults('5.8 - Liste des tableaux', $tableList);
    }

    this.testList = {
      '1': this.status,
    };

    this.elementList = Array.from($tableList) as Array<HTMLElement>;
    return this.status;
  }
}
