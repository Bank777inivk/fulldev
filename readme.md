CAHIER DES CHARGES COMPLET
PLATEFORME DE BANQUE EN LIGNE VIRTUELLE

📋 TABLE DES MATIÈRES

Contexte et Objectifs
Spécifications Techniques
Architecture du Projet
Devises et Internationalisation
Site Vitrine Public
Gestion des Comptes Clients
Processus KYC
Espace Client
Système de Virements
Gestion des Crédits
Espace Administrateur
Notifications et Communications
Sécurité
Expérience Utilisateur


1. CONTEXTE ET OBJECTIFS
1.1 Présentation du Projet
Développement d'une plateforme de banque en ligne virtuelle fonctionnant de manière autonome, sécurisée et réaliste. La plateforme est destinée à démontrer des fonctionnalités bancaires avancées dans un cadre académique et professionnel.
1.2 Cible

Présentation à une institution bancaire
Jury académique
Démonstration de compétences techniques

1.3 Objectifs Principaux

Logique bancaire réaliste et crédible
Séparation claire des rôles (client/administrateur)
Sécurité robuste
Expérience utilisateur professionnelle
Interface 100% responsive (desktop, tablette, mobile)


2. SPÉCIFICATIONS TECHNIQUES
2.1 Stack Technologique
Frontend

Framework: React avec Vite
Déploiement: Vercel
Responsive: Mobile-first approach
Charte graphique: Bleu bancaire (couleur principale)

Backend

Base de données: Firebase Firestore
Authentification: Firebase Authentication
Stockage fichiers: Cloudinary (formule Spark sans Storage)
Hébergement: Firebase Hosting (optionnel)

2.2 Structure du Projet

Monorepo contenant deux applications distinctes :

Application Client (/client)
Application Admin (/admin)


Repository unique avec séparation claire des dossiers

2.3 Contraintes Techniques

Formule Firebase Spark (gratuite)
Pas d'accès à Firebase Storage → Cloudinary pour tous les fichiers
Support uniquement EUR et USD


