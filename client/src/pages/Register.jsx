import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

// --- SUB-COMPONENTS (Extracted to prevent re-renders) ---

const SelectionStep = ({ handleSelectType, styles }) => (
    <div style={styles.selectionContainer} className="fadeInUp register-selection-card">
        <h2 style={styles.gatewayTitle}>Choisissez votre type de compte</h2>
        <p style={styles.gatewaySubtitle}>Une expérience bancaire sur-mesure pour chacun de vos besoins.</p>

        <div style={styles.cardsGrid} className="selection-grid">
            {/* Personal Card */}
            <div
                style={styles.selectionCard}
                className="card-hover register-selection-item"
                onClick={() => handleSelectType('personal')}
            >
                <div style={styles.iconCircle}>👤</div>
                <h3 style={styles.cardTypeTitle}>Particulier</h3>
                <p style={styles.cardTypeDesc}>Gérez votre argent au quotidien, épargnez et accédez à nos crédits personnels.</p>
                <ul style={styles.cardFeatures}>
                    <li>✓ Compte courant & Épargne</li>
                    <li>✓ Cartes Visa / Mastercard</li>
                    <li>✓ Prêts personnels</li>
                </ul>
                <button style={styles.cardBtn}>Ouvrir un compte Particulier</button>
            </div>

            {/* Business Card */}
            <div
                style={styles.selectionCard}
                className="card-hover register-selection-item"
                onClick={() => handleSelectType('business')}
            >
                <div style={styles.iconCircleBlue}>🏢</div>
                <h3 style={styles.cardTypeTitle}>Professionnel</h3>
                <p style={styles.cardTypeDesc}>Des solutions puissantes pour les entreprises, freelances et associations.</p>
                <ul style={styles.cardFeatures}>
                    <li>✓ Gestion de trésorerie</li>
                    <li>✓ Paiements internationaux</li>
                    <li>✓ Crédits professionnels</li>
                </ul>
                <button style={styles.cardBtnBlue}>Ouvrir un compte Business</button>
            </div>
        </div>
    </div>
);

const SecuritySection = ({ formData, handleChange, loading, error, styles, setStep, suffix }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const eyeButtonStyle = {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    };

    return (
        <div style={styles.sectionNoBorder}>
            <h4 style={styles.sectionHeading}>SÉCURITÉ & VALIDATION</h4>
            <div style={styles.formGrid} className="register-form-grid">
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mot de passe sécurisé *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Confirmation du mot de passe *</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{ ...styles.input, paddingRight: '3.5rem' }}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
                            <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div style={styles.checkboxGroup}>
                <input type="checkbox" name="termsAccepted" id={`terms-${suffix}`} checked={formData.termsAccepted} onChange={handleChange} required style={styles.checkbox} />
                <label htmlFor={`terms-${suffix}`} style={styles.checkboxLabel}>
                    Je certifie l'exactitude des informations fournies et j'accepte les <a href="#" style={styles.link}>Conditions Générales d'Utilisation</a> d'INVIK SA.
                </label>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    border: '1px solid #ffcdd2'
                }}>
                    {error}
                </div>
            )}

            <div style={styles.submitContainer}>
                <button
                    type="submit"
                    style={{
                        ...styles.submitBtn,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    className="register-submit-btn"
                    disabled={loading}
                >
                    {loading ? "Création en cours..." : "Finaliser"}
                </button>
                <div style={{ marginTop: '1.5rem' }}>
                    <a onClick={() => setStep(0)} style={{ ...styles.link, fontSize: '0.9rem' }}>← Retour</a>
                </div>
            </div>
        </div>
    );
};

const PersonalForm = ({ formData, handleChange, handleSubmit, loading, error, setStep, view, styles }) => (
    <div className="fadeInUp">
        <h2 style={styles.formTitle}>Inscription Particulier</h2>
        <p style={styles.formSubtitle}>Veuillez remplir vos informations personnelles obligatoires.</p>

        <form onSubmit={handleSubmit}>
            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>1. Identité</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div style={styles.formGroup}><label style={styles.label}>Prénom *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Nom *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Date de naissance *</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Lieu de naissance *</label><input type="text" name="birthPlace" placeholder="Ex: Paris" value={formData.birthPlace} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Sexe *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.select}>
                            <option value="">Choisir...</option><option value="M">Masculin</option><option value="F">Féminin</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Nationalité *</label>
                        <select name="nationality" value={formData.nationality} onChange={handleChange} required style={styles.select}>
                            <option value="">Sélectionner...</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Pays de résidence *</label>
                        <select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select}>
                            <option value="">Sélectionner...</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>2. Coordonnées & Préférences</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>Adresse complète *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Code Postal *</label><input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Ville *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Téléphone mobile *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Email valide *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Devise du compte *</label>
                        <select name="currency" value={formData.currency} onChange={handleChange} required style={styles.select}>
                            <option value="EUR">EUR (€)</option><option value="USD">USD ($)</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Option Épargne *</label>
                        <select name="accountType" value={formData.accountType} onChange={handleChange} required style={styles.select}>
                            <option value="standard">Standard uniquement</option><option value="savings">Avec Épargne & Crédit automatique</option>
                        </select>
                    </div>
                </div>
            </div>

            <SecuritySection
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                error={error}
                styles={styles}
                setStep={setStep}
                suffix={view}
            />
        </form>
    </div>
);

