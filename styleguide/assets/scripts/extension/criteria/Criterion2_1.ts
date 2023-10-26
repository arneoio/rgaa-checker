import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque cadre a-t-il un titre de cadre ?
 * Traite: NA, C, NC
 */
export default class Criterion2_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
    this.querySelector = 'iframe, frame';
    this.initHighlight();
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun cadre n'a été trouvé.";
    let untitledFrameList: Array<HTMLTableElement> = [];

    let $frameList = document.querySelectorAll(this.querySelector);
    if ($frameList.length) {
      $frameList.forEach(($frame: HTMLTableElement) => {
        if (!$frame.title) {
          untitledFrameList.push($frame);
        }
      });

      status = untitledFrameList.length === 0 ? 'C' : 'NC';
      message = untitledFrameList.length === 0 ? "Tous les cadres ont un titre." : "Certains cadres n'ont pas de titre.";
    }

    this.updateCriteria('2.1', status, message);
    this.updateTest('2.1.1', status);

    if (untitledFrameList.length > 0) {
      this.logResults('2.1 - Cadres sans titre', untitledFrameList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('title');
  }
}

