import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreditRequest = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initial values from calculator if available
    const initialAmount = location.state?.amount || 10000;
    const initialDuration = location.state?.duration || 24;

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const frenchBanks = [
        "BNP Paribas", "Société Générale", "Crédit Agricole", "Caisse d'Épargne", "Banque Populaire",
        "Crédit Mutuel", "La Banque Postale", "LCL", "HSBC France", "BoursoBank", "Boursorama Banque",
        "N26", "Revolut", "Hello bank!", "Fortuneo", "Monabanq", "BforBank", "Nickel", "Lydia", "Qonto",
        "BRED Banque Populaire", "Banque de la Réunion", "Banque des Antilles Françaises",
        "Banque de Guyane", "Banque de Nouvelle-Calédonie", "Banque de Polynésie", "Crédit Lyonnais",
        "CIC", "Crédit du Nord", "Boursorma", "Orange Bank", "Floa Bank", "Younited Credit", "Autres"
    ].sort();

    const [formData, setFormData] = useState({
        // 1. Infos Générales
        typeCredit: 'personnel',
        montant: initialAmount,
        duree: initialDuration,
        objet: '',
        // 2. Identité
        civilite: 'M.',
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        nationalite: 'Française',
        typePieceIdentite: 'cni',
        dateExpPiece: '',
        paysDelivrance: '',
        // 3. Situation Personnelle
        situationMatrimoniale: 'celibataire',
        nbEnfants: 0,
        typeLogement: 'locataire',
        ancienneteAdresse: 0,
        adresseRue: '',
        adresseCodePostal: '',
        adresseVille: '',
        adressePays: 'France',
        // 4. Situation Professionnelle
        statutPro: 'cdi',
        nomEmployeur: '',
        secteurActivite: '',
        posteOccupe: '',
        anciennetePro: 0,
        typeContrat: 'cdi',
        revenusMensuels: 0,
        autresRevenus: 0,
        // 5. Situation Financière
        chargesMensuelles: 0,
        loyer: 0,
        autresCredits: 0,
        pensions: 0,
        totalEncours: 0,
        soldeMoyen: 0,
        devise: 'EUR',
        incidentBancaire: 'non',
        incidentDetail: '',
        // 6. Infos Bancaires
        banqueActuelle: '',
        autreBanqueNom: '',
        paysBanque: 'France',
        iban: '',
        ancienneteCompte: 0,
        // 7. Consentements
        certifieBase: true,
        autoriseAnalyse: true,
        refuseProspection: false
    });

    const [score, setScore] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep = () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.objet) newErrors.objet = "L'objet du crédit est obligatoire";
            if (!formData.montant || formData.montant <= 0) newErrors.montant = "Le montant est obligatoire";
        }
        if (step === 2) {
            if (!formData.nom) newErrors.nom = "Le nom est obligatoire";
            if (!formData.prenom) newErrors.prenom = "Le prénom est obligatoire";
            if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est obligatoire";
        }
        if (step === 3) {
            if (!formData.adresseRue) newErrors.adresseRue = "La rue est obligatoire";
            if (!formData.adresseCodePostal) newErrors.adresseCodePostal = "Le code postal est obligatoire";
            if (!formData.adresseVille) newErrors.adresseVille = "La ville est obligatoire";
            if (!formData.adressePays) newErrors.adressePays = "Le pays est obligatoire";
        }
        if (step === 4) {
            if (formData.statutPro !== 'sans_emploi' && !formData.nomEmployeur) newErrors.nomEmployeur = "L'employeur est obligatoire";
            if (!formData.revenusMensuels || formData.revenusMensuels <= 0) newErrors.revenusMensuels = "Les revenus sont obligatoires";
        }
        if (step === 6) {
            if (!formData.banqueActuelle) newErrors.banqueActuelle = "Veuillez sélectionner votre banque";
            if (formData.banqueActuelle === 'Autres' && !formData.autreBanqueNom) newErrors.autreBanqueNom = "Le nom de la banque est obligatoire";
            if (!formData.iban) newErrors.iban = "L'IBAN est obligatoire";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const calculateScore = () => {
        const revenus = Number(formData.revenusMensuels) + Number(formData.autresRevenus);
        const charges = Number(formData.chargesMensuelles) + Number(formData.loyer) + Number(formData.autresCredits);

        if (revenus === 0) return 'RED';

        const tauxEndettement = (charges / revenus) * 100;
        const resteAVivre = revenus - charges;

        // Simple scoring logic based on typical banking rules
        if (tauxEndettement > 45 || formData.incidentBancaire === 'oui' || resteAVivre < 800) {
            return 'RED';
        } else if (tauxEndettement > 33 || resteAVivre < 1200 || formData.statutPro === 'sans_emploi') {
            return 'YELLOW';
        } else {
            return 'GREEN';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate analysis delay
        setTimeout(() => {
            const finalScore = calculateScore();
            setScore(finalScore);
            setIsSubmitting(false);
            setStep(8); // Success/Result step
        }, 2500);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 1 sur 7</span>
                            <h3 style={styles.stepTitle}>Informations Générales</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Type de crédit demandé *</label>
                            <select name="typeCredit" value={formData.typeCredit} onChange={handleInputChange} style={styles.input}>
                                <option value="personnel">Crédit personnel</option>
                                <option value="consommation">Crédit consommation</option>
                                <option value="automobile">Crédit automobile</option>
                                <option value="immobilier">Crédit immobilier</option>
                                <option value="professionnel">Crédit professionnel</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Montant du crédit demandé (€) *</label>
                            <input type="number" name="montant" value={formData.montant} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.montant ? 'red' : '#e0e0e0' }} />
                            {errors.montant && <span style={styles.errorText}>{errors.montant}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>Durée souhaitée (en mois) *</label>
                            <input type="number" name="duree" value={formData.duree} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Objet précis du crédit (obligatoire) *</label>
                            <textarea
                                name="objet"
                                value={formData.objet}
                                onChange={handleInputChange}
                                style={{ ...styles.textarea, borderColor: errors.objet ? 'red' : '#e0e0e0' }}
                                placeholder="Décrivez l'objet de votre financement..."
                            />
                            {errors.objet && <span style={styles.errorText}>{errors.objet}</span>}
                        </div>
                        <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                    </div>
                );
            case 2:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 2 sur 7</span>
                            <h3 style={styles.stepTitle}>👤 Identité du demandeur</h3>
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>Civilité *</label>
                                <select name="civilite" value={formData.civilite} onChange={handleInputChange} style={styles.input}>
                                    <option value="M.">M.</option>
                                    <option value="Mme">Mme</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>Nom *</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.nom ? 'red' : '#e0e0e0' }} />
                                {errors.nom && <span style={styles.errorText}>{errors.nom}</span>}
                            </div>
                            <div style={styles.formGroup}>
                                <label>Prénom(s) *</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.prenom ? 'red' : '#e0e0e0' }} />
                                {errors.prenom && <span style={styles.errorText}>{errors.prenom}</span>}
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Date de naissance *</label>
                            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.dateNaissance ? 'red' : '#e0e0e0' }} />
                            {errors.dateNaissance && <span style={styles.errorText}>{errors.dateNaissance}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>Numéro de pièce d'identité (Dernier rappel avant l'étape suivante)</label>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>Veuillez avoir votre pièce d'identité à portée de main pour la suite.</p>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Type de pièce d’identité *</label>
                            <select name="typePieceIdentite" value={formData.typePieceIdentite} onChange={handleInputChange} style={styles.input}>
                                <option value="passeport">Passeport</option>
                                <option value="cni">Carte nationale d’identité</option>
                                <option value="sejour">Titre de séjour</option>
                            </select>
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 3 sur 7</span>
                            <h3 style={styles.stepTitle}>🏠 Situation personnelle</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Situation matrimoniale *</label>
                            <select name="situationMatrimoniale" value={formData.situationMatrimoniale} onChange={handleInputChange} style={styles.input}>
                                <option value="celibataire">Célibataire</option>
                                <option value="marie">Marié(e)</option>
                                <option value="divorce">Divorcé(e)</option>
                                <option value="veuf">Veuf(ve)</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Nombre d’enfants à charge</label>
                            <input type="number" name="nbEnfants" value={formData.nbEnfants} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Type de logement *</label>
                            <select name="typeLogement" value={formData.typeLogement} onChange={handleInputChange} style={styles.input}>
                                <option value="proprietaire">Propriétaire</option>
                                <option value="locataire">Locataire</option>
                                <option value="heberge">Hébergé</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>N° et Rue *</label>
                            <input type="text" name="adresseRue" value={formData.adresseRue} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseRue ? 'red' : '#e0e0e0' }} placeholder="Ex: 12 Rue de la Paix" />
                            {errors.adresseRue && <span style={styles.errorText}>{errors.adresseRue}</span>}
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>Code Postal *</label>
                                <input type="text" name="adresseCodePostal" value={formData.adresseCodePostal} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseCodePostal ? 'red' : '#e0e0e0' }} placeholder="75001" />
                                {errors.adresseCodePostal && <span style={styles.errorText}>{errors.adresseCodePostal}</span>}
                            </div>
                            <div style={styles.formGroup}>
                                <label>Ville *</label>
                                <input type="text" name="adresseVille" value={formData.adresseVille} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseVille ? 'red' : '#e0e0e0' }} placeholder="Paris" />
                                {errors.adresseVille && <span style={styles.errorText}>{errors.adresseVille}</span>}
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Pays *</label>
                            <input type="text" name="adressePays" value={formData.adressePays} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adressePays ? 'red' : '#e0e0e0' }} />
                            {errors.adressePays && <span style={styles.errorText}>{errors.adressePays}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 4 sur 7</span>
                            <h3 style={styles.stepTitle}>💼 Situation professionnelle</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Statut professionnel *</label>
                            <select name="statutPro" value={formData.statutPro} onChange={handleInputChange} style={styles.input}>
                                <option value="cdi">Salarié CDI</option>
                                <option value="cdd">Salarié CDD</option>
                                <option value="fonctionnaire">Fonctionnaire</option>
                                <option value="independant">Travailleur indépendant</option>
                                <option value="entrepreneur">Entrepreneur</option>
                                <option value="retraite">Retraité</option>
                                <option value="sans_emploi">Sans emploi</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Revenus mensuels nets (€) *</label>
                            <input type="number" name="revenusMensuels" value={formData.revenusMensuels} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.revenusMensuels ? 'red' : '#e0e0e0' }} />
                            {errors.revenusMensuels && <span style={styles.errorText}>{errors.revenusMensuels}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>Nom de l'employeur / entreprise *</label>
                            <input type="text" name="nomEmployeur" value={formData.nomEmployeur} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.nomEmployeur ? 'red' : '#e0e0e0' }} />
                            {errors.nomEmployeur && <span style={styles.errorText}>{errors.nomEmployeur}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 5 sur 7</span>
                            <h3 style={styles.stepTitle}>💰 Situation financière</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Loyer / Crédit immobilier mensuel (€)</label>
                            <input type="number" name="loyer" value={formData.loyer} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Autres crédits en cours (€)</label>
                            <input type="number" name="autresCredits" value={formData.autresCredits} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Incident bancaire antérieur ? *</label>
                            <select name="incidentBancaire" value={formData.incidentBancaire} onChange={handleInputChange} style={styles.input}>
                                <option value="non">Non</option>
                                <option value="oui">Oui</option>
                            </select>
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 6 sur 7</span>
                            <h3 style={styles.stepTitle}>🏦 Informations bancaires</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>Banque actuelle *</label>
                            <select
                                name="banqueActuelle"
                                value={formData.banqueActuelle}
                                onChange={handleInputChange}
                                style={{ ...styles.input, borderColor: errors.banqueActuelle ? 'red' : '#e0e0e0' }}
                            >
                                <option value="">-- Sélectionner votre banque --</option>
                                {frenchBanks.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                            {errors.banqueActuelle && <span style={styles.errorText}>{errors.banqueActuelle}</span>}
                        </div>
                        {formData.banqueActuelle === 'Autres' && (
                            <div style={styles.formGroup}>
                                <label>Nom de votre banque *</label>
                                <input
                                    type="text"
                                    name="autreBanqueNom"
                                    value={formData.autreBanqueNom}
                                    onChange={handleInputChange}
                                    style={{ ...styles.input, borderColor: errors.autreBanqueNom ? 'red' : '#e0e0e0' }}
                                    placeholder="Entrez le nom de l'établissement"
                                />
                                {errors.autreBanqueNom && <span style={styles.errorText}>{errors.autreBanqueNom}</span>}
                            </div>
                        )}
                        <div style={styles.formGroup}>
                            <label>IBAN / Numéro de compte *</label>
                            <input type="text" name="iban" value={formData.iban} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.iban ? 'red' : '#e0e0e0' }} placeholder="FR76..." />
                            {errors.iban && <span style={styles.errorText}>{errors.iban}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={nextStep} style={styles.submitButton}>Suivant</button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 7 sur 7</span>
                            <h3 style={styles.stepTitle}>⚖️ Déclarations et consentements</h3>
                        </div>
                        <div style={styles.checkboxGroup}>
                            <input type="checkbox" name="certifieBase" checked={formData.certifieBase} onChange={handleInputChange} />
                            <label>Je certifie que les informations fournies sont exactes et complètes.</label>
                        </div>
                        <div style={styles.checkboxGroup}>
                            <input type="checkbox" name="autoriseAnalyse" checked={formData.autoriseAnalyse} onChange={handleInputChange} />
                            <label>J’autorise INVIK SA à analyser mes données dans le cadre de l’étude de ma demande.</label>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                            <strong>🔐 Protection des données :</strong> Les données collectées sont destinées à INVIK SA exclusivement pour l’étude de la demande de crédit.
                        </div>
                        <div style={{ ...styles.row, marginTop: '2rem' }}>
                            <button onClick={prevStep} style={styles.secondaryButton}>Retour</button>
                            <button onClick={handleSubmit} style={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Analyse en cours...' : 'Soumettre ma demande'}
                            </button>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="form-step" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--primary-color)' }}>Analyse Terminée</h2>
                        <div style={{
                            padding: '2rem',
                            borderRadius: '16px',
                            backgroundColor: score === 'GREEN' ? '#e6fffa' : score === 'YELLOW' ? '#fffbeb' : '#fff5f5',
                            margin: '2rem 0'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                {score === 'GREEN' ? '🟢' : score === 'YELLOW' ? '🟡' : '🔴'}
                            </div>
                            <h3 style={{
                                color: score === 'GREEN' ? '#2c7a7b' : score === 'YELLOW' ? '#b45309' : '#c53030',
                                fontSize: '1.5rem',
                                marginBottom: '1rem'
                            }}>
                                {score === 'GREEN' ? 'Forte probabilité d’acceptation' :
                                    score === 'YELLOW' ? 'Étude complémentaire requise' :
                                        'Forte probabilité de rejet'}
                            </h3>
                            <p style={{ color: '#666' }}>
                                {score === 'GREEN' ? 'Votre dossier présente une excellente solvabilité.' :
                                    score === 'YELLOW' ? 'Certains éléments nécessitent une vérification manuelle.' :
                                        'Votre situation financière actuelle ne permet pas l’octroi du crédit.'}
                            </p>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                            Décision finale soumise à validation interne INVIK SA
                        </p>
                        <button onClick={() => navigate('/')} style={{ ...styles.submitButton, marginTop: '2rem' }}>Retour à l'accueil</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={styles.page} className="desktop-only">
            <section style={styles.hero}>
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1>Demande de Crédit</h1>
                        <p>Étude de solvabilité en temps réel</p>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
                <div style={styles.formCard}>
                    {/* Progress Bar */}
                    {step < 8 && (
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${(step / 7) * 100}%` }}></div>
                        </div>
                    )}
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#fcfcfc' },
    hero: {
        background: 'linear-gradient(rgba(0,51,102,0.9), rgba(0,51,102,0.8)), url(/service/service-5.jpg)',
        backgroundSize: 'cover',
        padding: '6rem 0',
        textAlign: 'center',
        color: 'white'
    },
    heroOverlay: { padding: '0 1rem' },
    formCard: {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
    },
    progressBar: {
        height: '6px',
        backgroundColor: '#eee',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#00ccff',
        transition: 'width 0.4s ease'
    },
    formGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
    input: {
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s'
    },
    textarea: {
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        fontSize: '1rem',
        minHeight: '100px',
        outline: 'none'
    },
    submitButton: {
        backgroundColor: '#003366',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '50px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(0,51,102,0.2)'
    },
    secondaryButton: {
        backgroundColor: '#f8f9fa',
        color: '#666',
        padding: '1rem 2rem',
        borderRadius: '50px',
        border: '1px solid #eee',
        fontSize: '1rem',
        cursor: 'pointer'
    },
    checkboxGroup: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    },
    stepHeader: {
        marginBottom: '2rem',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '1rem'
    },
    stepNumber: {
        display: 'block',
        fontSize: '0.85rem',
        color: '#00ccff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '0.5rem'
    },
    stepTitle: {
        margin: 0,
        color: 'var(--primary-color)',
        fontSize: '1.5rem',
        fontWeight: '700'
    },
    errorText: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: '0.2rem'
    }
};

export default CreditRequest;
