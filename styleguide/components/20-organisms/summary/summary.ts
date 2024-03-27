export default class Summary {
  $element: HTMLElement;
  $copyButton: HTMLElement;
  $textArea: HTMLTextAreaElement;
  $score: HTMLElement;
  $scoreProgress: HTMLElement;
  $scoreText: HTMLElement;
  $scoreMention: HTMLElement;
  $tested: HTMLElement;
  $total: HTMLElement;

  constructor($element: HTMLElement) {
    this.$element = $element;
    this.$copyButton = this.$element.querySelector('.js-summary__copyButton');
    this.$textArea = this.$element.querySelector('.js-summary__textarea');

    this.$score = document.querySelector('.js-summary__score');
    this.$scoreProgress = document.querySelector('.js-summary__score__progress');
    this.$tested = document.querySelector('.js-summary__tested');
    this.$total = document.querySelector('.js-summary__total');
    this.$scoreText = document.querySelector('.js-summary__score__text');
    this.$scoreMention = document.querySelector('.js-summary__score__mention');

    this.bindEvents();
  }

  bindEvents() {
    this.$copyButton.addEventListener('click', this.copyData.bind(this));

    document.addEventListener('rgaachecker-initialized', () => {
      this.updateCompletion();
    });
    document.addEventListener('rgaachecker-criteria-updated', () => {
      this.updateCompletion();
    });
  }

  copyData(event: Event) {
    this.$textArea.value = '';
    let resultList: any[] = [];
    const $criteriaCardList = Array.from(document.querySelectorAll('.js-criteriaCard'));
    $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
      let criteriaNumber: string = $criteriaCard.dataset.criteria;
      let criteriaLabel: string = ($criteriaCard.querySelector('.js-criteriaCard__text') as HTMLElement)?.textContent?.trim() || '';
      let status: string = ($criteriaCard.querySelector('.js-criteriaSelector__toggler') as HTMLElement).dataset.status;
      let message: string = $criteriaCard.querySelector('.js-criteriaCard__verification')?.textContent?.trim() || '';
      let result = {
        criteriaNumber: criteriaNumber,
        criteriaLabel: criteriaLabel,
        status: status,
        message: message
      };

      resultList.push(result);
    });

    const csvContent = resultList.map(result => `${result.criteriaNumber}\t${result.criteriaLabel}\t${result.status}\tN\t${result.message}`).join('\n');
    this.$textArea.value = csvContent;

    if(navigator.clipboard) {
      navigator.clipboard.writeText(csvContent);
    } else {
      this.$textArea.select();
      // Commande dépréciée mais fonctionne sur tous les navigateurs
      document.execCommand('copy');
    }
  }

  updateCompletion() {
    let $criteriaCards = document.querySelectorAll('.js-criteriaCard');
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

    Object.keys(scoreList).forEach((status: string) => {
      let $status = document.querySelector(`.js-summary__progress[data-status="${status}"]`);
      $status.setAttribute('value', scoreList[status].toString());
      $status.setAttribute('max', total.toString());
    });

    // While NT remains, the score is not calculated
    if(scoreList['NT'] > 0) {
      this.$scoreText.classList.add('-hidden');
      this.$scoreMention.classList.remove('-hidden');
      let progress = total - scoreList['NT'];

      this.$tested.innerText = progress.toString();
      this.$total.innerText = total.toString();
      this.$scoreProgress.setAttribute('value', progress.toString());
      this.$scoreProgress.setAttribute('max', total.toString());
    } else {
      // All criteria have been tested, the score is calculated
      let total = scoreList['C'] + scoreList['NC'];
      let score = Math.round(scoreList['C'] / total * 100);

      this.$scoreProgress.setAttribute('value', score.toString());
      this.$scoreProgress.setAttribute('max', '100');
      this.$score.innerText = score.toString();

      this.$scoreText.classList.remove('-hidden');
      this.$scoreMention.classList.add('-hidden');
    }
  }
}
