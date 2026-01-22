import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { loanService } from '../services/loanService';

const Simulator = () => {
    const { showToast } = useNotifications();
    const [amount, setAmount] = useState(10000);
    const [duration, setDuration] = useState(24);
    const [email, setEmail] = useState('');
    const [interestRate, setInterestRate] = useState(3.0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalCost, setTotalCost] = useState(0);

    // Calculate rate based on amount tiers
    useEffect(() => {
        let rate = 3.5;
        if (amount > 50000) rate = 2.0;
        else if (amount > 20000) rate = 2.5;
        else if (amount > 5000) rate = 3.0;

        setInterestRate(rate);
    }, [amount]);

    // Calculate monthly payment and total
    useEffect(() => {
        const monthlyRate = interestRate / 100 / 12;
        const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
        setMonthlyPayment(payment);
        setTotalCost(payment * duration);
    }, [amount, duration, interestRate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const leadData = {
                email,
                montant: amount,
                duree: duration,
                mensualite: monthlyPayment,
                coutTotal: totalCost,
                taux: interestRate,
                typeCredit: 'Simulation Simulateur',
                nom: 'Prospect Simulateur',
                score: amount > 50000 ? 'GREEN' : 'YELLOW'
            };

            await loanService.createLead(leadData);
            showToast(`Votre simulation a été envoyée avec succès à ${email}.`, 'success');
        } catch (error) {
            console.error("Simulator lead error:", error);
            showToast("Erreur lors de l'envoi de la simulation.", "error");
        }
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>Simulateur de Crédit</h1>
            <p style={{ textAlign: 'center', marginBottom: '3rem' }}>Estimez vos mensualités en quelques clics. Réponse de principe immédiate.</p>

            <div style={styles.simulatorCard}>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Montant du projet : <span style={styles.value}>{amount.toLocaleString()} €</span></label>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            style={styles.range}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Durée : <span style={styles.value}>{duration} mois</span></label>
                        <input
                            type="range"
                            min="6"
                            max="120"
                            step="6"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            style={styles.range}
                        />
                    </div>

                    <div style={styles.results}>
                        <div style={styles.resultItem}>
                            <span>Taux (TAEG)</span>
                            <span style={styles.resultValue}>{interestRate}%</span>
                        </div>
                        <div style={styles.resultItem}>
                            <span>Mensualité</span>
                            <span style={styles.resultValueHighlight}>{monthlyPayment.toFixed(2)} €</span>
                        </div>
                        <div style={styles.resultItem}>
                            <span>Coût total</span>
                            <span style={styles.resultValue}>{totalCost.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div style={styles.emailSection}>
                        <label style={styles.label}>Recevoir ma simulation par email</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                            />
                            <button type="submit" style={styles.button}>Envoyer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    simulatorCard: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #eee',
    },
    formGroup: {
        marginBottom: '2rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#333',
    },
    value: {
        color: 'var(--primary-color)',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        float: 'right',
    },
    range: {
        width: '100%',
        cursor: 'pointer',
        accentColor: 'var(--primary-color)',
    },
    results: {
        backgroundColor: '#f5f7fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    resultItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    resultValue: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginTop: '0.5rem',
    },
    resultValueHighlight: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--primary-color)',
        marginTop: '0.5rem',
    },
    emailSection: {
        borderTop: '1px solid #eee',
        paddingTop: '2rem',
    },
    input: {
        flex: 1,
        padding: '0.8rem',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '1rem',
    },
    button: {
        whiteSpace: 'nowrap',
    }
};

export default Simulator;
