/*
 * BaseCriterion.ts - Copyright (c) 2023-2024 - Arneo
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

import { ICriterion } from "./ICriterion";
import Highlight from "./Highlight"

export default abstract class BaseCriterion implements ICriterion {
  $wrapper: HTMLElement;
  $highLightWrapper: HTMLElement;
  $criteriaCard: HTMLElement;
  querySelector: string;
  querySelectorList: Array<HTMLElement>;
  isInitialTestDone: boolean = false;
  isTestMode: boolean = false;
  topicNumber: number;
  topicSlug: string;
  criteriaNumber: number;
  highlightInstance: Highlight;
  HIGHLIGHT_CONTENT_MAX_LENGTH: number = 100;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    this.$wrapper = $wrapper;
    this.$highLightWrapper = $highLightWrapper;
    this.isTestMode = isTestMode;
    if(this.isTestMode) {
      return;
    }
    let criteriaNumber = this.constructor.name.replace('Criterion', '').replace('_', '.');
    this.topicNumber = parseInt(criteriaNumber.split('.')[0]);
    this.topicSlug = this.getTopicSlug(this.topicNumber);
    this.criteriaNumber = parseInt(criteriaNumber.split('.')[1]);
    this.$criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    this.querySelector = '';
    this.highlightInstance = Highlight.getInstance(this.$wrapper);
  }

  initHighlight() {
    if(this.isTestMode) {
      return;
    }

    // Affiche le switch
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');
    ($highlightSwitch.querySelector('.js-toggleSwitch__label') as HTMLElement).innerText = this.getHighlightSwitchLabel();
    $highlightSwitch.classList.remove('-hidden');

    // Ajoute le listener sur le switch
    const $input = $highlightSwitch.querySelector('input') as HTMLInputElement;
    $input.addEventListener('change', () => {
      if (!$input.checked) {
        this.resetHighlight();
      } else {
        // Désactive les autres highlight
        Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard__highlightSwitch input:checked')).forEach(($input: HTMLInputElement) => {
          if ($input !== $highlightSwitch.querySelector('input')) {
            $input.checked = false;
            // Trigger le change pour reset le highlight du bon critère
            $input.dispatchEvent(new Event('change'));
          }
        });

        this.enableHighlight();
      }
    });
  }

  updateCriteria(criteriaNumber: string, status: string, verification?: string) {
    if (this.isTestMode) {
      return;
    }
    let $criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    if (!$criteriaCard) {
      return;
    }
    $criteriaCard.dataset.status = status;

    if (verification) {
      let $criteriaVerification = $criteriaCard.querySelector('.js-criteriaCard__verification') as HTMLElement;
      $criteriaVerification.innerHTML = verification;
    }

    let $criteriaSelector = $criteriaCard.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;

    // Trigger click on criteriaSelector to update its status
    if (!this.isInitialTestDone) {
      const initializedEvent = new Event('rgaachecker-criteria-initialized', {
        bubbles: true,
        cancelable: true,
      });

      $criteriaSelector.dispatchEvent(initializedEvent);
    } else {
      $criteriaSelector.click();
    }
  }

  updateTest(testNumber: string, status: string) {
    if (this.isTestMode) {
      return;
    }

    let $criteriaTest = this.$wrapper.querySelector(`.js-criteriaCard__test__number[data-test="${testNumber}"]`) as HTMLElement;
    if (!$criteriaTest) {
      return;
    }

    $criteriaTest.dataset.status = status;
  }

  abstract runTest(): string;

  getHighlightedElements(): Array<HTMLElement> {
    if(!this.querySelector) {
      return [];
    }

    return Array.from(document.querySelectorAll(this.querySelector));
  }

  /**
   * Get the label for the highlight switch
   * @returns {string} Switch label
   */
  getHighlightSwitchLabel(): string {
    return 'Highlight';
  }

  /**
   * Get the content to display in the highlight list
   * @param $element
   * @returns string content to display, default similar to highlightLabel
   */
  getHighlightListContent($element: HTMLElement) {
    let text = $element.textContent;
    return text.length > this.HIGHLIGHT_CONTENT_MAX_LENGTH ? text.substring(0, this.HIGHLIGHT_CONTENT_MAX_LENGTH) + '...' : text;
  }

  /**
   * Get the label to display over the highlighted element
   * @param $element
   * @returns string label to display
   */
  getHighlightLabel($element: HTMLElement) {
    return '';
  }

  /**
   * Get the slug for the topic number
   * @param topicNumber
   * @returns string slug
   */
  getTopicSlug(topicNumber: number): string {
    switch (topicNumber) {
      case 1:
        return 'images';
      case 2:
        return 'frames';
      case 3:
        return 'colors';
      case 4:
        return 'multimedia';
      case 5:
        return 'tables';
      case 6:
        return 'links';
      case 7:
        return 'scripts';
      case 8:
        return 'mandatory';
      case 9:
        return 'structure';
      case 10:
        return 'presentation';
      case 11:
        return 'forms';
      case 12:
        return 'navigation';
      case 13:
        return 'consultation';
      default:
        return '';
    }
  }

  logResults(title: string, log: any): void {
    if (this.isTestMode) {
      return;
    }
    console.groupCollapsed(title);
    console.log(log);
    console.groupEnd();
  };

  resetHighlight() {
    document.querySelectorAll('*').forEach(($element: HTMLElement) => {
      $element.style.opacity = null; $element.style.outline = null;
    }
    );
    // Remove all highlights
    this.$highLightWrapper.innerHTML = '';
    this.highlightInstance.hide();
  }

  enableHighlight() {
    this.activateHighlight();
    this.highlightInstance.activate(this);
  }

  activateHighlight() {
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');

    // Retourne le tableau pour manipuler les éléments dans l'ordre inverse, optimisation pour le hideRecursive
    this.querySelectorList = [...this.getHighlightedElements().reverse()];
    if ($highlightSwitch.querySelector('input').checked) {
      this.hideRecursive(document.body);
    }
  }

  hideRecursive($element: HTMLElement, canBeHidden: boolean = true): boolean {
    if ($element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    // Ne pas cacher l'élément de l'extension
    if ($element.id === 'arneo-browser-extension') {
      return false;
    }

    // L'élément matche la recherche: mise en avant
    // Les éléments matchant sont dans l'ordre inverse de la liste
    if ($element === this.querySelectorList[this.querySelectorList.length - 1]) {
      // On supprime le dernier élément de la liste
      this.querySelectorList.pop();
      if (this.$highLightWrapper) {
        // On créé un élément dans le wrapper à la même position que l'élément matchant pour le mettre en avant
        let $highlight = document.createElement('div');
        let bounding = $element.getBoundingClientRect();
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        $highlight.style.top = `${bounding.top + scrollTop}px`;
        $highlight.style.left = `${bounding.left}px`;
        $highlight.style.width = `${bounding.width}px`;
        $highlight.style.height = `${bounding.height}px`;
        this.$highLightWrapper.appendChild($highlight);

        // Ajoute un label à l'élément mis en avant
        let $label = document.createElement('p');
        $label.innerText = this.getHighlightLabel($element);
        $highlight.appendChild($label);
      }

      $element.childNodes.forEach((e: HTMLElement) => {
        this.hideRecursive(e, false);
      });

      return false;
    }

    // L'élément n'a pas d'enfant ou est en aria hidden et ne match pas: on le masque
    if (($element.childElementCount === 0 || $element.getAttribute('aria-hidden') === 'true') && canBeHidden) {
      $element.style.opacity = '0.2';
      return !canBeHidden;
    } else {
      // On vérifie si parmis les enfants tous match ou pas pour ne masquer que le plus haut niveau ne matchant pas, on ne veut pas masquer récursivement
      let hasAllChildrenHidden = true;
      $element.childNodes.forEach((e: HTMLElement) => {
        var isChildHidden = this.hideRecursive(e, canBeHidden);
        if (!isChildHidden) {
          hasAllChildrenHidden = false;
        }
      });

      if (hasAllChildrenHidden && canBeHidden) {
        $element.style.opacity = '0.2';
        $element.querySelectorAll('*').forEach((e: HTMLElement) => {
          e.style.opacity = null;
        });
      }
      return hasAllChildrenHidden;
    }
  }
}
