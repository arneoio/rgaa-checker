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
class Background {
  initialZoomFactor: number = 1;
  tabId: number = 0;

  constructor() {
    this.init();
  }

  init() {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    console.log('Message received to background', request);
    if(!request.tabId) {
      console.error('No tabId provided');
      return false;
    }
    this.tabId = request.tabId;
    switch(request.action) {
      case "runTests":
        this.runTests();
        break;
      case "zoomIn":
        this.zoomIn();
        break;
      case "zoomBack":
        this.zoomBack();
        break;
    }

    return true;
  }

  zoomIn() {
    chrome.tabs.getZoom(this.tabId, (currentZoomFactor) => {
      this.initialZoomFactor = currentZoomFactor;
      chrome.tabs.setZoom(this.tabId, 2); // Set zoom to 200%
    });
  }

  zoomBack() {
    chrome.tabs.getZoom(this.tabId, () => {
      chrome.tabs.setZoom(this.tabId, this.initialZoomFactor); // Set zoom back to initial value
    });
  }

  runTests() {
    console.log('Running tests!!');
    chrome.tabs.query({active: true, currentWindow: true}, (tabs: chrome.tabs.Tab[]) => {
      if(!tabs[0]) {
        console.error('No active tab found');
        return false;
      }
      if(!tabs[0].id) {
        console.error('No tab id found');
        return false;
      }
      console.log('Sending message to tab', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, {action: "runTests"});
    });
  }
}

new Background();
