import ButtonExpand from './00-base/utils/button-expand';
import TabUtil from './00-base/utils/tab';
import Draggable from './00-base/utils/draggable';
import CriteriaCard from './15-molecules/criteria-card/criteria-card';
import FilterList from './15-molecules/filter-list/filter-list';
import TopicList from './15-molecules/topic-list/topic-list';
import Header from './20-organisms/header/header';
import './app.scss';
import AccessibilityTester from '../assets/scripts/extension/AccessibilityTester';
import Summary from './20-organisms/summary/summary';

var App = {
  init: function () {
    // Get element in shadow DOM if extension mode
    this.ID = 'arneo-accessibility-checker';
    this.HIGHLIGHT_ID = 'arneo-browser-highlight';

    this.documentRoot = document;
    const $shadowRoot = document.getElementById('arneo-browser-extension');
    if ($shadowRoot) {
      this.documentRoot = $shadowRoot.shadowRoot;
    }
    this.$wrapper = this.documentRoot.getElementById(this.ID);
    this.$highLightWrapper = this.documentRoot.getElementById(this.HIGHLIGHT_ID);

    this.tester = new AccessibilityTester(this.$wrapper, this.$highLightWrapper);

    // Inits elements common to every pages
    this.initLayout();

    this.initAtoms();

    this.initMolecules();

    this.initOrganisms();

    this.tester.runTests();
  },

  initLayout: function () {
    // Inits expand buttons (like burger menu)
    const $expandButtonList = Array.from(this.$wrapper.querySelectorAll(
      'button[aria-expanded][aria-controls]',
    ));

    if ($expandButtonList.length) {
      $expandButtonList.forEach(($expandButton) => {
        let $button = new ButtonExpand($expandButton as HTMLElement);
        $button.init(this.documentRoot);
      });
    }

    // Init tab system
    const $tabWrapperList = Array.from(this.$wrapper.querySelectorAll('[role="tablist"]'));
    if ($tabWrapperList.length) {
      $tabWrapperList.forEach(($tabWrapper) => {
        new TabUtil($tabWrapper as HTMLElement, this.documentRoot);
      });
    }

    // Init draggable elements
    const $draggableList = Array.from(this.$wrapper.querySelectorAll('.js-draggable'));
    if ($draggableList.length) {
      $draggableList.forEach(($draggable) => {
        new Draggable($draggable as HTMLElement);
      });
    }

    // When click outisde a criteriaSelector, reset its aria-expanded to false
    this.$wrapper.addEventListener('click', (event: MouseEvent) => {
      const $criteriaSelectorList = Array.from(this.$wrapper.querySelectorAll('.js-criteriaSelector')) as HTMLElement[];
      $criteriaSelectorList.forEach(($criteriaSelector: HTMLElement) => {
        if (!$criteriaSelector.contains(event.target as Node)) {
          $criteriaSelector?.querySelector('.js-criteriaSelector__toggler')?.setAttribute('aria-expanded', 'false');
          $criteriaSelector?.querySelector('.js-criteriaSelector__content')?.classList.remove('-expanded');
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
    const $criteriaCardList = Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard')) as HTMLElement[];
    if ($criteriaCardList.length) {
      $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
        const criteriaNumber = $criteriaCard.dataset.criteria;
        if (criteriaNumber) {
          new CriteriaCard(this.$wrapper, $criteriaCard, this.tester.criterionList[criteriaNumber], this.$highLightWrapper);
        }
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

    // Init summary
    const $summary: HTMLElement = this.$wrapper.querySelector('.js-summary');
    if ($summary) {
      new Summary(this.$wrapper, $summary);
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
