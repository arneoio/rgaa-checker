import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?
 * Traite: NA, NT
 */
export default class Criterion4_2 extends BaseCriterion {
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
      message = "Des médias temporels sont présents. Vérifier si leur transcription ou décription sont pertinentes.";
    }

    this.updateCriteria('4.2', status, message);
    this.updateTest('4.2.1', status);
    this.updateTest('4.2.2', status);
    this.updateTest('4.2.3', status);

    if ($temporalMediaList.length > 0) {
      this.logResults('4.2 - Médias temporels', $temporalMediaList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

