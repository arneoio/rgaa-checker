import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription (hors cas particuliers) ?
 * Traite: NA, NT
 */
export default class Criterion4_1 extends BaseCriterion {
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
      message = "Des médias temporels sont présents. Vérifier qu'ils sont correctement transcrits ou décrits.";
    }

    this.updateCriteria('4.1', status, message);
    this.updateTest('4.1.1', status);
    this.updateTest('4.1.2', status);
    this.updateTest('4.1.3', status);

    if ($temporalMediaList.length > 0) {
      this.logResults('4.1 - Médias temporels', $temporalMediaList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}

