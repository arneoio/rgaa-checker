// Set the badge to "OFF" when the extension is installed
browser.runtime.onInstalled.addListener(() => {
  browser.browserAction.setBadgeText({ text: 'OFF' });
  console.log('browser.runtime.onInstalled.addListener');
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
    const appendCode = `
      console.log('func', browser.runtime.getURL('../pages/panel.html'), browser.runtime.getURL('pages/panel.html'));
      fetch(
        browser.runtime.getURL('pages/panel.html'),
      ).then((panelHtmlResponse) => {
        const panelHtmlText = panelHtmlResponse.json();
        console.log('panelHtmlText', panelHtmlResponse,panelHtmlText);
        // Créer un élément shadow DOM pour l'extension
        const shadow = document.createElement('div');
        shadow.id = 'arneo-browser-extension';
        shadow.attachShadow({ mode: 'open' });

        // Ajouter le contenu de "panel.html" au shadow DOM
        shadow.shadowRoot.innerHTML = panelHtmlText;

        // Attacher le shadow DOM à la page
        document.body.appendChild(shadow);
      });
    `;

    browser.tabs.executeScript({
      code: appendCode,
    });
  } else if (nextState === 'OFF') {
    const makeItRed = 'document.body.style.border = "5px solid red"';

    const executing = browser.tabs.executeScript({
      code: makeItRed,
    });
  }
  // executing.then(onExecuted, onError);
/*
  console.log('browser.browserAction.onClicked.addListener', tab);




    // Injecter le contenu de "panel.html" dans la page en cours en utilisant le Shadow DOM
    console.log('nextState on');
    browser.tabs.executeScript({
      target: { tabId: tab.id },
      code:
    }).then(() => {
      console.log('then');
      browser.tabs.executeScript({
        target: { tabId: tab.id },
        files: ['app.js'],
      });
    });
  } else if (nextState === 'OFF') {
    // Supprimer le shadow DOM
    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const shadow = document.getElementById('arneo-browser-extension');
        if (shadow) {
          shadow.remove();
        }
      },
    });
  }*/
});
