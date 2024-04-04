/*
 * Criterion11_13.ts - Copyright (c) 2023-2024 - Arneo
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
 * La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_13 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
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
      '1': this.status
    };

    return this.status;
  }
}

