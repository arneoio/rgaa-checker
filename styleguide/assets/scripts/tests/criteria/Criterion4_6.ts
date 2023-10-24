import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?
 * Traite: NA, NT
 */
export default class Criterion4_6 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);
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

    this.updateCriteria('4.6', status, message);
    this.updateTest('4.6.1', status);
    this.updateTest('4.6.2', status);

    if($temporalMediaList.length > 0) {
      this.logResults('4.6 - Médias temporels', $temporalMediaList);
    }
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