3. ARCHITECTURE DU PROJET
3.1 Structure des Dossiers
/project-root
├── /client              # Application client
│   ├── /src
│   ├── /public
│   ├── package.json
│   └── vite.config.js
├── /admin               # Application admin
│   ├── /src
│   ├── /public
│   ├── package.json
│   └── vite.config.js
├── /shared              # Code partagé (utils, types)
├── /firebase            # Configuration Firebase
└── README.md
3.2 Collections Firestore
Users
javascript{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  dateOfBirth: timestamp,
  gender: string,
  nationality: string,
  residenceCountry: string,
  address: string,
  postalCode: string,
  city: string,
  phone: string,
  mainCurrency: 'EUR' | 'USD', // Défaut: EUR
  accountType: 'standard' | 'savings',
  kycStatus: 'pending' | 'approved' | 'rejected',
  kycDocuments: {
    idDocument: string, // URL Cloudinary
    selfie: string,     // URL Cloudinary
    video: string       // URL Cloudinary
  },
  accountStatus: 'active' | 'restricted' | 'blocked',
  createdAt: timestamp,
  updatedAt: timestamp
}
Wallets
javascript{
  userId: string,
  type: 'main' | 'savings' | 'credit',
  currency: 'EUR' | 'USD',
  balance: number,
  iban: string,
  bic: string,
  createdAt: timestamp
}
Transactions
javascript{
  id: string,
  userId: string,
  walletId: string,
  type: 'credit' | 'debit' | 'transfer',
  amount: number,
  currency: 'EUR' | 'USD',
  status: 'pending' | 'approved' | 'rejected' | 'in_progress',
  beneficiary: {
    name: string,
    iban: string,
    bic: string
  },
  description: string,
  transferCode: string | null, // Code généré par admin
  createdAt: timestamp,
  processedAt: timestamp | null,
  processedBy: string | null // Admin UID
}
Cards
javascript{
  userId: string,
  type: 'virtual' | 'physical',
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  status: 'active' | 'inactive' | 'blocked',
  limit: number,
  currency: 'EUR' | 'USD',
  orderDate: timestamp,
  activationDate: timestamp | null
}
CreditRequests
javascript{
  id: string,
  userId: string | null, // null si visiteur
  applicantType: 'client' | 'visitor',
  
  // Informations demandeur (visiteur)
  visitorInfo: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    residenceCountry: string,
    nationality: string
  } | null,
  
  // Détails du crédit
  amount: number,
  currency: 'EUR' | 'USD',
  duration: number, // en mois
  creditType: string,
  purpose: string,
  
  // Informations financières (client)
  professionalSituation: string | null,
  monthlyIncome: number | null,
  monthlyExpenses: number | null,
  
  // Calculs automatiques
  interestRate: number, // Calculé auto selon montant
  monthlyPayment: number,
  totalAmount: number,
  
  // Suivi
  status: 'pending' | 'approved' | 'rejected' | 'under_review',
  adminNotes: string,
  createdAt: timestamp,
  processedAt: timestamp | null,
  processedBy: string | null
}
Simulations
javascript{
  id: string,
  visitorEmail: string,
  amount: number,
  currency: 'EUR' | 'USD',
  duration: number,
  interestRate: number,
  monthlyPayment: number,
  totalAmount: number,
  createdAt: timestamp
}
ContactMessages
javascript{
  id: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  status: 'new' | 'read' | 'responded',
  createdAt: timestamp
}
Admins
javascript{
  uid: string,
  email: string,
  role: 'super_admin' | 'admin' | 'manager',
  permissions: string[],
  status: 'active' | 'blocked',
  createdAt: timestamp
}
```

---

## 4. DEVISES ET INTERNATIONALISATION

### 4.1 Devises Supportées
**Uniquement deux devises** pour simplifier la gestion :
- **EUR** (Euro) - Devise par défaut
- **USD** (Dollar américain)

### 4.2 Configuration des Comptes
- Tous les comptes sont créés par défaut en **EUR**
- Devise principale du compte : **EUR**
- Possibilité de gérer des transactions en USD

### 4.3 Pays et Nationalités
- **Aucune restriction géographique**
- Liste complète de tous les pays reconnus internationalement
- Champs obligatoires :
  - Nationalité
  - Pays de résidence

---

## 5. SITE VITRINE PUBLIC

### 5.1 Pages Principales

#### Page d'Accueil
- Présentation de la banque
- Valeurs et avantages
- Call-to-action vers inscription

#### Offres et Services
- Compte standard
- Compte avec épargne
- Cartes bancaires (virtuelle/physique)
- Services de crédit

#### Simulateur de Crédit
**Accessible sans compte** :
- Saisie du montant souhaité
- Durée du crédit
- Email pour recevoir la simulation
- Calcul automatique :
  - Taux d'intérêt (basé sur le montant)
  - Mensualité
  - Coût total
- Envoi par email :
  - Copie au visiteur
  - Copie à l'administrateur

#### FAQ
- Questions fréquentes
- Informations sur les services
- Processus d'ouverture de compte

#### Contact
- Formulaire de contact
- Envoi vers `contact@nomdedomaine.com`
- Copie dans le tableau de bord admin
- Statut de suivi des messages

### 5.2 Demande de Crédit Visiteur (Non-Client)

#### Formulaire Public
- Nom
- Prénom
- Email
- Téléphone
- Pays de résidence (liste complète)
- Nationalité (liste complète)
- Montant souhaité
- Devise (EUR ou USD)
- Objet du crédit
- Durée souhaitée

#### Fonctionnement
- **Taux d'intérêt automatique** selon le montant
- Admin peut modifier les taux depuis son espace
- Modification prise en compte automatiquement
- Demande visible dans tableau de bord admin

---

## 6. GESTION DES COMPTES CLIENTS

### 6.1 Formulaire d'Inscription (Exigeant)

#### Informations Personnelles Obligatoires
- Nom
- Prénom
- Date de naissance
- Sexe
- Nationalité (sélection parmi tous les pays)
- Pays de résidence (sélection parmi tous les pays)
- Adresse complète
- Code postal
- Ville
- Numéro de téléphone (format international)
- Adresse email valide

#### Informations Bancaires
- Devise principale : **EUR par défaut** pour tous les comptes
- Type de compte :
  - **Compte standard**
  - **Compte avec épargne**

#### Sécurité
- Mot de passe sécurisé (critères stricts)
- Confirmation du mot de passe
- Acceptation des conditions générales
- Acceptation de la politique de confidentialité

### 6.2 Création Automatique des Portefeuilles

#### Compte Standard
- 1 portefeuille principal (EUR)

#### Compte avec Épargne
Création automatique de **3 portefeuilles** :
1. **Portefeuille principal** (transactions courantes)
2. **Portefeuille épargne** (économies)
3. **Portefeuille crédit** (remboursements de prêts)

#### Génération Automatique
- IBAN unique par portefeuille
- BIC/SWIFT
- Numéro de compte

---

## 7. PROCESSUS KYC

### 7.1 Vérification d'Identité Obligatoire

Le KYC est **obligatoire** pour l'activation complète du compte.

#### Documents Requis
1. **Document d'identité officiel**
   - Carte d'identité
   - Passeport
   - Permis de conduire

2. **Photo selfie récente**
   - Visage clairement visible
   - Bonne qualité

3. **Vidéo courte du visage**
   - Preuve de vie
   - Durée : 5-10 secondes
   - Instructions claires

### 7.2 Processus de Validation

#### Côté Client
- Upload automatisé via interface
- Stockage sur Cloudinary
- Feedback en temps réel

#### Côté Admin
- Validation manuelle des documents
- Vérification de la cohérence
- Décision : Approuver / Rejeter / Demander plus d'infos

### 7.3 Statuts KYC
- **Pending** : En attente de validation
- **Approved** : Validé - Accès complet
- **Rejected** : Rejeté - Compte restreint

### 7.4 Restrictions sans KYC
Un compte non validé peut être :
- Restreint (limites sur les transactions)
- Bloqué (aucune transaction)
- Limité dans ses fonctionnalités (pas de virement, pas de carte)

---

## 8. ESPACE CLIENT

### 8.1 Tableau de Bord

#### Vue d'Ensemble
- Soldes de tous les portefeuilles (temps réel)
- Dernières transactions
- Notifications importantes
- Statut du compte et KYC

#### Portefeuilles
- **Principal** : Solde dynamique en EUR
- **Épargne** : Solde et intérêts (si applicable)
- **Crédit** : Solde dû et échéances

### 8.2 Gestion du Compte

#### Recharger le Compte
Deux méthodes disponibles :

1. **Virement bancaire**
   - Affichage du RIB du client
   - Instructions de virement
   - Crédit automatique après validation

2. **Carte bancaire 3D Secure**
   - Bouton "RECHARGER MON COMPTE"
   - Intégration paiement sécurisé
   - Crédit instantané

#### Téléchargement du RIB
- Format PDF
- Format Image (PNG/JPG)
- Informations complètes (IBAN, BIC, nom)

### 8.3 Virements

#### Effectuer un Virement
- Montant
- Devise (EUR ou USD)
- Bénéficiaire :
  - Nom
  - IBAN
  - BIC
- Motif du virement
- Date d'exécution

#### Gestion des Bénéficiaires
- Ajouter un bénéficiaire
- Liste des bénéficiaires enregistrés
- Modifier / Supprimer
- Favoris

#### Statut des Virements
- **En cours d'exécution** (1h à 24h)
- **Approuvé** par l'admin
- **Refusé** par l'admin
- **En attente de vérification**

### 8.4 Cartes Bancaires

#### Carte Virtuelle
- Activation / Désactivation instantanée
- Consultation des détails :
  - Numéro de carte
  - Date d'expiration
  - CVV
- Plafonds de paiement
- Historique des transactions

#### Carte Physique
- Commander une carte : **50 €**
- Suivi de commande
- Activation à réception
- Gestion des plafonds

### 8.5 Demande de Crédit

#### Formulaire Client
- Montant du crédit
- Devise (EUR ou USD)
- Durée souhaitée (en mois)
- Type de crédit :
  - Personnel
  - Immobilier
  - Auto
  - Autre
- Situation professionnelle
- Revenus mensuels nets
- Charges mensuelles
- Objet détaillé du crédit
- Acceptation des conditions

#### Suivi
- Statut de la demande
- Messages de l'administrateur
- Notifications de mise à jour

### 8.6 Historique et Relevés

#### Historique des Transactions
- Filtres par :
  - Date
  - Type (crédit, débit, virement)
  - Montant
  - Statut
- Export PDF / Excel
- Recherche avancée

#### Relevés de Compte
- Mensuel
- Annuel
- Période personnalisée
- Téléchargement PDF

### 8.7 Contact et Support

#### Messagerie avec Gestionnaire
- Envoyer un message
- Suivi des conversations
- Pièces jointes
- Notifications de réponse

---

## 9. SYSTÈME DE VIREMENTS

### 9.1 Processus de Validation

Tous les virements sortants sont **soumis à validation administrative**.

#### Workflow
1. **Client initie le virement**
   - Formulaire de virement
   - Vérification des données
   - Confirmation

2. **Statut initial : "En cours d'exécution"**
   - Délai affiché : 1h à 24h
   - Notification envoyée au client
   - Virement visible dans l'espace admin

3. **Validation par l'administrateur**
   - Vérification des informations
   - Contrôle de sécurité
   - Décision finale

### 9.2 Actions de l'Administrateur

#### Approuver le Virement
- Génération optionnelle d'un **code de transfert bancaire**
- Code unique lié à la transaction
- Code visible par le client
- Exécution du virement
- Notification au client

#### Refuser le Virement
- Motif du refus obligatoire
- Remboursement des frais éventuels
- Notification au client
- Blocage de la transaction

#### Mettre en Attente
- Demande de documents complémentaires
- Vérification approfondie
- Communication avec le client

### 9.3 Code de Transfert Bancaire

#### Génération
- Uniquement par l'administrateur
- Associé à une transaction spécifique
- Alphanumérique unique

#### Utilisation
- Preuve de validation
- Traçabilité
- Peut être requis par le client pour justifier le virement

---

## 10. GESTION DES CRÉDITS

### 10.1 Demande de Crédit Client (Compte Existant)

#### Informations Requises
- Montant demandé
- Devise (EUR ou USD)
- Durée (en mois)
- Type de crédit
- Situation professionnelle
- Revenus mensuels
- Charges mensuelles
- Objet du crédit
- Documents justificatifs (via Cloudinary)

#### Calcul Automatique
- **Taux d'intérêt** basé sur :
  - Montant
  - Durée
  - Profil client
  - Historique bancaire
- Mensualité calculée
- Coût total du crédit

### 10.2 Demande de Crédit Visiteur (Non-Client)

#### Formulaire Simplifié
- Informations personnelles
- Montant et devise
- Objet du crédit
- Coordonnées

#### Gestion Admin
- Tableau dédié aux demandes visiteurs
- Pré-qualification
- Invitation à ouvrir un compte
- Statistiques des demandes

### 10.3 Gestion des Taux d'Intérêt

#### Paramétrage Admin
- Définition des tranches de montants
- Taux associés par tranche
- Modification en temps réel
- Application automatique aux nouvelles demandes

#### Exemple de Tranches
```
0 - 5 000 € : 3,5%
5 000 - 20 000 € : 3,0%
20 000 - 50 000 € : 2,5%
50 000+ € : 2,0%
10.4 Validation et Suivi
Workflow Admin

