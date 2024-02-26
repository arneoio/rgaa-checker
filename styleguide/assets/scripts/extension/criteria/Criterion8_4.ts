/**
Copyright 2024 - Arneo.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import BaseCriterion from '../common/BaseCriterion';

/**
 * Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?
 * Traite: NC, NA, NT (validation manuelle)
 */
export default class Criterion8_4 extends BaseCriterion {
  apiKey: string;

  constructor($wrapper: HTMLElement, $highLightWrapper: HTMLElement, isTestMode: boolean = false) {
    super($wrapper, $highLightWrapper, isTestMode);
  }

  runTest() {
    let documentLanguage = '';
    let status = 'NT';
    let message = "Aucune langue par défaut n\'est définie, le critère n'est pas applicable.";

    const htmlElement = document.documentElement;
    const langAttribute = htmlElement.getAttribute('lang');
    const xmlLangAttribute = htmlElement.getAttribute('xml:lang');

    // Le code de langue est valide.
    // Le code de langue est pertinent.
    if (langAttribute || xmlLangAttribute) {
      documentLanguage = langAttribute || xmlLangAttribute;
      message = `Langue du document: <span>${documentLanguage}</span>.`;

      // Expression régulière pour la norme ISO 639-1 ou ISO 639-2
      const iso639Pattern = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/;

      if (!iso639Pattern.test(documentLanguage)) {
        status = 'NC';
        message = `Le code de langue <span>${documentLanguage}</span> n'est pas valide. Vérifiez le code de langue à l'aide de la <strong><a href="https://www.w3.org/International/questions/qa-choosing-language-tags" target="_blank">norme ISO 639-1 ou ISO 639-2</a></strong>.`;
      }
    } else {
      // Langue absente = critère non applicable, le 8.3 est déjà en NC
      status = 'NA';
    }

    this.updateCriteria('8.4', status, message);
    this.updateTest('8.4.1', status);

    return status;
  }
}
