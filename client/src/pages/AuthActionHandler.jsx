import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase/config';
import {
    applyActionCode,
    verifyPasswordResetCode,
    confirmPasswordReset,
    signOut
} from 'firebase/auth';

const AuthActionHandler = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [messageKey, setMessageKey] = useState('auth.action_handler.processing');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        // Force language sync if lang parameter is present
        const langParam = searchParams.get('lang');
        if (langParam && i18n.language !== langParam) {
            i18n.changeLanguage(langParam);
        }
    }, [searchParams, i18n]);

    useEffect(() => {
        if (!mode || !oobCode) {
            setStatus('error');
            setMessageKey('auth.action_handler.invalid_link');
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
                setMessageKey('auth.action_handler.unknown_action');
        }
    }, [mode, oobCode]);

    const handleVerifyEmail = async (code) => {
        try {
            await applyActionCode(auth, code);
            // Sign out the user immediately after verification as requested
            await signOut(auth);
            setStatus('success');
            setMessageKey('auth.action_handler.verify_email.success');
        } catch (error) {
            console.error('Verify email error:', error);
            setStatus('error');
            setMessageKey('auth.action_handler.verify_email.error');
        }
    };

    const handleResetPassword = async (code) => {
        try {
            await verifyPasswordResetCode(auth, code);
            setStatus('password-reset');
        } catch (error) {
            console.error('Reset password error:', error);
            setStatus('error');
            setMessageKey('auth.action_handler.reset_password.invalid');
        }
    };

    const handleRecoverEmail = async (code) => {
        try {
            // Logique de récupération d'email si nécessaire
            setStatus('success');
            setMessageKey('auth.action_handler.recover_email.success');
        } catch (error) {
            setStatus('error');
            setMessageKey('auth.action_handler.recover_email.error');
        }
    };

    const onPasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert(t('auth.action_handler.reset_password.mismatch'));
            return;
        }
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            // Sign out the session after password reset to ensure a clean login
            await signOut(auth);
            setStatus('success');
            setMessageKey('auth.action_handler.reset_password.success');
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
                        <p style={styles.text}>{t(messageKey)}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={styles.body}>
                        <div style={styles.successIcon}>✓</div>
                        <h2 style={styles.title}>{t('auth.action_handler.titles.success')}</h2>
                        <p style={styles.text}>{t(messageKey)}</p>
                        <button style={styles.button} onClick={() => navigate(`/${i18n.language}/login`)}>
                            {t('auth.action_handler.buttons.login')}
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div style={styles.body}>
                        <div style={styles.errorIcon}>✕</div>
                        <h2 style={styles.title}>{t('auth.action_handler.titles.error')}</h2>
                        <p style={styles.text}>{t(messageKey)}</p>
                        <button style={styles.button} onClick={() => navigate(`/${i18n.language}/login`)}>
                            {t('auth.action_handler.buttons.back_login')}
                        </button>
                    </div>
                )}

                {status === 'password-reset' && (
                    <div style={styles.body}>
                        <h2 style={styles.title}>{t('auth.action_handler.reset_password.title')}</h2>
                        <p style={styles.text}>{t('auth.action_handler.reset_password.instruction')}</p>
                        <form onSubmit={onPasswordSubmit} style={styles.form}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('auth.action_handler.reset_password.placeholder_new')}
                                    style={styles.input}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder={t('auth.action_handler.reset_password.placeholder_confirm')}
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                            <button type="submit" style={styles.button}>
                                {t('auth.action_handler.reset_password.submit')}
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
        paddingRight: '45px',
        borderRadius: '10px',
        border: '1px solid #cbd5e0',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    },
    eyeIcon: {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default AuthActionHandler;
