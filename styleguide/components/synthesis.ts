/*
 * synthesis.ts - Copyright (c) 2023-2024 - Arneo
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
import './synthesis.scss';

import LocalStorage from './00-base/utils/local-storage';
import MessageSender from './00-base/utils/message-sender';


var Synthesis = {
  init: function () {
    this.synthesisTemplate = document.getElementById('js-synthesis__rowTemplate') as HTMLTemplateElement;
    this.TOTAL_CRITERIA_NUMBER = 106;
    this.$tableBody = document.querySelector('.js-synthesis__tableBody');
    this.parseLocalStorage();
  },

  parseLocalStorage: function () {
    // get current host
    LocalStorage.getCurrentHost().then((currentHost: string) => {
      let $host = document.querySelector('.js-synthesis__hostname');
      if($host) {
        $host.textContent = currentHost;
        this.parseHostData(currentHost);
      }
    });
  },

  parseHostData: function (host: string) {
    LocalStorage.getStorageResults().then((data: any) => {
      if(!data[host]) {
        return;
      }

      let $urlList = document.querySelector('.js-synthesis__urlList');
      if($urlList) {
        let pageNumber = 1;
        for(let url in data[host]) {
          let $urlItem = document.createElement('li');
          let pagName = `P${('0' + pageNumber).slice(-2)}`;
          let fullUrl = `https://${host}${url}`;  // Crée l'URL complète (host + url)

          let $link = document.createElement('a');
          $link.href = fullUrl; // Met l'URL complète
          $link.target = '_blank';
          $link.textContent = `${pagName} - ${url}`;
          $link.addEventListener('click', (e) => {
            e.preventDefault();
            MessageSender.sendMessage('devtools_openUrl', { url: fullUrl });
          });
          $urlItem.appendChild($link);
          $urlList.appendChild($urlItem);

          // Create a new row from the template
          let $newRow = this.synthesisTemplate.content.cloneNode(true) as HTMLElement;
          let $pageName = $newRow.querySelector('.js-synthesis__row__pageName');
          if($pageName) {
            $pageName.textContent = pagName;
          }

          let results = this.parseUrlResults(data[host][url]);

          let cCount = 0;
          let ncCount = 0;
          let naCount = 0;
          Object.keys(results).forEach((topicNumber: string) => {
            switch (results[topicNumber]) {
              case 'C':
                ++cCount;
                break;
              case 'NC':
                ++ncCount;
                break;
              case 'NA':
                ++naCount;
                break;
            }
          });

          let $rowC = $newRow.querySelector('.js-synthesis__row__c');
          if($rowC) {
            $rowC.textContent = cCount.toString();
          }
          let $rowNC = $newRow.querySelector('.js-synthesis__row__nc');
          if($rowNC) {
            $rowNC.textContent = ncCount.toString();
          }
          let $rowNA = $newRow.querySelector('.js-synthesis__row__na');
          if($rowNA) {
            $rowNA.textContent = naCount.toString();
          }
          let $rowNT = $newRow.querySelector('.js-synthesis__row__nt');
          if($rowNT) {
            $rowNT.textContent = (this.TOTAL_CRITERIA_NUMBER - (cCount + ncCount + naCount)).toString();
          }

           // Ajouter la ligne à la table
           this.$tableBody.appendChild($newRow);

           ++pageNumber;
        }
      }
    });
  },

  parseUrlResults: function (urlData: any) {
    let runnerResults: any = {};
    try {
      runnerResults = JSON.parse(urlData['runner']);
    }
    catch (e) {} // in case of invalid JSON

    let userResults: any = {};
    try {
      userResults = JSON.parse(urlData['user']);
    }
    catch (e) {} // in case of invalid JSON

    return {...runnerResults, ...userResults};
  }
};

Synthesis.init();
