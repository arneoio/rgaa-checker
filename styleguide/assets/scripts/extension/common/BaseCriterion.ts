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

export default abstract class BaseCriterion implements ICriterion {
  $criteriaCard: HTMLElement;
  querySelector: string;
  querySelectorList: Array<HTMLElement>;
  isInitialTestDone: boolean = false;
  isTestMode: boolean = false;
  topicNumber: number;
  topicSlug: string;
  criteriaNumber: number;
  status: string = 'NT';
  messageList: any = {};
  elementList: Array<HTMLElement> = [];
  testList: any = {};
  HIGHLIGHT_CONTENT_MAX_LENGTH: number = 100;
  isHighlightActive: boolean = false;

  constructor(isTestMode: boolean = false) {
    this.isTestMode = isTestMode;
    if(this.isTestMode) {
      return;
    }
    let criteriaNumber = this.constructor.name.replace('Criterion', '').replace('_', '.');
    this.topicNumber = parseInt(criteriaNumber.split('.')[0]);
    this.topicSlug = this.getTopicSlug(this.topicNumber);
    this.criteriaNumber = parseInt(criteriaNumber.split('.')[1]);
    this.querySelector = '';
  }

  sendActionMessage(action: string) {
    // Send message to background script to zoom in for firefox or chrome
    if(typeof browser !== 'undefined') {
      browser.runtime.sendMessage({
        tabId: chrome.devtools.inspectedWindow.tabId,
        action: action
      });
    } else {
      chrome.runtime.sendMessage({
        tabId: chrome.devtools.inspectedWindow.tabId,
        action: action
      });
    }
  }

  updateCriteria(criteriaNumber: string, status: string, verification?: string) {
    // TODO: remove
  }

  updateTest(testNumber: string, status: string) {
    // TODO: remove
  }

  abstract runTest(): string;

  formatJSON(): any {
    let result = {
      topicNumber: this.topicNumber,
      criteriaNumber: this.criteriaNumber,
      status: this.status,
      messageList: this.messageList,
      elementList: this.querySelectorList,
      testList: this.testList,
      highlightSwitchLabel: this.getHighlightSwitchLabel(),
    }

    return result;
  }

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

  disableHighlight() {
    if(this.isHighlightActive) {
      this.resetHighlight();
      this.isHighlightActive = false;
    }
  }

  resetHighlight() {
    // Remove all highlights
    this.isHighlightActive = false;
  }

  enableHighlight() {
    this.isHighlightActive = true;
    this.activateHighlight();
    return this.getHighlightedElements();
  }

  activateHighlight() {
  }
}
