# Guide d'utilisation - Suivi de Conversion Google Ads

J'ai intégré le suivi de conversion Google Ads dans votre application. Voici comment finaliser la configuration de votre côté.

## Ce qui a été implémenté

Les événements de conversion sont désormais déclenchés automatiquement lors des actions suivantes :

1.  **Formulaire de Contact** : Déclenché après l'envoi réussi d'un message.
2.  **Simulateur de Crédit** : Déclenché lorsqu'un prospect demande à recevoir sa simulation par email.
3.  **Inscription** : Déclenché à la création d'un nouveau compte (Personnel ou Professionnel).
4.  **Demande de Crédit** : Déclenché à la validation finale du formulaire de demande (Desktop et Mobile).

## Comment configurer Google Ads

Comme nous n'avons pas utilisé de "Conversion Labels" spécifiques, vous devez configurer vos conversions dans l'interface Google Ads en utilisant les **noms d'événements** envoyés par le code.

### 1. Créer une action de conversion
Dans votre compte Google Ads :
1.  Allez dans **Objectifs** > **Conversions** > **Récapitulatif**.
2.  Cliquez sur **+ Nouvelle action de conversion**.
3.  Choisissez **Site Web**.
4.  Entrez l'URL de votre site et scannez-le.
5.  Ajoutez une action de conversion **manuellement** en utilisant le code.

### 2. Paramétrage technique (si nécessaire)
Si vous souhaitez utiliser des labels spécifiques plus tard, il vous suffira de remplacer le code générique que j'ai mis :

```javascript
// Code actuel dans les fichiers
window.gtag('event', 'conversion', {
    'send_to': 'AW-17959732906',
    // 'send_to': 'AW-17959732906/VOTRE_LABEL_ICI', // <-- Optionnel
});
```

### 3. Vérification
Vous pouvez vérifier que les événements partent bien en ouvrant la console de votre navigateur (F12) lors d'un test. J'ai ajouté des logs pour vous aider :
- `Contact conversion sent`
- `Simulator lead conversion sent`
- `Registration conversion sent`
- `Credit Request (Desktop/Mobile) conversion sent`

### 4. Outils SEO et Indexation ajoutés
Pour maximiser la visibilité et la crédibilité de vos publicités, j'ai également ajouté :
- **Meta Description & OG Tags** : Pour que vos liens soient élégants lorsqu'ils sont partagés sur Facebook, WhatsApp, etc.
- **robots.txt** : Pour guider correctement les robots Google.
- **sitemap.xml** : Pour aider à l'indexation rapide de vos pages.
- **manifest.json** : Pour une meilleure intégration sur mobile (style application).

## Besoin de modifier les labels ?
Si vous obtenez des labels spécifiques (ex: `AW-17959732906/abc123XYZ`), dites-le moi et je les mettrai à jour dans chaque fichier correspondant.
