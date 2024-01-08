import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?
 * Traite: NT
 */
export default class Criterion8_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    let status = 'NT';
    // Ajoute un lien vers le validateur du W3C de l'url courante
    const currentUrl = window.location.href;
    const w3cUrl = `https://validator.w3.org/nu/?doc=${encodeURIComponent(currentUrl)}`;
    let message = `Vérifiez le code source de la page web à l'aide du <strong><a href="${w3cUrl}" target="_blank">validateur du W3C</a></strong>.`;

    this.updateCriteria('8.2', status, message);
    this.updateTest('8.2.1', status);

    return status;
  }
}
