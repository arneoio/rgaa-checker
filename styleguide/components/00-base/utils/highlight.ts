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
import BaseCriterion from '../../../assets/scripts/extension/common/BaseCriterion';

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

  public activate(highlightJsonList: any) {
    this.clear();
    highlightJsonList.forEach((highlightJson: any, index: number) => {
      this.addItem(index, highlightJson);
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

  private addItem(index: number, highlightJson: any) {
    const $item = this.itemTemplate.content.cloneNode(true) as HTMLElement;
    let $tag: HTMLElement = $item.querySelector('.js-highlightList__itemTag') as HTMLElement;
    $tag.textContent = highlightJson.tag;
    $tag.classList.add(`-tag${highlightJson.tag}`);

    // Set text to display
    $item.querySelector('.js-highlightList__itemText').innerHTML = highlightJson.text;
    // Setcheckbox value
    ($item.querySelector('.js-highlightList__itemCheckbox') as HTMLInputElement).value = index.toString();

    $item.querySelector('.js-highlightList__itemConsoleButton').addEventListener('click', () => {
      console.log('hightlight in console', highlightJson);
      this.inspectElement(highlightJson);
    });
    $item.querySelector('.js-highlightList__itemPageButton').addEventListener('click', () => {
      console.log('hightlight in page');
      this.highlightElement(highlightJson);
    });
    if(highlightJson.isVisible) {
      $item.querySelector('.js-highlightList__visibilityStatus').remove();
    } else {
      $item.querySelector('.js-highlightList__itemPageButton').remove();
    }

    this.$list.appendChild($item);
  }

  private inspectElement(highlightJson: any) {
    chrome.devtools.inspectedWindow.eval(`inspect(document.evaluate('${highlightJson.xpath}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)`);
  }

  private highlightElement(highlightJson:any) {

    // $highlightElement.scrollIntoView({behavior: "smooth", block: "center"});
    // setTimeout(() => {
    //   // add a class to trigger the highlight animation
    //   $highlightElement.classList.add('-rgaacheckerHighlight');
    //   setTimeout(() => {
    //     $highlightElement.classList.remove('-rgaacheckerHighlight');
    //   }, 1000);
    // }, 500);
  }
}
