# Image

## Éviter le décalage de contenu au chargement

Pour que le chargement d'une image ne décale pas tout le contenu en dessous d'elle, utiliser la molécule **image-wrapper** dans la majorité des cas plutôt que l'atome image seul

## Lazyload

Il est important d'ajouter du lazy load sur un maximum d'images pour accélérer grandement le chargement des pages.

Pour le lazy-load, on charge un attribut src par défaut afin d'éviter une erreur de validation du HTML avec une balise <img /> sans attribut *src*.

Si on met un *src* vide, il chargera la page courante, ce qui ralentira le chargement de la page. On met donc par défaut un png vide encodé en base 64.
Si une page contient beaucoup d'images, il pourra être plus intéressant de charger le png vide sur une ressource externe pour consommer moins de bande passante sur le fichier html, mais généralement l'exécution d'une requête http sera plus coûteuse que charger l'image en base 64 plusieurs fois dans la page. Avec des fichiers html gzippés, c'est d'autant plus vrai.

Vous pouvez également remplacer le png vide par une image de placeholder qui sera utilisé sur le site, avec une couleur unie et le logo par exemple, ce qui peut avoir un effet sympa visuellement si les images mettent trop longtemps à charger.

Les images présentes en haut de page au dessus de la ligne de flottaison peuvent être appelées sans lazyload pour être affichées plus rapidement dès le chargement de la page.

La librairie recommandée pour le lazyload est lozad: https://www.npmjs.com/package/lozad.

## Noscript

On peut ajouter une version *noscript* de l'image sans lazyload, au cas où le JS soit désactivé. D'après [plusieurs sources](https://blog.dareboost.com/fr/2019/03/lazy-loading-des-pages-web-plus-rapides-sans-risque-seo/), ça peut servir à un meilleur référencement des images, car le robot de Google n'active pas le JS au premier passage sur une page apparemment. A ajouter au cas où le référencement de certaines images soit important.

## Accessibilité

Toute image doit avoir un attribut alt. En cas d'absence, les lecteurs d'écrans liront le chemin de l'image. Si une image contient de texte porteur de sens, il faut le décrire. Si l'image est décorative, ce qui est généralement le cas, il faut le laisser vide.

Par exemple une erreur qu'on voit souvent, c'est de remettre le titre d'un article en texte alternatif de l'image d'accompagnement, mais ça duplique l'information, notamment pour les lecteurs d'écran. Il faut le laisser vide une grande majorité du temps, à moins que l'image ne soit porteuse d'information essentielle à la compréhension de la page ou ne contienne elle-même un texte.
