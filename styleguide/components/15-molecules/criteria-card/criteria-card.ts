export default class CriteriaCard {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  $highLightWrapper: HTMLElement;
  criterion: any;
  criterionNumber: string;
  previousStatus: string;
  currentStatus: string;
  criteriaUpdatedEvent: Event;

  constructor($wrapper: HTMLElement, $element: HTMLElement, criterion: any, $highLightWrapper: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');
    this.$highLightWrapper = $highLightWrapper;
    this.criterion = criterion;
    this.criterionNumber = this.$element.dataset.criteria;
    this.previousStatus = 'NT';
    this.currentStatus = 'NT';

    this.criteriaUpdatedEvent = new Event('rgaachecker-criteria-updated', {
      bubbles: true,
      cancelable: true
    });

    this.bindEvents();
  }

  bindEvents() {
    Array.from(this.$statusSelector.querySelectorAll('.js-criteriaSelector__link')).forEach(($link: HTMLElement) => {
      $link.addEventListener('rgaachecker-criteria-initialized', () => {
        this.updateCardStatus($link);
        this.$element.classList.add('-checked');
        this.removeHighlightForNA();
      });

      $link.addEventListener('click', () => {
        this.updateCardStatus($link, true);
        this.$wrapper.dispatchEvent(this.criteriaUpdatedEvent);
      });
    });
  }

  removeHighlightForNA() {
    // If the status is NA, remove the highlight switch
    if (this.$element.dataset.status === 'NA') {
      this.$element.querySelector('.js-criteriaCard__highlightSwitch')?.remove();
    }
  }

  updateCardStatus($link: HTMLElement, saveUserState: boolean = false) {
    let newStatus = $link.dataset.status;

    this.$toggler.setAttribute('aria-expanded', 'false');
    this.$toggler.dataset.status = newStatus;
    (this.$toggler.querySelector('.js-criteriaSelector__togglerText') as HTMLElement).innerHTML = $link.innerHTML;
    this.$statusSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
    this.$element.dataset.status = newStatus;

    if (saveUserState) {
      this.saveStatus(newStatus);
    }
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
}
