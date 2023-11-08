import BaseCriterion from '../common/BaseCriterion';
import FormUtils from '../utils/FormUtils';

/**
 * Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion11_9 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = FormUtils.getButtonQuerySelector();
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun bouton de formulaire n'a été trouvé.";

    let $elementList = Array.from(document.querySelectorAll(this.querySelector));
    let noLabelElementList: Array<HTMLElement> = [];
    let noConcordantElementList: any = [];

    if ($elementList.length > 0) {
      status = 'NT';
      message = "Vérifiez si l'intitulé des boutons est pertinent.";

      $elementList.forEach(($element: HTMLElement) => {
        const accessibleLabel = FormUtils.getButtonAccessibleLabel($element);
        const visibleLabel = FormUtils.getButtonVisibleLabel($element);

        if (!accessibleLabel) {
          status = 'NC';
          message = 'Certains boutons n’ont pas d’intitulé.';
          noLabelElementList.push($element);
        }

        // Le nom accessible doit contenir au minimum le nom visible
        if (accessibleLabel && visibleLabel && !accessibleLabel.includes(visibleLabel.trim())) {
          status = 'NC';
          message = "Certains libellés accessibles ne contiennent pas reprennent pas le libellé visible.";
          console.log(accessibleLabel);
          console.log(visibleLabel);
          noConcordantElementList.push({ $element, visibleLabel, accessibleLabel });
        }
      });
    }

    this.updateCriteria('11.9', status, message);
    this.updateTest('11.9.1', noLabelElementList.length ? 'NC' : 'NT');
    this.updateTest('11.9.2', noConcordantElementList.length ? 'NC' : 'C');

    if (noLabelElementList.length) {
      this.logResults('11.9.1 - Liste des boutons sans intitulé', noLabelElementList);
    }

    if (noConcordantElementList.length) {
      this.logResults('11.9.2 - Liste des boutons dont l\'intitulé accessible ne contient pas le libellé visible', noConcordantElementList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le libellé visible du bouton, et le libellé accessible s'il est différent
    let label = '';

    const accessibleLabel = FormUtils.getButtonAccessibleLabel($element);
    const visibleLabel = FormUtils.getButtonVisibleLabel($element);

    label += visibleLabel;
    if (accessibleLabel && accessibleLabel !== visibleLabel) {
      label += ' (' + accessibleLabel + ')';
    }

    return label;
  }
}

