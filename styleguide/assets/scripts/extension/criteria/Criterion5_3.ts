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

/**
 * Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
 * Traite: NA, NT
 */
export default class Criterion5_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'table[role="presentation"]';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau de présentation n'a été trouvé.";

    let $presentationTableList = document.querySelectorAll('table[role="presentation"]');
    if ($presentationTableList.length) {
      status = 'NT';
      message = "Vérifiez si les tableaux de présentation ont un contenu linéarisé compréhensible.";
    }

    this.updateCriteria('5.3', status, message);
    this.updateTest('5.3.1', status);

    if ($presentationTableList.length > 0) {
      this.logResults('5.3 - Liste des tableaux de présentation', $presentationTableList);
    }

    return status;
  }
}

