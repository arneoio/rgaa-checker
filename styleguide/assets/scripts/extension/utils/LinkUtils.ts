import ImageUtils from "./ImageUtils";

export default class LinkUtils {
  /**
   * Vérifiez si le lien a un intitulé valide en suivant l'ordre spécifié dans le RGAA
   *
   * @param   {HTMLElement}  $link  Le lien à vérifier
   *
   * @return  {string}              L'intitulé du lien
   */
  static getLinkLabel($link: HTMLElement): string {
    const ariaLabelledby = $link.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      // Si aria-labelledby est défini, on récupère le contenu de l'élément référencé
      const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
      if (describedByElement) {
        return this.getLinkLabel(describedByElement);
      }
    }

    // Sinon, si aria-label est défini, utilisez son contenu comme intitulé
    const ariaLabel = $link.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Sinon on récupère l'intitulé du lien composite en parcourant ses éléments
    const compositeLinkLabel = this.extractCompositeLinkLabel($link);
    if (compositeLinkLabel) {
      return compositeLinkLabel;
    }

    // Sinon, si l'attribut title est défini, utilisez son contenu comme intitulé
    const title = $link.getAttribute('title');
    if (title) {
      return title;
    }

    return '';
  }

  static extractCompositeLinkLabel($element: HTMLElement): string {
    const titleParts: string[] = [];

    function processElement(currentElement: Element) {
      // Vérifier si l'élément est un nœud de texte et ajouter son contenu à la liste
      if (currentElement.nodeType === Node.TEXT_NODE) {
        const textContent = currentElement.textContent?.trim();
        if (textContent) {
          titleParts.push(textContent);
        }
      } else if (ImageUtils.isImageElement(currentElement as HTMLElement)) {
        titleParts.push(ImageUtils.getImageLabel(currentElement as HTMLElement));
      } else {
        // Pour d'autres éléments, récursivement traiter les enfants
        const children = currentElement.childNodes;
        for (const child of Array.from(children)) {
          processElement(child as Element);
        }
      }
    }

    // Démarrer le traitement à partir de l'élément de lien
    processElement($element);

    // Concaténer les parties de l'intitulé dans l'ordre
    return titleParts.join(' ').trim();
  }
}
