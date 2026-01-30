---
description: Guide de maintenance technique du site (Mise à jour, Sécurité, Build)
---

# Guide de Maintenance Technique

Ce guide explique comment maintenir le site à jour, sécurisé et performant. Ces commandes doivent être exécutées dans le terminal (Visual Studio Code).

## 1. Vérifier les Mises à jour Disponibles
Pour voir quelles bibliothèques (dépendances) ont de nouvelles versions :

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
- **Latest** : La toute dernière version (peut contenir des changements majeurs).

## 2. Mettre à jour les Dépendances
Pour mettre à jour les paquets vers la version "Wanted" (sûre) :

```bash
npm update
```

Pour forcer la mise à jour vers la toute dernière version "Latest" (attention aux bugs potentiels) :
```bash
npm install [nom-du-paquet]@latest
```

## 3. Audit de Sécurité
Pour vérifier s'il y a des failles de sécurité connues dans vos dépendances :

```bash
npm audit
```

Si des failles sont trouvées, tentez de les corriger automatiquement :
```bash
npm audit fix
```

## 4. Vérifier le Site en Production
Avant de déployer, il est bon de simuler la version "production" sur votre machine pour vérifier que tout fonctionne (comme la suppression des logs) :

```bash
npm run build
npm run preview
```

## 5. Bonnes Pratiques
- **Sauvegardez toujours** (`git commit`) avant de lancer une grosse mise à jour.
- Faites les mises à jour **une fois par mois** environ.
- Ne mettez pas à jour `react` ou `vite` sans vérifier la compatibilité majeure.
