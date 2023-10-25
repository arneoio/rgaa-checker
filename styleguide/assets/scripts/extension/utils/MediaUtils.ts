export default class MediaUtils {
  static getTemporalMediaList(): Array<HTMLElement> {
    const temporalMediaList: Array<HTMLElement> = [];
    const $mediaList = document.querySelectorAll(`audio, video, object, svg, canvas, [type="application/x-shockwave-flash"], bgsound`);

    $mediaList.forEach(($media: HTMLElement) => {
      // Pour les SVG on vérifie que l'élément est bien un média temporel
      if($media.getAttribute('aria-hidden') === 'true') {
        return;
      }

      if($media.tagName === 'svg') {
        const svgAnimations = $media.querySelectorAll("animate, animateTransform, animateMotion");

        if (svgAnimations.length === 0) {
          // L'élément SVG ne contient pas d'animations
          return;
        }
      }

      // On vérifie que l'élément object est bien un média temporel
      if($media.tagName === 'object') {
        const $embed = $media.querySelector('embed');
        if(!$embed) {
          return;
        }
      }

      // On vérifie que l'élément canvas est bien un média temporel
      if($media.tagName === 'canvas') {
        const context = ($media as HTMLCanvasElement).getContext('2d');

        // teste si on a une méthode animate ou requestAnimationFrame sur le contexte
        if (context && ('animationFrame' in context ||'requestAnimationFrame' in context)) {
          return;
        }
      }

      temporalMediaList.push($media);
    });

    // ou si leur portée n'est pas correcte
    return temporalMediaList;
  }
}
