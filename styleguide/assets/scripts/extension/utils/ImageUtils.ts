import LinkUtils from "./LinkUtils";

export default class ImageUtils {
  static isImageElement($image: HTMLElement): boolean {
    // vérifie qu'on a <img>, [role="img"], <area>, <input type="image">, <object type="image/…">, <svg>, <canvas> ou <embed type="images/…">
    const tagName = $image.tagName.toLowerCase();
    if (['img', 'svg', 'canvas'].includes(tagName)
      || (tagName === 'area' && $image.getAttribute('href'))
      || (tagName === 'input' && $image.getAttribute('type') === 'image')
      || (tagName === 'object' && $image.getAttribute('type')?.startsWith('image/'))
      || (tagName === 'embed' && $image.getAttribute('type')?.startsWith('image/'))) {
      return true;
    }

    return false;
  }

  static hasImageLabel($image: HTMLElement): boolean {
    if (!ImageUtils.isImageElement($image)) {
      return false;
    }

    const tagName = $image.tagName.toLowerCase();

    // On vérifie si aria-labelledby est défini pour <img>, [role="img"], <input type="image">, <object type="image/…">, <svg>, <canvas> ou <embed type="images/…">
    if (tagName !== 'area') {
      const ariaLabelledby = $image.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        // Si aria-labelledby est défini, on vérifie que l'élément référencé existe
        const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
        if (describedByElement) {
          return true;
        }
      }
    }

    // Sinon on vérifie si aria-label est défini
    const ariaLabel = $image.getAttribute('aria-label');
    if (ariaLabel) {
      return true;
    }

    // Sinon on vérifie si alt est défini pour img, area ou input
    if (['img', 'area', 'input'].includes(tagName)) {
      const alt = $image.getAttribute('alt');
      if (alt) {
        return true;
      }
    }

    // Sinon on vérifie si title est défini pour img, input, object, embed
    if (['img', 'input', 'object', 'embed'].includes(tagName)) {
      const title = $image.getAttribute('title');
      if (title) {
        return true;
      }
    }

    return false;
  }

  static getImageLabel($image: HTMLElement): string {
    if (!ImageUtils.isImageElement($image)) {
      return '';
    }

    const tagName = $image.tagName.toLowerCase();

    // On prend aria-labelledby si défini pour <img>, [role="img"], <input type="image">, <object type="image/…">, <svg>, <canvas> ou <embed type="images/…">
    if (tagName !== 'area') {
      const ariaLabelledby = $image.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        // Si aria-labelledby est défini, on récupère le contenu de l'élément référencé
        const describedByElement: HTMLElement = document.getElementById(ariaLabelledby);
        if (describedByElement) {
          return LinkUtils.getLinkLabel(describedByElement);
        }
      }
    }

    // Sinon on prend le aria-label
    const ariaLabel = $image.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Sinon on prend le alt pour img, area ou input
    if (['img', 'area', 'input'].includes(tagName)) {
      const alt = $image.getAttribute('alt');
      if (alt) {
        return alt;
      }
    }

    // Sinon on prend le title pour img, input, object, embed
    if (['img', 'input', 'object', 'embed'].includes(tagName)) {
      const title = $image.getAttribute('title');
      if (title) {
        return title;
      }
    }

    return '';
  }
}
