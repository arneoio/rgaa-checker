export default class MessageSender {
  static sendMessage(action: string, data: any = {}) {
    let messageData = { action, ...data };
    if (typeof browser !== 'undefined') {
      return browser.tabs.query({active: true, currentWindow: true})
        .then((tabs) => {
          return browser.tabs.sendMessage(tabs[0].id, messageData);
        });
    } else {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs[0]) {
            console.error('No active tab found');
            reject('No active tab found');
            return;
          }
          if (!tabs[0].id) {
            console.error('No tab id found');
            reject('No tab id found');
            return;
          }

          chrome.tabs.sendMessage(tabs[0].id, messageData, (response) => {
            resolve(response);
          });
        });
      });
    }
  }
}
