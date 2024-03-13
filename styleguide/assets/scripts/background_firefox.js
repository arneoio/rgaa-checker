/*
 * background_firefox.js - Copyright (c) 2023-2024 - Arneo
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

// Set the badge to "OFF" when the extension is installed
browser.runtime.onInstalled.addListener(() => {
  browser.browserAction.setBadgeText({ text: 'OFF' });
});

browser.browserAction.onClicked.addListener(async (tab) => {
  // Next state will always be the opposite
  const prevState = await browser.browserAction.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await browser.browserAction.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    try {
      await browser.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        func: async () => {
          const panelHtmlResponse = await fetch(
            chrome.runtime.getURL('../pages/panel.html'),
          );
          const panelHtmlText = await panelHtmlResponse.text();
          // Créer un élément shadow DOM pour l'extension
          const shadow = document.createElement('div');
          shadow.id = 'arneo-browser-extension';
          shadow.attachShadow({ mode: 'open' });

          // Ajouter le contenu de "panel.html" au shadow DOM
          shadow.shadowRoot.innerHTML = panelHtmlText;

          // Attacher le shadow DOM à la page
          document.body.appendChild(shadow);
        },
      })

      await browser.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        files: ['app.js'],
      });
    } catch (error) {
      console.error('error', error);
    }
  } else if (nextState === 'OFF') {
    await browser.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      func: () => {
        const shadow = document.getElementById('arneo-browser-extension');
        if (shadow) {
          shadow.remove();
        }
      },
    });
  }
});

let initialZoomFactor = 1;
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "zoomIn") {
    browser.tabs.get(sender.tab.id).then((tab) => {
      browser.tabs.getZoom(tab.id).then((currentZoomFactor) => {
        initialZoomFactor = currentZoomFactor;
        browser.tabs.setZoom(tab.id, 2);
      });
    });
  } else if (request.action === "zoomBack") {
    browser.tabs.get(sender.tab.id).then((tab) => {
      browser.tabs.getZoom(tab.id).then(() => {
        browser.tabs.setZoom(tab.id, initialZoomFactor);
      });
    });
  }
});
