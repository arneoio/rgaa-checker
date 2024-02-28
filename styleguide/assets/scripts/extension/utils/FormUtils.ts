/*
 * FormUtils.ts - Copyright (c) 2023-2024 - Arneo
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

export default class FormUtils {
  static getFormFieldQuerySelector(): string {
    return `
    input[type="text"],
    input[type="password"],
    input[type="search"],
    input[type="email"],
    input[type="number"],
    input[type="tel"],
    input[type="url"],
    textarea,
    input[type="checkbox"],
    input[type="radio"],
    input[type="date"],
    input[type="range"],
    input[type="color"],
    input[type="time"],
    input[type="month"],
    input[type="week"],
    input[type="datetime-local"],
    select,
    datalist,
    optgroup,
    option,
    input[type="file"],
    output,
    progress,
    meter,
    [role="progressbar"],
    [role="slider"],
    [role="spinbutton"],
    [role="textbox"],
    [role="listbox"],
    [role="searchbox"],
    [role="combobox"],
    [role="option"],
    [role="checkbox"],
    [role="radio"],
    [role="switch"]
  `;
  }

  static getGroupFieldQuerySelector(): string {
    return 'fieldset, [role="group"], [role="radiogroup"]';
  }

  static getButtonQuerySelector(): string {
    return 'button, input[type="button"], input[type="submit"], input[type="reset"], input[type="image"], [role="button"]';
  }

  static getFormFieldLabel($formField: HTMLElement): string {
    // On récupère l'intitulé du champ de formulaire en suivant l'ordre spécifié dans le RGAA
    // D'abord, on vérifie si aria-labelledby est défini
    const ariaLabelledby = $formField.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
      if (describedByElement) {
        return describedByElement.textContent || '';
      }
    }

    // Sinon, on vérifie si aria-label est défini
    const ariaLabel = $formField.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Sinon, on vérifie si le champ de formulaire a un label associé
    const id = $formField.getAttribute('id');
    if (id) {
      const labelElement: HTMLElement = document.querySelector(`label[for="${id}"]`);
      if (labelElement) {
        return labelElement.textContent || '';
      }
    }

    // On vérifie si le champ de formulaire est inclus dans un label
    const parentLabelElement: HTMLElement = $formField.closest('label');
    if (parentLabelElement) {
      return parentLabelElement.textContent || '';
    }

    // Sinon, on vérifie si le champ de formulaire a un titre
    const title = $formField.getAttribute('title');
    if (title) {
      return title;
    }

    // Sinon, on vérifie si le champ de formulaire a un placeholder
    const placeholder = $formField.getAttribute('placeholder');
    if (placeholder) {
      return placeholder;
    }

    return '';
  }

  static getButtonAccessibleLabel($button: HTMLElement): string {
    // On récupère l'intitulé du bouton en suivant l'ordre spécifié dans le RGAA
    // D'abord, on vérifie si aria-labelledby est défini
    const ariaLabelledby = $button.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
      if (describedByElement) {
        return describedByElement.textContent || '';
      }
    }

    // Sinon, on vérifie si aria-label est défini
    const ariaLabel = $button.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Sinon, pour les boutons de type image, on vérifie si alt est défini
    const tagName = $button.tagName.toLowerCase();
    if (tagName === 'input' && $button.getAttribute('type') === 'image') {
      const alt = $button.getAttribute('alt');
      if (alt) {
        return alt;
      }
    }

    // Sinon pour les input de type submit, reset ou button on vérifie si value est défini
    if (tagName === 'input' && ['submit', 'reset', 'button'].includes($button.getAttribute('type') || '')) {
      const value = $button.getAttribute('value');
      if (value) {
        return value;
      }
    }

    // Sinon pour un button ou role="button", on récupère le contenu textuel
    if (['button', '[role="button"]'].includes(tagName)) {
      return $button.textContent || '';
    }

    // Sinon on récupère l'attribut title
    const title = $button.getAttribute('title');
    if (title) {
      return title;
    }

    return '';
  }

  static getButtonVisibleLabel($button: HTMLElement): string {
    // On récupère l'intitulé du bouton en suivant l'ordre spécifié dans le RGAA
    const tagName = $button.tagName.toLowerCase();

    // Pour les input de type submit, reset ou button on vérifie si value est défini
    if (tagName === 'input' && ['submit', 'reset', 'button'].includes($button.getAttribute('type') || '')) {
      const value = $button.getAttribute('value');
      if (value) {
        return value;
      }
    }

    // Sinon pour un button ou role="button", on récupère le contenu textuel
    if (['button', '[role="button"]'].includes(tagName)) {
      return $button.textContent || '';
    }

    return '';
  }
}
