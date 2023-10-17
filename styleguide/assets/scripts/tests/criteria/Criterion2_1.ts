import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque cadre a-t-il un titre de cadre ?
 * Traite: NA, C, NC
 */
export default class Criterion2_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'iframe, frame';
  }

  runTest() {
    let status = 'NA';
    let untitledFrameList: Array<HTMLTableElement> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if($frameList.length) {
      $frameList.forEach(($frame: HTMLTableElement) => {
        if(!$frame.title) {
          untitledFrameList.push($frame);
        }
      });

      status = untitledFrameList.length === 0 ? 'C' : 'NC';
    }

    this.updateCriteria('2.1', status);
    this.updateTest('2.1.1', status);

    if(untitledFrameList.length > 0) {
      this.logResults('2.1 - Cadres sans titre', untitledFrameList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

