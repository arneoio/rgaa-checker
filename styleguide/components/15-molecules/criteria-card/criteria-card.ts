import Highlight from "../../00-base/utils/highlight";
import MessageSender from "../../00-base/utils/message-sender";
import LocalStorage from "../../00-base/utils/local-storage";

interface StorageData {
  [key: string]: any;
}

export default class CriteriaCard {
  $element: HTMLElement;
  $statusSelector: HTMLElement | null;
  topicNumber: number;
  criteriaNumber: number;
  criteriaUpdatedEvent: Event;
  messageList: any = {};
  localStorageKey: string;

  constructor($element: HTMLElement) {
    this.$element = $element;
    this.localStorageKey = 'rgaaCheckerResults';
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    let criteriaSplit: string[] = (this.$element?.dataset?.criteria || '').split('.');
    this.topicNumber = parseInt(criteriaSplit.shift());
    this.criteriaNumber = parseInt(criteriaSplit.pop());

    this.criteriaUpdatedEvent = new Event('rgaachecker-criteria-updated', {
      bubbles: true,
      cancelable: true
    });

    this.bindEvents();
  }

  bindEvents() {
    Array.from(this.$statusSelector?.querySelectorAll('.js-criteriaSelector__input') as NodeListOf<HTMLInputElement>).forEach(($input: HTMLInputElement) => {
      $input.addEventListener('change', () => {
        this.updateCardStatus($input);
        this.saveStatus($input.value || 'NT');
        document.dispatchEvent(this.criteriaUpdatedEvent);
      });
    });
  }

  loadData(criterionData: any, host: string, url: string) {
    // Update criterion status
    let status = criterionData.status;
    this.$element.dataset.status = status;
    this.$element.classList.add('-checked');
    this.messageList = criterionData.messageList || {'C': '', 'NC': '', 'NA': '', 'NT': ''};

    let $statusRadioInput = this.$statusSelector?.querySelector(`.js-criteriaSelector__input[value="${status}"]`) as HTMLInputElement;
    console.log('loadData', this.$statusSelector, status, $statusRadioInput);
    this.updateCardStatus($statusRadioInput);
    this.updateTests(criterionData.testList);
    this.setHighlightSwitch(criterionData);
    this.loadUserStatus(host, url);
  }

  loadUserStatus(host: string, url: string) {
      LocalStorage.getUserData(host, url).then((userStoredData: any) => {
        let userStatus = userStoredData[this.topicNumber + '.' + this.criteriaNumber];
        if (userStatus) {
          let $statusRadioInput = this.$statusSelector?.querySelector(`.js-criteriaSelector__input[value="${userStatus}"]`) as HTMLInputElement;
          this.updateCardStatus($statusRadioInput);
          // TODO: if user status is different from the one in the runner, display a warning
        }
    });
  }

  updateCardStatus($input: HTMLInputElement) {
    let newStatus = $input.value;

    this.$element.dataset.status = newStatus;
    $input.checked = true;
    let $verificationText = this.$element?.querySelector('.js-criteriaCard__verification');
    if ($verificationText) {
      $verificationText.innerHTML = this.messageList[newStatus] || '';
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
    const $highlightSwitch = this.$element.querySelector('.js-criteriaCard__highlightSwitch');
    if (!$highlightSwitch) {
      return;
    }

    // If the status is NA, remove the highlight switch
    if (criterionData.status === 'NA' || criterionData.highlightSwitchLabel === '') {
      $highlightSwitch.classList.add('-hidden');
      return;
    }

    // Otherwise, display the switch and set the label
    $highlightSwitch.classList.remove('-hidden');
    ($highlightSwitch.querySelector('.js-toggleSwitch__label') as HTMLElement).innerText = criterionData.highlightSwitchLabel;

    // Ajoute le listener sur le switch
    const $input = $highlightSwitch.querySelector('input') as HTMLInputElement;
    $input.addEventListener('change', () => {
      if (!$input.checked) {
        MessageSender.sendMessage('devtools_disableHighlight');
        Highlight.getInstance().hide();
      } else {
        MessageSender.sendMessage('devtools_enableHighlight', {topicNumber: this.topicNumber, criteriaNumber: this.criteriaNumber});
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
    let host = document.querySelector('.js-summary__host')?.textContent.trim();
    let url = document.querySelector('.js-summary__url')?.textContent.trim();

    if(!host || !url) {
      return;
    }

    LocalStorage.saveUserData(host, url, this.topicNumber, this.criteriaNumber, newStatus);
  }
}
