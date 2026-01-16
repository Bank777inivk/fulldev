import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { loanService } from '../../services/loanService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const Credits = () => {
    const { currentUser } = useAuth();
    const { loans: history, loading } = useData();
    const [amount, setAmount] = useState(100000);
    const [duration, setDuration] = useState(120); // months
    const [interestRate] = useState(2.5); // 2.5% annual
    const [projectType, setProjectType] = useState('Personnel');
    const [otherType, setOtherType] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateMonthly = () => {
        const r = (interestRate / 100) / 12;
        const n = duration;
        const p = amount;
        if (r === 0) return (p / n).toFixed(2);
        const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return monthly.toFixed(2);
    };

    const handleApply = async () => {
        setSubmitting(true);
        setMessage({ type: '', text: '' });
        try {
            await loanService.applyForLoan(currentUser.uid, {
                amount,
                duration,
                monthlyPayment: calculateMonthly(),
                interestRate,
                type: projectType === 'Autre' ? otherType : projectType
            });
            setMessage({ type: 'success', text: 'Demande envoyée ! Un conseiller vous contactera.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de la demande.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && history.length === 0) return <div style={{ textAlign: 'center', padding: '5rem' }}>Chargement...</div>;

    if (isMobile) {
        return (
            <KycVerificationBanner>
                <div style={{ padding: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>Crédits</h1>

                    <div style={styles.mobileCard}>
                        <h3 style={{ fontSize: '1rem', color: '#003366', marginBottom: '1.5rem' }}>Simulateur</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={styles.label}>Projet</label>
                            <select
                                style={styles.select}
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                            >
                                <option value="Personnel">Prêt Personnel</option>
                                <option value="Immobilier">Crédit Immobilier</option>
                                <option value="Véhicule">Crédit Véhicule</option>
                                <option value="Autre">Autre (Préciser...)</option>
                            </select>
                        </div>

                        {projectType === 'Autre' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={styles.label}>Précisez votre projet</label>
                                <input
                                    style={styles.select}
                                    placeholder="Ex: Voyage, Mariage, Travaux..."
                                    value={otherType}
                                    onChange={(e) => setOtherType(e.target.value)}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={styles.label}>Montant: <strong>{amount.toLocaleString()} €</strong></label>
                            <input type="range" min="1000" max="900000" step="5000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={styles.range} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={styles.label}>Durée: <strong>{duration} mois</strong></label>
                            <input type="range" min="12" max="300" step="12" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={styles.range} />
                        </div>

                        <div style={styles.mobileResult}>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Mensualité</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{calculateMonthly()} €</div>
                        </div>

                        <button style={styles.mobileSubmitBtn} onClick={handleApply} disabled={submitting}>
                            {submitting ? 'Envoi...' : 'Demander ce prêt'}
                        </button>
                        {message.text && <p style={{ color: message.type === 'success' ? '#2ecc71' : '#e74c3c', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>{message.text}</p>}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', color: '#003366', marginBottom: '1rem' }}>Mes demandes</h3>
                        {history.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: '#888' }}>Aucune demande en cours.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {history.map(loan => (
                                    <div key={loan.id} style={styles.mobileHistoryItem}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{loan.amount.toLocaleString()} €</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{loan.duration} mois • {loan.type}</div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '50px', background: '#fff3e0', color: '#e65100', fontWeight: 'bold' }}>
                                            {loan.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </KycVerificationBanner>
        );
    }

    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Crédits & Financements</h1>
                    <p style={styles.subtitle}>Simulez votre projet et obtenez une réponse en 24h.</p>
                </header>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h2 style={{ color: '#003366', marginBottom: '1.5rem' }}>Votre simulation</h2>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Type de projet</label>
                            <select
                                style={styles.select}
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                            >
                                <option value="Personnel">Prêt Personnel</option>
                                <option value="Immobilier">Crédit Immobilier</option>
                                <option value="Véhicule">Crédit Véhicule</option>
                                <option value="Professionnel">Projet Professionnel</option>
                                <option value="Autre">Autre (Préciser...)</option>
                            </select>

                            {projectType === 'Autre' && (
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={styles.label}>Votre projet spécifique</label>
                                    <input
                                        style={styles.select}
                                        placeholder="Décrivez brièvement votre projet..."
                                        value={otherType}
                                        onChange={(e) => setOtherType(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={styles.label}>Montant du prêt</label>
                                <span style={styles.valueDisplay}>{amount.toLocaleString()} €</span>
                            </div>
                            <input type="range" min="5000" max="900000" step="5000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={styles.range} />
                        </div>

                        <div style={styles.inputGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={styles.label}>Durée du remboursement</label>
                                <span style={styles.valueDisplay}>{duration} mois ({Math.floor(duration / 12)} ans)</span>
                            </div>
                            <input type="range" min="12" max="300" step="12" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={styles.range} />
                        </div>

                        <div style={styles.summaryBox}>
                            <div style={styles.summRow}><span>Taux d'intérêt (TAEG)</span><strong>{interestRate}%</strong></div>
                            <div style={styles.summRow}><span>Mensualité estimée</span><strong style={{ fontSize: '1.4rem', color: '#003366' }}>{calculateMonthly()} €</strong></div>
                            <button style={styles.applyBtn} onClick={handleApply} disabled={submitting}>
                                {submitting ? 'Traitement...' : 'Faire une demande officielle'}
                            </button>
                        </div>
                        {message.text && <div style={{ ...styles.alert, background: message.type === 'success' ? '#e8f5e9' : '#ffebee' }}>{message.text}</div>}
                    </div>

                    <div style={styles.historyCard}>
                        <h2 style={{ color: '#003366', marginBottom: '1.5rem' }}>Suivi des demandes</h2>
                        {history.length === 0 ? (
                            <div style={styles.empty}>Vos demandes de crédit apparaîtront ici.</div>
                        ) : (
                            <div style={styles.loanList}>
                                {history.map(loan => (
                                    <div key={loan.id} style={styles.loanItem}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>{loan.amount.toLocaleString()} €</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{loan.type} • {loan.duration} mois</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '0.75rem', display: 'inline-block', padding: '4px 12px', borderRadius: '50px', backgroundColor: '#f5f7fa', fontWeight: 'bold', color: '#555' }}>
                                                {loan.status === 'pending' ? 'Étude en cours' : loan.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </KycVerificationBanner>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' },
    card: { backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    inputGroup: { marginBottom: '2rem' },
    label: { fontSize: '0.9rem', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' },
    select: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #eef2f6', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', marginBottom: '1rem' },
    valueDisplay: { color: '#003366', fontWeight: '800', fontSize: '1.1rem' },
    range: { width: '100%', cursor: 'pointer', margin: '15px 0' },
    summaryBox: { background: '#f8fbff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e3f2fd' },
    summRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    applyBtn: { width: '100%', padding: '1.2rem', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' },
    historyCard: { backgroundColor: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eee' },
    loanList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    loanItem: { padding: '15px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center' },
    empty: { textAlign: 'center', padding: '3rem', color: '#888', fontStyle: 'italic' },
    alert: { marginTop: '1rem', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' },

    // MOBILE
    mobileCard: { background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    mobileResult: { background: '#003366', color: 'white', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem' },
    mobileSubmitBtn: { width: '100%', padding: '14px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
    mobileHistoryItem: { background: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
};

export default Credits;
