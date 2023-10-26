import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?
 * Traite: NA, NT
 */
export default class Criterion5_3 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'table[role="presentation"]';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun tableau de présentation n'a été trouvé.";

    let $presentationTableList = document.querySelectorAll('table[role="presentation"]');
    if ($presentationTableList.length) {
      status = 'NT';
      message = "Vérifiez si les tableaux de présentation ont un contenu linéarisé compréhensible.";
    }

    this.updateCriteria('5.3', status, message);
    this.updateTest('5.3.1', status);

    if ($presentationTableList.length > 0) {
      this.logResults('5.3 - Liste des tableaux de présentation', $presentationTableList);
    }

    return status;
  }
}

