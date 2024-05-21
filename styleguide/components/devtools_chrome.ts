chrome.devtools.panels.create('RGAA Checker', 'images/icon64.png', 'rgaa-checker-panel.html', (panel) => {
  panel.onShown.addListener((panelWindow) => {
    chrome.runtime.sendMessage({ action: "devtools_panelShown" });
  });
});
