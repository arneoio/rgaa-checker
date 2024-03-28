/*
 * Criterion10_2.ts - Copyright (c) 2023-2024 - Arneo
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
 * Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ?
 * Traite: NT (validation manuelle)
 */
export default class Criterion10_2 extends BaseCriterion {
  constructor(isTestMode: boolean = false) {
    super(isTestMode);
  }

  resetHighlight(): void {
    // Réactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = false;
    });
  }

  activateHighlight(): void {
    // Désactive toutes les feuilles de style
    const stylesheetList = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheetList.forEach((stylesheet: HTMLLinkElement) => {
      stylesheet.disabled = true;
    });
  }

  getHighlightSwitchLabel() {
    return "Switch les styles";
  }

  runTest() {
    this.status = 'NT';
    let message = "Désactivez les feuilles de styles pour vérifier que le contenu reste lisible et utilisable.";

    this.updateCriteria('10.2', status, message);
    this.updateTest('10.2.1', status);

    return this.status;
  }
}

