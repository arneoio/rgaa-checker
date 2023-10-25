import BaseCriterion from '../common/BaseCriterion';
import MediaUtils from '../utils/MediaUtils';

/**
 * Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?
 * Traite: NA, NT
 */
export default class Criterion4_3 extends BaseCriterion {
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

    this.updateCriteria('4.3', status, message);
    this.updateTest('4.3.1', status);
    this.updateTest('4.3.2', status);

    if($temporalMediaList.length > 0) {
      this.logResults('4.3 - Médias temporels', $temporalMediaList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.tagName;
  }
}
