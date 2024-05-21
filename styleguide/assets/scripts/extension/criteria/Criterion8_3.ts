/*
 * Criterion8_3.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, la langue par défaut est-elle présente ?
 * Traite: C, NC
 */
export default class Criterion8_3 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'C': 'La langue par défaut est présente.',
      'NC': 'La langue par défaut n\'est pas présente.'
    }
  }

  runTest() {
    let isCriteriaValid = true;

    const htmlElement = document.documentElement;
    const langAttribute = htmlElement.getAttribute('lang');
    const xmlLangAttribute = htmlElement.getAttribute('xml:lang');

    // L'indication de la langue de la page (attribut lang et/ou xml:lang) est donnée pour l'élément html.
    if (langAttribute || xmlLangAttribute) {
      isCriteriaValid = true;
    } else {
      // L'indication de la langue de la page (attribut lang et/ou xml:lang) est donnée sur chaque élément de texte ou sur l'un des éléments parents.
      const textElements = document.querySelectorAll('p, span, div'); // Sélectionnez les éléments de texte pertinents
      let isLanguageDefinedForAllTextElements = true;

      textElements.forEach((element) => {
        const langAttribute = element.getAttribute('lang');
        const xmlLangAttribute = element.getAttribute('xml:lang');

        if (!langAttribute && !xmlLangAttribute) {
          isLanguageDefinedForAllTextElements = false;
        }
      });

      isCriteriaValid = isLanguageDefinedForAllTextElements;
    }

    this.status = isCriteriaValid ? 'C' : 'NC';

    this.testList = {
      '1': this.status
    }

    return this.status;
  }
}
