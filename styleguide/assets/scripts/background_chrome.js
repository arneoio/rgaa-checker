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
let currentTabId = null;
// Set the badge to "OFF" when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: 'OFF' });
});

chrome.action.onClicked.addListener(async (tab) => {
  // Next state will always be the opposite
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    // Injecter le contenu de "panel.html" dans la page en cours en utilisant le Shadow DOM
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: async () => {
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

        const styleElement = document.createElement('div');
        styleElement.innerHTML = `
            <style>
            .-rgaacheckerHighlight {
              animation: highlightAnimation 0.5s ease-in-out;
            }

            @keyframes highlightAnimation {
              0% { transform: scale(1); }
              25% { transform: scale(1.15); }
              75% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
            </style>
        `;
        document.body.appendChild(styleElement);
      },
    })
    .then(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['app.js'],
      });

    });
  } else if (nextState === 'OFF') {
    // Supprimer le shadow DOM
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const shadow = document.getElementById('arneo-browser-extension');
        if (shadow) {
          shadow.remove();
        }
      },
    });
  }
});

let initialZoomFactor = 1;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Message received', request);
    switch(request.action) {
      case "zoomIn":
        chrome.tabs.getZoom(sender.tab.id, (currentZoomFactor) => {
          if (sender.tab) {
            initialZoomFactor = currentZoomFactor;
            chrome.tabs.setZoom(sender.tab.id, 2); // Double le zoom
          }
        });
        break;
      case "zoomBack":
        chrome.tabs.getZoom(sender.tab.id, () => {
          if (sender.tab) {
            chrome.tabs.setZoom(sender.tab.id, initialZoomFactor); // Divise le zoom par 2
          }
        });
        break;
      case "inspectElement":
        console.log('Inspecting element', request.elementId);
        // inspect the element using manifest v3
        chrome.debugger.attach({ tabId: sender.tab.id }, "1.3", function() {
          chrome.debugger.sendCommand({ tabId: sender.tab.id }, "DOM.enable", {}, function() {
            chrome.debugger.sendCommand({ tabId: sender.tab.id }, "DOM.getDocument", {}, function(result) {
              const rootNodeId = result.root.nodeId;
              chrome.debugger.sendCommand({ tabId: sender.tab.id }, "DOM.querySelector", {
                nodeId: rootNodeId,
                selector: "#" + request.elementId
              }, function(node) {
                console.log('Element found', node);
                if (node.nodeId) {
                  chrome.debugger.sendCommand({ tabId: sender.tab.id }, "DOM.highlightNode", {
                    highlightConfig: {
                      contentColor: { r: 0, g: 0, b: 0, a: 0 },
                      paddingColor: { r: 0, g: 0, b: 0, a: 0 },
                      marginColor: { r: 0, g: 0, b: 0, a: 0 },
                      borderColor: { r: 255, g: 0, b: 0, a: 1 },
                      showInfo: true
                    },
                    nodeId: node.nodeId
                  }, function() {
                    console.log('Element highlighted', node.nodeId);
                    // If id was added by the extension, remove it
                    if(request.elementId === 'rgaachecker-hightlight-id')
                    {
                      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "DOM.removeAttribute", {
                        nodeId: node.nodeId,
                        name: 'id'
                      });
                    }
                  });
                }
              });
            });
          });
        });
        break;
    }
  }
);
