import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loanService } from '../services/loanService';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const CreditRequestMobile = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useNotifications();

    // Initial values from calculator
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
        typeCredit: 'personnel',
        montant: initialAmount,
        duree: initialDuration,
        objet: '',
        civilite: 'M.',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        dateNaissance: '',
        adresseRue: '',
        adresseCodePostal: '',
        adresseVille: '',
        adressePays: 'France',
        statutPro: 'cdi',
        nomEmployeur: '',
        revenusMensuels: 0,
        loyer: 0,
        autresCredits: 0,
        incidentBancaire: 'non',
        banqueActuelle: '',
        autreBanqueNom: '',
        iban: '',
        certifieBase: true,
        autoriseAnalyse: true
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
            if (!formData.objet) newErrors.objet = "Obligatoire";
            if (!formData.montant || formData.montant <= 0) newErrors.montant = "Obligatoire";
        }
        if (step === 2) {
            if (!formData.nom) newErrors.nom = "Nom requis";
            if (!formData.prenom) newErrors.prenom = "Prénom requis";
            if (!formData.email) newErrors.email = "Email requis";
            if (!formData.telephone) newErrors.telephone = "Téléphone requis";
            if (!formData.dateNaissance) newErrors.dateNaissance = "Date requise";
        }
        if (step === 3) {
            if (!formData.adresseRue) newErrors.adresseRue = "Rue requise";
            if (!formData.adresseCodePostal) newErrors.adresseCodePostal = "CP requis";
        }
        if (step === 6) {
            if (!formData.banqueActuelle) newErrors.banqueActuelle = "Sélectionnez une banque";
            if (!formData.iban) newErrors.iban = "IBAN requis";
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
        const revenus = Number(formData.revenusMensuels);
        const charges = Number(formData.loyer) + Number(formData.autresCredits);
        if (revenus === 0) return 'RED';
        const ratio = (charges / revenus) * 100;
        if (ratio > 45 || formData.incidentBancaire === 'oui') return 'RED';
        if (ratio > 33) return 'YELLOW';
        return 'GREEN';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const finalScore = calculateScore();
            // Persistence to Firestore
            await loanService.createLead({
                ...formData,
                score: finalScore,
                language: i18n.language
            });

            setScore(finalScore);
            setStep(8);
        } catch (error) {
            console.error("Error submitting lead (mobile):", error);
            showToast(t('common.error'), "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>🎯</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.general')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.object')}</label>
                            <textarea
                                name="objet"
                                value={formData.objet}
                                onChange={handleInputChange}
                                style={{ ...styles.mobileTextarea, borderColor: errors.objet ? '#ff4d4d' : '#d1d5db' }}
                                placeholder="Ex: Travaux, Achat véhicule, Voyage..."
                            />
                            {errors.objet && <span style={styles.mobileError}>{errors.objet}</span>}
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.amount')}</label>
                            <div style={styles.inputWrapper}>
                                <input type="number" name="montant" value={formData.montant} onChange={handleInputChange} style={styles.mobileInput} />
                                <span style={styles.inputIcon}>€</span>
                            </div>
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.duration')}</label>
                            <div style={styles.inputWrapper}>
                                <input type="number" name="duree" value={formData.duree} onChange={handleInputChange} style={styles.mobileInput} />
                                <span style={styles.inputIcon}>📅</span>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>👤</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.identity')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.lastname')}</label>
                            <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} style={styles.mobileInput} placeholder={t('credit.fields.lastname')} />
                            {errors.nom && <span style={styles.mobileError}>{errors.nom}</span>}
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.firstname')}</label>
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} style={styles.mobileInput} placeholder={t('credit.fields.firstname')} />
                            {errors.prenom && <span style={styles.mobileError}>{errors.prenom}</span>}
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.email')}</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={styles.mobileInput} placeholder="votre@email.com" />
                            {errors.email && <span style={styles.mobileError}>{errors.email}</span>}
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.phone')}</label>
                            <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} style={styles.mobileInput} placeholder="06 00 00 00 00" />
                            {errors.telephone && <span style={styles.mobileError}>{errors.telephone}</span>}
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.dob')}</label>
                            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} style={styles.mobileInput} />
                            {errors.dateNaissance && <span style={styles.mobileError}>{errors.dateNaissance}</span>}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>📍</div>
                        <h2 style={styles.mobileTitle}>{t('credit.fields.city')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.street')}</label>
                            <input type="text" name="adresseRue" value={formData.adresseRue} onChange={handleInputChange} style={styles.mobileInput} placeholder={t('credit.fields.street_placeholder')} />
                            {errors.adresseRue && <span style={styles.mobileError}>{errors.adresseRue}</span>}
                        </div>
                        <div style={styles.grid2}>
                            <div style={styles.mobileGroup}>
                                <label style={styles.mobileLabel}>{t('credit.fields.zip')}</label>
                                <input type="text" name="adresseCodePostal" value={formData.adresseCodePostal} onChange={handleInputChange} style={styles.mobileInput} placeholder="75001" />
                                {errors.adresseCodePostal && <span style={styles.mobileError}>{errors.adresseCodePostal}</span>}
                            </div>
                            <div style={styles.mobileGroup}>
                                <label style={styles.mobileLabel}>{t('credit.fields.city')}</label>
                                <input type="text" name="adresseVille" value={formData.adresseVille} onChange={handleInputChange} style={styles.mobileInput} placeholder="Paris" />
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>💼</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.professional')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.income')}</label>
                            <div style={styles.inputWrapper}>
                                <input type="number" name="revenusMensuels" value={formData.revenusMensuels} onChange={handleInputChange} style={styles.mobileInput} />
                                <span style={styles.inputIcon}>€</span>
                            </div>
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.employer')}</label>
                            <input type="text" name="nomEmployeur" value={formData.nomEmployeur} onChange={handleInputChange} style={styles.mobileInput} placeholder="Entreprise / Auto-enptrise" />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>💰</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.financial')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.rent')}</label>
                            <div style={styles.inputWrapper}>
                                <input type="number" name="loyer" value={formData.loyer} onChange={handleInputChange} style={styles.mobileInput} />
                                <span style={styles.inputIcon}>🏠</span>
                            </div>
                        </div>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.other_credits')}</label>
                            <div style={styles.inputWrapper}>
                                <input type="number" name="autresCredits" value={formData.autresCredits} onChange={handleInputChange} style={styles.mobileInput} />
                                <span style={styles.inputIcon}>💳</span>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>🏦</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.banking')}</h2>
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.current_bank')}</label>
                            <select name="banqueActuelle" value={formData.banqueActuelle} onChange={handleInputChange} style={styles.mobileInput}>
                                <option value="">{t('credit.options.select_bank')}</option>
                                {frenchBanks.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            {errors.banqueActuelle && <span style={styles.mobileError}>{errors.banqueActuelle}</span>}
                        </div>
                        {formData.banqueActuelle === 'Autres' && (
                            <div style={styles.mobileGroup}>
                                <label style={styles.mobileLabel}>{t('credit.fields.other_bank')}</label>
                                <input type="text" name="autreBanqueNom" value={formData.autreBanqueNom} onChange={handleInputChange} style={styles.mobileInput} />
                            </div>
                        )}
                        <div style={styles.mobileGroup}>
                            <label style={styles.mobileLabel}>{t('credit.fields.iban')}</label>
                            <input type="text" name="iban" value={formData.iban} onChange={handleInputChange} style={styles.mobileInput} placeholder="FR76 XXXX XXXX XXXX" />
                            {errors.iban && <span style={styles.mobileError}>{errors.iban}</span>}
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div style={styles.mobileStep}>
                        <div style={styles.iconCircle}>🛡️</div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.consent')}</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>{t('credit.fields.privacy')}</p>
                        <div style={styles.mobileCheckboxCard}>
                            <input type="checkbox" name="certifieBase" checked={formData.certifieBase} onChange={handleInputChange} id="certif" style={styles.checkbox} />
                            <label htmlFor="certif" style={styles.checkboxLabel}>{t('credit.fields.certify')}</label>
                        </div>
                        <div style={styles.mobileCheckboxCard}>
                            <input type="checkbox" name="autoriseAnalyse" checked={formData.autoriseAnalyse} onChange={handleInputChange} id="auth" style={styles.checkbox} />
                            <label htmlFor="auth" style={styles.checkboxLabel}>{t('credit.fields.authorize')}</label>
                        </div>
                    </div>
                );
            case 8:
                return (
                    <div style={{ ...styles.mobileStep, textAlign: 'center' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: score === 'GREEN' ? '#d1fae5' : score === 'YELLOW' ? '#fef3c7' : '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            margin: '0 auto 2rem auto',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
                        }}>
                            {score === 'GREEN' ? '✅' : score === 'YELLOW' ? '⚠️' : '❌'}
                        </div>
                        <h2 style={styles.mobileTitle}>{t('credit.steps.result')}</h2>
                        <div style={{
                            padding: '2rem',
                            borderRadius: '24px',
                            background: 'white',
                            border: `2px solid ${score === 'GREEN' ? '#10b981' : score === 'YELLOW' ? '#f59e0b' : '#ef4444'}`,
                            marginBottom: '2rem',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
                        }}>
                            <p style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: score === 'GREEN' ? '#065f46' : score === 'YELLOW' ? '#92400e' : '#991b1b',
                                marginBottom: '0.5rem'
                            }}>
                                {score === 'GREEN' ? t('credit.result.green_title') : score === 'YELLOW' ? t('credit.result.yellow_title') : t('credit.result.red_title')}
                            </p>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                {score === 'GREEN' ? t('credit.result.green_desc') :
                                    score === 'YELLOW' ? t('credit.result.yellow_desc') :
                                        t('credit.result.red_desc')}
                            </p>
                        </div>
                        <button onClick={() => navigate('/')} style={styles.mobilePrimaryBtn}>{t('credit.result.home_btn')}</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={styles.mobileContainer}>
            <div style={styles.mobileHeader}>
                <div style={styles.progressHeader}>
                    <div style={styles.progressInfo}>{t('dashboard.pagination.page', { current: step, total: 7 })}</div>
                    <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${(step / 7) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div style={styles.contentArea}>
                {renderStep()}
            </div>

            {step < 8 && (
                <div style={styles.mobileNav}>
                    {step > 1 && (
                        <button onClick={prevStep} style={styles.mobileBackBtn}>
                            <span style={{ fontSize: '1.2rem' }}>←</span>
                        </button>
                    )}
                    {step < 7 ? (
                        <button onClick={nextStep} style={styles.mobilePrimaryBtn}>
                            {t('common.next')}
                        </button>
                    ) : (
                        <button onClick={handleSubmit} style={styles.mobilePrimaryBtn} disabled={isSubmitting}>
                            {isSubmitting ? t('credit.fields.analyzing') : t('credit.fields.submit')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    mobileContainer: {
        minHeight: '100vh',
        backgroundColor: '#f8faff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', sans-serif"
    },
    mobileHeader: {
        padding: '1.5rem 1.5rem 1rem 1.5rem',
        backgroundColor: '#fff',
        borderBottom: '1px solid #eef2f6'
    },
    progressHeader: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    },
    progressInfo: {
        fontSize: '0.9rem',
        color: 'var(--primary-color)',
        fontWeight: '700'
    },
    progressTrack: {
        height: '8px',
        backgroundColor: '#eef2f6',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #00ccff, #003366)',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 10px rgba(0, 204, 255, 0.3)'
    },
    contentArea: {
        flex: 1,
        padding: '2rem 1.5rem',
        overflowY: 'auto'
    },
    mobileStep: {
        animation: 'fadeInSlide 0.4s ease-out'
    },
    iconCircle: {
        width: '56px',
        height: '56px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        marginBottom: '1rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
    },
    mobileTitle: {
        fontSize: '1.8rem',
        color: '#1e293b',
        marginBottom: '2rem',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },
    mobileGroup: {
        marginBottom: '1.5rem'
    },
    grid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    mobileLabel: {
        display: 'block',
        fontSize: '0.85rem',
        color: '#64748b',
        marginBottom: '0.6rem',
        fontWeight: '600'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    mobileInput: {
        width: '100%',
        padding: '1rem',
        borderRadius: '16px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        color: '#1e293b',
        fontWeight: '500'
    },
    inputIcon: {
        position: 'absolute',
        right: '1rem',
        color: '#94a3b8',
        fontSize: '1rem'
    },
    mobileTextarea: {
        width: '100%',
        padding: '1rem',
        borderRadius: '16px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
        fontSize: '1rem',
        minHeight: '100px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#1e293b',
        fontWeight: '500'
    },
    mobileCheckboxCard: {
        display: 'flex',
        gap: '1rem',
        padding: '1.2rem',
        backgroundColor: '#fff',
        borderRadius: '16px',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
    },
    checkbox: {
        width: '20px',
        height: '20px',
        accentColor: '#003366'
    },
    checkboxLabel: {
        fontSize: '0.85rem',
        color: '#475569',
        lineHeight: '1.4'
    },
    mobileNav: {
        padding: '1.2rem 1.5rem',
        backgroundColor: '#fff',
        borderTop: '1px solid #eef2f6',
        display: 'flex',
        gap: '1rem'
    },
    mobilePrimaryBtn: {
        flex: 2,
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '1.1rem',
        borderRadius: '18px',
        fontWeight: '700',
        fontSize: '1rem',
        boxShadow: '0 10px 20px rgba(0, 51, 102, 0.2)',
        transition: 'transform 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mobileBackBtn: {
        width: '60px',
        backgroundColor: '#f1f5f9',
        color: '#1e293b',
        border: 'none',
        borderRadius: '18px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mobileError: {
        color: '#ef4444',
        fontSize: '0.75rem',
        marginTop: '0.4rem',
        fontWeight: '500',
        display: 'block'
    }
};

// Add keyframes via CSS in JSX is not possible directly in styles object
// but we assume Tailwind or index.css handles common animations.
// Let's inject a style tag for the animation.
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);
}

export default CreditRequestMobile;
