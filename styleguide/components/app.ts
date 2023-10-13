import ButtonExpand from './00-base/utils/button-expand';
import TabUtil from './00-base/utils/tab';
import CriteriaCard from './15-molecules/criteria-card/criteria-card';
import FilterList from './15-molecules/filter-list/filter-list';
import TopicList from './15-molecules/topic-list/topic-list';
import Header from './20-organisms/header/header';
import './app.scss';
import AccessibilityTester from '../assets/scripts/tests/AccessibilityTester';

var App = {
  init: function () {
    // Get element in shadow DOM if extension mode
    this.ID = 'arneo-accessibility-checker';
    this.documentRoot = document;
    if (document.getElementById('arneo-browser-extension')) {
      this.documentRoot = document.getElementById('arneo-browser-extension').shadowRoot;
    }
    this.$wrapper = this.documentRoot.getElementById(this.ID);

    // Inits elements common to every pages
    this.initLayout();

    this.initAtoms();

    this.initMolecules();

    this.initOrganisms();

    const tester = new AccessibilityTester(this.$wrapper);
    tester.runTests();
  },

  initLayout: function () {
    // Inits expand buttons (like burger menu)
    const $expandButtonList = Array.from(this.$wrapper.querySelectorAll(
      'button[aria-expanded][aria-controls]',
    ));

    if ($expandButtonList.length) {
      $expandButtonList.forEach(($expandButton) => {
        let $button = new ButtonExpand($expandButton);
        $button.init(this.documentRoot);
      });
    }

    // Init tab system
    const $tabWrapperList = Array.from(this.$wrapper.querySelectorAll('[role="tablist"]'));
    if ($tabWrapperList.length) {
      $tabWrapperList.forEach(($tabWrapper) => {
        TabUtil.init($tabWrapper, this.documentRoot);
      });
    }

    // When click outisde a criteriaSelector, reset its aria-expanded to false
    this.$wrapper.addEventListener('click', (event: Event) => {
      const $criteriaSelectorList = Array.from(this.$wrapper.querySelectorAll('.js-criteriaSelector'));
      $criteriaSelectorList.forEach(($criteriaSelector: HTMLElement) => {
        if (!$criteriaSelector.contains(event.target as Node)) {
          $criteriaSelector.querySelector('.js-criteriaSelector__toggler').setAttribute('aria-expanded', 'false');
          $criteriaSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
        }
      });
    });

    // Set sticky title on list
    this.$topicList = Array.from(this.$wrapper.querySelectorAll('.js-topic'));
    this.setStickyTitle();
    this.$wrapper.addEventListener('scroll', () => {
      this.setStickyTitle();
    });
  },

  initAtoms: function () {
  },

  initMolecules: function () {
    // Init filter list
    this.$filterList = this.$wrapper.querySelector('.js-filterList') as HTMLElement;
    if (this.$filterList) {
      new FilterList(this.$wrapper, this.$filterList);
    }

    // Init Criteria cards
    const $criteriaCardList = Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard'));
    if ($criteriaCardList.length) {
      $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
        new CriteriaCard(this.$wrapper, $criteriaCard);
      });
    }

    // Init topic list
    const $topicList: HTMLElement = this.$wrapper.querySelector('.js-topicList');
    if ($topicList) {
      new TopicList(this.$wrapper, $topicList);
    }
  },

  initOrganisms: function () {
    // Init header
    const $header: HTMLElement = this.$wrapper.querySelector('.js-header');
    if ($header) {
      new Header(this.$wrapper, $header);
    }
  },

  setStickyTitle: function () {
    Array.from(this.$topicList).forEach(($topic: HTMLElement, index: number) => {
      const $title: HTMLElement = $topic.querySelector('.js-topic__top');
      const itemRect = $topic.getBoundingClientRect();

      let offset = this.$filterList ? this.$filterList.getBoundingClientRect().bottom : 70;
      let top = Math.max(0, -itemRect.top + offset);
      $title.style.setProperty('--topic-top', `${top}px`);

  });
  }
};

App.init();
