/*
 * Criterion8_1.ts - Copyright (c) 2023-2024 - Arneo
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
 * Chaque page web est-elle définie par un type de document ?
 * Traite: C, NC
 */
export default class Criterion8_1 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'C': 'Le type de document est valide.',
      'NC': 'Le type de document n\'est pas valide.'
    }
  }

  runTest() {
    let isCriteriaValid = true;
    const htmlDocument = document.documentElement;
    let isDoctypeBeforeHtml = false;
    let isValidDoctype = false;

    // Vérifiez la présence de la balise DOCTYPE
    const hasDoctype = document.doctype !== null;
    if(!hasDoctype) {
      isCriteriaValid = false;
    } else {
      // Vérifiez que la balise DOCTYPE est placée avant la balise <html>
      isDoctypeBeforeHtml = htmlDocument.compareDocumentPosition(document.doctype) === Node.DOCUMENT_POSITION_PRECEDING;
      // Vérifiez que le type de document est valide (par exemple, <!DOCTYPE html>)
      isValidDoctype = document.doctype.name === 'html';
      if(!isDoctypeBeforeHtml || !isValidDoctype) {
        isCriteriaValid = false;
      }
    }

    this.status = isCriteriaValid ? 'C' : 'NC';
    if(!isCriteriaValid) {
      let invalidmessage = !hasDoctype ? "La balise DOCTYPE est manquante."
      : !isDoctypeBeforeHtml ? "La balise DOCTYPE n'est pas placée avant la balise <html>."
      : "Le type de document n'est pas valide.";
      this.messageList['NC'] = invalidmessage;
    }

    this.testList = {
      '1': !hasDoctype ? 'NC' : 'C',
      '2': isValidDoctype ? 'C' : 'NC',
      '3': isDoctypeBeforeHtml ? 'C' : 'NC'
    }

    return this.status;
  }
}
