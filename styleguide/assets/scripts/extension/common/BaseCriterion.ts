import { Criterion } from "./Criterion";

export default abstract class BaseCriterion implements Criterion {
  $wrapper: HTMLElement;
  $highLightWrapper: HTMLElement;
  $criteriaCard: HTMLElement;
  querySelector: string;
  querySelectorList: Array<HTMLElement>;
  isInitialTestDone: boolean = false;
  isTestMode: boolean = false;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    this.$wrapper = $wrapper;
    this.$highLightWrapper = $highLightWrapper;
    this.isTestMode = isTestMode;

    if(isTestMode) {
      return;
    }

    let criteriaNumber = this.constructor.name.replace('Criterion', '').replace('_', '.');
    this.$criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    this.querySelector = '';
  }

  initHighlight() {
    if(this.isTestMode) {
      return;
    }

    // Affiche le switch
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');
    ($highlightSwitch.querySelector('.js-toggleSwitch__label') as HTMLElement).innerText = this.getHighlightText();
    $highlightSwitch.classList.remove('-hidden');

    // Ajoute le listener sur le switch
    const $input = $highlightSwitch.querySelector('input') as HTMLInputElement;
    $input.addEventListener('change', () => {
      if (!$input.checked) {
        this.resetHighlight();
      } else {
        // Désactive les autres highlight
        Array.from(this.$wrapper.querySelectorAll('.js-criteriaCard__highlightSwitch input:checked')).forEach(($input: HTMLInputElement) => {
          if ($input !== $highlightSwitch.querySelector('input')) {
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
    if (this.isTestMode) {
      return;
    }

    let $criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    if (!$criteriaCard) {
      return;
    }
    $criteriaCard.dataset.status = status;

    if (verification) {
      let $criteriaVerification = $criteriaCard.querySelector('.js-criteriaCard__verification') as HTMLElement;
      $criteriaVerification.innerHTML = verification;
    }

    let $criteriaSelector = $criteriaCard.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;

    // Trigger click on criteriaSelector to update its status
    if (!this.isInitialTestDone) {
      const loadClickEvent = new Event('loadclick', {
        bubbles: true, // L'événement peut se propager à travers la hiérarchie DOM
        cancelable: true, // L'événement peut être annulé
      });

      $criteriaSelector.dispatchEvent(loadClickEvent);
    } else {
      $criteriaSelector.click();
    }
  }

  updateTest(testNumber: string, status: string) {
    if (this.isTestMode) {
      return;
    }

    let $criteriaTest = this.$wrapper.querySelector(`.js-criteriaCard__test__number[data-test="${testNumber}"]`) as HTMLElement;
    if (!$criteriaTest) {
      return;
    }

    $criteriaTest.dataset.status = status;
  }

  abstract runTest(): string;

  getHighlightedElements(): Array<HTMLElement> {
    return Array.from(document.querySelectorAll(this.querySelector));
  }

  getHighlightText(): string {
    return 'Highlight';
  }

  getHighlightLabel($element: HTMLElement) {
    return '';
  }

  logResults(title: string, log: any): void {
    if (this.isTestMode) {
      return;
    }
    console.groupCollapsed(title);
    console.log(log);
    console.groupEnd();
  };

  resetHighlight() {
    document.querySelectorAll('*').forEach(($element: HTMLElement) => {
      $element.style.opacity = null; $element.style.outline = null;
    }
    );
    // Remove all highlights
    this.$highLightWrapper.innerHTML = '';
  }

  activateHighlight() {
    const $highlightSwitch = this.$criteriaCard.querySelector('.js-criteriaCard__highlightSwitch');

    // Retourne le tableau pour manipuler les éléments dans l'ordre inverse, optimisation pour le hideRecursive
    this.querySelectorList = this.getHighlightedElements().reverse();
    if ($highlightSwitch.querySelector('input').checked) {
      this.hideRecursive(document.body);
    }
  }

  hideRecursive($element: HTMLElement, canBeHidden: boolean = true): boolean {
    if ($element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    // Ne pas cacher l'élément de l'extension
    if ($element.id === 'arneo-browser-extension') {
      return false;
    }

    // L'élément matche la recherche: mise en avant
    // Les éléments matchant sont dans l'ordre inverse de la liste
    if ($element === this.querySelectorList[this.querySelectorList.length - 1]) {
      // On supprime le dernier élément de la liste
      this.querySelectorList.pop();
      if (this.$highLightWrapper) {
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

      $element.childNodes.forEach((e: HTMLElement) => {
        this.hideRecursive(e, false);
      });

      return false;
    }

    // L'élément n'a pas d'enfant ou est en aria hidden et ne match pas: on le masque
    if (($element.childElementCount === 0 || $element.getAttribute('aria-hidden') === 'true') && canBeHidden) {
      $element.style.opacity = '0.2';
      return !canBeHidden;
    } else {
      // On vérifie si parmis les enfants tous match ou pas pour ne masquer que le plus haut niveau ne matchant pas, on ne veut pas masquer récursivement
      let hasAllChildrenHidden = true;
      $element.childNodes.forEach((e: HTMLElement) => {
        var isChildHidden = this.hideRecursive(e, canBeHidden);
        if (!isChildHidden) {
          hasAllChildrenHidden = false;
        }
      });

      if (hasAllChildrenHidden && canBeHidden) {
        $element.style.opacity = '0.2';
        $element.querySelectorAll('*').forEach((e: HTMLElement) => {
          e.style.opacity = null;
        });
      }
      return hasAllChildrenHidden;
    }
  }
}
