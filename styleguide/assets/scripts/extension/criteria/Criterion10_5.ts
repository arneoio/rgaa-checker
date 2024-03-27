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
  export default class Criterion10_5 extends BaseCriterion {
  zoomFactor: number = 1;
  $highlightedElementList: Array<HTMLElement> = [];

  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.initHighlight();
  }

  getHighlightedElements(): Array<HTMLElement> {
    return this.getElementWithBackgroundImageList(document.body);
  }

  activateHighlight(): void {
    super.activateHighlight();

    // Also remove background images
    const $elementWithBackgroundImageList = this.getElementWithBackgroundImageList(document.body);
    this.$highlightedElementList = $elementWithBackgroundImageList;

    for (const $element of $elementWithBackgroundImageList) {
        const backgroundImage = getComputedStyle($element).getPropertyValue('background-image');
        const inlineBackgroundImage = $element.style.backgroundImage;
        // if background-image is in inline style, save it in data attribute
        if (inlineBackgroundImage) {
            $element.dataset.backgroundImage = inlineBackgroundImage;
        }

        $element.style.backgroundImage = 'none';
    }
  }

  resetHighlight(): void {
    super.resetHighlight();

    // Restore background images
    this.$highlightedElementList.forEach(($element: HTMLElement) => {
        let backgroundImage = $element.dataset.backgroundImage;
        if (backgroundImage) {
          $element.style.backgroundImage = $element.dataset.backgroundImage;
          delete $element.dataset.backgroundImage;
        } else {
          $element.style.backgroundImage = '';
        }
    });
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun élément texte n'a été trouvé.";
    let test1Status = 'NA';
    let test2Status = 'NA';
    let test3Status = 'NA';

    let allTextElementsHaveBackgroundColor = true;
    let allTextElementsHaveColor = true;

    let $colorElementList = [];
    let $backgroundElementList = [];

    // Best practice and convention is to get color and background-color on body element
    if(this.hasBackgroundColor(document.body) && this.hasColor(document.body)) {
      status = 'C';
      message = "Les déclarations CSS de color de background sont déclarées dans le body.";
      test1Status = 'C';
      test2Status = 'C';
    } else {
      // if not defined on body, find all text elements then check if they have background color and color
      let $textElementList = this.getTextElementList(document.body);
      if ($textElementList.length) {
        for (const $textElement of $textElementList) {
          if (!this.hasBackgroundColor($textElement)) {
            allTextElementsHaveBackgroundColor = false;
            $backgroundElementList.push($textElement);
          }
          if (!this.hasColor($textElement)) {
            allTextElementsHaveColor = false;
            $colorElementList.push($textElement);
          }
        }

        status = allTextElementsHaveBackgroundColor && allTextElementsHaveColor ? 'C' : 'NC';
        test1Status = allTextElementsHaveBackgroundColor ? 'C' : 'NC';
        test2Status = allTextElementsHaveColor ? 'C' : 'NC';
        message = allTextElementsHaveBackgroundColor ?
          "Les déclarations CSS de background sont correctement définies." :
          "Les déclarations CSS de background ne sont pas correctement définies pour tous les textes.";
        message += allTextElementsHaveColor ?
          "<br />Les déclarations CSS de color sont correctement définies." :
          "<br />Les déclarations CSS de color ne sont pas correctement définies pour tous les textes.";
      }
    }

    let elementWithBackgroundImageList = this.getElementWithBackgroundImageList(document.body);
    if(elementWithBackgroundImageList.length > 0) {
      status = 'NT';
      message += "<br />Certains éléments ont des images de fond à vérifier.";
      test3Status = 'NT';
    } else {
      test3Status = 'NA';
      message += "<br />Aucun élément n'a d'image de fond.";
    }

    this.updateCriteria('10.5', status, message);
    this.updateTest('10.5.1', test1Status);
    this.updateTest('10.5.2', test2Status);
    this.updateTest('10.5.3', test3Status);

    if (elementWithBackgroundImageList.length > 0) {
      this.logResults('10.5 - Éléments avec background image', elementWithBackgroundImageList);
    }
    if($colorElementList.length > 0) {
      this.logResults('10.5 - Éléments sans couleur', $colorElementList);
    }
    if($backgroundElementList.length > 0) {
      this.logResults('10.5 - Éléments sans background', $backgroundElementList);
    }

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

  private getElementWithBackgroundImageList(rootElement: HTMLElement): HTMLElement[] {
    const elementWithBackgroundImageList: HTMLElement[] = [];

    // Check if element has background image or check its children
    function recursively(element: HTMLElement) {
        const computedStyle = getComputedStyle(element);
        const backgroundImage = computedStyle.getPropertyValue('background-image');

        // if background-image is defined and not none (or list of none), add to list
        if (backgroundImage && !backgroundImage.split(',').every(bg => bg.trim() === 'none')) {
            elementWithBackgroundImageList.push(element);
        } else {
            for (const child of Array.from(element.children)) {
              recursively(child as HTMLElement);
            }
        }
    }

    recursively(rootElement);
    return elementWithBackgroundImageList;
  }

  private hasBackgroundColor(element: HTMLElement): boolean {
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.getPropertyValue('background-color');

    // if background-color is defined and not transparent, return true
    if(backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      return true;
    }

    // else check if parent has background-color recursively
    if(element.parentElement) {
      return this.hasBackgroundColor(element.parentElement);
    }

    return false;
  }

  private hasColor(element: HTMLElement): boolean {
    const computedStyle = getComputedStyle(element);
    const color = computedStyle.getPropertyValue('color');

    // Vérifier si la couleur de police est définie et n'est pas transparente
    return !!color && color !== 'rgba(0, 0, 0, 0)';
  }
}

