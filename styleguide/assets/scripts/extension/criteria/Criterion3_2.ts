/*
 * Criterion3_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?
 * Traite: C, NC
 */
export default class Criterion2_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'C': 'Le contraste entre la couleur du texte et la couleur de son arrière-plan est suffisamment élevé pour tous les éléments textuels.',
      'NC': 'Le contraste entre la couleur du texte et la couleur de son arrière-plan n\'est pas suffisamment élevé pour tous les éléments textuels.'
    }
  }

  runTest() {
    this.status = 'NA';

    return this.status;
  }
}

