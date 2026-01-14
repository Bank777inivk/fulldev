import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreditRequest = () => {
    const navigate = useNavigate();
    const [loanType, setLoanType] = useState('personal');
    const [amount, setAmount] = useState(10000);
    const [duration, setDuration] = useState(24);

    const calculateMonthly = () => {
        const rate = 0.029; // 2.9%
        const monthlyRate = rate / 12;
        const x = Math.pow(1 + monthlyRate, duration);
        const monthly = (amount * x * monthlyRate) / (x - 1);
        return monthly.toFixed(2);
    };

    return (
        <div style={styles.page}>
            <section style={styles.hero}>
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>Demande de Crédit</h1>
                        <p style={styles.heroSubtitle}>Réalisez vos projets avec un financement adapté</p>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '4rem 2rem' }}>
                <div style={styles.grid}>
                    {/* Formulaire */}
                    <div style={styles.formCard}>
                        <h2 style={styles.sectionTitle}>Votre Projet</h2>
                        <form style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Type de projet</label>
                                <select
                                    style={styles.select}
                                    value={loanType}
                                    onChange={(e) => setLoanType(e.target.value)}
                                >
                                    <option value="personal">Prêt Personnel</option>
                                    <option value="real_estate">Crédit Immobilier</option>
                                    <option value="auto">Crédit Auto</option>
                                    <option value="works">Travaux</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Montant souhaité: {amount.toLocaleString()} €</label>
                                <input
                                    type="range"
                                    min="1000"
                                    max="500000"
                                    step="1000"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    style={styles.range}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Durée: {duration} mois ({duration / 12} ans)</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="300"
                                    step="12"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    style={styles.range}
                                />
                            </div>

                            <div style={styles.resultBox}>
                                <div style={styles.resultItem}>
                                    <span>Mensualité estimée</span>
                                    <span style={styles.monthlyAmount}>{calculateMonthly()} € / mois</span>
                                </div>
                                <div style={styles.resultItem}>
                                    <span>Taux (TAEG fixe)</span>
                                    <span>2.90 %</span>
                                </div>
                            </div>

                            <h3 style={{ ...styles.sectionTitle, fontSize: '1.5rem', marginTop: '2rem' }}>Vos Coordonnées</h3>

                            <div style={styles.row}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Nom</label>
                                    <input type="text" style={styles.input} placeholder="Votre nom" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Prénom</label>
                                    <input type="text" style={styles.input} placeholder="Votre prénom" />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input type="email" style={styles.input} placeholder="email@exemple.com" />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Revenu mensuel net</label>
                                <input type="number" style={styles.input} placeholder="Ex: 2500" />
                            </div>

                            <button type="button" style={styles.submitButton} onClick={() => alert('Demande envoyée avec succès ! Un conseiller vous recontactera sous 24h.')}>
                                Envoyer ma demande
                            </button>
                        </form>
                    </div>

                    {/* Info Side */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>Pourquoi nous choisir ?</h3>
                        <ul style={styles.benefitList}>
                            <li style={styles.benefitItem}>
                                <span style={styles.check}>✓</span> Réponse de principe immédiate
                            </li>
                            <li style={styles.benefitItem}>
                                <span style={styles.check}>✓</span> Aucuns frais de dossier
                            </li>
                            <li style={styles.benefitItem}>
                                <span style={styles.check}>✓</span> Taux fixes compétitifs
                            </li>
                            <li style={styles.benefitItem}>
                                <span style={styles.check}>✓</span> Assurance emprunteur incluse
                            </li>
                        </ul>
                        <div style={styles.helpBox}>
                            <h4>Besoin d'aide ?</h4>
                            <p>Nos conseillers sont disponibles au :</p>
                            <p style={styles.phone}>01 23 45 67 89</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
    },
    hero: {
        backgroundImage: 'url(/service/service-5.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        color: 'white',
        fontSize: '3rem',
        marginBottom: '1rem',
        textAlign: 'center',
        fontWeight: '800',
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '1.2rem',
        textAlign: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    infoCard: {
        backgroundColor: 'var(--primary-color)',
        padding: '2.5rem',
        borderRadius: '16px',
        color: 'white',
        height: 'fit-content',
    },
    sectionTitle: {
        color: 'var(--primary-color)',
        marginBottom: '2rem',
        fontSize: '1.8rem',
        fontWeight: '700',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    label: {
        fontWeight: '600',
        color: '#333',
    },
    input: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    select: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    range: {
        width: '100%',
        cursor: 'pointer',
    },
    resultBox: {
        backgroundColor: '#f0f7ff',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid #cce5ff',
        marginTop: '1rem',
    },
    resultItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        fontSize: '1.1rem',
        color: '#555',
    },
    monthlyAmount: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary-color)',
    },
    submitButton: {
        backgroundColor: '#00ccff',
        color: 'var(--primary-color)',
        padding: '1.2rem',
        borderRadius: '50px',
        border: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '1rem',
        boxShadow: '0 4px 15px rgba(0,204,255,0.3)',
    },
    infoTitle: {
        fontSize: '1.8rem',
        marginBottom: '2rem',
        fontWeight: '700',
    },
    benefitList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    benefitItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.9)',
    },
    check: {
        color: '#00ccff',
        fontWeight: 'bold',
        fontSize: '1.2rem',
    },
    helpBox: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '2rem',
        textAlign: 'center',
    },
    phone: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#00ccff',
        marginTop: '0.5rem',
    }
};

export default CreditRequest;
