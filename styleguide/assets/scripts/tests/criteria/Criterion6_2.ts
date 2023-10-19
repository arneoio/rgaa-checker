import BaseCriterion from '../common/BaseCriterion';
import LinkUtils from '../utils/LinkUtils';

/**
 * Dans chaque page web, chaque lien a-t-il un intitulé ?
 * Traite: C, NC
 */
export default class Criterion6_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"]';
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun lien n'a été trouvé.";

    let isCriteriaValid = true;
     // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);

    if($linkList.length) {
      const linkListWithLabel: any = [];
      const linkListWithoutLabel: any = [];

      $linkList.forEach(($link: HTMLElement) => {
        let linkLabel = LinkUtils.getLinkLabel($link);

        if(linkLabel.trim() === '') {
          linkListWithoutLabel.push($link);
        } else {
          linkListWithLabel.push({ $link, label: linkLabel });
        }
      });

      if(linkListWithLabel.length > 0) {
        this.logResults('6.2 - Liens avec intitulé ', linkListWithLabel);
      }
      if(linkListWithoutLabel.length > 0) {
        this.logResults('6.2 - Liens sans intitulé ', linkListWithoutLabel);
      }

      isCriteriaValid = linkListWithoutLabel.length === 0;
      let status = isCriteriaValid ? 'C' : 'NC';
      let message = isCriteriaValid ? "Tous les liens ont un intitulé." : "Certains liens n'ont pas d'intitulé.";
    }

    this.updateCriteria('6.2', status, message);
    this.updateTest('6.2.1', status);
  }

  getHighlightLabel($element: HTMLElement) {
    return LinkUtils.getLinkLabel($element);
  }
}
}
