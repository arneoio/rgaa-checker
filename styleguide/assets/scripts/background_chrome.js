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
