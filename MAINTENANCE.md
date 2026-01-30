# Guide de Maintenance Technique

Ce guide explique comment maintenir le site à jour, sécurisé et performant.

## 1. Vérifier les Mises à jour Disponibles
Pour voir quelles bibliothèques (dépendances) ont de nouvelles versions, ouvrez un terminal et lancez :

```bash
# Pour le client
cd client
npm outdated

# Pour l'admin
cd ../admin
npm outdated
```

Le tableau affichera :
- **Current** : Votre version actuelle.
- **Wanted** : La version recommandée (sûre).
- **Latest** : La toute dernière version.

## 2. Mettre à jour les Dépendances
Pour mettre à jour les paquets vers la version "Wanted" (sûre) :

```bash
npm update
```

## 3. Audit de Sécurité
Pour vérifier s'il y a des failles de sécurité connues dans vos dépendances :

```bash
npm audit
```

Si des failles sont trouvées :
```bash
npm audit fix
```

## 4. Vérifier le Site en Production
Avant de déployer, simulez la version "production" sur votre machine :

```bash
npm run build
npm run preview
```
