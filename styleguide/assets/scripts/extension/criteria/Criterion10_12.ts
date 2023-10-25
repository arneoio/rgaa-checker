import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_12 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement) {
    super($wrapper, $highLightWrapper);

    //     // Un objet pour stocker les valeurs originales de letter-spacing.
    // const originalLetterSpacing = {};

    // // Fonction pour augmenter le letter-spacing.
    // function increaseLetterSpacing() {
    //   // Sélectionnez et parcourez les éléments textuels.
    //   textElements.forEach(element => {
    //     const currentLetterSpacing = window.getComputedStyle(element).letterSpacing;
    //     if (!isNaN(parseFloat(currentLetterSpacing))) {
    //       const letterSpacingValue = parseFloat(currentLetterSpacing);
    //       const newLetterSpacing = (letterSpacingValue * 1.5) + 'px';

    //       // Stockez la valeur d'origine avant de la modifier.
    //       originalLetterSpacing[element] = currentLetterSpacing;

    //       // Appliquez la nouvelle valeur à letter-spacing.
    //       element.style.letterSpacing = newLetterSpacing;
    //     }
    //   });
    // }

    // // Fonction pour rétablir les valeurs originales de letter-spacing.
    // function resetLetterSpacing() {
    //   // Parcourez les éléments stockés et rétablissez les valeurs d'origine.
    //   for (const element of Object.keys(originalLetterSpacing)) {
    //     element.style.letterSpacing = originalLetterSpacing[element];
    //   }

    //   // Effacez le stockage des valeurs originales.
    //   originalLetterSpacing = {};
    // }
  }

  runTest() {
    return 'NT';
  }
}

