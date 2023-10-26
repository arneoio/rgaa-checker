export default class TableUtils {
  static getComplexTableList(): Array<HTMLElement> {
    const complexTableList: Array<HTMLElement> = [];
    const $tableList = document.querySelectorAll('table');

    $tableList.forEach(($table) => {
      const rows = $table.rows;

      // Vérifier les en-têtes de colonne dans la première ligne
      const headerCells = rows[0].cells;
      const isComplexColumnHeaders = headerCells.length > 1;

      // Vérifier les en-têtes de ligne dans la première colonne
      let isComplexRowHeaders = false;
      for (let i = 1; i < rows.length; ++i) {
        const cell = rows[i].cells[0];
        if (cell.hasAttribute('rowspan') || cell.hasAttribute('colspan')) {
          isComplexRowHeaders = true;
          break;
        }
      }

      if (isComplexColumnHeaders || isComplexRowHeaders) {
        complexTableList.push($table);
      }
    });

    // Le tableau est complexe si les en-têtes sont répartis de manière inhabituelle
    // ou si leur portée n'est pas correcte
    return complexTableList;
  }

  static getComplexTableDescription($table: HTMLTableElement): string {
    // Vérifier si un élément <caption> existe et a du texte
    const captionElement = $table.querySelector('caption');
    if (captionElement && captionElement.textContent.trim() !== '') {
      return captionElement.textContent.trim();
    }

    // Vérifier si l'attribut "summary" est défini (HTML/XHTML antérieurs à HTML5)
    const summaryAttribute = $table.getAttribute('summary');
    if (summaryAttribute && summaryAttribute.trim() !== '') {
      return summaryAttribute.trim();
    }

    // Vérifier si l'attribut "aria-describedby" est défini et lié à un élément avec du texte
    const ariaDescribedByAttribute = $table.getAttribute('aria-describedby');
    if (ariaDescribedByAttribute) {
      const describedByElement = document.getElementById(ariaDescribedByAttribute);
      if (describedByElement && describedByElement.textContent.trim() !== '') {
        return describedByElement.textContent.trim();
      }
    }

    return '';
  }

  static getTableDescription($table: HTMLTableElement): string {
    // Vérifier si un élément <caption> existe et a du texte
    const captionElement = $table.querySelector('caption');
    if (captionElement && captionElement.textContent.trim() !== '') {
      return captionElement.textContent.trim();
    }

    // Vérifier si l'attribut "title" est défini
    const titleAttribute = $table.getAttribute('title');
    if (titleAttribute && titleAttribute.trim() !== '') {
      return titleAttribute.trim();
    }

    // Vérifier si l'attribut "aria-label" est défini
    const ariaLabelAttribute = $table.getAttribute('aria-label');
    if (ariaLabelAttribute && ariaLabelAttribute.trim() !== '') {
      return ariaLabelAttribute.trim();
    }

    // Vérifier si l'attribut "aria-describedby" est défini et lié à un élément avec du texte
    const ariaDescribedByAttribute = $table.getAttribute('aria-describedby');
    if (ariaDescribedByAttribute) {
      const describedByElement = document.getElementById(ariaDescribedByAttribute);
      if (describedByElement && describedByElement.textContent.trim() !== '') {
        return describedByElement.textContent.trim();
      }
    }
  }
}
