/*
 * app.ts - Copyright (c) 2023-2024 - Arneo
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
import './app.scss';

import ButtonExpand from './00-base/utils/button-expand';
import TabUtil from './00-base/utils/tab';
import CriteriaCard from './15-molecules/criteria-card/criteria-card';
import FilterList from './15-molecules/filter-list/filter-list';
import TopicList from './15-molecules/topic-list/topic-list';
import Header from './20-organisms/header/header';
import Summary from './20-organisms/summary/summary';
import Devtools from './25-templates/devtools/devtools';
import MessageSender from './00-base/utils/message-sender';

var App = {
  init: function () {
    // Get element in shadow DOM if extension mode
    this.HIGHLIGHT_ID = 'arneo-browser-highlight';

    this.$main = document.querySelector('.js-main');
    this.criteriaCardList = [];

    // Inits elements common to every pages
    this.initLayout();

    this.initAtoms();

    this.initMolecules();

    this.initOrganisms();

    this.devtools = new Devtools(this.criteriaCardList);

    this.bindEvents();
  },

  bindEvents: function () {
    document.querySelector('.js-refreshTestsButtons').addEventListener('click', () => {
      MessageSender.sendMessage('devtools_runTests');
    });
  },

  initLayout: function () {
    // Inits expand buttons (like burger menu)
    const $expandButtonList = Array.from(document.querySelectorAll(
      'button[aria-expanded][aria-controls]',
    ));

    if ($expandButtonList.length) {
      $expandButtonList.forEach(($expandButton) => {
        let $button = new ButtonExpand($expandButton as HTMLElement);
        $button.init();
      });
    }

    // Init tab system
    const $tabWrapperList = Array.from(document.querySelectorAll('[role="tablist"]'));
    if ($tabWrapperList.length) {
      $tabWrapperList.forEach(($tabWrapper) => {
        new TabUtil($tabWrapper as HTMLElement);
      });
    }

    // When click outisde a criteriaSelector, reset its aria-expanded to false
    document.addEventListener('click', (event: MouseEvent) => {
      const $criteriaSelectorList = Array.from(document.querySelectorAll('.js-criteriaSelector')) as HTMLElement[];
      $criteriaSelectorList.forEach(($criteriaSelector: HTMLElement) => {
        if (!$criteriaSelector.contains(event.target as Node)) {
          $criteriaSelector?.querySelector('.js-criteriaSelector__toggler')?.setAttribute('aria-expanded', 'false');
          $criteriaSelector?.querySelector('.js-criteriaSelector__content')?.classList.remove('-expanded');
        }
      });
    });

    // Set sticky title on list
    this.$topicList = Array.from(document.querySelectorAll('.js-topic'));
    this.setStickyTitle();
    this.$main.addEventListener('scroll', () => {
      this.setStickyTitle();
    });
  },

  initAtoms: function () {
  },

  initMolecules: function () {
    // Init filter list
    this.$filterList = document.querySelector('.js-filterList') as HTMLElement;
    if (this.$filterList) {
      new FilterList(this.$filterList);
    }

    // Init Criteria cards
    const $criteriaCardList = Array.from(document.querySelectorAll('.js-criteriaCard')) as HTMLElement[];
    if ($criteriaCardList.length) {
      $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
        const criteriaNumber = $criteriaCard.dataset.criteria;
        if (criteriaNumber) {
          let criteriaCard = new CriteriaCard($criteriaCard);
          this.criteriaCardList.push(criteriaCard);
        }
      });
    }

    // Init topic list
    const $topicList: HTMLElement = document.querySelector('.js-topicList');
    if ($topicList) {
      new TopicList($topicList);
    }
  },

  initOrganisms: function () {
    // Init header
    const $header: HTMLElement = document.querySelector('.js-header');
    if ($header) {
      new Header($header);
    }

    // Init summary
    const $summary: HTMLElement = document.querySelector('.js-summary');
    if ($summary) {
      new Summary($summary);
    }
  },

  setStickyTitle: function () {
    (Array.from(this.$topicList) as HTMLElement[]).forEach(($topic: HTMLElement, index: number) => {
      const $title: HTMLElement = $topic.querySelector('.js-topic__top');
      const itemRect = $topic.getBoundingClientRect();

      let offset = this.$filterList ? this.$filterList.getBoundingClientRect().bottom : 70;
      let top = Math.max(0, -itemRect.top + offset);
      $title.style.setProperty('--topic-top', `${top}px`);
    });
  }
};

App.init();
