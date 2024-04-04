import MessageSender from "../../00-base/utils/message-sender";

export default class CriteriaCard {
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  topicNumber: number;
  criteriaNumber: number;
  previousStatus: string;
  currentStatus: string;
  criteriaUpdatedEvent: Event;
  messageList: any = {};

  constructor($element: HTMLElement) {
    this.$element = $element;
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');
    let criteriaSplit = this.$element.dataset.criteria.split('.');
    this.topicNumber = parseInt(criteriaSplit.shift());
    this.criteriaNumber = parseInt(criteriaSplit.pop());
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
      $link.addEventListener('click', () => {
        this.updateCardStatus($link, true);
        document.dispatchEvent(this.criteriaUpdatedEvent);
      });
    });
  }

  loadData(criterionData: any) {
    // Update criterion status
    let status = criterionData.status;
    this.$element.dataset.status = status;
    this.$element.classList.add('-checked');
    this.messageList = criterionData.messageList || {'C': '', 'NC': '', 'NA': '', 'NT': ''};

    let $statusLink = this.$statusSelector.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;
    this.updateCardStatus($statusLink);
    this.updateTests(criterionData.testList);
    this.setHighlightSwitch(criterionData);
  }

  updateCardStatus($link: HTMLElement, saveUserState: boolean = false) {
    let newStatus = $link.dataset.status;

    this.$toggler.setAttribute('aria-expanded', 'false');
    this.$toggler.dataset.status = newStatus;
    (this.$toggler.querySelector('.js-criteriaSelector__togglerText') as HTMLElement).innerHTML = $link.innerHTML;
    this.$statusSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
    this.$element.dataset.status = newStatus;
    this.$element.querySelector('.js-criteriaCard__verification').innerHTML = this.messageList[newStatus] || '';

    if (saveUserState) {
      this.saveStatus(newStatus);
    }
  }


  updateTests(testList: any) {
    Object.keys(testList).forEach((key: string) => {
      let testNumber = this.topicNumber + '.' + this.criteriaNumber + '.' + key;
      let testStatus = testList[key];
      let $test = this.$element.querySelector(`.js-criteriaCard__test__number[data-test="${testNumber}"]`) as HTMLElement;
      if ($test) {
        $test.dataset.status = testStatus;
      }
    });
  }

  setHighlightSwitch(criterionData: any) {
    // If the status is NA, remove the highlight switch, otherwise update its label
    const $highlightSwitch = this.$element.querySelector('.js-criteriaCard__highlightSwitch');
    if (!$highlightSwitch) {
      return;
    }

    if (criterionData.status === 'NA') {
      this.$element.querySelector('.js-criteriaCard__highlightSwitch')?.remove();
      return;
    }

    $highlightSwitch.classList.remove('-hidden');
    ($highlightSwitch.querySelector('.js-toggleSwitch__label') as HTMLElement).innerText = criterionData.highlightSwitchLabel;

    // Ajoute le listener sur le switch
    const $input = $highlightSwitch.querySelector('input') as HTMLInputElement;
    $input.addEventListener('change', () => {
      if (!$input.checked) {
        console.log('Disable highlight');
        MessageSender.sendMessage('disableHighlight');
      } else {
        console.log('Enable highlight');
        MessageSender.sendMessage('enableHighlight', {topicNumber: this.topicNumber, criteriaNumber: this.criteriaNumber});
        // Désactive les autres highlight
        Array.from(document.querySelectorAll('.js-criteriaCard__highlightSwitch input:checked')).forEach(($input: HTMLInputElement) => {
          if ($input !== $highlightSwitch.querySelector('input')) {
            $input.checked = false;
          }
        });
      }
    });
  }

  saveStatus(newStatus: string) {
    let savedStatus = JSON.parse(localStorage.getItem('rgaaCheckerResults')) || {
      "user": {},
      "runner": {},
    };

    // Créé une entrée pour la page courante si elle n'existe pas
    savedStatus.user[window.location.href] = savedStatus.user[window.location.href] || {};

    // Sauvegarde le status dans le user
    savedStatus.user[window.location.href][this.criteriaNumber] = newStatus;

    // Met à jour le localStorage
    localStorage.setItem('rgaaCheckerResults', JSON.stringify(savedStatus));
  }
}
