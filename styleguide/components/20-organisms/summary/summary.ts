export default class Summary {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $copyButton: HTMLElement;
  $textArea: HTMLTextAreaElement;

  constructor($wrapper: HTMLElement, $element: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$copyButton = this.$element.querySelector('.js-summary__copyButton');
    this.$textArea = this.$element.querySelector('.js-summary__textarea');

    this.init();
  }

  init() {
    this.$copyButton.addEventListener('click', this.copyData.bind(this));
  }

  copyData(event: Event) {
    this.$textArea.value = '';
    let resultList: any[] = [];
    const $criteriaCardList = Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard'));
    $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
      let status = ($criteriaCard.querySelector('.js-criteriaSelector__toggler') as HTMLElement).dataset.status;
      let message = $criteriaCard.querySelector('.js-criteriaCard__verification')?.textContent || '';

      let result = {
        status: status,
        message: message
      };

      resultList.push(result);
    });

    const csvContent = resultList.map(result => `${result.status}\tN\t${result.message}`).join('\n');
    this.$textArea.value = csvContent;

    if(navigator.clipboard) {
      navigator.clipboard.writeText(csvContent);
    } else {
      this.$textArea.select();
      // Commande dépréciée mais fonctionne sur tous les navigateurs
      document.execCommand('copy');
    }
  }
}
