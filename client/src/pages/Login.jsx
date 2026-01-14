import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Login logic here
        alert("Connexion en cours...");
    };

    return (
        <div style={styles.page}>
            <div className="container" style={styles.container}>
                <div style={styles.authCard}>

                    <div style={styles.formContent}>
                        <h2 style={styles.title}>Connexion Client</h2>
                        <p style={styles.subtitle}>Accédez à votre espace bancaire sécurisé</p>

                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Identifiant Client (Email)</label>
                                <input
                                    type="email"
                                    placeholder="votre.email@exemple.com"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Mot de passe</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.forgot}>
                                <a href="#" style={styles.link}>Mot de passe oublié ?</a>
                            </div>

                            <button type="submit" style={styles.submitButton}>
                                Se connecter
                            </button>
                        </form>

                        <div style={styles.divider}>
                            <span>Pas encore client ?</span>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            style={styles.registerButton}
                        >
                            Ouvrir un compte
                        </button>
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
