# Documentation Technique de l'Extension RGAA Checker

## 1. Introduction

Cette extension permet de vérifier la conformité aux critères RGAA (Référentiel Général d'Accessibilité pour les Administrations). Elle utilise un panel dans les outils de développement du navigateur pour analyser et afficher les résultats de l'accessibilité.

## 2. Architecture du Projet

### 2.1. Composants principaux

L'extension est composée de plusieurs parties. Chaque template est appliqué à une zone spécifique de l'extension.
Les templates sont placés dans le styleguide en twig et sont compilés en html pour l'extension.

Dans le dossier **styleguide/components/templates** on trouve:

- **popup** : Ce template correspond à la popup de l'extension qui va s'afficher en cliquant sur l'icône de l'extension. Elle indique juste d'ouvrir les outils de développement pour accéder à l'extension. (popup.html, ce qui ne peut pas être fait automatiquement)
- **devtools** : Ce template est celui appelé par le manifest.json pour afficher l'extension dans les outils de développement. Il contient uniquement le chargement du script de devtools_chrome.js ou devtools_firefox.js qui va charger le panel.
- **panel** : Ce template correspond à l'onglet RGAA Checker dans les outils de développement du navigateur.
- **synthesis** : Un template dans le devtools permettant d'afficher les résultats des tests RGAA.

### 2. Communication entre les Composants

1. **DevTools Panel** envoie des messages au **Background Script**.
2. **Background Script** interagit avec le **Content Script** qui va analyser la page.
3. Les résultats sont renvoyés au **Background Script** puis au **DevTools Panel** pour affichage.

Les messages sont préfixés par `devtools_`, `background_` ou `content_` pour indiquer l'origine du message.

### 2.1. Lancement des Tests

Les tests sont lancés depuis le panel **DevTools** ou par une interaction avec la page. Le **Content Script** analyse la page et vérifie les critères RGAA.

### 2.2. Structure des Résultats

Les résultats des tests sont envoyés sous forme de JSON. Chaque critère est testé et ses résultats sont stockés avec les informations associées.
Chaque critère est identifié par sa thématique et numéro de critère dans la thématique.

```json
{
  "4.2": {
    "topicNumber": 4,
    "criteriaNumber": 2,
    "highlightSwitchLabel": "Highlight",
    "messageList": {
      "NT": "Toutes les images de la page ont une alternative t…ici toutes les images sans alternative textuelle.",
      "NC": "Toutes les images de la page n'ont pas d'alternati…ici toutes les images sans alternative textuelle.",
      "NA": "Aucune image n'a été trouvée dans la page./!\\ En l…ici toutes les images sans alternative textuelle."
    },
    "status": "NT",
    "testList": { "1": "NT", "2": "NA" }
  }
}
```

- Si le critère permet de mettre en évidence des éléments ou autre action, le label de l'action est stocké dans `highlightSwitchLabel`.
- Les messages pour chaque statut sont stockés dans `messageList`. ça permet de changer dynamiquement le message affiché en fonction du statut du critère quand l'utilisateur le change.
- Le statut vérifié du critère est stocké dans `status`.
- Les résultats des chacun des tests sont stockés dans `testList`, ce qui permet d'avoir une vision lpus fine de ce qui a fonctionné ou non dans les tests effectués.

### 3 Vérification des critères dans le content

Tout ce qui concerne les critères est exécuté deuis le content script dans **components/content.ts**. Tout le moteur d'exécution des tests est dans **assets/scripts/extension**.

Le script **AccessibilityTest.ts** va inclure chaque critère individuellement et les exécuter sur la page. Il va ensuite renvoyer les résultats au background script.

## 3.1 fonctionnement des critères d'automatisation et simplification

Chaque critère va définir plusieurs propriétés qui seront renvoyées au devtools ensuite.
Les critères étendent une interface `ICriterion` qui définit les propriétés et méthodes à implémenter pour chaque critère. Cette interface est implémentée par la classe `BaseCriterion` qui contient les méthodes communes à tous les critères ainsi que les méthodes pour communiquer avec le background.

`AccessibilityTester` est le fichier qui va interagir dans la page visitée (Appliquer le highlight dans un canvas, etc.) et va appeler les méthodes des critères pour les exécuter.

### 3.1.1 Propriétés des critères

- `messageList`: Les messages pour chaque statut du critère.
- `testList`: La liste des résultats pour chaque test du critère.
- `querySelector`: Les sélecteurs css pour récupérer les éléments à mettre en avant pour le critère.
- `status`: Le statut du critère.

### 3.1.2 Méthodes des critères

- `getHighlightListContent`: une méthode qui va renvoyer le contenu à afficher dans le highlight pour le critère.
- `getHighlightedElements`: une méthode qui va renvoyer les éléments mis en avant pour le critère. Par défaut, elle renvoie les éléments récupérés par la propriété `querySelector` du critère.
- `getHighlightSwitchLabel`: une méthode qui va renvoyer le libellé du bouton de highlight pour le critère, par défaut "Highlight".
- `runTest`: une méthode qui va exécuter les tests du critère et renvoyer les résultats en définissant les propriétés `testList` et `status`.
- `activateHighlight`: une méthode qui va activer le highlight pour le critère. Par défaut ça sera mettre en avant les éléments récupérés par la propriété `querySelector` du critère, mais on peut faire le traitement souhaité pour chaque critère (désactiver les styles css, etc.)
- `resetHighlight`: une méthode qui va désactiver le highlight pour le critère en faisant l'opération inverse si nécessaire (réactiver les styles css)

## 4 Génération de l'extension

Le dossier **generation** contient:

- un dossier **data** avec les données json des critères récupérées sur (https://github.com/DISIC/accessibilite.numerique.gouv.fr/blob/main/RGAA/criteres.json)[le repository RGAA du DISIC].
- un index.mjs qui permet de récupérer et formatter les données des critères pour les templates
- un template.mjs qui récupère les templates twig du styleguide et les compile en html avec les données des critères.
- un dossier utils pour l'affichage des informations en console et pour zipper les fichiers générés.

La génération de l'extension est fait en exécutant la commande `node generation/index.mjs [engine]` qui va générer les fichiers html dans le dossier **dist** pour chrome ou firefox suivant le paramètre engine. Dans le dossier **dist** on trouve les fichiers html générés pour l'extension dans des dossiers pour **chrome** et **firefox**.
