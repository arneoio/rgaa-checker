import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?
 * Traite: C, NC, NA
 */
export default class Criterion11_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = FormUtils.getGroupFieldQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun regroupement de champ n'a été trouvé.";

    let $elementList = document.querySelectorAll(this.querySelector);

    if ($elementList.length > 0) {
      status = 'C';
      message = "Les regroupements de champs ont bien un label.";
      // Vérifie si les fieldset ont une légende, ou si les éléments de type role="group" ont un aria-label ou un aria-labelledby
      let $fieldsetList = document.querySelectorAll('fieldset');

      Array.from($fieldsetList).forEach(($fieldset: HTMLElement) => {
        if (!$fieldset.querySelector('legend')) {
          status = 'NC';
        }
      });

      let $groupList = document.querySelectorAll('[role="group"], [role="radiogroup"]');
      Array.from($groupList).forEach(($group: HTMLElement) => {
        // Vérifie si aria-label est défini
        if (!$group.getAttribute('aria-label')) {
          // Sinon vérifie si aria-labelledby est défini et que l'élément référencé existe
          const ariaLabelledby = $group.getAttribute('aria-labelledby');
          if (!ariaLabelledby || !document.getElementById(ariaLabelledby)) {
            status = 'NC';
          }
        }
      });

      if (status === 'NC') {
        message = "Certains regroupements de champs n'ont pas de légende.";
      }
    }

    this.updateCriteria('11.6', status, message);
    this.updateTest('11.6.1', status);

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé du regroupement de champ
    return $element.tagName === 'FIELDSET' ? $element.tagName : $element.getAttribute('role');
  }
}

