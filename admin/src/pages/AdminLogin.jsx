import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Échec de la connexion. Vérifiez vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                <div style={styles.loginCard} className="animate-slide-up">
                    <div style={styles.header}>
                        <div style={styles.logoWrapper}>
                            <div style={styles.iconCircle}>
                                <i className="fas fa-shield-alt" style={styles.icon}></i>
                            </div>
                            <div style={styles.pulseRing}></div>
                        </div>
                        <h1 style={styles.title}>BanK <span style={styles.subtitle}>Admin</span></h1>
                        <p style={styles.description}>Portail sécurisé d'administration</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.error} className="animate-fade-in">
                                <i className="fas fa-exclamation-circle"></i>
                                {error}
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-envelope" style={styles.inputIcon}></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={styles.input}
                                    placeholder="admin@inviksa.com"
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mot de passe</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-lock" style={styles.inputIcon}></i>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={styles.input}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <i className="fas fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <div style={styles.secureBadge}>
                            <i className="fas fa-lock"></i>
                            <span>Connexion Sécurisée SSL</span>
                        </div>
                        <p style={styles.copyright}>© 2026 Invik SA. Accès restreint.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #001e3c 0%, #003366 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 204, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 1,
        padding: '2rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    loginCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '3rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    logoWrapper: {
        position: 'relative',
        width: '80px',
        height: '80px',
        margin: '0 auto 1.5rem',
    },
    iconCircle: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 10px 25px rgba(0, 51, 102, 0.3)',
    },
    pulseRing: {
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        right: '-10px',
        bottom: '-10px',
        borderRadius: '50%',
        border: '2px solid rgba(0, 204, 255, 0.3)',
        animation: 'pulse 2s infinite',
    },
    icon: {
        fontSize: '2rem',
        color: 'white',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: 'var(--primary)',
        margin: '0 0 0.5rem 0',
        letterSpacing: '-1px',
    },
    subtitle: {
        color: 'var(--secondary)',
    },
    description: {
        color: 'var(--text-light)',
        fontSize: '1rem',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    error: {
        background: 'var(--danger-light)',
        color: 'var(--danger)',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid rgba(231, 76, 60, 0.2)',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginLeft: '0.25rem',
    },
    inputWrapper: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: '1.25rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-light)',
        transition: '0.2s',
    },
    input: {
        width: '100%',
        padding: '1rem 1.25rem 1rem 3rem',
        borderRadius: '12px',
        border: '2px solid var(--border)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        background: 'var(--bg-main)',
        fontFamily: 'inherit',
    },
    button: {
        padding: '1.1rem',
        borderRadius: '12px',
        border: 'none',
        background: 'var(--gradient-primary)',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(0, 51, 102, 0.2)',
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
    },
    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed',
    },
    footer: {
        marginTop: '2.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        paddingTop: '1.5rem',
    },
    secureBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'var(--success-light)',
        color: 'var(--success)',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        marginBottom: '1rem',
    },
    copyright: {
        color: 'var(--text-light)',
        fontSize: '0.85rem',
        margin: 0,
    },
};

export default AdminLogin;
