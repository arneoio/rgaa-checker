export default class CriteriaCard {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  $summaryScore: HTMLElement;
  $summaryScoreProgress: HTMLElement;

  constructor($wrapper: HTMLElement, $element: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');

    this.$summaryScore = this.$wrapper.querySelector('.js-summary__score');
    this.$summaryScoreProgress = this.$wrapper.querySelector('.js-summary__score__progress');

    this.init();
  }

  init() {
    Array.from(this.$statusSelector.querySelectorAll('.js-criteriaSelector__link')).forEach(($link) => {
      $link.addEventListener('click', this.updateCardStatus.bind(this));
    });
  }

  updateCardStatus(event: Event) {
    event.preventDefault();
    let $link = event.target as HTMLElement;
    let newStatus = $link.dataset.status;

    this.$toggler.setAttribute('aria-expanded', 'false');
    this.$toggler.dataset.status = newStatus;
    (this.$toggler.querySelector('.js-criteriaSelector__togglerText') as HTMLElement).innerText = $link.innerText;
    this.$statusSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
    this.$element.dataset.status = newStatus;

    // Update global score
    this.updateGlobalScore();
  }

  updateGlobalScore() {
    let $criteriaCards = this.$wrapper.querySelectorAll('.js-criteriaCard');
    let scoreList: any = {
      'C': 0,
      'NC': 0,
      'NA': 0,
      'NT': 0,
    }

    $criteriaCards.forEach(($criteriaCard) => {
      let status = ($criteriaCard.querySelector('.js-criteriaSelector__toggler') as HTMLElement).dataset.status;
      ++scoreList[status];
    });

    let total = $criteriaCards.length;
    let totalScore = scoreList['C'] + scoreList['NC'] + scoreList['NA'];
    let score = scoreList['C'] + scoreList['NA'];

    this.$summaryScore.innerText = (Math.round(score / totalScore * 100)).toString();
    this.$summaryScoreProgress.setAttribute('value', score);
    this.$summaryScoreProgress.setAttribute('max', totalScore);
    Object.keys(scoreList).forEach((status: string) => {
      let $status = this.$wrapper.querySelector(`.js-summary__progress[data-status="${status}"]`);
      $status.setAttribute('value', scoreList[status].toString());
      $status.setAttribute('max', total.toString());
    });
  }
}
