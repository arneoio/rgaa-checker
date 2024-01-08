import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion11_8 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = 'select';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun select n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll(this.querySelector));
    let hasAllOptiongroup = true;
    let hasAtLeastOneOptiongroup = false;

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Certains select ont des optgroup, tous correctement associés à un label. Vérifiez leur pertinence.<br />Vérifiez si les autres select devraient avoir des regroupements.";

      $elementList.forEach(($element: HTMLElement) => {
        const $optgroupList = $element.querySelectorAll('optgroup');
        if ($optgroupList.length === 0) {
          hasAllOptiongroup = false;
        }
        Array.from($optgroupList).forEach(($optgroup: HTMLElement) => {
          hasAtLeastOneOptiongroup = true;
          // Vérifie si l'attribut label est défini
          if (!$optgroup.getAttribute('label')) {
            status = 'NC';
            message = "Certains optgroup n'ont pas de label associé.";
          }
        });
      });

      if (hasAllOptiongroup) {
        message = 'Tous les select présents ont un optgroup. Vérifiez leur pertinence.';
      }
    }

    this.updateCriteria('11.8', status, message);
    this.updateTest('11.8.1', $elementList.length > 0 ? 'NT' : 'NA');
    this.updateTest('11.8.2', $elementList.length === 0 ? 'NA' : (status === 'NC' ? 'NC' : 'C'));
    this.updateTest('11.8.3', hasAtLeastOneOptiongroup ? 'NT' : 'NA');

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le label des optgroup
    let label = '';
    const $optgroup = $element.querySelectorAll('optgroup');
    Array.from($optgroup).forEach(($optgroup: HTMLElement) => {
      label += ($optgroup.getAttribute('label') || '') + ' ';
    });

    return label;
  }
}

