/*
 * devtools.js - Copyright (c) 2023-2024 - Arneo
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
import MessageSender from "../../00-base/utils/message-sender";
import Highlight from "../../00-base/utils/highlight";
import LocalStorage from "../../00-base/utils/local-storage";
import CriteriaCard from "../../15-molecules/criteria-card/criteria-card";

interface StorageData {
  [key: string]: any;
}

export default class Panel {
  criteriaCardList: Array<CriteriaCard>;

  constructor(criteriaCardList: Array<CriteriaCard>) {
    this.init(criteriaCardList);
  }

  init(criteriaCardList: Array<any>) {
    this.criteriaCardList = criteriaCardList;
    if(typeof browser !== 'undefined' && browser) {
      browser.runtime.onMessage.addListener(this.handleMessage.bind(this));
    } else {
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    }
  }

  async handleMessage(request: any, sender: any, sendResponse: any) {
    switch (request.action) {
      case 'devtools_panelShown':
        MessageSender.sendMessage('devtools_runTests');
        break;
      case 'background_testsCompleted':
        this.updateUrl(request.host, request.url);
        await this.parseResults(request);
        const criteriaUpdatedEvent = new Event('rgaachecker-initialized', {
          bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
          cancelable: true, // L'événement peut être annulé
        });
        document.body.dispatchEvent(criteriaUpdatedEvent);
        break;
      case 'background_elementsHightlighted':
        Highlight.getInstance().activate(request.result);
        break;
      default:
        break;
    }

    sendResponse({});
    return true;
  }

  async parseResults(request: any) {
    let host = request.host || '';
    let url = request.url || '';
    let criteriaList = request.result || {};

    if(!host || !url) {
      console.log('no host or url found, skip');
      return;
    }

    await LocalStorage.getUserData(host, url).then((userStoredData: any) => {
      console.log('parse rsults userStoredData', userStoredData);
      this.criteriaCardList.forEach((criterion: any) => {
        let criterionData = criteriaList[criterion.topicNumber + '.' + criterion.criteriaNumber];

        // First load data from the runner if available
        if(criterionData) {
          console.log(`criteria ${criterion.topicNumber}.${criterion.criteriaNumber} found in runner data`, criterionData);
          criterion.loadData(criterionData);
        }

        // Then check if user data is available to override the status
        let userStatus = userStoredData[criterion.topicNumber + '.' + criterion.criteriaNumber];
        if (userStatus) {
          console.log(`criteria ${criterion.topicNumber}.${criterion.criteriaNumber} found in user data`, userStatus);
          let $statusRadioInput = criterion.$statusSelector?.querySelector(`.js-criteriaSelector__input[value="${userStatus}"]`) as HTMLInputElement;
          criterion.updateCardStatus($statusRadioInput);
          // TODO: if user status is different from the one in the runner, display a warning
        }
      });
    });

    await LocalStorage.getRunnerData(host, url).then((runnerResults: any) => {
      LocalStorage.saveRunnerData(host, url, criteriaList);

      // Do not show differences on first run
      const isFirstRun = Object.keys(runnerResults).length === 0;
      if(isFirstRun) {
        return;
      }

      // Show differences
      let diff: any = {};
      Object.keys(runnerResults).forEach((key: string) => {
        if(typeof runnerResults[key] === 'string' && runnerResults[key] !== criteriaList[key].status) {
          diff[key] = {
            previous: runnerResults[key],
            current: criteriaList[key].status
          };
        }
      });

      if(Object.keys(diff).length > 0) {
        this.showDiff(diff);
      }
    });
  }

  updateUrl(host: string, url: string) {
    let $host = document.querySelector('.js-summary__host') as HTMLElement;
    if($host) {
      $host.textContent = host;
    }

    let $url = document.querySelector('.js-summary__url') as HTMLElement;
    if($url) {
      $url.textContent = url;
    }

    // Save current host name in local storage
    LocalStorage.saveCurrentHost(host);
  }

  showDiff(diff: any) {
    let $diffContainer = document.querySelector('.js-summary__differences') as HTMLElement;
    if(!$diffContainer) {
      return;
    }

    let $diffList = document.querySelector('.js-summary__differences__list') as HTMLElement;
    if(!$diffList) {
      return;
    }

    try {
      // Clear the list
      $diffList.innerHTML = '';
      Object.keys(diff).forEach((key: string) => {
        let $diffItem = document.createElement('li');
        $diffItem.classList.add(`-status-${diff[key].current}`);
        $diffItem.innerHTML = `Critère <strong>${key}</strong>:
            <span class="-status-${diff[key].previous.toLowerCase()}">${diff[key].previous}</span>
            ➡ <span class="-status-${diff[key].current.toLowerCase()}">${diff[key].current}</span>`;
        $diffList.appendChild($diffItem);

        $diffContainer.classList.remove('-hidden');
      });
    } catch (error) {
      console.error('Error while showing differences:', error);
    }
  }
}
