/*
 * Criterion1_9.ts - Copyright (c) 2023-2024 - Arneo
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
import ImageUtils from '../utils/ImageUtils';

/**
 * Chaque légende d’image est-elle, si nécessaire, correctement reliée à l’image correspondante ?
 * Traite: NT, NC
 */
export default class Criterion1_9 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.querySelector = ImageUtils.querySelector;
    this.messageList = {
      'NT': 'Trouvez les images sans légende ou avec une légende incorrecte.',
      'NC': 'Des images sont mal reliées à leur légende.',
      'NA': 'Aucune image n\'a été trouvée dans la page.'
    }
  }

  runTest() {
    console.log('Running test for criterion 1.9');
    this.status = 'NA';

    let $invalidFigureImageList: HTMLElement[] = [];

    let $imageList = document.querySelectorAll('img, [role="img"]:not(object, embed, svg, canvas), input[type="image"]');
    let imageHasValidCaption = true;
    Array.from($imageList).forEach(($image: HTMLElement) => {
      if (!this.hasValidFigureCaption($image)) {
        this.status = 'NC';
        $invalidFigureImageList.push($image);
        imageHasValidCaption = false;
      }
    });

    let $objectList = document.querySelectorAll('object[type^="image/"]');
    let objectHasValidCaption = true;
    Array.from($objectList).forEach(($object: HTMLElement) => {
      if (!this.hasValidFigureCaption($object)) {
        this.status = 'NC';
        $invalidFigureImageList.push($object);
        objectHasValidCaption = false;
      }
    });

    let $embedList = document.querySelectorAll('embed[type^="image/"]');
    let embedHasValidCaption = true;
    Array.from($embedList).forEach(($embed: HTMLElement) => {
      if (!this.hasValidFigureCaption($embed)) {
        this.status = 'NC';
        $invalidFigureImageList.push($embed);
        embedHasValidCaption = false;
      }
    });

    let $svgList = document.querySelectorAll('svg[role="img"]');
    let svgHasValidCaption = true;
    Array.from($svgList).forEach(($svg: HTMLElement) => {
      if (!this.hasValidFigureCaption($svg)) {
        this.status = 'NC';
        $invalidFigureImageList.push($svg);
        svgHasValidCaption = false;
      }
    });

    let $canvasList = document.querySelectorAll('canvas[role="img"]');
    let canvasHasValidCaption = true;
    Array.from($canvasList).forEach(($canvas: HTMLElement) => {
      if (!this.hasValidFigureCaption($canvas)) {
        this.status = 'NC';
        $invalidFigureImageList.push($canvas);
        canvasHasValidCaption = false;
      }
    });

    this.testList = {
      1: $imageList.length ? (imageHasValidCaption ? 'NT' : 'NC') : 'NA',
      2: $objectList.length ? (objectHasValidCaption ? 'NT' : 'NC') : 'NA',
      3: $embedList.length ? (embedHasValidCaption ? 'NT' : 'NC') : 'NA',
      4: $svgList.length ? (svgHasValidCaption ? 'NT' : 'NC') : 'NA',
      5: $canvasList.length ? (canvasHasValidCaption ? 'NT' : 'NC') : 'NA'
    }

    console.log('1.9 - Liste des images avec légende mal associée', $invalidFigureImageList);

    if($invalidFigureImageList.length > 0) {
      this.logResults('1.9 - Liste des images avec légende mal associée', $invalidFigureImageList);
    }

    this.elementList = Array.from($invalidFigureImageList) as HTMLElement[];

    return this.status;
  }

  getHighlightLabel($element: HTMLElement) {
    return ImageUtils.getImageLabel($element);
  }

  getHighlightedElements(): Array<HTMLElement> {
    let $highlightElementList: HTMLElement[] = [];
    let $imageList = document.querySelectorAll(this.querySelector);
    Array.from($imageList).forEach(($image: HTMLElement) => {
      if(!this.hasValidFigureCaption($image)) {
        $highlightElementList.push($image);
      }
    });

    return $highlightElementList;
  }

  getHighlightListContent($element: HTMLElement) {
    // For images, display the image
    let $highlightContent = '';
    if ($element.tagName === 'IMG') {
      $highlightContent = `<img src="${($element as HTMLImageElement).src}" alt="${ImageUtils.getImageLabel($element)}">`;
    } else {
      $highlightContent = this.getHighlightLabel($element);
    }

    // Checks what is missing in the figure
    let $figure = $element.closest('figure');
    if($figure) {
      if(!['figure', 'group'].includes($figure.getAttribute('role'))) {
        $highlightContent += `<br>La figure n'a pas d'attribut role="figure" ou role="group".`;
      }

      let ariaLabel = $figure.getAttribute('aria-label');
      if(!ariaLabel) {
        $highlightContent += `<br>La figure n'a pas d'attribut aria-label.`;
      } else {
        let $figcaption = $figure.querySelector('figcaption');
        if($figcaption && ariaLabel !== $figcaption.textContent) {
          $highlightContent += `<br>Le aria-label de la figure ne correspond pas au texte de la légende.`;
        }
      }
    }

    return $highlightContent;
  }

  private hasValidFigureCaption($image: HTMLElement) {
    // Checks if the image is in a figure
    let $figure = $image.closest('figure');
    if(!$figure) {
      return true;
    }

    // Checks if the figure has a figcaption
    let $figcaption = $figure.querySelector('figcaption');
    if(!$figcaption) {
      // Checks if figure got a legend text but not a figcaption
      let figcaptionText = $figure.textContent;
      if(figcaptionText.trim() !== '') {
        // No figcaption but a legend text, status is NC
        return false;
      }

      // No figcaption in figure, do nothing
      return true;
    }

    // Checks if figure/figcaption is correctly linked to the image
    // Checks figure role
    let $figureRole = $figure.getAttribute('role');
    if(!['figure', 'group'].includes($figureRole)) {
      return false;
    }

    // figure must have a aria-label attribute matching figcaption content
    let figcaptionText = $figcaption.textContent;
    let ariaLabel = $figure.getAttribute('aria-label');
    if(ariaLabel !== figcaptionText) {
      return false;
    }

    return true;
  }
}

