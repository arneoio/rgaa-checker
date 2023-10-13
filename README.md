# Prérequis

- Node 16+

# Installation

Copier le fichier `.env.dist` en `.env` pour avoir les bons chemins du styleguide au build de webpabk et fractal.

```bash
cp .env.dist .env
```

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
yarn buildExtension
```

Pour créer un zip également:

```bash
yarn buildExtension
```
