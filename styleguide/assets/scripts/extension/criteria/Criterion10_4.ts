/*
 * Criterion10_4.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_4 extends BaseCriterion {
  zoomFactor: number = 1;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.initHighlight();
  }

  getHighlightText() {
    return "Zoomer le texte à 200%";
  }

  activateHighlight(): void {
    // Zoom dans la page à 200%
    // chrome.tabs.getZoom(function (zoomFactor: number) {
    //   this.zoomFactor = zoomFactor;
    //   // Pour effectuer un zoom à 200% :
    //   chrome.tabs.setZoom(2);
    // });
  }

  resetHighlight(): void {
    // let chrome = window.chrome as any;
    // // Zoom dans la page à 200%
    // chrome.tabs.getZoom(function () {
    //   // Pour effectuer un zoom à 200% :
    //   chrome.tabs.setZoom(this.zoomFactor);
    // });
  }

  runTest() {
    return 'NT';
  }
}

