# Prérequis

  - Node 18+

# Installation

```bash
yarn install
yarn build
```

## Front

```bash
yarn dev
```

Les assets sont dans le dossier `styleguide/assets/`.

Les éléments du styleguide sont dans le dossier `styleguide/`.

## Génération de l'extension

Pour générer juste l'extension, il faut lancer la commande suivante :

```bash
yarn buildChrome
yarn buildFirefox
```

# Installation dans le navigateur

## Chrome

  - Aller dans `chrome://extensions/`
  - Activer le mode développeur
  - Charger l'extension non empaquetée
  - Sélectionner le dossier `dist/chrome`

![chrome installation](doc/install-chrome.png)

## Firefox

  - Aller dans `about:debugging#/runtime/this-firefox`
  - Charger un module temporaire
  - Sélectionner le fichier `dist/firefox/manifest.json`

![firefox installation](doc/install-firefox.png)
