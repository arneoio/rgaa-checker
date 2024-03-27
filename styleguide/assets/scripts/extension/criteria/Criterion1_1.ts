/*
 * Criterion1_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque image porteuse d’information a-t-elle une alternative textuelle ?
 * Traite: NA, NT
 */
export default class Criterion1_1 extends BaseCriterion {
  constructor($highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($highLightWrapper, isTestMode);
    this.querySelector = 'img, [role="img"], area, input[type="image"], img[ismap], object[type^="image/"], embed[type^="image/"]';
    this.initHighlight();
  }

  // getHighlightedElements(): Array<HTMLElement> {
  //   const noAltImageList: any = [];
  //   let $imageList = Array.from(document.querySelectorAll(this.querySelector));

  //   $imageList.forEach(($image: HTMLElement) => {
  //     if (!ImageUtils.hasImageLabel($image)) {
  //       noAltImageList.push($image);
  //     }
  //   });

  //   return noAltImageList;
  // }

  runTest() {
    let status = 'NA';
    let warningMessage = "/!\\ En l'état actuel, la distinction entre images porteuses et non porteuses d'information n'est pas faite. Nous listons ici toutes les images sans alternative textuelle.";
    let message = "Aucune image n'a été trouvée dans la page.";

    let $noLabelImageList: any = [];

    let $imageList = document.querySelectorAll('img, [role="img"]:not(object, embed, svg, canvas)');
    let imageHasLabel = true;
    Array.from($imageList).forEach(($image: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($image)) {
        imageHasLabel = false;
        $noLabelImageList.push($image);
      }
    });

    let $areaList = document.querySelectorAll('area');
    let areaHasLabel = true;
    Array.from($areaList).forEach(($area: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($area)) {
        areaHasLabel = false;
        $noLabelImageList.push($area);
      }
    });

    let $inputList = document.querySelectorAll('input[type="image"]');
    let inputHasLabel = true;
    Array.from($inputList).forEach(($input: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($input)) {
        inputHasLabel = false;
        $noLabelImageList.push($input);
      }
    });

    let $mapImageList = document.querySelectorAll('img[ismap]');
    let mapImageHasLabel = true;
    Array.from($mapImageList).forEach(($mapImage: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($mapImage)) {
        mapImageHasLabel = false;
        $noLabelImageList.push($mapImage);
      }
    });

    let $svgList = document.querySelectorAll('svg[role="img"]');
    let svgHasLabel = true;
    Array.from($svgList).forEach(($svg: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($svg)) {
        svgHasLabel = false;
        $noLabelImageList.push($svg);
      }
    });

    let $objectList = document.querySelectorAll('object[type^="image/"]');
    let objectHasLabel = true;
    Array.from($objectList).forEach(($object: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($object)) {
        objectHasLabel = false;
        $noLabelImageList.push($object);
      }
    });

    let $embedList = document.querySelectorAll('embed[type^="image/"]');
    let embedHasLabel = true;
    Array.from($embedList).forEach(($embed: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($embed)) {
        embedHasLabel = false;
        $noLabelImageList.push($embed);
      }
    });

    let $canvasList = document.querySelectorAll('canvas[role="img"]');
    let canvasHasLabel = true;
    Array.from($canvasList).forEach(($canvas: HTMLElement) => {
      if (!ImageUtils.hasImageLabel($canvas)) {
        canvasHasLabel = false;
        $noLabelImageList.push($canvas);
      }
    });

    if (!imageHasLabel || !areaHasLabel || !inputHasLabel || !mapImageHasLabel || !svgHasLabel || !objectHasLabel || !embedHasLabel || !canvasHasLabel) {
      // status = 'NC';
      message = "Toutes les images de la page n'ont pas d'alternative textuelle.";
    } else if ($imageList.length || $areaList.length || $inputList.length || $mapImageList.length || $svgList.length || $objectList.length || $embedList.length || $canvasList.length) {
      status = 'NT';
      message = "Toutes les images de la page ont une alternative textuelle.";
    }

    this.updateCriteria('1.1', status, message + '<br />' + warningMessage);
    this.updateTest('1.1.1', $imageList.length ? (imageHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.2', $areaList.length ? (areaHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.3', $inputList.length ? (inputHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.4', $mapImageList.length ? (mapImageHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.5', $svgList.length ? (svgHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.6', $objectList.length ? (objectHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.7', $embedList.length ? (embedHasLabel ? 'NT' : 'NC') : 'NA');
    this.updateTest('1.1.8', $canvasList.length ? (canvasHasLabel ? 'NT' : 'NC') : 'NA');

    let $allImageList = document.querySelectorAll(this.querySelector);
    if($allImageList.length > 0) {
      this.logResults('1.1 - Liste des images', document.querySelectorAll(this.querySelector));
    }

    if ($noLabelImageList.length > 0) {
      this.logResults('1.1 - Liste des images sans alternative textuelle', $noLabelImageList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return ImageUtils.getImageLabel($element);
  }

  getHighlightListContent($element: HTMLElement) {
    // For images, display the image
    if ($element.tagName === 'IMG') {
      return `<img src="${($element as HTMLImageElement).src}" alt="${ImageUtils.getImageLabel($element)}">`;
    } else {
      return this.getHighlightLabel($element);
    }
  }
}

