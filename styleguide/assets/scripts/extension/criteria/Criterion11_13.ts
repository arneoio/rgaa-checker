/**
Copyright 2024 - Arneo.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion11_13 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun formulaire n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll('form'));

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez le critère manuellement.";
    }

    this.updateCriteria('11.13', status, message);
    this.updateTest('11.13.1', status);

    return status;
  }
}

