/*
 * Criterion11_12.ts - Copyright (c) 2023-2024 - Arneo
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
 * Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_12 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'NC': "Les données saisies ne peuvent pas être modifiées, mises à jour ou récupérées par l’utilisateur.",
      'NA': "Aucun formulaire n'a été trouvé.",
      'NT': "Vérifiez le critère manuellement."
    };
  }

  runTest() {
    this.status = 'NA';

    let $elementList = Array.from(document.querySelectorAll('form'));

    if ($elementList.length > 0) {
      this.status = 'NT';
    }

    this.testList = {
      '1': this.status,
      '2': this.status
    };

    return this.status;
  }
}

