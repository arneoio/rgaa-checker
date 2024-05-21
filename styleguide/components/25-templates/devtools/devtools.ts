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


export default class Devtools {
  criteriaCardList: Array<any>;

  constructor(criteriaCardList: Array<any>) {
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

  handleMessage(request: any, sender: any, sendResponse: any) {
    switch (request.action) {
      case 'devtools_panelShown':
        MessageSender.sendMessage('devtools_runTests');
        break;
      case 'background_testsCompleted':
        this.parseResults(request.result);
        const criteriaUpdatedEvent = new Event('rgaachecker-initialized', {
          bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
          cancelable: true, // L'événement peut être annulé
        });
        document.body.dispatchEvent(criteriaUpdatedEvent);
        break;
      case 'elementsHightlighted':
        break;
      default:
        break;
    }

    sendResponse({});
    return true;
  }

  parseResults(criteriaList: any) {
    // results data structure
    // 4.2: {
    //   topicNumber: 4,
    //   criteriaNumber: 2,
    //   highlightSwitchLabel:"Highlight",
    //   messageList:{NT: 'Toutes les images de la page ont une alternative t…ici toutes les images sans alternative textuelle.', NC: "Toutes les images de la page n'ont pas d'alternati…ici toutes les images sans alternative textuelle.", NA: "Aucune image n'a été trouvée dans la page./!\\ En l…ici toutes les images sans alternative textuelle."},
    //   status:"NT",
    //   testList:{1: 'NT', 2: 'NA'}
    // }
    Object.keys(criteriaList).forEach((key: string) => {
      let criterionData = criteriaList[key];
      let criterion = this.criteriaCardList.find((criterion: any) => {
        return criterion.topicNumber === criterionData.topicNumber && criterion.criteriaNumber === criterionData.criteriaNumber;
      });
      if(!criterion) {
        console.error(`Criterion ${criterionData.topicNumber}.${criterionData.criteriaNumber} not found`);
        return;
      }
      criterion.loadData(criterionData);
    });
  }
}
