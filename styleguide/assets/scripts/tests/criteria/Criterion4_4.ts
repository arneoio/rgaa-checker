import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?
 * Traite: NA, NT
 */
export default class Criterion4_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement) {
    super($wrapper);
    this.querySelector = `audio, video, object, svg, canvas, [type='application/x-shockwave-flash'], bgsound`;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun média temporel.";

    let $temporalMediaList = MediaUtils.getTemporalMediaList();
    if($temporalMediaList.length) {
      status = 'NT';
      message = "Des médias temporels sont présents.";
    }

    this.updateCriteria('4.4', status, message);
    this.updateTest('4.4.1', status);

    if($temporalMediaList.length > 0) {
      this.logResults('4.4 - Médias temporels', $temporalMediaList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

