/*
 * Criterion10_12.ts - Copyright (c) 2023-2024 - Arneo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BaseCriterion from '../common/BaseCriterion';

/**
 * Dans chaque page web, chaque citation est-elle correctement indiquée ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_12 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);

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

