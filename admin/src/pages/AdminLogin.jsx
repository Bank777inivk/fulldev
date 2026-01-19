import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const styles = {
        container: {
            minHeight: '100dvh',
            width: '100%',
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'center',
            background: isMobile ? 'white' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            overflow: 'hidden',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: !isMobile ? 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)' : 'none',
            pointerEvents: 'none',
        },
        content: {
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: isMobile ? '100%' : '480px',
            padding: isMobile ? '0' : '2rem',
        },
        loginCard: {
            background: isMobile ? 'white' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: isMobile ? 'none' : 'blur(20px)',
            borderRadius: isMobile ? '0' : '32px',
            padding: isMobile ? '3rem 1.5rem' : '4rem 3.5rem',
            width: '100%',
            boxShadow: isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
        },
        header: {
            textAlign: 'center',
            marginBottom: '3.5rem',
        },
        logoWrapper: {
            position: 'relative',
            width: '90px',
            height: '90px',
            margin: '0 auto 2rem',
        },
        iconCircle: {
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 20px 40px rgba(29, 78, 216, 0.3)',
            transform: 'rotate(-5deg)',
        },
        icon: {
            fontSize: '2.5rem',
            color: 'white',
        },
        title: {
            fontSize: isMobile ? '2.2rem' : '2.8rem',
            fontWeight: '900',
            color: isMobile ? '#1e293b' : 'white',
            margin: '0 0 0.75rem 0',
            letterSpacing: '-1.5px',
        },
        subtitle: {
            color: '#38bdf8',
        },
        description: {
            color: isMobile ? '#64748b' : '#94a3b8',
            fontSize: '1rem',
            fontWeight: '600',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
        },
        error: {
            background: '#fef2f2',
            color: '#dc2626',
            padding: '1.25rem',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: '1px solid #fee2e2',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
        },
        label: {
            fontSize: '0.85rem',
            fontWeight: '800',
            color: isMobile ? '#1e293b' : 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginLeft: '0.5rem',
        },
        inputWrapper: {
            position: 'relative',
        },
        inputIcon: {
            position: 'absolute',
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '1.1rem',
        },
        input: {
            width: '100%',
            padding: '1.1rem 3.5rem 1.1rem 3.5rem',
            borderRadius: '16px',
            border: isMobile ? '2px solid #f1f5f9' : '2px solid rgba(255, 255, 255, 0.1)',
            fontSize: '1rem',
            fontWeight: '600',
            outline: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isMobile ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
            color: isMobile ? '#1e293b' : 'white',
            boxSizing: 'border-box'
        },
        button: {
            padding: '1.25rem',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '900',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 20px 40px rgba(29, 78, 216, 0.2)',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        buttonDisabled: {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
        footer: {
            marginTop: '4rem',
            textAlign: 'center',
            borderTop: isMobile ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '2rem',
        },
        secureBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            background: isMobile ? '#f0fdf4' : 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
        },
        copyright: {
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: '600',
            margin: 0,
        },
    };

    return (
        <div style={styles.container}>
            {!isMobile && <div style={styles.overlay}></div>}
            <div style={styles.content}>
                <div style={styles.loginCard} className="animate-slide-up">
                    <div style={styles.header}>
                        <div style={styles.logoWrapper}>
                            <div style={styles.iconCircle}>
                                <i className="fas fa-shield-alt" style={styles.icon}></i>
                            </div>
                        </div>
                        <h1 style={styles.title}>BanK <span style={styles.subtitle}>Admin</span></h1>
                        <p style={styles.description}>Accès Restreint & Sécurisé</p>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {error && (
                            <div style={styles.error} className="animate-fade-in">
                                <i className="fas fa-exclamation-triangle"></i>
                                {error}
                            </div>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Administrateur</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-user-shield" style={styles.inputIcon}></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={styles.input}
                                    placeholder="admin@banque.com"
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Clé d'Accès</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-key" style={styles.inputIcon}></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={styles.input}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 5
                                    }}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    AUTHENTIFICATION...
                                </>
                            ) : (
                                <>
                                    ACCÉDER AU PANEL
                                    <i className="fas fa-lock-open"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <div style={styles.secureBadge}>
                            <i className="fas fa-fingerprint"></i>
                            <span>CRYPTAGE AES-256 SSL</span>
                        </div>
                        <p style={styles.copyright}>© 2026 Admin Portal. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
