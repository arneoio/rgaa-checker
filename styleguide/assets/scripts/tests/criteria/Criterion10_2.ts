import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = `link[rel="stylesheet"]`;
    this.initHighlight();
  }

  resetHighlight(): void {
    // Réactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = false;
    });
  }

  activateHighlight(): void {
    // Désactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = true;
    });
  }

  getHighlightText() {
    return "Switch les styles";
  }

  runTest() {
    let status = 'NT';
    let message = "Désactivez les feuilles de styles pour vérifier que le contenu reste lisible et utilisable.";

    this.updateCriteria('10.2', status, message);
    this.updateTest('10.2.1', status);
  }
}

