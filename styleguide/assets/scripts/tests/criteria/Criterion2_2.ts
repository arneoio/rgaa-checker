import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?
 * Traite: NA, NT (validation manuelle)
 */
export default class Criterion2_2 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'iframe, frame';
  }

  runTest() {
    let status = 'NA';
    let frameTitleList: Array<any> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if($frameList.length) {
      $frameList.forEach(($frame: HTMLTableElement) => {
        if($frame.title) {
          frameTitleList.push({
            title: $frame.title,
            frame: $frame
          });
          status = 'NT';
        }
      });

    }

    this.updateCriteria('2.2', status);
    this.updateTest('2.2.1', status);

    if(frameTitleList.length > 0) {
      this.logResults('2.2 - Liste des titres des cadres', frameTitleList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

