import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
    const { userData, updateUserData } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');

    const [editData, setEditData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phone: userData?.phone || '',
        address: userData?.address || '',
        city: userData?.city || '',
        zipCode: userData?.zipCode || '',
        countryOfResidence: userData?.countryOfResidence || '',
        nationality: userData?.nationality || '',
        dob: userData?.dob || '',
        gender: userData?.gender || '',
        notificationsEnabled: userData?.notificationsEnabled ?? true,
        darkMode: userData?.darkMode ?? false,
        language: userData?.language || 'Français'
    });

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSave = async () => {
        try {
            await updateUserData(editData);
            setStatus({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
            setTimeout(() => setStatus({ type: '', text: '' }), 5000);
        } catch (err) {
            setStatus({ type: 'error', text: 'Une erreur est survenue.' });
        }
    };

    const renderInput = (label, name, icon, type = "text", disabled = false) => (
        <div style={styles.formGroup}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputWrapper}>
                {icon && <i className={icon} style={styles.inputIcon}></i>}
                <input
                    type={type}
                    style={{ ...styles.input, paddingLeft: icon ? '45px' : '16px', backgroundColor: disabled ? '#f8fafc' : 'white' }}
                    value={editData[name] || ''}
                    onChange={e => setEditData({ ...editData, [name]: e.target.value })}
                    disabled={disabled}
                />
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div style={{ padding: '1rem', paddingBottom: '3rem' }}>
                <h1 style={styles.mobileTitle}>Mon Compte</h1>

                <div style={styles.mobileTabs}>
                    <button style={activeTab === 'profile' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('profile')}>Profil</button>
                    <button style={activeTab === 'security' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('security')}>Sécurité</button>
                    <button style={activeTab === 'prefs' ? styles.mobileTabActive : styles.mobileTab} onClick={() => setActiveTab('prefs')}>Réglages</button>
                </div>

                <div className="fadeIn" key={activeTab}>
                    {activeTab === 'profile' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>Dossier Client</div>
                            <div style={styles.mobileIdBox}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>IDENTIFIANT DE CONNEXION</div>
                                <div style={{ color: '#0f172a', fontWeight: 'bold', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-all' }}>{userData?.email}</div>
                            </div>
                            {renderInput('Prénom', 'firstName', 'fas fa-user')}
                            {renderInput('Nom', 'lastName', 'fas fa-id-card')}
                            {renderInput('Téléphone', 'phone', 'fas fa-phone')}
                            <div style={{ ...styles.mobileSectionHeader, marginTop: '20px' }}>Localisation</div>
                            {renderInput('Adresse', 'address', 'fas fa-map-marker-alt')}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {renderInput('Ville', 'city', null)}
                                {renderInput('CP', 'zipCode', null)}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>Accès Sécurisé</div>
                            <div style={styles.mobileActionRow}>
                                <div style={styles.mobileActionIcon}><i className="fas fa-shield-virus"></i></div>
                                <div style={{ flex: 1 }}><strong>Protection 2FA</strong><div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activé par défaut</div></div>
                                <input type="checkbox" style={styles.toggle} defaultChecked />
                            </div>
                            <div style={{ ...styles.mobileActionRow, marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                <div style={styles.mobileActionIcon}><i className="fas fa-key"></i></div>
                                <div style={{ flex: 1 }}><strong>Changer mon mot de passe</strong></div>
                                <i className="fas fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prefs' && (
                        <div style={styles.mobileGlassCard}>
                            <div style={styles.mobileSectionHeader}>Personnalisation</div>
                            <div style={styles.mobileActionRow}>
                                <div style={styles.mobileActionIcon}><i className="fas fa-moon"></i></div>
                                <div style={{ flex: 1 }}><strong>Mode Sombre</strong></div>
                                <input type="checkbox" checked={editData.darkMode} onChange={e => setEditData({ ...editData, darkMode: e.target.checked })} style={styles.toggle} />
                            </div>
                            <div style={{ ...styles.mobileActionRow, marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                <div style={styles.mobileActionIcon}><i className="fas fa-language"></i></div>
                                <div style={{ flex: 1 }}><strong>Langue de l'interface</strong></div>
                                <select style={styles.mobileSelect} value={editData.language} onChange={e => setEditData({ ...editData, language: e.target.value })}>
                                    <option>Français</option><option>English</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {activeTab !== 'security' && (
                    <button style={styles.mobileSaveBtn} onClick={handleSave}>Enregistrer les réglages</button>
                )}
                {status.text && <p style={{ textAlign: 'center', color: status.type === 'success' ? '#22c55e' : '#ef4444', marginTop: '15px', fontSize: '0.9rem' }}>{status.text}</p>}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Paramètres du Compte</h1>
                <p style={styles.subtitle}>Consultez et modifiez les informations de votre profil bancaire.</p>
            </header>

            <div style={styles.premiumCard}>
                <div style={styles.sidebar}>
                    <button style={activeTab === 'profile' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('profile')}>
                        <i className="fas fa-user-circle"></i> Mes Informations
                    </button>
                    <button style={activeTab === 'security' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('security')}>
                        <i className="fas fa-shield-alt"></i> Sécurité & Accès
                    </button>
                    <button style={activeTab === 'prefs' ? styles.sideTabActive : styles.sideTab} onClick={() => setActiveTab('prefs')}>
                        <i className="fas fa-sliders-h"></i> Préférences
                    </button>

                    <div style={styles.securityIndicator}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' }}>NIVEAU DE PROTECTION</div>
                        <div style={styles.securityBar}><div style={{ ...styles.securityFill, width: '75%' }}></div></div>
                        <div style={{ fontSize: '0.75rem', marginTop: '10px', color: '#475569' }}>Optimal et Vérifié</div>
                    </div>
                </div>

                <div style={styles.content}>
                    <div className="fadeIn" key={activeTab}>
                        {activeTab === 'profile' && (
                            <>
                                <h2 style={styles.contentTitle}>Informations Personnelles</h2>
                                <div style={styles.profileSummary}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold' }}>EMAIL DE CONTACT</div>
                                        <div style={{ fontSize: '1.2rem', color: '#003366', fontWeight: 'bold' }}>{userData?.email}</div>
                                    </div>
                                    <div style={styles.statusChip}>Email Vérifié <i className="fas fa-check-circle"></i></div>
                                </div>
                                <div style={styles.formGrid}>
                                    {renderInput('Prénom', 'firstName', 'fas fa-user')}
                                    {renderInput('Nom', 'lastName', 'fas fa-id-card')}
                                    {renderInput('Téléphone', 'phone', 'fas fa-phone-alt')}
                                    {renderInput('Nationalité', 'nationality', 'fas fa-flag')}
                                    <div style={{ gridColumn: '1 / -1' }}>{renderInput('Adresse de résidence', 'address', 'fas fa-map-marked-alt')}</div>
                                    {renderInput('Ville', 'city', null)}
                                    {renderInput('Code Postal', 'zipCode', null)}
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <h2 style={styles.contentTitle}>Contrôle d'Accès</h2>
                                <div style={styles.optionGrid}>
                                    <div style={styles.optionCard}>
                                        <div style={styles.optionIcon}><i className="fas fa-shield-alt"></i></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Double Authentification</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Protection renforcée lors de vos connexions.</div>
                                        </div>
                                        <span style={styles.activeTag}>Activé</span>
                                    </div>
                                    <div style={styles.optionCard}>
                                        <div style={styles.optionIcon}><i className="fas fa-key"></i></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sécurité du Mot de Passe</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Mise à jour régulière conseillée.</div>
                                        </div>
                                        <button style={styles.actionBtn}>Mise à jour</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'prefs' && (
                            <>
                                <h2 style={styles.contentTitle}>Préférences de Compte</h2>
                                <div style={styles.prefBox}>
                                    <div style={styles.prefRow}>
                                        <span>Activer le mode sombre sur l'interface</span>
                                        <input type="checkbox" style={styles.toggle} checked={editData.darkMode} onChange={e => setEditData({ ...editData, darkMode: e.target.checked })} />
                                    </div>
                                    <div style={styles.prefRow}>
                                        <span>Alertes de transactions par SMS</span>
                                        <input type="checkbox" style={styles.toggle} checked={editData.notificationsEnabled} onChange={e => setEditData({ ...editData, notificationsEnabled: e.target.checked })} />
                                    </div>
                                    <div style={{ ...styles.prefRow, borderBottom: 'none' }}>
                                        <span>Langue des relevés bancaires</span>
                                        <select style={styles.select} value={editData.language} onChange={e => setEditData({ ...editData, language: e.target.value })}>
                                            <option>Français</option><option>English</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div style={styles.formFooter}>
                        {activeTab !== 'security' && (
                            <button style={styles.saveBtn} onClick={handleSave}>Mettre à jour les paramètres</button>
                        )}
                        {status.text && (
                            <div style={{ ...styles.alert, background: status.type === 'success' ? '#f0fdf4' : '#fef2f2', color: status.type === 'success' ? '#15803d' : '#b91c1c' }}>
                                {status.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' },
    header: { marginBottom: '3.5rem' },
    title: { fontSize: '2.5rem', color: '#0f172a', fontWeight: '900', letterSpacing: '-1px' },
    subtitle: { color: '#64748b', fontSize: '1.1rem', marginTop: '5px' },

    premiumCard: { display: 'grid', gridTemplateColumns: '320px 1fr', background: 'white', borderRadius: '40px', boxShadow: '0 40px 100px -20px rgba(0, 51, 102, 0.12)', overflow: 'hidden', minHeight: '650px', border: '1px solid #f1f5f9' },

    sidebar: { background: '#f8fafc', padding: '3rem 2rem', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '15px' },
    sideTab: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '20px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', transition: '0.3s', textAlign: 'left' },
    sideTabActive: { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '20px', border: 'none', background: 'white', color: '#003366', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.04)', textAlign: 'left', transform: 'translateX(10px)' },
    securityIndicator: { marginTop: 'auto', background: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #f1f5f9' },
    securityBar: { height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' },
    securityFill: { height: '100%', background: '#22c55e', borderRadius: '3px' },

    content: { padding: '4rem', background: 'white' },
    contentTitle: { color: '#003366', fontSize: '1.8rem', fontWeight: '900', marginBottom: '3rem' },
    profileSummary: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#f8fafc', padding: '30px', borderRadius: '30px', marginBottom: '3rem', border: '1px solid #f1f5f9' },
    statusChip: { padding: '8px 16px', borderRadius: '50px', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' },
    label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { position: 'relative', boxSizing: 'border-box', width: '100%' },
    inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#003366' },
    input: { width: '100%', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', transition: '0.2s', outline: 'none', color: '#334155', boxSizing: 'border-box', wordWrap: 'break-word', overflowWrap: 'break-word' },

    optionGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
    optionCard: { display: 'flex', alignItems: 'center', gap: '25px', padding: '25px', borderRadius: '25px', border: '1px solid #f1f5f9', background: '#f8fafc' },
    optionIcon: { width: '56px', height: '56px', background: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', fontSize: '1.4rem' },
    activeTag: { padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.8rem' },
    actionBtn: { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 'bold', cursor: 'pointer' },

    prefBox: { background: '#f8fafc', borderRadius: '30px', padding: '10px 30px', border: '1px solid #f1f5f9' },
    prefRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #f1f5f9', fontSize: '1.1rem', fontWeight: '500' },
    toggle: { width: '44px', height: '22px', cursor: 'pointer', accentColor: '#003366' },
    select: { padding: '8px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' },

    formFooter: { marginTop: '4rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem', display: 'flex', flexDirection: 'column', gap: '20px' },
    saveBtn: { padding: '18px 45px', background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0, 51, 102, 0.2)' },
    alert: { padding: '15px 25px', borderRadius: '15px', fontWeight: 'bold', textAlign: 'center' },

    // MOBILE
    mobileTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '2rem', textAlign: 'center', letterSpacing: '-1.5px' },
    mobileTabs: { display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '24px', marginBottom: '2.5rem' },
    mobileTab: { flex: 1, padding: '14px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: 'bold', borderRadius: '18px', fontSize: '0.9rem' },
    mobileTabActive: { flex: 1, padding: '14px', border: 'none', background: 'white', color: '#003366', fontWeight: 'bold', borderRadius: '18px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' },
    mobileGlassCard: { background: 'white', padding: '2.5rem 1.5rem', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden', boxSizing: 'border-box' },
    mobileSectionHeader: { fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' },
    mobileIdBox: { background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '25px', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' },
    mobileActionRow: { display: 'flex', alignItems: 'center', gap: '15px' },
    mobileActionIcon: { width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366' },
    mobileSaveBtn: { width: '100%', padding: '22px', background: '#003366', color: 'white', border: 'none', borderRadius: '25px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '2.5rem', boxShadow: '0 20px 40px rgba(0, 51, 102, 0.15)' },
    mobileSelect: { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }
};

export default Settings;
