/*
 * Criterion10_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion10_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.initHighlight();
  }

  resetHighlight(): void {
    // Réactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = false;
    });
  }

  activateHighlight(): void {
    // Désactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = true;
    });
  }

  getHighlightText() {
    return "Switch les styles";
  }

  runTest() {
    let status = 'NT';
    let message = "Désactivez les feuilles de styles pour valider le test 10.1.3 en vérifiant que les espaces n'ont pas été utilisés pour simuler des tableaux ou des colonnes ni pour séparer les lettres d'un mot.";

    const presentationElementList = document.querySelectorAll('basefont, big, blink, center, font, marquee, s, strike, tt');
    if (presentationElementList.length > 0) {
      status = 'NC';
      message = "Des éléments de présentation sont utilisés dans le site web.";
    }

    const presentationAttributes = [
      'align', 'alink', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing',
      'char', 'charoff', 'clear', 'color', 'compact', 'frameborder', 'hspace',
      'link', 'marginheight', 'marginwidth', 'text', 'valign', 'vlink', 'vspace',
    ];
    const presentationAttributeList = document.body.querySelectorAll(presentationAttributes.map((attribute) => `[${attribute}]`).join(', '));

    // Vérifie si l'attribut size est utilisé sauf sur les balises select
    const sizeAttributeList = document.body.querySelectorAll('[size]:not(select)');

    // Vérifie si l'attribut width ou height est utilisé sauf sur les balises img, object, canvas, embed, svg
    const widthAttributeList = document.body.querySelectorAll('[width]:not(img, object, canvas, embed, svg)');
    const heightAttributeList = document.body.querySelectorAll('[height]:not(img, object, canvas, embed, svg)');

    const mergedPresentationAttributeList = Array.from(presentationAttributeList).concat(Array.from(sizeAttributeList)).concat(Array.from(widthAttributeList)).concat(Array.from(heightAttributeList));

    if (mergedPresentationAttributeList.length > 0) {
      status = 'NC';
      message = "Des attributs de présentation sont utilisés dans le site web.";
    }

    this.updateCriteria('10.1', status, message);
    this.updateTest('10.1.1', presentationElementList.length > 0 ? 'NC' : 'C');
    this.updateTest('10.1.2', mergedPresentationAttributeList.length > 0 ? 'NC' : 'C');
    this.updateTest('10.1.3', 'NT');

    if (presentationElementList.length > 0) {
      this.logResults('10.1 - Liste des éléments de présentation', presentationElementList);
    }

    if (mergedPresentationAttributeList.length > 0) {
      this.logResults('10.1 - Liste des attributs de présentation', mergedPresentationAttributeList);
    }

    return status;
  }
}

