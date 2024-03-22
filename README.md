# RGAA Checker

## Description

Accélérez et simplifiez vos audits d'accessibilité RGAA directement dans votre navigateur !

Conçue pour les auditeurs, développeurs et tous les acteurs du web soucieux de l'accessibilité, cette extension disponible pour les navigateurs Chrome et Firefox automatise la vérification des critères d'accessibilité RGAA, vous offrant un gain de temps significatif et une analyse précise.

Le [RGAA](https://fr.wikipedia.org/wiki/R%C3%A9f%C3%A9rentiel_g%C3%A9n%C3%A9ral_d%27am%C3%A9lioration_de_l%27accessibilit%C3%A9), aligné sur les normes [WCAG](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines), vise à assurer l'accessibilité numérique pour les personnes handicapées, ciblant les services publics et les grandes entreprises en France avec un CA supérieur à 250 millions d'euros, pour un internet plus inclusif.

Pour plus de détails, veuillez consulter le [site officiel du RGAA](https://accessibilite.numerique.gouv.fr/).

## Fonctionnalités clés

L'extension teste actuellement 48 critères complets sur un total de 106. Certains critères restants sont soit partiellement intégrables, soit non testable automatiquement (environ 33). L'objectif à terme est d'atteindre un périmètre de 73 critères complets sur un total de 106.

- Analyse automatisée : Évaluez automatiquement une sélection de critères RGAA, respectant scrupuleusement les critères et tests du RGAA
- Analyse simplifiée : Pour les critères ne pouvant être automatisés, mettez en avant dans la page les éléments impactés pour les vérifier facilement sans en oublier
- Rapports détaillés : Visualisez les résultats directement dans votre navigateur, avec la possibilité de filtrer, consulter, et comprendre chaque problème d'accessibilité identifié.
- Validation des critères : Grâce à la liste complète des critères à jour avec des raccourcis par thématique, vous pouvez valider ou invalider les critères. vos choix sont sauvegardés si vous revenez plus tard sur la page.
- Export vers la grille : En un clic vous pouvez exporter les résultats de chaque page pour remplir les grilles d'audit officielles du RGAA
- Compatibilité étendue : Fonctionne sur toutes les pages web, y compris les intranets, les pages protégées par mot de passe, et les contenus dynamiquement générés.

Que vous travailliez sur des sites en développement ou que vous souhaitiez évaluer l'accessibilité de sites existants, notre extension est l'outil idéal pour intégrer les meilleures pratiques d'accessibilité dans votre workflow. Rejoignez-nous dans notre mission pour un web plus accessible à tous.

## Fonctionnalités à venir

- Afficher la liste des éléments mis en avant pour chaque critère dans la page
- Afficher la différence trouvée entre 2 chargements de page
- Permettre la configuration d'options pour l'extension
- Automatiser la vérification de plus de critères
- Internationalisation

## Critères gérés

| Critère |  C  | NC  | NA  | Assistance | Commentaire                                                                                                            |
| :------ | :-: | :-: | :-: | :--------: | :--------------------------------------------------------------------------------------------------------------------- |
| 1.1     |     |     |     |            | /!\ Récupération des images sans texte alternatif. Partiellement implémenté, ne distingue pas les images de décoration |
| 2.1     | ✅  | ✅  | ✅  |            |                                                                                                                        |
| 2.2     |     |     | ✅  |     ✅     | Liste les cadres et leur titre dans la console                                                                         |
| 4.1     |     |     | ✅  |            | Pour la partie multimédia, vérifie juste s'il y en a dans la page                                                      |
| 4.2     |     |     | ✅  |            |                                                                                                                        |
| 4.3     |     |     | ✅  |            |                                                                                                                        |
| 4.4     |     |     | ✅  |            |                                                                                                                        |
| 4.5     |     |     | ✅  |            |                                                                                                                        |
| 4.6     |     |     | ✅  |            |                                                                                                                        |
| 4.7     |     |     | ✅  |            |                                                                                                                        |
| 5.1     | ✅  | ✅  | ✅  |            |                                                                                                                        |
| 5.2     |     |     | ✅  |     ✅     | Trouve les tableaux complexe et les liste dans la console.                                                             |
| 5.3     |     |     | ✅  |            |                                                                                                                        |

## Installation

Installation depuis les sources :

- [INSTALL.md](INSTALL.md)

Installation depuis les magasins d'extensions de Chrome et Firefox :

- Bientôt disponible !

## Documentation

- [MANUAL.md](MANUAL.md)

## Des questions ? Des problèmes ? Des suggestions ?

Pour signaler un bug ou proposer une fonctionnalité, créez un [rapport d'anomalie sur GitHub](https://github.com/arneoio/rgaa-checker/issues) en veillant à vous assurer que quelqu'un d'autre n'a pas déjà créé un rapport sur le même sujet.

## Liens

- [Arneo](https://www.arneo.io)
- [Site officiel du RGAA](https://accessibilite.numerique.gouv.fr/)
