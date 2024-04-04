chrome.devtools.panels.create('RGAA Checker', 'images/icon64.png', 'rgaa-checker-panel.html', (panel) => {
  console.log('Panel created');
  panel.onShown.addListener((panelWindow) => {
    chrome.runtime.sendMessage({ action: "panelShown" });
  });
});
