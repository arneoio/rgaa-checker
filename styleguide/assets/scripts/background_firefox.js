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
          console.log(panelHtmlText);
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
