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

  static getFormFieldLabel($formField: HTMLElement): string {
    // On récupère l'intitulé du champ de formulaire en suivant l'ordre spécifié dans le RGAA
    // D'abord, on vérifie si aria-labelledby est défini
    const ariaLabelledby = $formField.getAttribute('aria-labelledby');
    if(ariaLabelledby) {
      const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
      if(describedByElement) {
        return describedByElement.textContent || '';
      }
    }

    // Sinon, on vérifie si aria-label est défini
    const ariaLabel = $formField.getAttribute('aria-label');
    if(ariaLabel) {
      return ariaLabel;
    }

    // Sinon, on vérifie si le champ de formulaire a un label associé
    const id = $formField.getAttribute('id');
    if(id) {
      const labelElement: HTMLElement = document.querySelector(`label[for="${id}"]`);
      if(labelElement) {
        return labelElement.textContent || '';
      }
    }

    // On vérifie si le champ de formulaire est inclus dans un label
    const parentLabelElement: HTMLElement = $formField.closest('label');
    if(parentLabelElement) {
      return parentLabelElement.textContent || '';
    }

    // Sinon, on vérifie si le champ de formulaire a un titre
    const title = $formField.getAttribute('title');
    if(title) {
      return title;
    }

    // Sinon, on vérifie si le champ de formulaire a un placeholder
    const placeholder = $formField.getAttribute('placeholder');
    if(placeholder) {
      return placeholder;
    }

    return '';
  }
}
