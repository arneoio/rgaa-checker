export default class TopicList {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $topicItemList: NodeListOf<HTMLElement>;

  constructor($wrapper: HTMLElement, $element: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$topicItemList = this.$element.querySelectorAll('.js-topicList__item');
    this.init();
    this.bindEvents();
  }

  init() {
    // On scroll, change active topic
    this.$wrapper.addEventListener('scroll', () => {
      Array.from(this.$topicItemList).forEach(($topicItem: HTMLElement) => {
        let $topic = this.$wrapper.querySelector(`.js-topic[data-topic="${$topicItem.dataset.topic}"]`) as HTMLElement;
        if ($topic) {
          if ($topic.offsetTop <= this.$wrapper.scrollTop + 80) {
            Array.from(this.$topicItemList).forEach(($topicItem: HTMLElement) => {
              $topicItem.classList.remove('-active');
            });
            $topicItem.classList.add('-active');
          }
        }
      });
    });

    // When click on topic, scroll view to related topic
    Array.from(this.$topicItemList).forEach(($topicItem: HTMLElement) => {
      $topicItem.addEventListener('click', () => {
        let selectedTopic = $topicItem.dataset.topic;
        let scrollPosition = this.$wrapper.scrollTop;
        if(selectedTopic == 'all') {
          scrollPosition = 0;
        } else {
          let $relatedTopic = this.$wrapper.querySelector(`.js-topic[data-topic="${selectedTopic}"]`) as HTMLElement;
          if ($relatedTopic) {
            scrollPosition = $relatedTopic.offsetTop - 80;
          }
        }

        this.$wrapper.scrollTo({top: scrollPosition, behavior: 'smooth' });
      });
    });
  }

  bindEvents() {
    this.$wrapper.addEventListener('rgaachecker-initialized', () => {
      this.updateTopicListCompletion();
    });
    this.$wrapper.addEventListener('rgaachecker-criteria-updated', () => {
      this.updateTopicListCompletion();
    });
  }

  updateTopicListCompletion() {
    let totalCompletedCriteriaNumber: number = 0;
    Array.from(this.$topicItemList).forEach(($topicItem: HTMLElement) => {
      let selectedTopic = $topicItem.dataset.topic;

      if(selectedTopic === 'all') {
        return;
      }

      let $relatedTopic = this.$wrapper.querySelector(`.js-topic[data-topic="${selectedTopic}"]`) as HTMLElement;
      let $criteriaList = $relatedTopic.querySelectorAll('.js-criteriaSelector__toggler');
      let completedCriteriaNumber: number = 0;
      Array.from($criteriaList).forEach(($criteria: HTMLElement) => {
        if($criteria.dataset.status != 'NT') {
          ++completedCriteriaNumber;

          return;
        }
      });
      totalCompletedCriteriaNumber += completedCriteriaNumber;
      Array.from(this.$wrapper.querySelectorAll(`.js-topic__addressedCriteriaNumber[data-topic="${selectedTopic}"]`)).forEach(($topicScore: HTMLElement) => {
        $topicScore.innerText = completedCriteriaNumber.toString();
      });
    });

    Array.from(this.$wrapper.querySelectorAll('.js-topic__addressedCriteriaNumber[data-topic="all"]')).forEach(($topicScore: HTMLElement) => {
      $topicScore.innerText = totalCompletedCriteriaNumber.toString();
    });
  }
}
