import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?
 * Traite: NA, NT
 */
export default class Criterion4_7 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = `audio, video, object, svg, canvas, [type='application/x-shockwave-flash'], bgsound`;
  }

  runTest() {
    let status = 'NA';
    let message = "Aucun média temporel.";

    let $temporalMediaList = MediaUtils.getTemporalMediaList();
    if ($temporalMediaList.length) {
      status = 'NT';
      message = "Des médias temporels sont présents.";
    }

    this.updateCriteria('4.7', status, message);
    this.updateTest('4.7.1', status);
    this.updateTest('4.7.2', status);

    if ($temporalMediaList.length > 0) {
      this.logResults('4.7 - Médias temporels', $temporalMediaList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

