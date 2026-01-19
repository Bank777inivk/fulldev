import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import KycVerificationBanner from '../components/dashboard/KycVerificationBanner';

const Dashboard = () => {
    const { currentUser, userData } = useAuth();
    const { wallets, transactions: allTransactions, loading, kycStatus } = useData();
    const navigate = useNavigate();

    const transactions = allTransactions.slice(0, 5);

    const mainAcc = wallets.find(w => w.type === 'main') || { balance: 0, currency: 'EUR', iban: '---' };
    const savingsAcc = wallets.find(w => w.type === 'savings') || { balance: 0, currency: 'EUR' };
    const creditAcc = wallets.find(w => w.type === 'credit') || { balance: 0, currency: 'EUR' };

    if (loading && wallets.length === 0) {
        return <div style={styles.loading}>Préparation de votre espace personnel...</div>;
    }

    return (
        <div style={styles.dashboardContainer}>
            <header style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{ ...styles.welcome, marginBottom: 0 }}>Bonjour, {userData?.firstName || currentUser?.email} 👋</h1>
                    <KycVerificationBanner variant="badge" />
                </div>
                <p style={styles.date}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div style={styles.statsGrid} className="stats-grid-mobile">
                {/* Main Account Card */}
                <div style={styles.mainCard}>
                    <div style={styles.cardHeader}>
                        <h3 style={{ ...styles.cardLabel, color: 'rgba(255,255,255,0.8)' }}>Compte Principal</h3>
                        <i className="fas fa-wallet" style={{ ...styles.cardIcon, color: 'white' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: 'white' }} className="balance-mobile">
                        {mainAcc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {mainAcc.currency}
                    </p>
                    {kycStatus?.status === 'verified' ? (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)' }}>IBAN: {mainAcc.iban.substring(0, 15)}...</p>
                    ) : (
                        <p style={{ ...styles.cardInfo, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                            <i className="fas fa-lock" style={{ marginRight: '5px' }}></i> IBAN masqué (Vérification requise)
                        </p>
                    )}
                </div>

                {/* Savings Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>Épargne</h3>
                        <i className="fas fa-piggy-bank" style={{ ...styles.cardIcon, color: '#27ae60' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: '#27ae60' }} className="balance-mobile">
                        {savingsAcc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {savingsAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>Taux: 2.5% / an</p>
                </div>

                {/* Credit Card */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardLabel}>Compte Crédit</h3>
                        <i className="fas fa-file-invoice-dollar" style={{ ...styles.cardIcon, color: '#e74c3c' }}></i>
                    </div>
                    <p style={{ ...styles.balance, color: '#e74c3c' }} className="balance-mobile">
                        {creditAcc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {creditAcc.currency}
                    </p>
                    <p style={styles.cardInfo}>{creditAcc.balance < 0 ? 'Remboursement en cours' : 'Aucune dette'}</p>
                </div>
            </div>

            <div style={styles.mainContent} className="dashboard-grid-stack">
                <div style={styles.transactionsSection}>
                    <h2 style={styles.sectionTitle}>Transactions récentes</h2>
                    <div style={styles.transactionList}>
                        {transactions.length > 0 ? (
                            transactions.map(t => (
                                <div key={t.id} style={styles.transactionItem}>
                                    <div style={styles.transIconBox}>
                                        <i className={t.type === 'credit' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'}
                                            style={{ color: t.type === 'credit' ? '#27ae60' : '#e74c3c' }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p style={styles.transName}>{t.description || (t.type === 'credit' ? 'Dépôt' : 'Virement')}</p>
                                            {t.status === 'in_review' && (
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    background: '#e0f2fe',
                                                    color: '#0369a1',
                                                    padding: '2px 8px',
                                                    borderRadius: '50px',
                                                    fontWeight: '700',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <i className="fas fa-circle-notch fa-spin"></i> Examen INVIK
                                                </span>
                                            )}
                                        </div>
                                        <p style={styles.transDate}>{t.createdAt?.toDate().toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <p style={{ ...styles.transAmount, color: t.type === 'credit' ? '#27ae60' : '#333' }}>
                                        {t.type === 'credit' ? '+' : '-'}{t.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {t.currency}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                <i className="fas fa-history" style={styles.emptyIcon}></i>
                                <p style={styles.emptyMsg}>Aucune transaction pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.actionsSection}>
                    <h2 style={styles.sectionTitle}>Actions rapides</h2>
                    <div style={styles.actionsGrid}>
                        <button style={styles.actionBtn} onClick={() => navigate('/dashboard/transfers')}>
                            <i className="fas fa-paper-plane"></i> Effectuer un virement
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/dashboard/credits')}>
                            <i className="fas fa-hand-holding-usd"></i> Demander un crédit
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/dashboard/deposit')}>
                            <i className="fas fa-plus-circle"></i> Ajouter des fonds
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/dashboard/cards')}>
                            <i className="fas fa-credit-card"></i> Mes cartes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        color: '#003366',
        fontSize: '1.2rem',
    },
    header: {
        marginBottom: '2rem',
    },
    welcome: {
        fontSize: '1.8rem',
        color: '#003366',
        fontWeight: '800',
        margin: 0,
    },
    date: {
        color: '#666',
        marginTop: '0.3rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
    },
    mainCard: {
        background: 'linear-gradient(135deg, #003366 0%, #00509e 100%)',
        padding: '1.8rem',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 51, 102, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
    },
    card: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    cardIcon: {
        fontSize: '1.5rem',
        color: '#003366',
        opacity: 0.8,
    },
    cardLabel: {
        fontSize: '0.85rem',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: 0,
    },
    balance: {
        fontSize: '2.2rem',
        fontWeight: '800',
        color: '#003366',
        margin: '0 0 0.5rem 0',
    },
    cardInfo: {
        fontSize: '0.85rem',
        color: '#aaa',
        margin: 0,
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
    },
    transactionsSection: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    actionsSection: {
        backgroundColor: 'white',
        padding: '1.8rem',
        borderRadius: '20px',
        border: '1px solid #eef2f6',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        color: '#003366',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    transactionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0',
        borderBottom: '1px solid #f8fbff',
    },
    transIconBox: {
        width: '40px',
        height: '40px',
        backgroundColor: '#f8fbff',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transName: {
        margin: 0,
        fontWeight: '700',
        color: '#333',
        fontSize: '0.95rem',
    },
    transDate: {
        margin: 0,
        fontSize: '0.8rem',
        color: '#aaa',
    },
    transAmount: {
        margin: 0,
        fontWeight: '800',
        fontSize: '1rem',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: '#ccc',
        padding: '2rem 0',
    },
    emptyIcon: {
        fontSize: '3rem',
    },
    emptyMsg: {
        margin: 0,
        fontStyle: 'italic',
    },
    actionsGrid: {
        display: 'grid',
        gap: '1rem',
    },
    actionBtn: {
        padding: '1.2rem',
        backgroundColor: '#f8fbff',
        border: '1px solid #eef6ff',
        borderRadius: '12px',
        color: '#003366',
        textAlign: 'left',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.95rem',
    }
};

export default Dashboard;
