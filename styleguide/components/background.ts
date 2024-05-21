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

  constructor() {
    this.init();
  }

  init() {
    if(browser) {
      browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
    } else {
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }
  }

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch(request.action) {
      case "zoomIn":
        this.zoomIn();
        break;
      case "zoomBack":
        this.zoomBack();
        break;
      case "content_testsCompleted":
        // send back to devtools
        if(browser) {
          browser.runtime.sendMessage({ action: "background_testsCompleted", result: request.result });
        }
        break;
      case "content_pageLoaded":
        this.runTests(sendResponse);
        break;
      case "devtools_runTests":
        this.runTests(sendResponse);
        break;
      default:
        return true;
    }

    return true;
  }

  zoomIn() {
    if(browser) {
      return browser.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id as number;
          return browser.tabs.getZoom(tabId)
            .then((currentZoomFactor) => {
              this.initialZoomFactor = currentZoomFactor;
              return browser.tabs.setZoom(tabId, 2);
            });
        }
      })
      .catch((error) => {
        console.error("Error while zooming in:", error);
      });
    } else {
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
  }

  zoomBack() {
    if(browser) {
      return browser.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id as number;
          return browser.tabs.setZoom(tabId, this.initialZoomFactor);
        }
      })
      .catch((error) => {
        console.error("Error while zooming back:", error);
      });
    } else {
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

  runTests(sendResponse: any) {
    if(browser) {
      return browser.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id as number;
          return browser.tabs.sendMessage(tabId, { action: "background_runTests" });
        }
      })
      .catch((error) => {
        console.error("Error while running tests:", error);
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id as number;
          chrome.tabs.sendMessage(tabId, { action: "background_runTests" });
        }
      });
    }
  }
}

new Background();
