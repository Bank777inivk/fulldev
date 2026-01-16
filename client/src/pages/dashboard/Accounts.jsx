import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { walletService } from '../../services/walletService';
import { cardService } from '../../services/cardService';
import { ribService } from '../../services/ribService';
import { kycService } from '../../services/kycService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const Accounts = () => {
    const { currentUser, userData } = useAuth();
    const { wallets, kycStatus, loading } = useData();
    const { showToast, alert: showCustomAlert } = useNotifications();
    const navigate = useNavigate();
    const [activeAccount, setActiveAccount] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('savings');
    const [requestDetails, setRequestDetails] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isKycVerified = kycStatus?.status === 'verified';

    const handleRequestSubmit = async () => {
        if (!currentUser) return;
        try {
            await walletService.requestAccountOpening(currentUser.uid, {
                type: requestType,
                details: requestDetails
            });
            showToast("Votre demande a été envoyée avec succès. Un conseiller va l'étudier.", 'success');
            setShowRequestModal(false);
            setRequestDetails('');
        } catch (error) {
            showToast("Erreur lors de l'envoi de la demande. Veuillez réessayer.", 'error');
        }
    };

    // Auto-healing logic
    useEffect(() => {
        const healWallets = async () => {
            if (currentUser && !loading && wallets.length === 0 && userData) {
                console.log("No wallets found, creating initial wallets...");
                try {
                    const createdWallets = await walletService.createInitialWallets(
                        currentUser.uid,
                        userData.accountType || 'standard',
                        userData.mainCurrency || 'EUR'
                    );

                    const mainWallet = createdWallets.find(w => w.type === 'main');
                    if (mainWallet) {
                        await cardService.createInitialCard(currentUser.uid, mainWallet.id);
                    }
                    await ribService.createInitialRibs(currentUser.uid, createdWallets);
                } catch (error) {
                    console.error("Error healing wallets:", error);
                }
            }
        };

        healWallets();
    }, [currentUser, loading, wallets.length, userData]);

    // Set active account once wallets are loaded
    useEffect(() => {
        if (wallets.length > 0 && !activeAccount) {
            const mainWallet = wallets.find(w => w.type === 'main');
            setActiveAccount(mainWallet?.id || wallets[0]?.id);
        }
    }, [wallets, activeAccount]);

    const getAccountInfo = (wallet) => {
        if (!wallet) return null;

        const configs = {
            main: {
                name: 'Compte Courant',
                type: 'Principal',
                color: '#003366',
                icon: 'fas fa-wallet'
            },
            savings: {
                name: 'Compte Épargne',
                type: 'Épargne',
                color: '#27ae60',
                icon: 'fas fa-piggy-bank',
                rate: '2.5%'
            },
            credit: {
                name: 'Réserve Crédit',
                type: 'Crédit',
                color: '#e74c3c',
                icon: 'fas fa-hand-holding-usd',
                limit: '5000 €'
            }
        };

        return configs[wallet.type] || configs.main;
    };

    const currentAcc = wallets.find(acc => acc.id === activeAccount);
    const currentInfo = getAccountInfo(currentAcc);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        showToast(`${label} copié dans le presse-papier !`, 'info');
    };

    if (loading && wallets.length === 0) {
        return <div style={styles.loading}>Chargement de vos comptes...</div>;
    }

    if (wallets.length === 0) {
        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h1 style={{ ...styles.title, marginBottom: 0 }}>Mes Comptes</h1>
                        <KycVerificationBanner variant="badge" />
                    </div>
                    <p style={styles.subtitle}>Aucun compte trouvé. Veuillez contacter le support.</p>
                </header>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h1 style={{ ...styles.title, marginBottom: 0 }}>Mes Comptes</h1>
                    <KycVerificationBanner variant="badge" />
                </div>
                <p style={styles.subtitle}>Gérez vos portefeuilles et consultez vos coordonnées bancaires.</p>
            </header>

            <div style={styles.accountGrid}>
                {wallets.map(acc => {
                    const info = getAccountInfo(acc);
                    return (
                        <div
                            key={acc.id}
                            style={{
                                ...styles.accountCard,
                                borderLeft: `5px solid ${info.color}`,
                                opacity: activeAccount === acc.id ? 1 : 0.8,
                                transform: activeAccount === acc.id ? 'scale(1.02)' : 'scale(1)',
                                boxShadow: activeAccount === acc.id ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                            onClick={() => setActiveAccount(acc.id)}
                        >
                            <div style={styles.cardHeader}>
                                <i className={info.icon} style={{ ...styles.cardIcon, color: info.color }}></i>
                                <span style={styles.accountType}>{info.type}</span>
                            </div>
                            <h3 style={styles.accountName}>{info.name}</h3>
                            <p style={{
                                ...styles.balance,
                                color: acc.balance < 0 ? '#e74c3c' : (acc.type === 'savings' ? '#27ae60' : '#003366')
                            }}>
                                {acc.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {acc.currency}
                            </p>
                        </div>
                    );
                })}
                <div style={styles.addAccountCard} onClick={() => setShowRequestModal(true)}>
                    <div style={styles.addIconCircle}>
                        <i className="fas fa-plus"></i>
                    </div>
                    <h3 style={styles.addTitle}>Ouvrir un compte</h3>
                    <p style={styles.addText}>Compte Épargne, Crédit ou Devise</p>
                </div>
            </div>

            {showRequestModal && !isMobile && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Demande d'ouverture de compte</h2>
                        <p style={styles.modalSubtitle}>Sélectionnez le type de compte souhaité.</p>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Type de compte</label>
                            <select style={styles.select} value={requestType} onChange={e => setRequestType(e.target.value)}>
                                <option value="savings">Compte Épargne (Livret)</option>
                                <option value="currency_usd">Compte Devise (USD)</option>
                                <option value="business">Compte Professionnel</option>
                                <option value="other">Autre demande</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Message (Optionnel)</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Précisez votre besoin..."
                                value={requestDetails}
                                onChange={e => setRequestDetails(e.target.value)}
                            />
                        </div>

                        <div style={styles.modalActions}>
                            <button style={styles.cancelBtn} onClick={() => setShowRequestModal(false)}>Annuler</button>
                            <button style={styles.submitBtn} onClick={handleRequestSubmit}>Envoyer ma demande</button>
                        </div>
                    </div>
                </div>
            )}

            {showRequestModal && isMobile && (
                <div style={styles.mobileRequestDrawer}>
                    <div style={styles.mobileRequestHeader}>
                        <h3 style={styles.mobileRequestTitle}>Ouvrir un compte</h3>
                        <button style={styles.mobileCloseBtn} onClick={() => setShowRequestModal(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div style={styles.mobileRequestContent}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Type de compte</label>
                            <select style={styles.select} value={requestType} onChange={e => setRequestType(e.target.value)}>
                                <option value="savings">Compte Épargne (Livret)</option>
                                <option value="currency_usd">Compte Devise (USD)</option>
                                <option value="business">Compte Professionnel</option>
                                <option value="other">Autre demande</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Message (Optionnel)</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Précisez votre besoin..."
                                value={requestDetails}
                                onChange={e => setRequestDetails(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={styles.mobileRequestFooter}>
                        <button style={styles.mobileSubmitBtn} onClick={handleRequestSubmit}>Envoyer ma demande</button>
                    </div>
                </div>
            )}

            {currentAcc && (
                <div style={styles.detailsSection}>
                    <div style={styles.detailsHeader}>
                        <div style={{ ...styles.iconBadge, backgroundColor: currentInfo.color }}>
                            <i className={currentInfo.icon}></i>
                        </div>
                        <div>
                            <h2 style={styles.detailsTitle}>{currentInfo.name}</h2>
                            <span style={styles.statusBadge}>Compte Actif</span>
                        </div>
                    </div>

                    <div style={styles.infoGrid}>
                        <div style={styles.infoBox}>
                            <label style={styles.infoLabel}>IBAN</label>
                            <div style={styles.copyRow}>
                                <span style={styles.infoValue}>
                                    {isKycVerified ? currentAcc.iban : 'FR76 **** **** **** **** **** ***'}
                                </span>
                                {isKycVerified && (
                                    <button onClick={() => copyToClipboard(currentAcc.iban, 'IBAN')} style={styles.copyBtn}>
                                        <i className="far fa-copy"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={styles.infoBox}>
                            <label style={styles.infoLabel}>BIC / SWIFT</label>
                            <div style={styles.copyRow}>
                                <span style={styles.infoValue}>
                                    {isKycVerified ? currentAcc.bic : '********'}
                                </span>
                                {isKycVerified && (
                                    <button onClick={() => copyToClipboard(currentAcc.bic, 'BIC')} style={styles.copyBtn}>
                                        <i className="far fa-copy"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        {currentInfo.rate && (
                            <div style={styles.infoBox}>
                                <label style={styles.infoLabel}>Taux de rémunération</label>
                                <span style={styles.infoValue}>{currentInfo.rate} / an</span>
                            </div>
                        )}
                        {currentInfo.limit && (
                            <div style={styles.infoBox}>
                                <label style={styles.infoLabel}>Plafond autorisé</label>
                                <span style={styles.infoValue}>{currentInfo.limit}</span>
                            </div>
                        )}
                    </div>

                    <div style={styles.actionsRow}>
                        <button style={styles.primaryAction} onClick={() => navigate('/dashboard/transfers')}>
                            <i className="fas fa-paper-plane" style={{ marginRight: '10px' }}></i>
                            Effectuer un virement
                        </button>
                        <button
                            style={{ ...styles.secondaryAction, opacity: isKycVerified ? 1 : 0.5, cursor: isKycVerified ? 'pointer' : 'not-allowed' }}
                            disabled={!isKycVerified}
                            title={!isKycVerified ? "Vérification d'identité requise" : ""}
                            onClick={() => navigate('/dashboard/documents')}
                        >
                            <i className="fas fa-file-download" style={{ marginRight: '10px' }}></i>
                            {isKycVerified ? 'Télécharger le RIB' : 'RIB (Vérif. Requise)'}
                        </button>
                        <button style={styles.secondaryAction} onClick={() => navigate('/dashboard/history')}>
                            <i className="fas fa-history" style={{ marginRight: '10px' }}></i>
                            Voir l'historique
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading: {
        textAlign: 'center',
        padding: '3rem',
        color: '#003366',
        fontSize: '1.2rem',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.8rem',
        color: '#003366',
        fontWeight: '800',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#666',
        fontSize: '1rem',
    },
    accountGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    accountCard: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    cardIcon: {
        fontSize: '1.5rem',
    },
    accountType: {
        fontSize: '0.75rem',
        backgroundColor: '#f0f4f8',
        padding: '0.3rem 0.6rem',
        borderRadius: '50px',
        color: '#666',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    accountName: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '0.5rem',
    },
    balance: {
        fontSize: '1.5rem',
        fontWeight: '800',
    },
    detailsSection: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    },
    detailsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #eee',
    },
    iconBadge: {
        width: '60px',
        height: '60px',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.8rem',
    },
    detailsTitle: {
        fontSize: '1.4rem',
        color: '#333',
        marginBottom: '0.2rem',
    },
    statusBadge: {
        fontSize: '0.8rem',
        color: '#27ae60',
        fontWeight: '600',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem',
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoLabel: {
        fontSize: '0.8rem',
        color: '#888',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    copyRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fbff',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        border: '1px solid #eef2f7',
    },
    infoValue: {
        fontSize: '1rem',
        color: '#003366',
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    copyBtn: {
        background: 'transparent',
        color: '#00ccff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.1rem',
        padding: '0.2rem',
    },
    actionsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    primaryAction: {
        backgroundColor: '#003366',
        color: 'white',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '10px',
        fontWeight: '700',
        cursor: 'pointer',
        flex: 1,
        minWidth: '200px',
    },
    secondaryAction: {
        backgroundColor: '#f0f4f8',
        color: '#003366',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '10px',
        fontWeight: '700',
        cursor: 'pointer',
        flex: 1,
        minWidth: '200px',
    },
    addAccountCard: {
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '25px',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '2px dashed #cbd5e1',
        transition: 'all 0.3s ease',
        minHeight: '200px',
        textAlign: 'center'
    },
    addIconCircle: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#f1f5f9',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '15px',
        transition: '0.3s'
    },
    addTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' },
    addText: { fontSize: '0.9rem', color: '#94a3b8' },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modalContent: {
        background: 'white', padding: '2rem', borderRadius: '20px', width: '90%', maxWidth: '500px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease'
    },
    modalTitle: { fontSize: '1.5rem', color: '#003366', marginBottom: '0.5rem', fontWeight: 'bold' },
    modalSubtitle: { color: '#64748b', marginBottom: '1.5rem' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: 'bold', fontSize: '0.9rem' },
    select: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', minHeight: '100px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem' },
    cancelBtn: { padding: '12px 24px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    submitBtn: { padding: '12px 24px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
    // MOBILE DRAWER STYLES
    mobileRequestDrawer: {
        position: 'fixed',
        top: '65px', // Below dashboard header
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f8fafc',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out',
    },
    mobileRequestHeader: {
        padding: '1.2rem',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
    },
    mobileRequestTitle: {
        margin: 0,
        fontSize: '1.2rem',
        color: '#003366',
        fontWeight: 'bold',
    },
    mobileCloseBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        color: '#64748b',
    },
    mobileRequestContent: {
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
    },
    mobileRequestFooter: {
        padding: '1.2rem',
        background: 'white',
        borderTop: '1px solid #e2e8f0',
    },
    mobileSubmitBtn: {
        width: '100%',
        padding: '1.2rem',
        background: '#003366',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
    }
};

export default Accounts;
