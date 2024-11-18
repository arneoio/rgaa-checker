/*
 * Criterion13_3.ts - Copyright (c) 2023-2024 - Arneo
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
import LinkUtils from '../utils/LinkUtils';

/**
 * Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible (hors cas particuliers) ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion13_3 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
    this.messageList = {
      'NT': "Aucun document bureautique téléchargeable détecté. Vérifiez si la page n'en contiendrait pas."
    };
  }

  getHighlightedElements(): Array<HTMLElement> {
    return LinkUtils.getDownloadableDocumentList();
  }

  runTest() {
    let $downloadableLinkList = LinkUtils.getDownloadableDocumentList();

    if ($downloadableLinkList.length > 0) {
    this.messageList['NT'] = "Des documents bureautiques téléchargeables ont été détectés. Vérifiez si chacun d'eux possède une version accessible.";
    }

    this.testList = {
      '1': this.status
    };

    return this.status;
  }
}
