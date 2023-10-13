# Icônes

Dans les bonnes pratiques, on préfixe dans la config webpack les icones par *i-*. Cela permet de limiter le risque de conflit entre l'id utilisé pour un icone et tout autre élément du site.

```js
symbolId: (filePath) => 'i-' + path.basename(filePath, '.svg'),
```

Le template est prévu pour ajouter le *i-* devant le nom automatiquement.
