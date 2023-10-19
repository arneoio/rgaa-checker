import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?
 * Traite: NC, NT (validation manuelle)
 */
export default class Criterion9_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'main, header, footer, nav';
  }

  runTest() {
    let status = 'NT';
    let message = 'Vérifiez si les éléments strcuturants sont présents et correctement balisés.';
    let $elementList = document.querySelectorAll(this.querySelector);
    let $main = document.querySelectorAll('main');

    if($main.length === 0) {
      status = 'NC';
      message = 'La balise &lt;main&gt; est absente.';
    } else if($main.length > 1) {
      status = 'NC';
      message = 'La balise &lt;main&gt; est présente plusieurs fois.';
    }

    this.updateCriteria('9.2', status, message);
    this.updateTest('9.2.1', status);

    if($elementList.length > 0) {
      this.logResults('9.2 - Liste des éléments structurant', $elementList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    // Affiche le tag de l'élément
    return `${$element.tagName}`;
  }
}