const BusinessForm = ({ formData, handleChange, handleSubmit, loading, error, setStep, view, styles }) => (
    <div className="fadeInUp">
        <h2 style={styles.formTitle}>Inscription Professionnel</h2>
        <p style={styles.formSubtitle}>Formulaire complet pour les entreprises et indépendants.</p>

        <form onSubmit={handleSubmit}>
            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>1. Informations Société</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>Dénomination sociale (Nom de l'entreprise) *</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Forme juridique *</label>
                        <select name="legalForm" value={formData.legalForm} onChange={handleChange} required style={styles.select}>
                            <option value="">Choisir...</option><option value="SARL">SARL / EURL</option><option value="SAS">SAS / SASU</option><option value="SA">SA</option><option value="AUTO">Auto-entrepreneur</option><option value="ASSOC">Association</option><option value="OTHER">Autre</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}><label style={styles.label}>Numéro d'immatriculation (SIRET/TVA/VAT) *</label><input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Secteur d'activité *</label><input type="text" name="activitySector" value={formData.activitySector} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Pays d'immatriculation *</label>
                        <select name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} required style={styles.select}>
                            <option value="">Sélectionner...</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="full-width-mobile" style={{ gridColumn: '1/-1' }}><label style={styles.label}>Adresse du siège social *</label><input type="text" name="address" value={formData.address} onChange={handleChange} required style={styles.input} /></div>
                </div>
            </div>

            <div style={styles.section}>
                <h4 style={styles.sectionHeading}>2. Représentant Légal</h4>
                <div style={styles.formGrid} className="register-form-grid">
                    <div style={styles.formGroup}><label style={styles.label}>Prénom *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Nom *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Lieu de naissance *</label><input type="text" name="birthPlace" placeholder="Ex: Paris" value={formData.birthPlace} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Fonction *</label><input type="text" name="repFunction" placeholder="Ex: Gérant" value={formData.repFunction} onChange={handleChange} required style={styles.input} /></div>
                    <div style={styles.formGroup}><label style={styles.label}>Email professionnel *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} /></div>
                </div>
            </div>

            <SecuritySection
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                error={error}
                styles={styles}
                setStep={setStep}
                suffix={view}
            />
        </form>
    </div>
);

