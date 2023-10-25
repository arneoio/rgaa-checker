import BaseCriterion from '../common/BaseCriterion';
import LinkUtils from '../utils/LinkUtils';

/**
 * Dans chaque page web, chaque lien a-t-il un intitulé ?
 * Traite: C, NC
 */
export default class Criterion6_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"]';
    this.initHighlight();
  }

  getHighlightedElements(): Array<HTMLElement> {
    // Sélectionnez tous les liens sans intitulé
    const linkListWithoutLabel: any = [];
    const $linkList = document.querySelectorAll(this.querySelector);

    if($linkList.length) {

      $linkList.forEach(($link: HTMLElement) => {
        let linkLabel = LinkUtils.getLinkLabel($link);

        if(linkLabel.trim() === '') {
          linkListWithoutLabel.push($link);
        }
      });
    }

    return linkListWithoutLabel;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun lien n'a été trouvé.";

    let isCriteriaValid = true;
     // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);

    if($linkList.length) {
      const $linkListWithoutLabel = this.getHighlightedElements();

      if($linkListWithoutLabel.length > 0) {
        this.logResults('6.2 - Liens sans intitulé ', $linkListWithoutLabel);
      }

      isCriteriaValid = $linkListWithoutLabel.length === 0;
      status = isCriteriaValid ? 'C' : 'NC';
      message = isCriteriaValid ? "Tous les liens ont un intitulé." : "Certains liens n'ont pas d'intitulé.";
    } else {
      status = 'NT';
      message = "Aucun lien n'a été trouvé dans la page.";
    }

    this.updateCriteria('6.2', status, message);
    this.updateTest('6.2.1', status);
  }

  getHighlightLabel($element: HTMLElement) {
    return LinkUtils.getLinkLabel($element);
  }
}
