import React, { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminService } from '../services/adminService';

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#003366',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1rem',
    },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #f1f5f9',
    },
    infoGrid: {
        display: 'grid',
        gap: '1rem',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #f1f5f9',
    },
    infoLabel: {
        fontWeight: '600',
        color: '#64748b',
    },
    infoValue: {
        color: '#1e293b',
    },
    badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        background: '#dcfce7',
        color: '#166534',
    },
    superAdminBadge: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
    },
    formGroup: {
        marginBottom: '1.5rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        color: '#1e293b',
        fontSize: '0.95rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
    },
    button: {
        padding: '0.875rem 2rem',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
        color: 'white',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    alert: {
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.95rem',
    },
    alertSuccess: {
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
    },
    alertError: {
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
    },
    helpText: {
        fontSize: '0.85rem',
        color: '#64748b',
        marginTop: '0.5rem',
    },
};

const AdminProfile = () => {
    const { currentUser, isSuperAdmin } = useAdminAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        if (currentPassword === newPassword) {
            setMessage({ type: 'error', text: 'Le nouveau mot de passe doit être différent de l\'ancien' });
            return;
        }

        setLoading(true);

        try {
            await adminService.changeAdminPassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (label, value, onChange, field, placeholder) => (
        <div style={styles.formGroup}>
            <label style={styles.label}>
                <i className="fas fa-lock" style={{ marginRight: '0.5rem', color: '#64748b' }}></i>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    type={showPassword[field] ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    style={{ ...styles.input, paddingRight: '40px' }}
                    placeholder={placeholder}
                    disabled={loading}
                />
                <i
                    className={`fas fa-eye${showPassword[field] ? '-slash' : ''}`}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '4px'
                    }}
                    onClick={() => togglePasswordVisibility(field)}
                    title={showPassword[field] ? "Masquer" : "Afficher"}
                />
            </div>
            {field === 'new' && (
                <p style={styles.helpText}>
                    <i className="fas fa-info-circle"></i> Minimum 8 caractères
                </p>
            )}
        </div>
    );

    return (
        <div style={styles.container} className="animate-fade-in">
            <div style={styles.header}>
                <h1 style={styles.title}>Mon Profil</h1>
                <p style={styles.subtitle}>Gérez vos informations personnelles et votre sécurité</p>
            </div>

            {/* Profile Information */}
            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Informations du compte</h2>
                <div style={styles.infoGrid}>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nom complet</span>
                        <span style={styles.infoValue}>
                            {currentUser?.firstName} {currentUser?.lastName}
                        </span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Email</span>
                        <span style={styles.infoValue}>{currentUser?.email}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Rôle</span>
                        <span style={styles.infoValue}>
                            <span style={{
                                ...styles.badge,
                                ...(isSuperAdmin ? styles.superAdminBadge : {})
                            }}>
                                {isSuperAdmin ? 'Super Administrateur' : 'Administrateur'}
                            </span>
                        </span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Statut</span>
                        <span style={styles.infoValue}>
                            <span style={styles.badge}>Actif</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Password Change */}
            <div style={styles.card}>
                <h2 style={styles.sectionTitle}>
                    <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                    Changer le mot de passe
                </h2>

                {message.text && (
                    <div style={{
                        ...styles.alert,
                        ...(message.type === 'success' ? styles.alertSuccess : styles.alertError)
                    }}>
                        <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handlePasswordChange}>
                    {renderPasswordInput(
                        "Mot de passe actuel",
                        currentPassword,
                        (e) => setCurrentPassword(e.target.value),
                        "current",
                        "Entrez votre mot de passe actuel"
                    )}

                    {renderPasswordInput(
                        "Nouveau mot de passe",
                        newPassword,
                        (e) => setNewPassword(e.target.value),
                        "new",
                        "Entrez votre nouveau mot de passe"
                    )}

                    {renderPasswordInput(
                        "Confirmer le nouveau mot de passe",
                        confirmPassword,
                        (e) => setConfirmPassword(e.target.value),
                        "confirm",
                        "Confirmez votre nouveau mot de passe"
                    )}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                Modification en cours...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                                Modifier le mot de passe
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
