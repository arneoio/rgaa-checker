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
 * Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?
 * Traite: NA, NT
 */
export default class Criterion5_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'table:not([role="presentation"])';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau de données n'a été trouvé.";

    let $tableList = document.querySelectorAll(this.querySelector);
    if ($tableList.length) {
    }

    this.updateCriteria('5.5', status, message);
    this.updateTest('5.5.1', status);

    if ($tableList.length > 0) {
      this.logResults('5.5 - Liste des tableaux de données', $tableList);
    }

    return status;
  }
}