const MobileSelection = ({ handleSelectType }) => (
    <div className="mobile-selection-wrapper">
        <div className="mobile-selection-item" onClick={() => handleSelectType('personal')}>
            <div className="mobile-selection-icon">👤</div>
            <div className="mobile-selection-info">
                <h3>Compte Particulier</h3>
                <p>Pour vos besoins quotidiens</p>
            </div>
            <i className="fas fa-chevron-right"></i>
        </div>
        <div className="mobile-selection-item" onClick={() => handleSelectType('business')}>
            <div className="mobile-selection-icon blue">🏢</div>
            <div className="mobile-selection-info">
                <h3>Compte Professionnel</h3>
                <p>Pour votre entreprise</p>
            </div>
            <i className="fas fa-chevron-right"></i>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useNotifications();
    const [step, setStep] = useState(0); // 0: Selection, 1: Form
    const [userType, setUserType] = useState(null); // 'personal' or 'business'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Joint logic for both forms
    const [formData, setFormData] = useState({
        // Common 
        email: '',
        password: '',
        confirmPassword: '',
        currency: 'EUR',
        termsAccepted: false,

        // Personal Specific
        firstName: '',
        lastName: '',
        dob: '',
        birthPlace: '',
        gender: '',
        nationality: '',
        countryOfResidence: '',
        address: '',
        city: '',
        zipCode: '',
        phone: '',
        accountType: 'standard',

        // Business Specific
        companyName: '',
        legalForm: '',
        registrationNumber: '',
        activitySector: '',
        repFunction: '', // Gérant, Président, etc.
    });

    const handleSelectType = (type) => {
        setUserType(type);
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handleChange = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const name = e.target.name;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setLoading(true);
        try {
            const { email, password, confirmPassword, termsAccepted, ...profileData } = formData;
            await register(email, password, {
                ...profileData,
                userType,
                displayName: userType === 'personal' ? `${formData.firstName} ${formData.lastName}` : formData.companyName
            });

            showToast("Compte créé avec succès ! Un email de vérification a été envoyé à votre adresse.", 'success');
            navigate('/email-verification-pending');
        } catch (err) {
            console.error("Erreur d'inscription:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Cette adresse email est déjà utilisée.");
            } else {
                setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page} className="register-page">
            {/* Desktop Hero - Hidden on mobile */}
            <section style={styles.hero} className="register-hero desktop-only">
                <div style={styles.heroOverlay}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h1 style={styles.heroTitle} className="register-hero-title">Ouvrir un Compte</h1>
                        <p style={styles.heroSubtitle}>Rejoignez INVIK SA, la banque de demain.</p>
                    </div>
                </div>
            </section>

            {/* Mobile Header - Visible only on mobile */}
            <div className="mobile-register-header">
                <button onClick={() => step === 1 ? setStep(0) : navigate(-1)} className="mobile-back-btn">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h1>{step === 0 ? "Inscription" : (userType === 'personal' ? "Particulier" : "Professionnel")}</h1>
                <div style={{ width: '40px' }}></div> {/* Spacer */}
            </div>

            <div className="container" style={styles.formContainer}>
                {/* Desktop Version */}
                <div className="desktop-register-view">
                    {step === 0 ? (
                        <SelectionStep handleSelectType={handleSelectType} styles={styles} />
                    ) : (
                        <div style={styles.formCard} className="register-form-card">
                            {userType === 'personal' ? (
                                <PersonalForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="desktop"
                                    styles={styles}
                                />
                            ) : (
                                <BusinessForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="desktop"
                                    styles={styles}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Version Rendering */}
                <div className="mobile-register-view">
                    {step === 0 ? (
                        <MobileSelection handleSelectType={handleSelectType} />
                    ) : (
                        <div className="mobile-form-container">
                            {userType === 'personal' ? (
                                <PersonalForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="mobile"
                                    styles={styles}
                                />
                            ) : (
                                <BusinessForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    loading={loading}
                                    error={error}
                                    setStep={setStep}
                                    view="mobile"
                                    styles={styles}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f0f2f5', paddingBottom: '5rem' },
    hero: {
        backgroundImage: 'url(/service/service-8.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
        height: '280px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    heroOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    heroTitle: { color: 'white', fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' },
    heroSubtitle: { color: '#e0e0e0', fontSize: '1.1rem' },

    formContainer: { maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', marginTop: '-3rem', position: 'relative', zIndex: 10 },

    // Selection Gateway Styles
    selectionContainer: { textAlign: 'center', backgroundColor: 'white', padding: '4rem 3rem', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' },
    gatewayTitle: { fontSize: '2rem', color: '#003366', fontWeight: '800', marginBottom: '1rem' },
    gatewaySubtitle: { color: '#666', marginBottom: '3.5rem', fontSize: '1.1rem' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' },
    selectionCard: {
        backgroundColor: '#f8fbff', padding: '3rem 2rem', borderRadius: '16px', cursor: 'pointer', textAlign: 'center',
        border: '2px solid transparent', transition: 'all 0.3s ease'
    },
    iconCircle: { width: '80px', height: '80px', backgroundColor: '#eef6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' },
    iconCircleBlue: { width: '80px', height: '80px', backgroundColor: '#003366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' },
    cardTypeTitle: { fontSize: '1.5rem', fontWeight: '800', color: '#003366', marginBottom: '1rem' },
    cardTypeDesc: { color: '#555', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' },
    cardFeatures: { listStyle: 'none', padding: 0, margin: '0 0 2rem', textAlign: 'left', color: '#666', fontSize: '0.9rem' },
    cardBtn: { width: '100%', padding: '1rem', backgroundColor: '#00ccff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
    cardBtnBlue: { width: '100%', padding: '1rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },

    // Form Styles
    formCard: { backgroundColor: 'white', padding: '4rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    formTitle: { fontSize: '2.2rem', color: '#003366', fontWeight: '800', textAlign: 'center', marginBottom: '0.5rem' },
    formSubtitle: { textAlign: 'center', color: '#666', marginBottom: '3.5rem', fontSize: '1rem' },
    section: { marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #f0f0f0' },
    sectionNoBorder: { marginBottom: 0 },
    sectionHeading: { fontSize: '1rem', color: '#00ccff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' },
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontSize: '0.9rem', fontWeight: '700', color: '#1a1a1a' },
    input: { padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fcfcfc', outline: 'none' },
    select: { padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fcfcfc', color: '#333', cursor: 'pointer', outline: 'none' },
    checkboxGroup: { display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '3rem' },
    checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
    checkboxLabel: { fontSize: '0.9rem', color: '#555', lineHeight: '1.5' },
    submitContainer: { textAlign: 'center' },
    submitBtn: { padding: '1.2rem 4rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0, 51, 102, 0.2)' },
    link: { color: '#00ccff', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' },
};

export default Register;
