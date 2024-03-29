/*
 * Criterion8_8.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion8_8 extends BaseCriterion {
  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
    this.querySelector = '*[lang]:not(html), *[xml\\:lang]:not(html)';
    this.initHighlight();
  }

  runTest() {
    let status = 'NT';
    let message = "Vérifiez si les changements de langue indiqués sont pertinents.";
    let $elementList = document.querySelectorAll(this.querySelector);

    if($elementList.length === 0) {
      status = 'NA';
      message = "Aucun changement de langue n'a été détecté.";
    } else {
      // Expression régulière pour la norme ISO 639-1 ou ISO 639-2
      const iso639Pattern = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/;

      // Vérifier si le code de langue est valide.
      Array.from($elementList).forEach(($element: HTMLElement) => {
        const langAttribute = $element.getAttribute('lang');
        const xmlLangAttribute = $element.getAttribute('xml:lang');
        let elementLanguage = langAttribute || xmlLangAttribute;

        if (!iso639Pattern.test(elementLanguage)) {
          status = 'NC';
          message = `Le code de langue <span>${elementLanguage}</span> n'est pas valide. Vérifiez le code de langue à l'aide de la <strong><a href="https://www.w3.org/International/questions/qa-choosing-language-tags" target="_blank">norme ISO 639-1 ou ISO 639-2</a></strong>.`;
        }
      });
    }

    this.updateCriteria('8.8', status, message);
    this.updateTest('8.8.1', status);

    if($elementList.length > 0) {
      this.logResults('8.8 - Liste des changements de langue', $elementList);
    }

    return status;
  }

  getHighlightLabel($element: HTMLElement) {
    return $element.getAttribute('lang') || $element.getAttribute('xml:lang');
  }
}