Réception de la demande
Analyse du dossier
Vérification des documents
Décision :

Approuver
Refuser
Demander plus d'infos



Statuts

Pending : En attente
Under Review : En cours d'analyse
Approved : Approuvé
Rejected : Refusé


11. ESPACE ADMINISTRATEUR
11.1 Tableau de Bord Admin
Vue d'Ensemble

Statistiques globales :

Nombre de clients
Nombre de transactions en attente
Montant total des virements du jour
Demandes de crédit en attente
Demandes KYC à traiter


Graphiques et analytics
Alertes et notifications

11.2 Gestion des Clients
Fonctionnalités

Liste complète des clients

Recherche avancée
Filtres (statut, KYC, date d'inscription)


Fiche client détaillée :

Informations personnelles (modifiables)
Historique des transactions
Portefeuilles et soldes
Documents KYC
Crédits en cours
Notes administratives


Actions possibles :

Modifier les informations
Bloquer / Débloquer le compte
Restreindre les fonctionnalités
Valider / Rejeter KYC
Envoyer un message
Générer des rapports



11.3 Gestion des Virements
Tableau des Virements

Tous les virements en attente
Détails complets
Statut en temps réel

Actions

Approuver avec/sans code de transfert
Refuser avec motif
Mettre en attente de vérification
Historique des décisions

11.4 Gestion des Crédits
Demandes Clients

Liste des demandes
Filtrage par statut
Analyse des dossiers
Validation / Refus

Demandes Visiteurs

Tableau dédié
Contact avec les demandeurs
Conversion en clients

Paramétrage

Modification des taux d'intérêt
Gestion des tranches
Conditions d'octroi

11.5 Gestion des Cartes
Fonctionnalités

Liste des cartes actives
Commandes en cours
Activation / Désactivation
Modification des plafonds
Blocage de carte

11.6 Gestion des RIB
Actions

Génération de RIB
Modification des coordonnées bancaires
Validation des IBAN
Historique des modifications

11.7 Simulations et Messages
Simulations de Crédit

Toutes les simulations effectuées sur le site
Détails et coordonnées
Export des données
Statistiques

Messages de Contact

Formulaires de contact reçus
Statut (nouveau, lu, répondu)
Réponse directe
Archivage

11.8 Gestion des Administrateurs
Rôles

Super Admin :

Tous les droits
Création/blocage d'autres admins
Gestion des permissions


Admin :

Gestion des clients
Validation des transactions
Accès complet sauf gestion des admins


Gestionnaire :

Consultation
Actions limitées
Permissions restreintes



Fonctionnalités

Créer de nouveaux administrateurs
Modifier les rôles
Bloquer un administrateur (Super Admin uniquement)
Définir les permissions personnalisées
Historique des actions admin


12. NOTIFICATIONS ET COMMUNICATIONS
12.1 Notifications Internes
Système de Notifications In-App

Badge de notification
Centre de notifications
Types :

Virement effectué
Virement en attente
Crédit approuvé/refusé
KYC validé/rejeté
Message du gestionnaire
Alerte de sécurité



12.2 Notifications Email
Emails Automatiques
Envoyés pour chaque événement important :

Inscription

Email de bienvenue
Rappel KYC


KYC

Confirmation de réception
Validation / Rejet


Virements

Virement initié
En cours de traitement
Approuvé (avec code de transfert)
Refusé (avec motif)
Virement reçu


Crédits

Demande reçue
En cours d'analyse
Approuvé / Refusé
Échéances à venir


Cartes

Commande confirmée
Carte expédiée
Activation


Compte

Blocage / Déblocage
Modification importante
Alerte de sécurité


Simulations

Copie de simulation au visiteur
Notification admin



12.3 Templates Email

Design professionnel
Charte graphique de la banque
Personnalisés selon le type
Responsive mobile


13. SÉCURITÉ
13.1 Authentification
Firebase Authentication

Email/Password
Vérification d'email obligatoire
Réinitialisation de mot de passe sécurisée
Session management

Critères de Mot de Passe

Minimum 8 caractères
Au moins une majuscule
Au moins une minuscule
Au moins un chiffre
Au moins un caractère spécial

13.2 Protection des Données
Chiffrement

Données sensibles chiffrées dans Firestore
Communications HTTPS uniquement
Tokens sécurisés

Règles Firestore

Accès client : ses propres données uniquement
Accès admin : toutes les données
Validation des données côté backend
Interdiction d'écriture directe

13.3 Validation des Transactions
Workflow de Sécurité

Double vérification pour virements > 1000 €
Code de transfert pour validations
Traçabilité complète
Logs d'audit

13.4 Protection Contre la Fraude
Mesures

Limitation des tentatives de connexion
Détection d'activités suspectes
Blocage automatique si nécessaire
Vérification multi-facteurs (future feature)


14. EXPÉRIENCE UTILISATEUR
14.1 Design System
Charte Graphique

Couleur principale : Bleu bancaire (#003366 ou similaire)
Couleurs secondaires :

Bleu clair pour les accents
Vert pour les validations
Rouge pour les alertes
Gris pour les textes secondaires



Typographie

Police professionnelle et lisible
Hiérarchie claire des titres
Taille adaptative selon device

Composants

Buttons
Cards
Forms
Tables
Modals
Notifications
Charts

14.2 Responsive Design
Breakpoints

Mobile : < 768px
Tablet : 768px - 1024px
Desktop : > 1024px

Adaptations

Navigation mobile (hamburger menu)
Tableaux scrollables
Formulaires optimisés
Touch-friendly sur mobile

14.3 Performance
Optimisations

Lazy loading des images
Code splitting
Mise en cache intelligente
Minification des assets
CDN pour ressources statiques

Temps de Chargement

Page d'accueil : < 2 secondes
Dashboard : < 3 secondes
Interactions : instantanées

14.4 Accessibilité
Normes

Contraste des couleurs (WCAG AA)
Labels pour formulaires
Navigation au clavier
ARIA labels


15. ROADMAP ET ÉVOLUTIONS FUTURES
15.1 Phase 1 (MVP) - 8 semaines

Site vitrine
Inscription et authentification
KYC basique
Dashboard client
Dashboard admin
Virements basiques
Notifications email

15.2 Phase 2 - 4 semaines

Cartes bancaires
Recharge par carte 3D Secure
Gestion des bénéficiaires
Simulateur de crédit
Demandes de crédit

15.3 Phase 3 - 4 semaines

Statistiques avancées
Export de données
Gestion multi-devises améliorée
Optimisations performance
Tests et débogage

15.4 Évolutions Futures (Post-MVP)

Application mobile native
Multi-facteur authentication (2FA)
Chatbot support client
API publique
Internationalisation (plus de langues)
Plus de devises
Investissements et placements
Assurances


16. LIVRABLES
16.1 Code Source

Repository Git organisé
Documentation technique
README complet
Guide d'installation

16.2 Documentation

Cahier des charges (ce document)
Documentation utilisateur
Documentation admin
Guide de déploiement
Documentation API (Firestore)

16.3 Environnements

Production : Application déployée sur Vercel
Staging : Environnement de test
Développement : Local

16.4 Démo

Vidéo de présentation
Comptes de démonstration :

Client avec données fictives
Admin avec données fictives


Présentation PowerPoint


17. CONTRAINTES ET LIMITES
17.1 Techniques

Formule Spark Firebase (limitations de quota)
Pas de Firebase Storage (utilisation de Cloudinary)
Pas de serveur backend dédié (Cloud Functions limitées)

17.2 Fonctionnelles

Système virtuel (pas de vraies transactions bancaires)
Support uniquement EUR et USD
Validation manuelle des virements

17.3 Légales
Important : Cette plateforme est à but académique/démonstration uniquement.

Pas de licence bancaire
Pas de traitement de fonds réels
Mentions légales claires sur le site


18. CRITÈRES DE SUCCÈS
18.1 Fonctionnels

✅ Inscription et authentification fonctionnelles
✅ KYC complet et validable
✅ Virements avec validation admin
✅ Cartes virtuelles et physiques
✅ Système de crédit
Continuer13:13opérationnel

✅ Notifications email et in-app

18.2 Techniques

✅ Application 100% responsive
✅ Temps de chargement < 3 secondes
✅ Zéro erreur console en production
✅ Code propre et documenté
✅ Tests unitaires > 70% coverage

18.3 UX/UI

✅ Interface professionnelle
✅ Navigation intuitive
✅ Feedback utilisateur clair
✅ Design cohérent
✅ Accessibilité WCAG AA


19. SUPPORT ET MAINTENANCE
19.1 Documentation

Guide utilisateur complet
FAQ détaillée
Tutoriels vidéo
Documentation technique

19.2 Monitoring

Firebase Analytics
Error tracking (Sentry ou similaire)
Performance monitoring
User behavior analytics

19.3 Maintenance

Mises à jour de sécurité
Corrections de bugs
Optimisations performance
Évolutions fonctionnelles


📞 CONTACT ET RESSOURCES
Support Projet

Email technique : dev@projet-banque.com
Email admin : admin@projet-banque.com

Ressources

Repository GitHub : [URL]
Documentation : [URL]
Démo en ligne : [URL]


Version : 1.0
Date : Janvier 2026
Statut : Validé

Ce cahier des charges est un document évolutif. Toute modification majeure doit faire l'objet d'une validation et d'une mise à jour de version