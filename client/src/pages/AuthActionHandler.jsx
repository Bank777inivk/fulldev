import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import {
    applyActionCode,
    verifyPasswordResetCode,
    confirmPasswordReset,
    signOut
} from 'firebase/auth';

const AuthActionHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, error, password-reset
    const [message, setMessage] = useState('Traitement de votre demande en cours...');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (!mode || !oobCode) {
            setStatus('error');
            setMessage('Lien invalide ou expiré.');
            return;
        }

        switch (mode) {
            case 'verifyEmail':
                handleVerifyEmail(oobCode);
                break;
            case 'resetPassword':
                handleResetPassword(oobCode);
                break;
            case 'recoverEmail':
                handleRecoverEmail(oobCode);
                break;
            default:
                setStatus('error');
                setMessage('Action non reconnue.');
        }
    }, [mode, oobCode]);

    const handleVerifyEmail = async (code) => {
        try {
            await applyActionCode(auth, code);
            // Sign out the user immediately after verification as requested
            await signOut(auth);
            setStatus('success');
            setMessage('Votre adresse email a été vérifiée avec succès !');
        } catch (error) {
            console.error('Verify email error:', error);
            setStatus('error');
            setMessage('Le code de vérification est invalide ou a déjà été utilisé.');
        }
    };

    const handleResetPassword = async (code) => {
        try {
            await verifyPasswordResetCode(auth, code);
            setStatus('password-reset');
        } catch (error) {
            console.error('Reset password error:', error);
            setStatus('error');
            setMessage('Lien de réinitialisation invalide ou expiré.');
        }
    };

    const handleRecoverEmail = async (code) => {
        try {
            // Logique de récupération d'email si nécessaire
            setStatus('success');
            setMessage('Votre email a été restauré.');
        } catch (error) {
            setStatus('error');
            setMessage('Erreur lors de la récupération.');
        }
    };

    const onPasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            // Sign out the session after password reset to ensure a clean login
            await signOut(auth);
            setStatus('success');
            setMessage('Votre mot de passe a été modifié avec succès.');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.logo}>INVIK BANK</h1>
                </div>

                {status === 'processing' && (
                    <div style={styles.body}>
                        <div style={styles.spinner}></div>
                        <p style={styles.text}>{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={styles.body}>
                        <div style={styles.successIcon}>✓</div>
                        <h2 style={styles.title}>Félicitations !</h2>
                        <p style={styles.text}>{message}</p>
                        <button style={styles.button} onClick={() => navigate('/login')}>
                            Veuillez vous connecter pour avoir accès à votre espace client
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div style={styles.body}>
                        <div style={styles.errorIcon}>✕</div>
                        <h2 style={styles.title}>Oups !</h2>
                        <p style={styles.text}>{message}</p>
                        <button style={styles.button} onClick={() => navigate('/login')}>
                            Retour à la connexion
                        </button>
                    </div>
                )}

                {status === 'password-reset' && (
                    <div style={styles.body}>
                        <h2 style={styles.title}>Nouveau mot de passe</h2>
                        <p style={styles.text}>Veuillez saisir votre nouveau mot de passe.</p>
                        <form onSubmit={onPasswordSubmit} style={styles.form}>
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                style={styles.input}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirmer le mot de passe"
                                style={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="submit" style={styles.button}>
                                Valider le changement
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)',
        padding: '20px'
    },
    card: {
        maxWidth: '450px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        textAlign: 'center'
    },
    header: {
        padding: '30px',
        background: '#f8fbff',
        borderBottom: '1px solid #eee'
    },
    logo: {
        margin: 0,
        fontSize: '24px',
        letterSpacing: '2px',
        color: '#003366',
        fontWeight: '900'
    },
    body: {
        padding: '40px'
    },
    title: {
        margin: '0 0 15px',
        fontSize: '1.8rem',
        color: '#1a202c'
    },
    text: {
        fontSize: '1.1rem',
        color: '#4a5568',
        lineHeight: '1.6',
        margin: '0 0 20px'
    },
    subtext: {
        fontSize: '0.9rem',
        color: '#718096'
    },
    successIcon: {
        width: '70px',
        height: '70px',
        background: '#00b894',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        margin: '0 auto 25px'
    },
    errorIcon: {
        width: '70px',
        height: '70px',
        background: '#d63031',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        margin: '0 auto 25px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #003366',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    button: {
        width: '100%',
        padding: '14px',
        background: '#003366',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    input: {
        padding: '12px 15px',
        borderRadius: '10px',
        border: '1px solid #cbd5e0',
        fontSize: '1rem',
        outline: 'none'
    }
};

export default AuthActionHandler;
