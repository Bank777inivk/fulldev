import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { currentUser, userData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <div style={styles.dashboardPage}>
            <div className="container" style={styles.container}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.welcome}>Bonjour, {userData?.firstName || currentUser?.email}</h1>
                        <p style={styles.date}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Déconnexion</button>
                </header>

                <div style={styles.statsGrid}>
                    <div style={styles.card}>
                        <h3 style={styles.cardLabel}>Compte Principal</h3>
                        <p style={styles.balance}>0,00 €</p>
                        <p style={styles.cardInfo}>IBAN: FR76 ... 1234</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardLabel}>Épargne</h3>
                        <p style={{ ...styles.balance, color: '#27ae60' }}>0,00 €</p>
                        <p style={styles.cardInfo}>Taux: 2.5% / an</p>
                    </div>
                    <div style={styles.card}>
                        <h3 style={styles.cardLabel}>Crédit en cours</h3>
                        <p style={{ ...styles.balance, color: '#e74c3c' }}>0,00 €</p>
                        <p style={styles.cardInfo}>Prochaine échéance: --</p>
                    </div>
                </div>

                <div style={styles.mainContent}>
                    <div style={styles.transactionsSection}>
                        <h2 style={styles.sectionTitle}>Transactions récentes</h2>
                        <div style={styles.transactionList}>
                            <p style={styles.emptyMsg}>Aucune transaction pour le moment.</p>
                        </div>
                    </div>

                    <div style={styles.actionsSection}>
                        <h2 style={styles.sectionTitle}>Actions rapides</h2>
                        <div style={styles.actionsGrid}>
                            <button style={styles.actionBtn}>Effectuer un virement</button>
                            <button style={styles.actionBtn}>Demander un crédit</button>
                            <button style={styles.actionBtn}>Recharger mon compte</button>
                            <button style={styles.actionBtn}>Mes cartes bancaires</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    dashboardPage: {
        minHeight: '100vh',
        backgroundColor: '#f4f7fa',
        padding: '2rem 1rem',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
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
    logoutBtn: {
        padding: '0.6rem 1.2rem',
        backgroundColor: 'transparent',
        border: '1px solid #e74c3c',
        color: '#e74c3c',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem',
    },
    card: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    cardLabel: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    balance: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#003366',
        margin: '0 0 1rem 0',
    },
    cardInfo: {
        fontSize: '0.85rem',
        color: '#888',
        margin: 0,
    },
    mainContent: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
    },
    transactionsSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    actionsSection: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: '#003366',
        fontWeight: '700',
        marginBottom: '1.5rem',
    },
    transactionList: {
        textAlign: 'center',
        padding: '2rem 0',
    },
    emptyMsg: {
        color: '#999',
        fontStyle: 'italic',
    },
    actionsGrid: {
        display: 'grid',
        gap: '1rem',
    },
    actionBtn: {
        padding: '1rem',
        backgroundColor: '#f8fbff',
        border: '1px solid #eef6ff',
        borderRadius: '8px',
        color: '#003366',
        textAlign: 'left',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    }
};

export default Dashboard;
