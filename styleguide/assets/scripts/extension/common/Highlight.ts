/*
 * Highlight.ts - Copyright (c) 2023-2024 - Arneo
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
import BaseCriterion from './BaseCriterion';

export default class Highlight {
  private static instance: Highlight | null = null;
  private $element: HTMLElement;
  private $list: HTMLElement;
  private itemTemplate: HTMLTemplateElement
  private $closeButton: HTMLElement;
  private tempId: string = 'rgaachecker-hightlight-id';

  private constructor() {
    this.$element = document.querySelector('.js-highlightList') as HTMLElement;
    this.$list = this.$element.querySelector('.js-highlightList__list') as HTMLElement;
    this.itemTemplate = this.$element.querySelector('.js-highlightList__itemTemplate') as HTMLTemplateElement;
    this.$closeButton = this.$element.querySelector('.js-highlightList__closeButton') as HTMLElement;

    this.bindEvents();
  }

  public static getInstance(): Highlight {
    if (!Highlight.instance) {
      Highlight.instance = new Highlight();
    }
    return Highlight.instance;
  }

  private bindEvents() {
    this.$closeButton.addEventListener('click', this.close.bind(this));
  }

  private close() {
    this.hide();
  }

  public activate(criterion: BaseCriterion) {
    let $highlightElementList: Array<HTMLElement> = criterion.getHighlightedElements();
    this.clear();
    $highlightElementList.forEach(($highlightElement, index) => {
      this.addItem(index, $highlightElement, criterion);
    });
    this.show();
  }

  private show() {
    this.$element.classList.remove('-hidden');
  }

  public hide() {
    this.$element.classList.add('-hidden');
  }

  private clear() {
    // Remove all except first item (usd for all) and template
    while (this.$list.children.length > 2) {
      this.$list.removeChild(this.$list.lastChild as Node);
    }
  }

  private addItem(index: number, $highlightElement: HTMLElement, criterion: BaseCriterion) {
    const $item = this.itemTemplate.content.cloneNode(true) as HTMLElement;
    let $tag: HTMLElement = $item.querySelector('.js-highlightList__itemTag') as HTMLElement;
    $tag.textContent = $highlightElement.tagName.toUpperCase();
    $tag.classList.add(`-tag${$highlightElement.tagName.toUpperCase()}`);

    // Set text to display
    $item.querySelector('.js-highlightList__itemText').innerHTML = criterion.getHighlightListContent($highlightElement);
    // Setcheckbox value
    ($item.querySelector('.js-highlightList__itemCheckbox') as HTMLInputElement).value = index.toString();

    // $item.querySelector('.js-highlightList__itemConsoleButton').addEventListener('click', () => {
    //   this.inspectElement($highlightElement);
    // });
    $item.querySelector('.js-highlightList__itemPageButton').addEventListener('click', () => {
      this.highlightElement($highlightElement);
    });
    let isElementVisible = $highlightElement.checkVisibility({
      opacityProperty: true,
      visibilityProperty: true,
    } as any); // Obligé de mettre "any", opacityProperty n'est pas reconnu
    if(isElementVisible) {
      $item.querySelector('.js-highlightList__visibilityStatus').remove();
    }

    this.$list.appendChild($item);
  }

  private inspectElement($highlightElement: HTMLElement) {
    if(!$highlightElement.id) {
      $highlightElement.id = this.tempId;
    }
    // Send message to background script to zoom in for firefox or chrome
    if(typeof browser !== 'undefined') {
      browser.runtime.sendMessage({action: "inspectElement", elementId: $highlightElement.id});
    } else {
      chrome.runtime.sendMessage({action: "inspectElement", elementId: $highlightElement.id});
    }
  }

  private highlightElement($highlightElement: HTMLElement) {
    $highlightElement.scrollIntoView({behavior: "smooth", block: "center"});
    setTimeout(() => {
      // add a class to trigger the highlight animation
      $highlightElement.classList.add('-rgaacheckerHighlight');
      setTimeout(() => {
        $highlightElement.classList.remove('-rgaacheckerHighlight');
      }, 1000);
    }, 500);
  }
}
