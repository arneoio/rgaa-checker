/*
 * AccessibilityTester.ts - Copyright (c) 2023-2024 - Arneo
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

import Criterion1_1 from "./criteria/Criterion1_1";
import Criterion2_1 from "./criteria/Criterion2_1";
import Criterion2_2 from "./criteria/Criterion2_2";
import Criterion4_1 from "./criteria/Criterion4_1";
import Criterion4_2 from "./criteria/Criterion4_2";
import Criterion4_3 from "./criteria/Criterion4_3";
import Criterion4_4 from "./criteria/Criterion4_4";
import Criterion4_5 from "./criteria/Criterion4_5";
import Criterion4_6 from "./criteria/Criterion4_6";
import Criterion4_7 from "./criteria/Criterion4_7";
import Criterion5_1 from "./criteria/Criterion5_1";
import Criterion5_2 from "./criteria/Criterion5_2";
import Criterion5_3 from "./criteria/Criterion5_3";
import Criterion5_4 from "./criteria/Criterion5_4";
import Criterion5_5 from "./criteria/Criterion5_5";
import Criterion6_1 from "./criteria/Criterion6_1";
import Criterion6_2 from "./criteria/Criterion6_2";
import Criterion8_1 from "./criteria/Criterion8_1";
import Criterion8_10 from "./criteria/Criterion8_10";
import Criterion8_2 from "./criteria/Criterion8_2";
import Criterion8_3 from "./criteria/Criterion8_3";
import Criterion8_4 from "./criteria/Criterion8_4";
import Criterion8_5 from "./criteria/Criterion8_5";
import Criterion8_6 from "./criteria/Criterion8_6";
import Criterion8_7 from "./criteria/Criterion8_7";
import Criterion8_8 from "./criteria/Criterion8_8";
import Criterion9_1 from "./criteria/Criterion9_1";
import Criterion9_2 from "./criteria/Criterion9_2";
import Criterion9_3 from "./criteria/Criterion9_3";
import Criterion9_4 from "./criteria/Criterion9_4";
import Criterion10_1 from "./criteria/Criterion10_1";
import Criterion10_2 from "./criteria/Criterion10_2";
import Criterion10_3 from "./criteria/Criterion10_3";
import Criterion10_4 from "./criteria/Criterion10_4";
import Criterion10_5 from "./criteria/Criterion10_5";
import Criterion10_7 from "./criteria/Criterion10_7";
import Criterion11_1 from "./criteria/Criterion11_1";
import Criterion11_2 from "./criteria/Criterion11_2";
import Criterion11_3 from "./criteria/Criterion11_3";
import Criterion11_4 from "./criteria/Criterion11_4";
import Criterion11_5 from "./criteria/Criterion11_5";
import Criterion11_6 from "./criteria/Criterion11_6";
import Criterion11_7 from "./criteria/Criterion11_7";
import Criterion11_8 from "./criteria/Criterion11_8";
import Criterion11_9 from "./criteria/Criterion11_9";
import Criterion11_10 from "./criteria/Criterion11_10";
import Criterion11_11 from "./criteria/Criterion11_11";
import Criterion11_12 from "./criteria/Criterion11_12";
import Criterion11_13 from "./criteria/Criterion11_13";

export default class AccessibilityTester {
  $highlightWrapper: HTMLElement;
  criterionList: any;
  localStorageKey: string;

  constructor($highlightWrapper: HTMLElement) {
    this.$highlightWrapper = $highlightWrapper;
    this.localStorageKey = 'accessibilityTesterResults';

    this.criterionList = {
      "1.1": new Criterion1_1(this.$highlightWrapper),
      "2.1": new Criterion2_1(this.$highlightWrapper),
      "2.2": new Criterion2_2(this.$highlightWrapper),
      "4.1": new Criterion4_1(this.$highlightWrapper),
      "4.2": new Criterion4_2(this.$highlightWrapper),
      "4.3": new Criterion4_3(this.$highlightWrapper),
      "4.4": new Criterion4_4(this.$highlightWrapper),
      "4.5": new Criterion4_5(this.$highlightWrapper),
      "4.6": new Criterion4_6(this.$highlightWrapper),
      "4.7": new Criterion4_7(this.$highlightWrapper),
      "5.1": new Criterion5_1(this.$highlightWrapper),
      "5.2": new Criterion5_2(this.$highlightWrapper),
      "5.3": new Criterion5_3(this.$highlightWrapper),
      "5.4": new Criterion5_4(this.$highlightWrapper),
      "5.5": new Criterion5_5(this.$highlightWrapper),
      "6.1": new Criterion6_1(this.$highlightWrapper),
      "6.2": new Criterion6_2(this.$highlightWrapper),
      "8.1": new Criterion8_1(this.$highlightWrapper),
      "8.2": new Criterion8_2(this.$highlightWrapper),
      "8.3": new Criterion8_3(this.$highlightWrapper),
      "8.4": new Criterion8_4(this.$highlightWrapper),
      "8.5": new Criterion8_5(this.$highlightWrapper),
      "8.6": new Criterion8_6(this.$highlightWrapper),
      "8.7": new Criterion8_7(this.$highlightWrapper),
      "8.8": new Criterion8_8(this.$highlightWrapper),
      "8.10": new Criterion8_10(this.$highlightWrapper),
      "9.1": new Criterion9_1(this.$highlightWrapper),
      "9.2": new Criterion9_2(this.$highlightWrapper),
      "9.3": new Criterion9_3(this.$highlightWrapper),
      "9.4": new Criterion9_4(this.$highlightWrapper),
      "10.1": new Criterion10_1(this.$highlightWrapper),
      "10.2": new Criterion10_2(this.$highlightWrapper),
      "10.3": new Criterion10_3(this.$highlightWrapper),
      "10.4": new Criterion10_4(this.$highlightWrapper),
      "10.5": new Criterion10_5(this.$highlightWrapper),
      "10.7": new Criterion10_7(this.$highlightWrapper),
      "11.1": new Criterion11_1(this.$highlightWrapper),
      "11.2": new Criterion11_2(this.$highlightWrapper),
      "11.3": new Criterion11_3(this.$highlightWrapper),
      "11.4": new Criterion11_4(this.$highlightWrapper),
      "11.5": new Criterion11_5(this.$highlightWrapper),
      "11.6": new Criterion11_6(this.$highlightWrapper),
      "11.7": new Criterion11_7(this.$highlightWrapper),
      "11.8": new Criterion11_8(this.$highlightWrapper),
      "11.9": new Criterion11_9(this.$highlightWrapper),
      "11.10": new Criterion11_10(this.$highlightWrapper),
      "11.11": new Criterion11_11(this.$highlightWrapper),
      "11.12": new Criterion11_12(this.$highlightWrapper),
      "11.13": new Criterion11_13(this.$highlightWrapper),
    }
  }

  loadSavedData() {
    // Get previous results from localStorage
    const previousResults = JSON.parse(localStorage.getItem(this.localStorageKey)) || {
      "user": {},
      "runner": {},
    };

    // Get results of runner for current page
    const currentPageResults = previousResults.runner[window.location.pathname] || {};

    let pageResults: any = {};

    Object.keys(this.criterionList).forEach((key: string) => {
      const criterion = this.criterionList[key];
      const criteraStatus = criterion.runTest();
      criterion.isInitialTestDone = true;
      pageResults[key] = criteraStatus;
    });

    // Get difference between previous and current results
    const diff: any = {};
    Object.keys(pageResults).forEach((key: string) => {
      if (typeof currentPageResults[key] !== 'undefined' && currentPageResults[key] !== pageResults[key]) {
        diff[key] = {
          "previous": currentPageResults[key],
          "current": pageResults[key],
        };
      }
    });

    console.log('Différence', diff);

    // Save results of runner to localStorage for current page
    previousResults.runner[window.location.pathname] = pageResults;

    localStorage.setItem(this.localStorageKey, JSON.stringify(previousResults));
  }

  runTests() {
    this.loadSavedData();
    this.loadUserResults();

    const criteriaUpdatedEvent = new Event('rgaachecker-initialized', {
      bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
      cancelable: true, // L'événement peut être annulé
    });
    document.body.dispatchEvent(criteriaUpdatedEvent);
  }

  loadUserResults() {
    const results = JSON.parse(localStorage.getItem(this.localStorageKey));
    const userResults = results.user[window.location.pathname] || {};

    // TODO: à améliorer. Si possible appeler la méthode updateCriteria de chaque critère plutôt que de faire ça à la main
    // Mais if faut dans ce cas une classe définie pour chaque critère
    // TODO: s'il y a un conflit entre les résultats de l'utilisateur et ceux du runner suite au chargement, il faut indiquer le conflit
    Object.keys(userResults).forEach((key: string) => {
      let $criteriaCard: HTMLElement = document.querySelector(`.js-criteriaCard[data-criteria="${key}"]`);
      if ($criteriaCard) {
        let $toggler: HTMLElement = $criteriaCard.querySelector(`.js-criteriaSelector__toggler`);
        let $togglerText: HTMLElement = $criteriaCard.querySelector(`.js-criteriaSelector__togglerText`);
        $criteriaCard.dataset.status = userResults[key];
        $toggler.dataset.status = userResults[key];
        $togglerText.innerText = userResults[key];
      }
    });

  }
}
