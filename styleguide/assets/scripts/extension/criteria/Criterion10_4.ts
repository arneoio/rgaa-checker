import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_4 extends BaseCriterion {
  zoomFactor: number = 1;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.initHighlight();
  }

  getHighlightText() {
    return "Zoomer le texte à 200%";
  }

  activateHighlight(): void {
    // Zoom dans la page à 200%
    // chrome.tabs.getZoom(function (zoomFactor: number) {
    //   this.zoomFactor = zoomFactor;
    //   // Pour effectuer un zoom à 200% :
    //   chrome.tabs.setZoom(2);
    // });
  }

  resetHighlight(): void {
    // let chrome = window.chrome as any;
    // // Zoom dans la page à 200%
    // chrome.tabs.getZoom(function () {
    //   // Pour effectuer un zoom à 200% :
    //   chrome.tabs.setZoom(this.zoomFactor);
    // });
  }

  runTest() {
    return 'NT';
  }
}

