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

// declare type for topicResultList
declare type TopicResultList = {
  [topicNumber: string]: {
    c: number,
    nc: number,
    na: number
  }
};

var Synthesis = {
  init: function () {
    this.TOTAL_CRITERIA_NUMBER = document.querySelector('.js-synthesis__criteriaList')?.childElementCount || 106;
    this.$tableBody = document.querySelector('.js-synthesis__tableBody');
    this.$urlList = document.querySelector('.js-synthesis__urlList');
    this.$urlItemTemplate = document.getElementById('js-synthesis__urlItem__template') as HTMLTemplateElement;
    this.$synthesisTemplate = document.getElementById('js-synthesis__rowTemplate') as HTMLTemplateElement;
    this.$progress = document.querySelector('.js-synthesis__progress') as HTMLProgressElement;
    this.$progressValue = document.querySelector('.js-synthesis__progressValue') as HTMLElement;

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

      let ncCriteriaList: string[] = [];
      let topicResultList: TopicResultList = {};
      let totalCriteriaChecked = 0;

      if(this.$urlList) {
        let pageNumber = 1;

        for(let url in data[host]) {
          let pageSlug = `P${('0' + pageNumber).slice(-2)}`;

          this.setUrlItem(url, host, pageSlug);

          // Create a new row from the template
          let $newRow = this.$synthesisTemplate.content.cloneNode(true) as HTMLElement;
          let $pageName = $newRow.querySelector('.js-synthesis__row__pageName');
          if($pageName) {
            $pageName.textContent = pageSlug;
          }

          let results = this.parseUrlResults(data[host][url]);
          let cCount = 0;
          let ncCount = 0;
          let naCount = 0;
          Object.keys(results).forEach((criterium: string) => {
            // Save the status number per page and per topic
            let topicNumber = criterium.split('.')[0];
            if(!topicResultList[topicNumber]) {
              topicResultList[topicNumber] = { c: 0, nc: 0, na: 0 };
            }

            switch (results[criterium]) {
              case 'C':
                ++cCount;
                ++topicResultList[topicNumber].c;
                break;
              case 'NC':
                ++ncCount;
                ++topicResultList[topicNumber].nc;
                // Add the topic number to the list of non-compliant criteria
                if(!ncCriteriaList.includes(criterium)) {
                  ncCriteriaList.push(criterium);
                }
                break;
              case 'NA':
                ++naCount;
                ++topicResultList[topicNumber].na;
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
            let checkedCriteriaNumber = cCount + ncCount + naCount;
            totalCriteriaChecked += checkedCriteriaNumber;
            $rowNT.textContent = (this.TOTAL_CRITERIA_NUMBER - (checkedCriteriaNumber)).toString();
          }

          // Ajouter la ligne à la table
          this.$tableBody.appendChild($newRow);

          ++pageNumber;
        }
      }

      // Set the result for each topic/status
      Object.keys(topicResultList).forEach((topicNumber: string) => {
        let topicData = topicResultList[topicNumber];
        for (const [status, value] of Object.entries(topicData)) {
          let $thematicCell = document.querySelector(`.js-synthesis__thematicCell[data-topic="${topicNumber}"][data-status="${status}"]`);
          if($thematicCell) {
            $thematicCell.textContent = value.toString();
          }
        }
      });

      // Removes all the not "NC" criteria from the list to keep only the NC ones
      let $ncCriteriaList = document.querySelectorAll('.js-synthesis__criteriaList__item');
      $ncCriteriaList.forEach(($item) => {
        let criterium = $item.getAttribute('data-criterium') || '';
        if(!ncCriteriaList.includes(criterium)) {
          $item.remove();
        }
      });

      // Update the progress bar
      let pageNumber = Object.keys(data[host]).length;
      let progress = Math.round(totalCriteriaChecked / this.TOTAL_CRITERIA_NUMBER / pageNumber * 100);
      if(this.$progress) {
        this.$progress.value = progress;
        this.$progressValue.textContent = `${progress}%`;
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
  },

  /**
   * Create a new item in the URL list with the given URL, host and page name
   * @param url
   * @param host
   * @param pageName
   */
  setUrlItem: function (url: string, host: string, pageSlug: string) {
    let $urlItem = this.$urlItemTemplate.content.cloneNode(true) as HTMLElement;
    let fullUrl = `https://${host}${url}`;

    let $slug = $urlItem.querySelector('.js-synthesis__urlItem__slug') as HTMLElement;
    $slug.textContent = pageSlug;

    let $link = $urlItem.querySelector('.js-synthesis__urlItem__link') as HTMLAnchorElement;
    $link.href = fullUrl;
    $link.target = '_blank';
    $link.textContent = url;

    // Cannot open link in devtools panel, so we send a message to the background script to open it in content
    $link.addEventListener('click', (e) => {
      e.preventDefault();
      MessageSender.sendMessage('devtools_openUrl', { url: fullUrl });
    });

    let $removeButton = $urlItem.querySelector('.js-synthesis__urlItem__removeButton') as HTMLButtonElement;
    $removeButton.addEventListener('click', (e) => {
      LocalStorage.removeUrl(host, url).then(() => {
        // reload the page to update the synthesis
        location.reload();
      });
    });

    this.$urlList.appendChild($urlItem);
  }
};

Synthesis.init();
