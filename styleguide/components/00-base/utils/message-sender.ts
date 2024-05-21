export default class MessageSender {
  static sendMessage(action: string, data: any = {}) {
    let messageData = { action, ...data };
    if (typeof browser !== 'undefined') {
      return browser.runtime.sendMessage(messageData);
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

          chrome.runtime.sendMessage(messageData, (response) => {
            resolve(response);
          });
        });
      });
    }
  }
}
