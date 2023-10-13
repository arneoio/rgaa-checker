import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque page web est-elle définie par un type de document ?
 * Traite: C, NC
 */
export default class Criterion6_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let isCriteriaValid = true;
     // Sélectionnez tous les liens et les éléments avec role="link"
    const $linkList = document.querySelectorAll('a:not([aria-hidden="true"]), [role="link"]:not([aria-hidden="true"]');
    const linkListWithLabel: any = [];
    const linkListWithoutLabel: any = [];

    $linkList.forEach(($link: HTMLElement) => {
      let linkLabel = this.getLinkLabel($link);

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
    this.updateCriteria('6.2', status);
    this.updateTest('6.2.1', status);
  }

  /**
   * Vérifiez si le lien a un intitulé valide en suivant l'ordre spécifié dans le RGAA
   *
   * @param   {HTMLElement}  $link  Le lien à vérifier
   *
   * @return  {string}              L'intitulé du lien
   */
  getLinkLabel($link: HTMLElement): string {
      const ariaLabelledby = $link.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        // Si aria-labelledby est défini, on récupère le contenu de l'élément référencé
        const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
        if(describedByElement) {
          return this.getLinkLabel(describedByElement);
        }
      }

      // Sinon, si aria-label est défini, utilisez son contenu comme intitulé
      const ariaLabel = $link.getAttribute('aria-label');
      if (ariaLabel) {
        return ariaLabel;
      }

      // Sinon, si le texte du lien est défini, utilisez-le comme intitulé
      const linkText = $link.textContent.trim();
      if (linkText) {
        return linkText;
      }

      // Sinon, si l'attribut title est défini, utilisez son contenu comme intitulé
      const title = $link.getAttribute('title');
      if (title) {
        return title;
      }

      return '';
      // TODO: Vérifier les liens avec des images sans texte
    }
}
