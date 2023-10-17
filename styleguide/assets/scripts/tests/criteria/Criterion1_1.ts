import BaseCriterion from '../common/BaseCriterion';

/**
 * Chaque image porteuse d’information a-t-elle une alternative textuelle ?
 * Traite: NA, NT
 */
export default class Criterion1_1 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = 'img, [role="img"], area, input[type="image"], svg, object[type^="image/"]';
  }

  runTest() {
    let status = 'NA';

    let imageList: Array<any> = [];

    let $imageList = document.querySelectorAll(this.querySelector);

    this.updateCriteria('1.1', status);
    this.updateTest('1.1.1', status);

    if(imageList.length > 0) {
      this.logResults('1.1 - Image TEMP', imageList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('alt');
  }
}

