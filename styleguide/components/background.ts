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
    console.log('init backgruond');
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    console.log('background received message', request);
    if(request.tabId) {
      this.tabId = request.tabId;
    }
    switch(request.action) {
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id as number;
        chrome.tabs.getZoom(tabId, (currentZoomFactor) => {
          this.initialZoomFactor = currentZoomFactor;
          chrome.tabs.setZoom(tabId, 2);
        });
      }
    });
  }

  zoomBack() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id as number;
        chrome.tabs.getZoom(tabId, (currentZoomFactor) => {
          chrome.tabs.setZoom(tabId, this.initialZoomFactor); // Zoom back to half, limited to 50%
        });
      }
    });
  }
}

new Background();
