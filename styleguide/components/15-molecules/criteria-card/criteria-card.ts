export default class CriteriaCard {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  $highLightWrapper: HTMLElement;
  $summaryScore: HTMLElement;
  $summaryScoreProgress: HTMLElement;
  $summaryTested: HTMLElement;
  $summaryTotal: HTMLElement;
  criterion: any;
  criterionNumber: string;

  constructor($wrapper: HTMLElement, $element: HTMLElement, criterion: any, $highLightWrapper: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');
    this.$highLightWrapper = $highLightWrapper;
    this.criterion = criterion;
    this.criterionNumber = this.$element.dataset.criteria;

    this.$summaryScore = this.$wrapper.querySelector('.js-summary__score');
    this.$summaryScoreProgress = this.$wrapper.querySelector('.js-summary__score__progress');
    this.$summaryTested = this.$wrapper.querySelector('.js-summary__tested');
    this.$summaryTotal = this.$wrapper.querySelector('.js-summary__total');

    this.init();
  }

  init() {
    Array.from(this.$statusSelector.querySelectorAll('.js-criteriaSelector__link')).forEach(($link: HTMLElement) => {
      $link.addEventListener('loadclick', () => {
        this.updateCardStatus($link);
      });
      $link.addEventListener('click', () => {
        this.updateCardStatus($link, true);
      });
    });
  }

  updateCardStatus($link: HTMLElement, saveUserState: boolean = false) {
    let newStatus = $link.dataset.status;

    this.$toggler.setAttribute('aria-expanded', 'false');
    this.$toggler.dataset.status = newStatus;
    (this.$toggler.querySelector('.js-criteriaSelector__togglerText') as HTMLElement).innerText = $link.innerText;
    this.$statusSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
    this.$element.dataset.status = newStatus;

    if (saveUserState) {
      this.saveStatus(newStatus);
    }

    // Update global score
    this.updateGlobalScore();
  }

  saveStatus(newStatus: string) {
    let savedStatus = JSON.parse(localStorage.getItem('accessibilityTesterResults')) || {
      "user": {},
      "runner": {},
    };

    // Créé une entrée pour la page courante si elle n'existe pas
    savedStatus.user[window.location.pathname] = savedStatus.user[window.location.pathname] || {};

    // Sauvegarde le status dans le user
    savedStatus.user[window.location.pathname][this.criterionNumber] = newStatus;

    // Met à jour le localStorage
    localStorage.setItem('accessibilityTesterResults', JSON.stringify(savedStatus));
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

      if (typeof status !== 'undefined') {
        ++scoreList[status];
      }
    });

    let total = $criteriaCards.length;
    let totalScore = scoreList['C'] + scoreList['NC'];
    let score = scoreList['C'];

    this.$summaryScore.innerText = (Math.round(score / totalScore * 100)).toString();
    this.$summaryScoreProgress.setAttribute('value', score);
    this.$summaryScoreProgress.setAttribute('max', totalScore);
    this.$summaryTested.innerText = (scoreList['C'] + scoreList['NC'] + scoreList['NA']).toString();
    this.$summaryTotal.innerText = total.toString();
    Object.keys(scoreList).forEach((status: string) => {
      let $status = this.$wrapper.querySelector(`.js-summary__progress[data-status="${status}"]`);
      $status.setAttribute('value', scoreList[status].toString());
      $status.setAttribute('max', total.toString());
    });
  }
}
