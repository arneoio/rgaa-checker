/*
 * content.ts - Copyright (c) 2023-2024 - Arneo
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
import AccessibilityTester from '../assets/scripts/extension/AccessibilityTester';

class RGAACheckerContent {
  accessibilityTester: AccessibilityTester;
  $highlightWrapper: HTMLElement;
  $highlightCanvas: HTMLCanvasElement;
  highlightContext: CanvasRenderingContext2D;
  isStylesInjected: boolean;

  constructor() {
    this.isStylesInjected = false;
    this.accessibilityTester = new AccessibilityTester();
    this.init();
  }

  init() {
    // send message if devtools panel is open
    if(typeof browser !== 'undefined' && browser) {
      browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
    } else {
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch(request.action) {
      case "background_runTests":
        this.runTests(sendResponse);
        break;
      case "background_enableHighlight":
        this.enableHighlight(request.topicNumber, request.criteriaNumber, sendResponse);
        break;
      case "background_disableHighlight":
        this.disableHighlight(sendResponse);
        break;
      case "background_highlightElement":
        this.highlightElement(request.xpath);
        break;
      default:
        sendResponse({});
        break;
    }

    return true;
  }

  runTests(sendResponse: any) {
    let testJsonResult = this.accessibilityTester.runTests();
    let messageParams = {
      action: 'content_testsCompleted',
      result: testJsonResult,
      host: window.location.host,
      url: window.location.pathname + window.location.search
    };
    if(typeof browser !== 'undefined' && browser) {
      browser.runtime.sendMessage(messageParams);
    } else {
      chrome.runtime.sendMessage(messageParams);
    }
    sendResponse(testJsonResult);
    return testJsonResult;
  }

  enableHighlight(topicNumber: string, criteriaNumber: string, sendResponse: any) {
    if(!this.isStylesInjected) {
      this.injectStyles();
      this.accessibilityTester.initHighlight();
      this.isStylesInjected = true;
    }

    let highlightedElementList = this.accessibilityTester.enableHighlight(topicNumber, criteriaNumber);
    chrome.runtime.sendMessage({
      action: 'content_elementsHightlighted',
      result: highlightedElementList
    });
    sendResponse(true);
    return true;
  }

  disableHighlight(sendResponse: any) {
    this.accessibilityTester.disableHighlight();
    sendResponse(true);
    return true;
  }

  highlightElement(xpath: string) {
    let $highlightElement = this.getElementByXpath(xpath);
    if($highlightElement) {
      $highlightElement.scrollIntoView({behavior: "smooth", block: "center"});
      setTimeout(() => {
        // add a class to trigger the highlight animation
        $highlightElement.classList.add('-rgaachecker__highlight');
        setTimeout(() => {
          $highlightElement.classList.remove('-rgaachecker__highlight');
        }, 1000);
      }, 500);
    }
  }

  getElementByXpath(path: string) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
  }

  injectStyles() {
    let $style = document.createElement('link');
    $style.rel = 'stylesheet';
    $style.type = 'text/css';
    $style.href = chrome.runtime.getURL('rgaa-checker-content.css');
    document.head.appendChild($style);
  }
}

new RGAACheckerContent();
