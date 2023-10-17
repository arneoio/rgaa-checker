export default class CriteriaCard {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $statusSelector: HTMLElement;
  $toggler: HTMLElement;
  $highlightSwitch: HTMLElement;
  $highLightWrapper: HTMLElement;
  $summaryScore: HTMLElement;
  $summaryScoreProgress: HTMLElement;
  highlightSelector: string;
  criterion: any;

  constructor($wrapper: HTMLElement, $element: HTMLElement, criterion: any, $highLightWrapper: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$statusSelector = this.$element.querySelector('.js-criteriaSelector');
    this.$toggler = this.$statusSelector.querySelector('.js-criteriaSelector__toggler');
    this.$highlightSwitch = this.$element.querySelector('.js-criteriaCard__highlightSwitch');
    this.$highLightWrapper = $highLightWrapper;
    this.criterion = criterion;
    this.highlightSelector = (this.criterion && this.criterion.getHighlightSelector()) || '';

    this.$summaryScore = this.$wrapper.querySelector('.js-summary__score');
    this.$summaryScoreProgress = this.$wrapper.querySelector('.js-summary__score__progress');

    this.init();
  }

  init() {
    Array.from(this.$statusSelector.querySelectorAll('.js-criteriaSelector__link')).forEach(($link) => {
      $link.addEventListener('click', this.updateCardStatus.bind(this));
    });

    if(this.highlightSelector) {
      this.$highlightSwitch.classList.remove('-hidden');
      this.$highlightSwitch.querySelector('input').addEventListener('change', () => {
        this.switchHighlightedElements();
      })
    }
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

  switchHighlightedElements() {
    document.querySelectorAll('*').forEach(($element: HTMLElement) => {
      $element.style.opacity = null; $element.style.outline = null; }
    );
    // Remove all highlights
    this.$highLightWrapper.innerHTML = '';

    // uncheck all other highlightSwitch
    Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard__highlightSwitch input')).forEach(($input: HTMLInputElement) => {
      if($input !== this.$highlightSwitch.querySelector('input')) {
        $input.checked = false;
      }
    });

    if(this.$highlightSwitch.querySelector('input').checked) {

      this.hideRecursive(document.body, this.highlightSelector);
    }
  }

  hideRecursive($element: HTMLElement, querySelector: string) {
    if ($element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }

    if($element.id === 'arneo-browser-extension') {
      return false;
    }

    // L'élément matche la recherche: mise en avant
    if($element.matches(querySelector)) {
        if(this.$highLightWrapper) {
          // On créé un élément dans le wrapper à la même position que l'élément matchant pour le mettre en avant
          let $highlight = document.createElement('div');
          let bounding = $element.getBoundingClientRect();
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          $highlight.style.top = `${bounding.top + scrollTop}px`;
          $highlight.style.left = `${bounding.left}px`;
          $highlight.style.width = `${bounding.width}px`;
          $highlight.style.height = `${bounding.height}px`;
          this.$highLightWrapper.appendChild($highlight);

          // Ajoute un label à l'élément mis en avant
          let $label = document.createElement('p');
          $label.innerText = this.criterion.getHighlightLabel($element);
          $highlight.appendChild($label);
        }
        return false;
    }

    // L'élément n'a pas d'enfant et ne match pas: on le masque
    if($element.childElementCount === 0) {
        $element.style.opacity = '0.2';
        return true;
    } else {
        // On vérifie si parmis les enfants tous match ou pas pour ne masquer que le plus haut niveau ne matchant pas, on ne veut pas masquer récursivement
        let hasAllChildrenHidden = true;
        $element.childNodes.forEach((e: HTMLElement) => {
            var isChildHidden = this.hideRecursive(e, querySelector);
            if (!isChildHidden) {
                hasAllChildrenHidden = false;
            }
        });

        if (hasAllChildrenHidden) {
            $element.style.opacity = '0.2';
            $element.querySelectorAll('*').forEach((e: HTMLElement) => {
                e.style.opacity = null;
            });
        }
        return hasAllChildrenHidden;
    }
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
