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
declare var browser: typeof chrome;

/**
 * Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?
 * Traite: C, NC
  */
  export default class Criterion10_7 extends BaseCriterion {
  $highlightElementList: Array<HTMLElement> = [];

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.initHighlight();
  }

  getHighlightedElements(): Array<HTMLElement> {
    this.$highlightElementList = this.getFocusableElementList();
    return this.$highlightElementList;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun élément de la page n'a de prise de focus.";

    let focusableElementList = this.getFocusableElementList();

    if(focusableElementList.length > 0) {
      status = 'NT';
      message = "Vérifie que l'ordre de tabulation est cohérent et que le focus des éléments est bien visible lorsqu'ils le prennent.";
    }

    this.updateCriteria('10.7', status, message);
    this.updateTest('10.7.1', status);

    return 'NT';
  }

  private getTextElementList(rootElement: HTMLElement): HTMLElement[] {
    const textElementList: HTMLElement[] = [];

    // Check if element is a text element or check its children
    function recursively(element: HTMLElement) {
        if (element.nodeType === Node.TEXT_NODE && element.nodeValue?.trim() !== '') {
            textElementList.push(element.parentElement!);
        } else {
            for (const child of Array.from(element.children)) {
                recursively(child as HTMLElement);
            }
        }
    }

    recursively(rootElement);
    return textElementList;
  }

  private getFocusableElementList(): HTMLElement[] {
    // Select all focusable elements
    let focusableElementList = Array.from(document.querySelectorAll('a[href], area[href], button, input, object, select, label, legend, optgroup, option, textarea, [tabindex]')) as HTMLElement[];

    // Removes elements with tabindex="-1"
    focusableElementList = focusableElementList.filter((element) => {
      return element.getAttribute('tabindex') !== '-1';
    });

    // Sort by tabindex in ascending order
    const sortedElementList = Array.from(focusableElementList).sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
      return tabindexA - tabindexB;
    });

    return sortedElementList;
  }
}

