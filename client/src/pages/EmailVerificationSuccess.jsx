import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';

const EmailVerificationSuccess = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const verifyEmail = async () => {
            const mode = searchParams.get('mode');
            const oobCode = searchParams.get('oobCode');

            if (mode === 'verifyEmail' && oobCode) {
                try {
                    await applyActionCode(auth, oobCode);
                    setStatus('success');

                    // Logout user after verification
                    setTimeout(async () => {
                        await logout();
                    }, 1000);

                } catch (error) {
                    console.error('Email verification error:', error);
                    setStatus('error');
                }
            } else {
                setStatus('error');
            }
        };

        verifyEmail();
    }, [searchParams, logout]);

    useEffect(() => {
        if (status === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (status === 'success' && countdown === 0) {
            navigate('/login');
        }
    }, [status, countdown, navigate]);

    if (status === 'verifying') {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.spinner}></div>
                    <h1 style={styles.title}>Vérification en cours...</h1>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={{ ...styles.iconBox, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <i className="fas fa-times" style={styles.icon}></i>
                    </div>
                    <h1 style={styles.title}>Erreur de vérification</h1>
                    <p style={styles.description}>
                        Le lien de vérification est invalide ou a expiré.
                    </p>
                    <button style={styles.btn} onClick={() => navigate('/login')}>
                        Retour à la connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.iconBox}>
                    <i className="fas fa-check-circle" style={styles.icon}></i>
                </div>
                <h1 style={styles.title}>Email vérifié avec succès !</h1>
                <p style={styles.description}>
                    Votre adresse email a été confirmée. Vous pouvez maintenant vous connecter à votre compte.
                </p>
                <div style={styles.countdownBox}>
                    <p style={styles.countdownText}>Redirection vers la page de connexion dans</p>
                    <div style={styles.countdownNumber}>{countdown}</div>
                </div>
                <button style={styles.btn} onClick={() => navigate('/login')}>
                    Se connecter maintenant
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#003366', padding: '2rem' },
    card: { maxWidth: '500px', width: '100%', background: 'white', borderRadius: '30px', padding: '3rem', boxShadow: '0 50px 100px rgba(0, 0, 0, 0.2)', textAlign: 'center' },
    iconBox: { width: '100px', height: '100px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' },
    icon: { fontSize: '3rem', color: 'white' },
    title: { fontSize: '2rem', fontWeight: '900', color: '#1a202c', marginBottom: '1rem' },
    description: { fontSize: '1.1rem', color: '#4a5568', marginBottom: '2rem', lineHeight: '1.6' },
    countdownBox: { background: '#f7fafc', padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem' },
    countdownText: { fontSize: '0.9rem', color: '#718096', marginBottom: '0.5rem' },
    countdownNumber: { fontSize: '3rem', fontWeight: '900', color: '#003366' },
    btn: { padding: '1rem 2rem', background: '#003366', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0, 51, 102, 0.3)', width: '100%' },
    spinner: { width: '60px', height: '60px', border: '5px solid #f3f3f3', borderTop: '5px solid #003366', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }
};

export default EmailVerificationSuccess;
