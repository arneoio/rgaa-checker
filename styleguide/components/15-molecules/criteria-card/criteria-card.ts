import Highlight from "../../00-base/utils/highlight";
import MessageSender from "../../00-base/utils/message-sender";
import LocalStorage from "../../00-base/utils/local-storage";

interface StorageData {
  [key: string]: any;
}

export default class CriteriaCard {
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  topicNumber: number;
  criteriaNumber: number;
  criteriaUpdatedEvent: Event;
  messageList: any = {};
  localStorageKey: string;

  constructor($element: HTMLElement) {
    this.$element = $element;
    this.localStorageKey = 'rgaaCheckerResults';
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');
    let criteriaSplit = this.$element.dataset.criteria.split('.');
    this.topicNumber = parseInt(criteriaSplit.shift());
    this.criteriaNumber = parseInt(criteriaSplit.pop());

    this.criteriaUpdatedEvent = new Event('rgaachecker-criteria-updated', {
      bubbles: true,
      cancelable: true
    });

    this.bindEvents();
  }

  bindEvents() {
    Array.from(this.$statusSelector.querySelectorAll('.js-criteriaSelector__link')).forEach(($link: HTMLElement) => {
      $link.addEventListener('click', () => {
        this.updateCardStatus($link);
        this.saveStatus($link.dataset.status || 'NT');
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

    let $statusLink = this.$statusSelector.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;
    this.updateCardStatus($statusLink);
    this.updateTests(criterionData.testList);
    this.setHighlightSwitch(criterionData);
    this.loadUserStatus(host, url);
  }

  loadUserStatus(host: string, url: string) {
      LocalStorage.getUserData(host, url).then((userStoredData: any) => {
        let userStatus = userStoredData[this.topicNumber + '.' + this.criteriaNumber];
        if (userStatus) {
          let $statusLink = this.$statusSelector.querySelector(`.js-criteriaSelector__link[data-status="${userStatus}"]`) as HTMLElement;
          this.updateCardStatus($statusLink);
          // TODO: if user status is different from the one in the runner, display a warning
        }
    });
  }

  updateCardStatus($link: HTMLElement) {
    let newStatus = $link.dataset.status;

    this.$toggler.setAttribute('aria-expanded', 'false');
    this.$toggler.dataset.status = newStatus;
    (this.$toggler.querySelector('.js-criteriaSelector__togglerText') as HTMLElement).innerHTML = $link.innerHTML;
    this.$statusSelector.querySelector('.js-criteriaSelector__content').classList.remove('-expanded');
    this.$element.dataset.status = newStatus;
    this.$element.querySelector('.js-criteriaCard__verification').innerHTML = this.messageList[newStatus] || '';
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

  // loadUserResults() {
  //   const results = JSON.parse(localStorage.getItem(this.localStorageKey));
  //   const userResults = results.user[window.location.pathname] || {};

  //   // TODO: à améliorer. Si possible appeler la méthode updateCriteria de chaque critère plutôt que de faire ça à la main
  //   // Mais if faut dans ce cas une classe définie pour chaque critère
  //   // TODO: s'il y a un conflit entre les résultats de l'utilisateur et ceux du runner suite au chargement, il faut indiquer le conflit
  //   Object.keys(userResults).forEach((key: string) => {
  //     let $criteriaCard: HTMLElement = document.querySelector(`.js-criteriaCard[data-criteria="${key}"]`);
  //     if ($criteriaCard) {
  //       let $toggler: HTMLElement = $criteriaCard.querySelector(`.js-criteriaSelector__toggler`);
  //       let $togglerText: HTMLElement = $criteriaCard.querySelector(`.js-criteriaSelector__togglerText`);
  //       $criteriaCard.dataset.status = userResults[key];
  //       $toggler.dataset.status = userResults[key];
  //       $togglerText.innerText = userResults[key];
  //     }
  //   });
  // }

  saveStatus(newStatus: string) {
    let host = document.querySelector('.js-summary__host')?.textContent;
    let url = document.querySelector('.js-summary__url')?.textContent;

    if(!host || !url) {
      return;
    }

    LocalStorage.saveUserData(host, url, this.topicNumber, this.criteriaNumber, newStatus);
  }
}
