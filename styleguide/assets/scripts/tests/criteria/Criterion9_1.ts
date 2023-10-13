import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?
 * Traite: NA, NC, NT (validation manuelle)
 */
export default class Criterion9_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
  }

  runTest() {
    let status = 'NA';
    let headingList: Array<any> = [];

    const $headingList = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]');

    if($headingList.length > 0) {
      status = 'NT';
    }

    // Récupère le niveau et le titre de chaque heading
    $headingList.forEach(($heading) => {
      const level = $heading.getAttribute('aria-level') || parseInt($heading.tagName.charAt(1), 10);
      const title = $heading.textContent;
      headingList.push({ level, title, isValid: true });
    });

    // Vérifie que la hiérarchie des headings est respectée
    for (let i = 0; i < headingList.length; i++) {
      const currentHeading = headingList[i];
      const nextHeading = headingList[i + 1];

      if (nextHeading && nextHeading.level - currentHeading.level > 1) {
        nextHeading.isValid = false;
        status = 'NC';
      }
    }

    this.updateCriteria('9.1', status, 'Vérifiez');
    this.updateTest('9.1.1', status);
    this.updateTest('9.1.2', status === 'NA' ? 'NA' : 'NT');
    this.updateTest('9.1.3', status);

    if(headingList.length > 0) {
      this.logResults('9.1 - Liste des heading', headingList);
    }
  }
}

