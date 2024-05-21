browser.devtools.panels.create('RGAA Checker', '/images/icon48.png', 'rgaa-checker-panel.html').then((panel) => {
  panel.onShown.addListener((panelWindow) => {
    browser.runtime.sendMessage({ action: "devtools_panelShown" });
  });
});
