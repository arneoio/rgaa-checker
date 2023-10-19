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
      if(describedByElement) {
        return this.getLinkLabel(describedByElement);
      }
    }

    // Sinon, si aria-label est défini, utilisez son contenu comme intitulé
    const ariaLabel = $link.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Sinon, si le texte du lien est défini, utilisez-le comme intitulé
    const linkText = $link.textContent.trim();
    if (linkText) {
      return linkText;
    }

    // Sinon, si l'attribut title est défini, utilisez son contenu comme intitulé
    const title = $link.getAttribute('title');
    if (title) {
      return title;
    }

    return '';
    // TODO: Vérifier les liens avec des images sans texte
  }
}
