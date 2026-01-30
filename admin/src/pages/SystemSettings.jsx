import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const SystemSettings = () => {
    const { isSuperAdmin } = useAdminAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [settings, setSettings] = useState({
        hideLanguageSelector: false,
        maintenanceMode: false
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await adminService.getSystemSettings();
            setSettings(data);
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error);
            setStatus({ type: 'error', message: 'Erreur lors du chargement des paramètres' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus({ type: '', message: '' });
        try {
            await adminService.updateSystemSettings(settings);
            setStatus({ type: 'success', message: 'Paramètres mis à jour avec succès' });
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            setStatus({ type: 'error', message: 'Erreur lors de la mise à jour' });
        } finally {
            setSaving(false);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div style={styles.container}>
                <div style={styles.errorCard}>
                    <i className="fas fa-lock" style={styles.errorIcon}></i>
                    <h2>Accès Restreint</h2>
                    <p>Seuls les SuperAdmins peuvent accéder aux paramètres système.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div style={styles.loading}>Chargement...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Paramètres Système</h1>
                    <p style={styles.subtitle}>Gérez les configurations globales de la plateforme client.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        ...styles.saveBtn,
                        opacity: saving ? 0.7 : 1,
                        cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                >
                    {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                    <span>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>
            </div>

            {status.message && (
                <div style={{
                    ...styles.alert,
                    backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: status.type === 'success' ? '#166534' : '#991b1b',
                    marginBottom: '2rem'
                }}>
                    <i className={`fas fa-${status.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {status.message}
                </div>
            )}

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    <i className="fas fa-globe" style={styles.sectionIcon}></i>
                    Interface Client
                </h3>

                <div style={styles.settingRow}>
                    <div style={styles.settingInfo}>
                        <h4 style={styles.settingLabel}>Mode Maintenance</h4>
                        <p style={styles.settingDesc}>
                            Si activé, l'accès au site client sera bloqué et une page de maintenance sera affichée.
                        </p>
                    </div>
                    <label style={styles.switch} className="switch">
                        <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={() => handleToggle('maintenanceMode')}
                        />
                        <span style={styles.slider}></span>
                    </label>
                </div>

                <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #f1f5f9' }} />

                <h3 style={{ ...styles.sectionTitle, marginTop: 0, borderBottom: 'none', paddingBottom: 0, marginBottom: '1.5rem' }}>
                    <i className="fas fa-language" style={styles.sectionIcon}></i>
                    Langues & Régions
                </h3>

                <div style={styles.settingRow}>
                    <div style={styles.settingInfo}>
                        <h4 style={styles.settingLabel}>Masquer le sélecteur de langue</h4>
                        <p style={styles.settingDesc}>
                            Si activé, le sélecteur de drapeaux sera masqué sur le site client et les utilisateurs ne pourront pas changer de langue.
                        </p>
                    </div>
                    <label style={styles.switch} className="switch">
                        <input
                            type="checkbox"
                            checked={settings.hideLanguageSelector}
                            onChange={() => handleToggle('hideLanguageSelector')}
                        />
                        <span style={styles.slider}></span>
                    </label>
                </div>
            </div>

            <div style={styles.infoCard}>
                <i className="fas fa-info-circle" style={styles.infoIcon}></i>
                <p>Ces modifications sont appliquées instantanément sur la plateforme client.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1rem',
    },
    alert: {
        padding: '1.2rem',
        borderRadius: '16px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem'
    },
    saveBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0.8rem 1.5rem',
        background: 'var(--gradient-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 51, 102, 0.2)',
    },
    section: {
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #f1f5f9',
    },
    sectionIcon: {
        color: 'var(--primary)',
    },
    settingRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: '1.05rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.4rem',
    },
    settingDesc: {
        fontSize: '0.9rem',
        color: '#64748b',
        lineHeight: '1.5',
    },
    switch: {
        position: 'relative',
        display: 'inline-block',
        width: '56px',
        height: '30px',
    },
    checkbox: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    slider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e2e8f0',
        transition: '.4s',
        borderRadius: '34px',
    },
    infoCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#f8fafc',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        color: '#64748b',
        fontSize: '0.9rem',
    },
    infoIcon: {
        color: 'var(--primary)',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.1rem',
        color: '#64748b',
    },
    errorCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
    },
    errorIcon: {
        fontSize: '3rem',
        color: '#ef4444',
        marginBottom: '1.5rem',
    }
};

// Add raw CSS for the toggle since we're using pseudo-elements
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    .switch input { opacity: 0; width: 0; height: 0; }
    .switch span:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .switch input:checked + span { background: var(--gradient-secondary); }
    .switch input:checked + span:before { transform: translateX(26px); }
`;
document.head.appendChild(styleTag);

export default SystemSettings;
