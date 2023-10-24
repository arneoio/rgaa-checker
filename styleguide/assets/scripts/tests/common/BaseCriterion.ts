import { Criterion } from "./Criterion";

export default abstract class BaseCriterion implements Criterion {
  $wrapper: HTMLElement;
  $highLightWrapper: HTMLElement;
  $criteriaCard: HTMLElement;
  querySelector: string;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$highLightWrapper = $highLightWrapper;
    let criteriaNumber = this.constructor.name.replace('Criterion', '').replace('_', '.');
    this.$criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    this.querySelector = '';
  }

  initHighlight() {
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');
    ($highlightSwitch.querySelector('.js-toggleSwitch__label') as HTMLElement).innerText = this.getHighlightText();
    $highlightSwitch.classList.remove('-hidden');
    const $input = $highlightSwitch.querySelector('input') as HTMLInputElement;
    $input.addEventListener('change', () => {
      if(!$input.checked) {
        this.resetHighlight();
      } else {
        // uncheck all other highlightSwitch
        Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard__highlightSwitch input:checked')).forEach(($input: HTMLInputElement) => {
          if($input !== $highlightSwitch.querySelector('input')) {
            $input.checked = false;
            // Trigger le change pour reset le highlight du bon critère
            $input.dispatchEvent(new Event('change'));
          }
        });

        this.activateHighlight();
      }
    })
  }

  updateCriteria(criteriaNumber: string, status: string, verification?: string) {
    let $criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    if(!$criteriaCard) {
      return;
    }
    $criteriaCard.dataset.status = status;

    if(verification) {
      let $criteriaVerification = $criteriaCard.querySelector('.js-criteriaCard__verification') as HTMLElement;
      $criteriaVerification.innerHTML = verification;
    }

    let $criteriaSelector = $criteriaCard.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;
    // Trigger click on criteriaSelector to update its status
    $criteriaSelector.click();
  }

  updateTest(testNumber: string, status: string) {
    let $criteriaTest = this.$wrapper.querySelector(`.js-criteriaCard__test__number[data-test="${testNumber}"]`) as HTMLElement;
    if(!$criteriaTest) {
      return;
    }

    $criteriaTest.dataset.status = status;
  }

  abstract runTest(): void;

  getHighlightSelector(): string {
    return this.querySelector;
  }

  getHighlightText(): string {
    return 'Highlight';
  }

  getHighlightLabel($element: HTMLElement) {
    return '';
  }

  logResults(title: string, log: any): void {
    console.groupCollapsed(title);
    console.log(log);
    console.groupEnd();
  };

  resetHighlight() {
    console.log('resetHighlight', this.constructor.name);
    document.querySelectorAll('*').forEach(($element: HTMLElement) => {
      $element.style.opacity = null; $element.style.outline = null; }
    );
    // Remove all highlights
    this.$highLightWrapper.innerHTML = '';
  }

  activateHighlight() {
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');

    if($highlightSwitch.querySelector('input').checked) {
      this.hideRecursive(document.body, this.getHighlightSelector());
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
          $label.innerText = this.getHighlightLabel($element);
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
}
