/*
 * Criterion3_2.ts - Copyright (c) 2023-2024 - Arneo
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
import ColorUtils from '../utils/ColorUtils';

/**
 * Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?
 * Traite: C, NC
 */
export default class Criterion3_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'C': 'Le contraste entre la couleur du texte et la couleur de son arrière-plan est suffisamment élevé pour tous les éléments textuels.',
      'NC': 'Le contraste entre la couleur du texte et la couleur de son arrière-plan n\'est pas suffisamment élevé pour tous les éléments textuels.'
    }
    this.querySelector = 'p, div, li, td, span, a, button, h1, h2, h3, h4, h5, h6';
  }

  getHighlightSwitchLabel(): string {
    return this.status === 'C' ? '' : this.DEFAULT_HIGHLIGHT_TEXT;
  }

  getHighlightedElements(): Array<HTMLElement> {
    const $elementList = document.querySelectorAll(this.querySelector);
    let $elementListToCheck: Array<any> = this.getElementListToCheck(Array.from($elementList) as Array<HTMLElement>);
    let $elementListToHighlight: Array<HTMLElement> = [];

    if ($elementListToCheck.length) {
      $elementListToCheck.forEach(($elementToCheck: any) => {
        if(!ColorUtils.isValidContrast($elementToCheck.textColor, $elementToCheck.backgroundColor)) {
          $elementListToHighlight.push($elementToCheck.element);
        }
      });
    }

    return $elementListToHighlight;
  }

  getHighlightListContent($element: HTMLElement) {
    let color = window.getComputedStyle($element).color;
    let backgroundColor = ColorUtils.getRealBackgroundColor($element);

    return `<span class="o-highlightList__constrastWrapper">
      <span class="o-highlightList__constrast"
        style="--rgaa-checker-3-2-color: ${color}; --rgaa-checker-3-2-background-color: ${backgroundColor};"
        title="Couleur: ${color}; Couleur de fond: ${backgroundColor}">
        <span class="-sr-only">Couleur : ${color}; Couleur de fond : ${backgroundColor}</span>
      </span>
      Ratio: ${ColorUtils.getContrast(color, backgroundColor).toFixed(2)}<br />
      Texte: ${this.getDirectTextContent($element)}
    </span>`;
  }

  runTest() {
    this.status = 'C';
    const $elementList = document.querySelectorAll(this.querySelector);
    let $elementListToCheck: Array<any> = this.getElementListToCheck(Array.from($elementList) as Array<HTMLElement>);

    if ($elementListToCheck.length) {
      $elementListToCheck.forEach(($elementToCheck: any) => {
        if(!ColorUtils.isValidContrast($elementToCheck.textColor, $elementToCheck.backgroundColor)) {
          this.status = 'NC';
          return;
        }
      });
    }

    return this.status;
  }

  private getElementListToCheck($elementList: Array<HTMLElement>): Array<any> {
    let $elementListToCheck: Array<any> = [];
    $elementList.forEach(($element: HTMLElement) => {
      const style = window.getComputedStyle($element);

      // If element doesn't have text, we don't need to check it
      if(!this.getDirectTextContent($element)) {
        return;
      }

      // If element is not visible, we don't need to check it
      let isElementVisible = $element.offsetWidth > 0 && $element.offsetHeight > 0 && style.visibility !== 'hidden' && style.display !== 'none' && style.opacity !== '0';

      if(!isElementVisible) {
        return;
      }

      // Ignore elment if visible for screen readers only
      if (style.clipPath.includes('inset(50%)')) {
        return;
      }

      // Get element color and background color
      const textColor = style.color;
      const backgroundColor = ColorUtils.getRealBackgroundColor($element);

      if (textColor && backgroundColor) {
        // Ajouter les éléments valides pour la vérification du contraste
        $elementListToCheck.push({
          element: $element,
          textColor: textColor,
          backgroundColor: backgroundColor,
        });
      }
    });

    return $elementListToCheck;
  }

  private getDirectTextContent($element: HTMLElement): string {
    let textContent = '';

    // Find text content of direct children
    Array.from($element.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            textContent += child.textContent?.trim() || '';
        }
    });

    return textContent;
  }
}

