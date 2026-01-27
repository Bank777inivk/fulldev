import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const CreditRequest = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useNotifications();

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
        email: '',
        telephone: '',
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
    const [interestRate, setInterestRate] = useState(3.0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Interest Rate logic (matching Simulator & Dashboard)
    useEffect(() => {
        let rate = 3.5;
        const amt = Number(formData.montant);
        if (amt > 100000) rate = 1.5;
        else if (amt > 50000) rate = 2.0;
        else if (amt > 20000) rate = 2.5;
        else if (amt > 5000) rate = 3.0;

        setInterestRate(rate);
    }, [formData.montant]);

    // Monthly Payment Calculation
    useEffect(() => {
        const amt = Number(formData.montant);
        const dur = Number(formData.duree);
        const r = (interestRate / 100) / 12;
        if (r === 0) {
            setMonthlyPayment((amt / dur).toFixed(2));
        } else {
            const monthly = (amt * r * Math.pow(1 + r, dur)) / (Math.pow(1 + r, dur) - 1);
            setMonthlyPayment(monthly.toFixed(2));
        }
    }, [formData.montant, formData.duree, interestRate]);

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
            if (!formData.email) newErrors.email = "L'email est obligatoire";
            if (!formData.telephone) newErrors.telephone = "Le téléphone est obligatoire";
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const finalScore = calculateScore();
            // Persistence to Firestore
            await loanService.createLead({
                ...formData,
                taux: interestRate,
                mensualite: monthlyPayment,
                coutTotal: (monthlyPayment * formData.duree).toFixed(2),
                score: finalScore,
                language: i18n.language // Add user's language
            });

            setScore(finalScore);
            setStep(8); // Success/Result step
        } catch (error) {
            console.error("Error submitting lead:", error);
            showToast(t('auth.register.form.error_generic'), "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 1 sur 7</span>
                            <h3 style={styles.stepTitle}>{t('credit.steps.general')}</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.type')} *</label>
                            <select name="typeCredit" value={formData.typeCredit} onChange={handleInputChange} style={styles.input}>
                                <option value="personnel">{t('credit.options.personal')}</option>
                                <option value="consommation">{t('credit.options.consumption')}</option>
                                <option value="automobile">{t('credit.options.auto')}</option>
                                <option value="immobilier">{t('credit.options.real_estate')}</option>
                                <option value="professionnel">{t('credit.options.pro')}</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.amount')} *</label>
                            <input type="number" name="montant" value={formData.montant} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.montant ? 'red' : '#e0e0e0' }} />
                            {errors.montant && <span style={styles.errorText}>{errors.montant}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.duration')} *</label>
                            <input type="number" name="duree" value={formData.duree} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.object')} *</label>
                            <textarea
                                name="objet"
                                value={formData.objet}
                                onChange={handleInputChange}
                                style={{ ...styles.textarea, borderColor: errors.objet ? 'red' : '#e0e0e0' }}
                                placeholder=""
                            />
                            {errors.objet && <span style={styles.errorText}>{errors.objet}</span>}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>{t('credit.fields.rate')} : {interestRate}%</label>
                            <input
                                type="range"
                                min="1.0"
                                max="15.0"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer', height: '6px', appearance: 'none', background: '#e2e8f0', borderRadius: '3px', outline: 'none' }}
                            />
                        </div>

                        {/* Simulation Result Box */}
                        <div style={{
                            background: '#f8fbff',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #e3f2fd',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{t('credit.fields.rate')} (TAEG)</span>
                                <strong style={{ color: '#003366' }}>{interestRate}%</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666', fontSize: '0.9rem' }}>{t('credit.fields.monthly')}</span>
                                <strong style={{ color: '#003366', fontSize: '1.4rem' }}>{monthlyPayment} €</strong>
                            </div>
                        </div>

                        <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                    </div>
                );
            case 2:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 2 sur 7</span>
                            <h3 style={styles.stepTitle}>👤 {t('credit.steps.identity')}</h3>
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.civility')} *</label>
                                <select name="civilite" value={formData.civilite} onChange={handleInputChange} style={styles.input}>
                                    <option value="M.">M.</option>
                                    <option value="Mme">Mme</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.lastname')} *</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.nom ? 'red' : '#e0e0e0' }} />
                                {errors.nom && <span style={styles.errorText}>{errors.nom}</span>}
                            </div>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.firstname')} *</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.prenom ? 'red' : '#e0e0e0' }} />
                                {errors.prenom && <span style={styles.errorText}>{errors.prenom}</span>}
                            </div>
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.email')} *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.email ? 'red' : '#e0e0e0' }} placeholder="votre@email.com" />
                                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                            </div>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.phone')} *</label>
                                <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.telephone ? 'red' : '#e0e0e0' }} placeholder={t('credit.fields.phone_placeholder')} />
                                {errors.telephone && <span style={styles.errorText}>{errors.telephone}</span>}
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.dob')} *</label>
                            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.dateNaissance ? 'red' : '#e0e0e0' }} />
                            {errors.dateNaissance && <span style={styles.errorText}>{errors.dateNaissance}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.id_num_warn')}</label>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}></p>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.id_type')} *</label>
                            <select name="typePieceIdentite" value={formData.typePieceIdentite} onChange={handleInputChange} style={styles.input}>
                                <option value="passeport">{t('credit.options.passport')}</option>
                                <option value="cni">{t('credit.options.cni')}</option>
                                <option value="sejour">{t('credit.options.residence')}</option>
                            </select>
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 3 sur 7</span>
                            <h3 style={styles.stepTitle}>🏠 {t('credit.steps.personal')}</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.marital')} *</label>
                            <select name="situationMatrimoniale" value={formData.situationMatrimoniale} onChange={handleInputChange} style={styles.input}>
                                <option value="celibataire">{t('credit.options.single')}</option>
                                <option value="marie">{t('credit.options.married')}</option>
                                <option value="divorce">{t('credit.options.divorced')}</option>
                                <option value="veuf">{t('credit.options.widowed')}</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.children')}</label>
                            <input type="number" name="nbEnfants" value={formData.nbEnfants} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.housing')} *</label>
                            <select name="typeLogement" value={formData.typeLogement} onChange={handleInputChange} style={styles.input}>
                                <option value="proprietaire">{t('credit.options.owner')}</option>
                                <option value="locataire">{t('credit.options.tenant')}</option>
                                <option value="heberge">{t('credit.options.hosted')}</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.street')} *</label>
                            <input type="text" name="adresseRue" value={formData.adresseRue} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseRue ? 'red' : '#e0e0e0' }} placeholder={t('credit.fields.street_placeholder')} />
                            {errors.adresseRue && <span style={styles.errorText}>{errors.adresseRue}</span>}
                        </div>
                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.zip')} *</label>
                                <input type="text" name="adresseCodePostal" value={formData.adresseCodePostal} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseCodePostal ? 'red' : '#e0e0e0' }} placeholder={t('credit.fields.zip_placeholder')} />
                                {errors.adresseCodePostal && <span style={styles.errorText}>{errors.adresseCodePostal}</span>}
                            </div>
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.city')} *</label>
                                <input type="text" name="adresseVille" value={formData.adresseVille} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adresseVille ? 'red' : '#e0e0e0' }} placeholder={t('credit.fields.city_placeholder')} />
                                {errors.adresseVille && <span style={styles.errorText}>{errors.adresseVille}</span>}
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.country')} *</label>
                            <input type="text" name="adressePays" value={formData.adressePays} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.adressePays ? 'red' : '#e0e0e0' }} />
                            {errors.adressePays && <span style={styles.errorText}>{errors.adressePays}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 4 sur 7</span>
                            <h3 style={styles.stepTitle}>💼 {t('credit.steps.professional')}</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.status')} *</label>
                            <select name="statutPro" value={formData.statutPro} onChange={handleInputChange} style={styles.input}>
                                <option value="cdi">{t('credit.options.cdi')}</option>
                                <option value="cdd">{t('credit.options.cdd')}</option>
                                <option value="fonctionnaire">{t('credit.options.official')}</option>
                                <option value="independant">{t('credit.options.freelance')}</option>
                                <option value="entrepreneur">{t('credit.options.entrepreneur')}</option>
                                <option value="retraite">{t('credit.options.retired')}</option>
                                <option value="sans_emploi">{t('credit.options.unemployed')}</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.income')} *</label>
                            <input type="number" name="revenusMensuels" value={formData.revenusMensuels} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.revenusMensuels ? 'red' : '#e0e0e0' }} />
                            {errors.revenusMensuels && <span style={styles.errorText}>{errors.revenusMensuels}</span>}
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.employer')} *</label>
                            <input type="text" name="nomEmployeur" value={formData.nomEmployeur} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.nomEmployeur ? 'red' : '#e0e0e0' }} />
                            {errors.nomEmployeur && <span style={styles.errorText}>{errors.nomEmployeur}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 5 sur 7</span>
                            <h3 style={styles.stepTitle}>💰 {t('credit.steps.financial')}</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.rent')}</label>
                            <input type="number" name="loyer" value={formData.loyer} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.other_credits')}</label>
                            <input type="number" name="autresCredits" value={formData.autresCredits} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.incident')} *</label>
                            <select name="incidentBancaire" value={formData.incidentBancaire} onChange={handleInputChange} style={styles.input}>
                                <option value="non">{t('credit.options.no')}</option>
                                <option value="oui">{t('credit.options.yes')}</option>
                            </select>
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 6 sur 7</span>
                            <h3 style={styles.stepTitle}>🏦 {t('credit.steps.banking')}</h3>
                        </div>
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.current_bank')} *</label>
                            <select
                                name="banqueActuelle"
                                value={formData.banqueActuelle}
                                onChange={handleInputChange}
                                style={{ ...styles.input, borderColor: errors.banqueActuelle ? 'red' : '#e0e0e0' }}
                            >
                                <option value="">{t('credit.options.select_bank')}</option>
                                {frenchBanks.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                            {errors.banqueActuelle && <span style={styles.errorText}>{errors.banqueActuelle}</span>}
                        </div>
                        {formData.banqueActuelle === 'Autres' && (
                            <div style={styles.formGroup}>
                                <label>{t('credit.fields.other_bank')} *</label>
                                <input
                                    type="text"
                                    name="autreBanqueNom"
                                    value={formData.autreBanqueNom}
                                    onChange={handleInputChange}
                                    style={{ ...styles.input, borderColor: errors.autreBanqueNom ? 'red' : '#e0e0e0' }}
                                    placeholder=""
                                />
                                {errors.autreBanqueNom && <span style={styles.errorText}>{errors.autreBanqueNom}</span>}
                            </div>
                        )}
                        <div style={styles.formGroup}>
                            <label>{t('credit.fields.iban')} *</label>
                            <input type="text" name="iban" value={formData.iban} onChange={handleInputChange} style={{ ...styles.input, borderColor: errors.iban ? 'red' : '#e0e0e0' }} placeholder={t('credit.fields.iban_placeholder')} />
                            {errors.iban && <span style={styles.errorText}>{errors.iban}</span>}
                        </div>
                        <div style={styles.row}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={nextStep} style={styles.submitButton}>{t('credit.fields.next')}</button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="form-step">
                        <div style={styles.stepHeader}>
                            <span style={styles.stepNumber}>Étape 7 sur 7</span>
                            <h3 style={styles.stepTitle}>⚖️ {t('credit.steps.consent')}</h3>
                        </div>
                        <div style={styles.checkboxGroup}>
                            <input type="checkbox" name="certifieBase" checked={formData.certifieBase} onChange={handleInputChange} />
                            <label>{t('credit.fields.certify')}</label>
                        </div>
                        <div style={styles.checkboxGroup}>
                            <input type="checkbox" name="autoriseAnalyse" checked={formData.autoriseAnalyse} onChange={handleInputChange} />
                            <label>{t('credit.fields.authorize')}</label>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                            <strong>🔐 {t('credit.fields.privacy').split(':')[0]} :</strong> {t('credit.fields.privacy').split(':')[1]}
                        </div>
                        <div style={{ ...styles.row, marginTop: '2rem' }}>
                            <button onClick={prevStep} style={styles.secondaryButton}>{t('credit.fields.back')}</button>
                            <button onClick={handleSubmit} style={styles.submitButton} disabled={isSubmitting}>
                                {isSubmitting ? t('credit.fields.analyzing') : t('credit.fields.submit')}
                            </button>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div className="form-step" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: 'var(--primary-color)' }}>{t('credit.steps.result')}</h2>
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
                                {score === 'GREEN' ? t('credit.result.green_title') :
                                    score === 'YELLOW' ? t('credit.result.yellow_title') :
                                        t('credit.result.red_title')}
                            </h3>
                            <p style={{ color: '#666' }}>
                                {score === 'GREEN' ? t('credit.result.green_desc') :
                                    score === 'YELLOW' ? t('credit.result.yellow_desc') :
                                        t('credit.result.red_desc')}
                            </p>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                            {t('credit.result.disclaimer')}
                        </p>
                        <button onClick={() => navigate(`/${i18n.language}`)} style={{ ...styles.submitButton, marginTop: '2rem' }}>{t('credit.result.home_btn')}</button>
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
                        <h1>{t('credit.hero.title')}</h1>
                        <p>{t('credit.hero.subtitle')}</p>
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
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e0e0e0',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s'
    },
    textarea: {
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e0e0e0',
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
