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
  constructor() {
    this.init();
  }

  init() {
    console.log('Init RGAACheckerContent');
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    console.log('Message received in content fron background', request);
    switch(request.action) {
      case "runTests":
        console.log('Running tests from devtools');
        this.runTests(sendResponse);
        break;
    }

    return true;
  }

  runTests(sendResponse: any) {
    let accessibilityTester = new AccessibilityTester();
    let testJsonResult = accessibilityTester.runTests();
    chrome.runtime.sendMessage({
      action: 'testsCompleted',
      results: testJsonResult });
    sendResponse(testJsonResult);
    return testJsonResult;
  }
}

console.log('Load RGAACheckerContent script');
new RGAACheckerContent();
