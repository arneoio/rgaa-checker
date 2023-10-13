import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion8_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let lang = '';
    let status = 'NT';

    const htmlElement = document.documentElement;
    const langAttribute = htmlElement.getAttribute('lang');
    const xmlLangAttribute = htmlElement.getAttribute('xml:lang');

    // Le code de langue est valide.
    // Le code de langue est pertinent.
    if (langAttribute || xmlLangAttribute) {
      lang = langAttribute || xmlLangAttribute;

      // Expression régulière pour la norme ISO 639-1 ou ISO 639-2
      const iso639Pattern = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/;

      if (!iso639Pattern.test(lang)) {
        status = 'NC';
      }
    } else {
      // Langue absente = critère non applicable, le 8.3 est déjà en NC
      status = 'NA';
    }

    this.updateCriteria('8.4', status, `Langue du document: <span>${lang}</span>.`);
    this.updateTest('8.4.1', status);
  }
}
