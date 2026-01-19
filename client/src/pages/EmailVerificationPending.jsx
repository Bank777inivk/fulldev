import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';

const EmailVerificationPending = () => {
    const { user, checkEmailVerification, logout } = useAuth();
    const navigate = useNavigate();
    const [resendStatus, setResendStatus] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        // If user is verified, redirect to dashboard
        if (user?.emailVerified) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Auto-poll for verification status every 3 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            if (user && !user.emailVerified) {
                try {
                    await checkEmailVerification();
                } catch (error) {
                    console.log("Auto-check failed", error);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user, checkEmailVerification]);

    const handleResendEmail = async () => {
        try {
            await sendEmailVerification(user);
            setResendStatus('Email de vérification renvoyé avec succès !');
            setTimeout(() => setResendStatus(''), 5000);
        } catch (error) {
            setResendStatus('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconBox}>
                    <i className="fas fa-envelope" style={styles.icon}></i>
                </div>
                <h1 style={styles.title}>Vérifiez votre adresse email</h1>
                <p style={styles.description}>
                    Un email de vérification a été envoyé à <strong>{user?.email}</strong>
                </p>
                <p style={styles.instructions}>
                    Veuillez cliquer sur le lien dans l'email, cette page se rafraîchira automatiquement.
                </p>

                {resendStatus && (
                    <div style={{ ...styles.alert, background: resendStatus.includes('succès') ? '#e8f5e9' : '#fff3e0', color: resendStatus.includes('succès') ? '#2e7d32' : '#e65100' }}>
                        {resendStatus}
                    </div>
                )}

                <div style={styles.actions}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <div style={styles.spinner}></div>
                        <p style={{ color: '#718096', fontSize: '0.9rem' }}>En attente de validation...</p>
                    </div>
                    <button style={styles.secondaryBtn} onClick={handleResendEmail}>
                        Renvoyer l'email de vérification
                    </button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Retour à la connexion
                    </button>
                </div>

                <div style={styles.helpText}>
                    <p>Vous n'avez pas reçu l'email ?</p>
                    <ul style={styles.helpList}>
                        <li>Vérifiez votre dossier spam/courrier indésirable</li>
                        <li>Assurez-vous que l'adresse email est correcte</li>
                        <li>Attendez quelques minutes avant de renvoyer</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#003366', padding: '2rem' },
    card: { maxWidth: '500px', width: '100%', background: 'white', borderRadius: '30px', padding: '3rem', boxShadow: '0 50px 100px rgba(0, 0, 0, 0.2)', textAlign: 'center' },
    iconBox: { width: '100px', height: '100px', background: '#003366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' },
    icon: { fontSize: '3rem', color: 'white' },
    title: { fontSize: '2rem', fontWeight: '900', color: '#1a202c', marginBottom: '1rem' },
    description: { fontSize: '1.1rem', color: '#4a5568', marginBottom: '1rem', lineHeight: '1.6' },
    instructions: { fontSize: '0.95rem', color: '#718096', marginBottom: '2rem', lineHeight: '1.5' },
    alert: { padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 'bold' },
    actions: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
    primaryBtn: { padding: '1rem 2rem', background: '#003366', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0, 51, 102, 0.3)' },
    secondaryBtn: { padding: '1rem 2rem', background: 'transparent', color: '#003366', border: '2px solid #003366', borderRadius: '15px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
    logoutBtn: { padding: '0.8rem', background: 'transparent', color: '#718096', border: 'none', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' },
    helpText: { textAlign: 'left', background: '#f7fafc', padding: '1.5rem', borderRadius: '15px', fontSize: '0.9rem', color: '#4a5568' },
    helpList: { marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' },
    spinner: { width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #003366', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem' }
};

export default EmailVerificationPending;
