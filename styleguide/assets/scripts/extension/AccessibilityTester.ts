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
  criterionList: any;
  localStorageKey: string;
  previousResults: any;
  pageResults: any;
  highlightWrapperId: string;
  $highlightWrapper: HTMLElement;
  $highlightCanvas: HTMLCanvasElement;
  $highlightElementList: HTMLElement[];
  highlightContext: CanvasRenderingContext2D;
  hightlightedCriterion: any;

  constructor() {
    this.localStorageKey = 'rgaaCheckerResults';
    this.highlightWrapperId = 'rgaaChecker__highlightWrapper';

    this.criterionList = {
      "1.1": new Criterion1_1(),
      "2.1": new Criterion2_1(),
      "2.2": new Criterion2_2(),
      "4.1": new Criterion4_1(),
      "4.2": new Criterion4_2(),
      "4.3": new Criterion4_3(),
      "4.4": new Criterion4_4(),
      "4.5": new Criterion4_5(),
      "4.6": new Criterion4_6(),
      "4.7": new Criterion4_7(),
      "5.1": new Criterion5_1(),
      "5.2": new Criterion5_2(),
      "5.3": new Criterion5_3(),
      "5.4": new Criterion5_4(),
      "5.5": new Criterion5_5(),
      "6.1": new Criterion6_1(),
      "6.2": new Criterion6_2(),
      "8.1": new Criterion8_1(),
      "8.2": new Criterion8_2(),
      "8.3": new Criterion8_3(),
      "8.4": new Criterion8_4(),
      "8.5": new Criterion8_5(),
      "8.6": new Criterion8_6(),
      "8.7": new Criterion8_7(),
      "8.8": new Criterion8_8(),
      "8.10": new Criterion8_10(),
      "9.1": new Criterion9_1(),
      "9.2": new Criterion9_2(),
      "9.3": new Criterion9_3(),
      "9.4": new Criterion9_4(),
      "10.1": new Criterion10_1(),
      "10.2": new Criterion10_2(),
      "10.3": new Criterion10_3(),
      "10.4": new Criterion10_4(),
      "10.5": new Criterion10_5(),
      "10.7": new Criterion10_7(),
      "11.1": new Criterion11_1(),
      "11.2": new Criterion11_2(),
      "11.3": new Criterion11_3(),
      "11.4": new Criterion11_4(),
      "11.5": new Criterion11_5(),
      "11.6": new Criterion11_6(),
      "11.7": new Criterion11_7(),
      "11.8": new Criterion11_8(),
      "11.9": new Criterion11_9(),
      "11.10": new Criterion11_10(),
      "11.11": new Criterion11_11(),
      "11.12": new Criterion11_12(),
      "11.13": new Criterion11_13(),
    };
  }

  bindCanvasEvents() {
    // on scroll or resize, refresh highlight
    window.addEventListener('scroll', () => {
      this.refreshHighlight();
    });

    window.addEventListener('resize', () => {
      this.$highlightCanvas.width = window.innerWidth;
      this.$highlightCanvas.height = window.innerHeight;
      this.refreshHighlight();
    });

    setInterval(() => {
      console.log('Refresh highlight');
      this.refreshHighlight();
    }, 1000);
  }

  loadSavedData() {
    // Get previous results from localStorage
    this.previousResults = JSON.parse(localStorage.getItem(this.localStorageKey)) || {
      "user": {},
      "runner": {},
    };
  }

  runTests() {
    this.loadSavedData();
    var jsonResult = this.runCriteriaTests();

    // Get results of runner for current page
    let currentPageResults = this.previousResults.runner[window.location.pathname] || {};
    // Get difference between previous and current results
    const diff: any = {};
    Object.keys(this.pageResults).forEach((key: string) => {
      if (typeof currentPageResults[key] !== 'undefined' && currentPageResults[key] !== this.pageResults[key]) {
        diff[key] = {
          "previous": currentPageResults[key],
          "current": this.pageResults[key],
        };
      }
    });
    console.log('Différence', diff);

    // Save results of runner to localStorage for current page
    this.previousResults.runner[window.location.pathname] = this.pageResults;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.previousResults));

    this.loadUserResults();

    return jsonResult;
  }

  runCriteriaTests() {
    this.pageResults = {};
    var jsonResult: any = {};

    Object.keys(this.criterionList).forEach((key: string) => {
      const criterion = this.criterionList[key];
      const criteraStatus = criterion.runTest();
      jsonResult[key] = criterion.formatJSON();
      criterion.isInitialTestDone = true;
      this.pageResults[key] = criteraStatus;
    });

    return jsonResult;
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

  initHighlight() {
    if(this.$highlightWrapper) {
      return;
    }

    this.$highlightElementList = [];

    // Create highlight wrapper
    this.$highlightWrapper = document.createElement('div');
    this.$highlightWrapper.id = this.highlightWrapperId;
    document.body.appendChild(this.$highlightWrapper);

    // Create highlight canvas
    this.$highlightCanvas = document.createElement('canvas');
    this.$highlightCanvas.id = 'rgaaChecker__highlightCanvas';
    this.$highlightCanvas.width = window.innerWidth;
    this.$highlightCanvas.height = window.innerHeight;
    this.$highlightWrapper.appendChild(this.$highlightCanvas);

    this.highlightContext = this.$highlightCanvas.getContext('2d');

    this.bindCanvasEvents();
  }

  enableHighlight(topicNumber: string, criteriaNumber: string) {
    this.hightlightedCriterion = this.criterionList[topicNumber + '.' + criteriaNumber];
    let highlightJsonList: any[] = [];

    // Reset all highlights except the one to enable
    Object.keys(this.criterionList).forEach((key: string) => {
      if (key !== topicNumber + '.' + criteriaNumber) {
        this.criterionList[key].disableHighlight();
      } else {
        let $highlightElementList = this.hightlightedCriterion.enableHighlight();

        this.$highlightElementList = $highlightElementList;
        this.showHighlight();

        $highlightElementList.forEach(($highlightElement: HTMLElement, index: number) => {
          highlightJsonList.push({
            xpath: this.getXPath($highlightElement),
            tag: $highlightElement.tagName,
            text: this.hightlightedCriterion.getHighlightListContent($highlightElement),
            isVisible: $highlightElement.checkVisibility({
              opacityProperty: true,
              visibilityProperty: true,
            } as any) // Obligé de mettre "any", opacityProperty n'est pas reconnu
          });
        });
      }
    });

    return highlightJsonList;
  }

  disableHighlight() {
    this.resetHighlight();
    Object.keys(this.criterionList).forEach((key: string) => {
      this.criterionList[key].disableHighlight();
    });
  }

  resetHighlight() {
    this.highlightContext.clearRect(0, 0, this.$highlightCanvas.width, this.$highlightCanvas.height);
  }

  getXPath(element: HTMLElement) {
    let xpath = '';
    for ( ; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode as HTMLElement) {
      let id = element.id;
      if (id) {
        return `id("${id}")${xpath}`;
      }
      let nodeName = element.nodeName;
      let sibling = element;
      let count = 1;
      while (sibling = sibling.previousElementSibling as HTMLElement) {
        if (sibling.nodeName === nodeName) {
          count++;
        }
      }
      xpath = `/${nodeName}[${count}]${xpath}`;
    }
    return xpath;
  }

  showHighlight() {
    this.resetHighlight();

    if(this.$highlightElementList.length === 0) {
      return;
    }

    this.highlightContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.highlightContext.strokeStyle = 'rgba(255, 0, 0, 1)';
    this.highlightContext.setLineDash([5, 5]);
    this.highlightContext.lineWidth = 1;
    this.highlightContext.fillRect(0, 0, this.$highlightCanvas.width, this.$highlightCanvas.height);

    // Check highlight element in viewport and visible
    this.$highlightElementList.forEach(($highlightElement: HTMLElement) => {
      if(!$highlightElement.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
      } as any)) {
        return;
      }

      let boundingList = $highlightElement.getClientRects();
      if(boundingList.length === 0) {
        return;
      }

      for(let i = 0; i < boundingList.length; ++i) {
        let bounding = boundingList[i];
        if(bounding.width === 0 || bounding.height === 0) {
          return;
        }
        if (bounding.top + bounding.height < 0 || bounding.top > window.innerHeight) {
          return;
        }

        // remove a rect in canvas at element position
        this.highlightContext.clearRect(bounding.left, bounding.top, bounding.width, bounding.height);
        this.highlightContext.strokeRect(bounding.left, bounding.top, bounding.width, bounding.height);
      }
    });
  }

  refreshHighlight() {
    this.showHighlight();
  }
}
