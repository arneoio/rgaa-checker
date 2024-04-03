/*
 * background_chrome.js - Copyright (c) 2023-2024 - Arneo
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

  constructor() {
    this.accessibilityTester = new AccessibilityTester();
    this.init();
  }

  init() {
    console.log('Init RGAACheckerContent');
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch(request.action) {
      case "runTests":
        this.runTests(sendResponse);
        break;
      case "enableHighlight":
        this.enableHighlight(request.topicNumber, request.criteriaNumber, sendResponse);
        break;
      case "disableHighlight":
        this.disableHighlight(sendResponse);
        break;
      default:
        console.log('Unknown action: ' + request.action);
        sendResponse({});
        break;
    }

    return true;
  }

  runTests(sendResponse: any) {
    let testJsonResult = this.accessibilityTester.runTests();
    chrome.runtime.sendMessage({
      action: 'testsCompleted',
      result: testJsonResult
    });
    sendResponse(testJsonResult);
    return testJsonResult;
  }

  enableHighlight(topicNumber: string, criteriaNumber: string, sendResponse: any) {
    let highlightedElementList = this.accessibilityTester.enableHighlight(topicNumber, criteriaNumber);
    chrome.runtime.sendMessage({
      action: 'elementsHightlighted',
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
}

console.log('Load RGAACheckerContent script');
new RGAACheckerContent();
