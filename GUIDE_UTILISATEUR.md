# 📘 GUIDE D'UTILISATION - BANK INVIK SA

Ce guide détaille l'utilisation de la plateforme Bank Invik SA pour les clients et les administrateurs, ainsi que les spécifications techniques de l'application.

---

## 👤 1. GUIDE CLIENT

### 1.1 Inscription (Création de Compte)
Pour rejoindre Bank Invik SA, suivez ces étapes :
1. Accédez à la page d'inscription.
2. **Choix du compte** : Sélectionnez entre un compte **Particulier** (besoins quotidiens) ou **Professionnel** (entreprises/indépendants).
3. **Formulaire d'identité** : Remplissez vos informations réelles (Nom, Prénom, Date de naissance, Adresse, etc.).
4. **Préférences** : Choisissez votre devise principale (EUR ou USD) et le type d'offre (Standard ou avec Épargne).
5. **Sécurité** : Choisissez un mot de passe robuste (6 caractères minimum).
6. **Validation** : Acceptez les conditions générales et finalisez.

### 1.2 Vérification d'Email (Étape Cruciale)
Une fois le formulaire soumis :
- Un email de vérification vous est automatiquement envoyé.
- Vous serez redirigé vers une page d'attente (**Vérification en attente**).
- **IMPORTANT** : Vous devez cliquer sur le lien dans l'email pour activer votre compte.
- Tant que l'email n'est pas vérifié, l'accès au tableau de bord restera bloqué.
- Après vérification, vous recevrez un email de bienvenue et pourrez vous connecter.

### 1.3 Utilisation du Tableau de Bord
Le tableau de bord centralise vos finances :
- **Solde en temps réel** : Visualisez vos avoirs sur vos différents comptes (Principal, Épargne, Crédit).
- **RIB/IBAN** : Téléchargez votre relevé d'identité bancaire au format PDF ou Image.
- **Dernières opérations** : Suivez l'historique de vos transactions avec leur statut.

### 1.4 Opérations Financières
- **Recharger mon compte** : 
    - Via **Virement** : En utilisant les coordonnées IBAN affichées.
    - Via **Carte Bancaire** : Pour un crédit instantané (Simulation 3D Secure).
- **Virements** : 
    - Saisissez les coordonnées du bénéficiaire (IBAN, BIC).
    - Les virements sortants sont soumis à une **validation administrative** (Délai 1h-24h).
- **Cartes** : 
    - Commandez une carte physique ou activez une carte virtuelle instantanément.
- **Crédits** : 
    - Utilisez le simulateur pour calculer vos mensualités.
    - Soumettez une demande de prêt directement depuis votre espace.

---

## 🛡️ 2. GUIDE ADMINISTRATEUR

### 2.1 Accès à l'Administration
L'interface admin est séparée de l'interface client (généralement sur un sous-domaine ou dossier `/admin`).
- Connectez-vous avec vos identifiants administrateur.
- Le tableau de bord affiche les statistiques globales (nombre de clients, transactions en attente, KYC à valider).

### 2.2 Gestion des Clients et KYC
C'est le cœur de la sécurité de la banque :
1. **Demandes de compte** : Examinez les nouvelles inscriptions.
2. **Vérification KYC** : 
    - Vérifiez les documents d'identité envoyés.
    - Comparez le selfie et la vidéo de preuve de vie.
    - **Actions** : Approuver, Rejeter (avec motif) ou Demander des informations complémentaires.
3. **Fiche Client** : Accédez à tous les détails (portefeuilles, historique, crédits) et gérez le statut du compte (Actif, Bloqué, Restreint).

### 2.3 Gestion des Transactions
Tous les virements initiés par les clients apparaissent ici :
- **Approbation** : Vous pouvez approuver une transaction et générer un **Code de Transfert** unique.
- **Refus** : Indiquez obligatoirement le motif du refus pour notifier le client.
- **Ajustement de solde** : Possibilité de créditer/débiter manuellement un compte en cas de besoin.

### 2.4 Crédits et Support
- **Demandes de Prêt** : Analysez les revenus et charges fournis par le client ou le visiteur avant de donner un accord de principe.
- **Support Client** : Répondez aux messages de contact et aux tickets de support ouverts par les utilisateurs.

---

## ⚙️ 3. UTILISATION TECHNIQUE (DEV)

### 3.1 Architecture du Projet
L'application est structurée en **Monorepo** :
- `/client` : Frontend utilisateur (React + Vite).
- `/admin` : Frontend gestionnaire (React + Vite).
- `/shared` : Logique et types partagés.
- `/firebase` : Configuration et règles de sécurité.

### 3.2 Stack Technologique
- **Frontend** : React.js, Vite, Vanilla CSS.
- **Backend & DB** : Firebase Firestore (Base de données NoSQL), Firebase Auth (Authentification).
- **Stockage** : Cloudinary (pour les documents KYC et images).
- **Déploiement** : Vercel pour les deux interfaces.

### 3.3 Configuration et Installation
1. **Variables d'environnement** :
    - Fichiers `.env` requis dans `/client` et `/admin` contenant les clés Firebase et Cloudinary.
2. **Installation** :
    ```bash
    npm install  # À la racine et dans chaque dossier d'app
    ```
3. **Lancement Local** :
    ```bash
    npm run dev  # Démarre le serveur de développement Vite
    ```

### 3.4 Déploiement
Le déploiement est automatisé via Vercel. 
- **Client** : Racine pointant vers `/client`.
- **Admin** : Racine pointant vers `/admin`.
- Configurez les réécritures (`rewrites`) dans `vercel.json` pour supporter les Single Page Applications (SPA).

---
*Ce document est la propriété de Bank Invik SA. Tous droits réservés.*
