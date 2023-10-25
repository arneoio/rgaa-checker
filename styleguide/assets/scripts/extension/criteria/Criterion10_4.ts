import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_4 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);

    // // Zoom dans la page à 200%
    // chrome.tabs.getZoom(function(zoomFactor) {
    //   // zoomFactor contient le facteur de zoom actuel (1.0 pour 100%)

    //   // Pour effectuer un zoom à 200% :
    //   var newZoomFactor = 2;
    //   chrome.tabs.setZoom(newZoomFactor);
    // });

    // Pour le zoom texte only: https://github.com/lihanli/chrome-text-only-zoom
  }

  runTest() {
    return 'NT';
  }
}

