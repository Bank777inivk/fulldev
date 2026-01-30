import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { login, resetPassword } = useAuth();
    const { showToast } = useNotifications();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError(t('auth.login.error_empty_email'));
            return;
        }
        setLoading(true);
        try {
            await resetPassword(email);
            setError('');
            showToast(t('auth.login.success_reset'), 'info');
            setIsForgotMode(false); // Optionally return to login mode
        } catch (err) {
            setError(t('auth.login.error_reset'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate(`/${i18n.language}/dashboard`);
        } catch (err) {
            console.error("Erreur de connexion:", err);
            setError(t('auth.login.error_login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page} className="auth-page">
            <div className="container" style={styles.container}>
                <div style={styles.authCard} className="auth-card">

                    <div style={styles.formContent} className="auth-form-content">
                        <h2 style={styles.title}>{t('auth.login.title')}</h2>
                        <p style={styles.subtitle}>{t('auth.login.subtitle')}</p>

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

                        <form onSubmit={isForgotMode ? handleForgotPassword : handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>{t('auth.login.identifier')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    placeholder={t('auth.login.email_placeholder')}
                                    style={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {!isForgotMode && (
                                <>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>{t('auth.login.password')}</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                autoComplete="current-password"
                                                placeholder={t('auth.login.password_placeholder')}
                                                style={{ ...styles.input, paddingRight: '3.5rem' }}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
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
                                                }}
                                            >
                                                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={styles.forgot}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); }} style={styles.link}>{t('auth.login.forgot_password')}</a>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                                disabled={loading}
                            >
                                {loading ? t('auth.login.loading') : (isForgotMode ? t('auth.login.sending') : t('auth.login.submit'))}
                            </button>

                            {isForgotMode && (
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); }} style={styles.link}>{t('auth.login.back_to_login')}</a>
                                </div>
                            )}
                        </form>

                        {!isForgotMode && (
                            <>
                                <div style={styles.divider}>
                                    <span>{t('auth.login.not_client')}</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/${i18n.language}/register`)}
                                    style={styles.registerButton}
                                >
                                    {t('auth.login.open_account')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '80vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    authCard: {
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        overflow: 'hidden',
    },
    formContent: {
        padding: '3rem 2.5rem',
    },
    title: {
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: '#003366',
        fontSize: '1.8rem',
        fontWeight: '800',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: '2.5rem',
        color: '#666',
        fontSize: '0.95rem',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #e1e1e1',
        fontSize: '1rem',
        backgroundColor: '#f8fbff',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box',
    },
    forgot: {
        textAlign: 'right',
        marginBottom: '2rem',
        fontSize: '0.85rem',
    },
    link: {
        color: '#00ccff',
        textDecoration: 'none',
        fontWeight: '500',
    },
    submitButton: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#003366',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '2rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 51, 102, 0.2)',
    },
    divider: {
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '1.5rem',
        marginBottom: '1.5rem',
        color: '#888',
        fontSize: '0.9rem',
    },
    registerButton: {
        width: '100%',
        padding: '1rem',
        backgroundColor: 'white',
        color: '#00ccff',
        border: '2px solid #00ccff',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default Login;
