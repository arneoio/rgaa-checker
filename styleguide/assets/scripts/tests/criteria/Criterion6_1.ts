import BaseCriterion from '../common/BaseCriterion';
import LinkUtils from '../utils/LinkUtils';

/**
 * Chaque lien est-il explicite (hors cas particuliers) ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion6_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"]';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun lien n'a été trouvé.";

    let isCriteriaValid = true;
     // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll(this.querySelector);

    if($linkList.length) {
      const linkListWithLabel: any = [];

      $linkList.forEach(($link: HTMLElement) => {
        let linkLabel = LinkUtils.getLinkLabel($link);

        if(linkLabel.trim() !== '') {
          linkListWithLabel.push({ $link, label: linkLabel });
        }
      });

      if(linkListWithLabel.length > 0) {
        this.logResults('6.1 - Intitulé des liens', linkListWithLabel);
        status = 'NT';
        message = "Vérifiez la pertinence des intitulés des liens.";
      }
    }

    this.updateCriteria('6.2', status, message);
    this.updateTest('6.2.1', status);
    this.updateTest('6.2.2', status);
    this.updateTest('6.2.3', status);
    this.updateTest('6.2.4', status);
    this.updateTest('6.2.5', status);
  }

  getHighlightLabel($element: HTMLElement) {
    return LinkUtils.getLinkLabel($element);
  }
}
