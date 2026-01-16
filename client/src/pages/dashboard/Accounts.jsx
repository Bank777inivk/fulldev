import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { walletService } from '../../services/walletService';
import { cardService } from '../../services/cardService';
import { ribService } from '../../services/ribService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const RibModal = ({ isOpen, onClose, rib, wallet, showToast }) => {
    if (!isOpen || !rib) return null;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        if (showToast) showToast(`${label} copié dans le presse-papiers !`, 'success');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
            padding: '10px'
        }} onClick={onClose}>
            <div style={{
                background: 'white', borderRadius: '28px', padding: '1.25rem',
                width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                position: 'relative', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10,
                    border: 'none', background: '#f1f5f9', width: '30px', height: '30px',
                    borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <i className="fas fa-times" style={{ fontSize: '0.8rem' }}></i>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #003366, #00509e)',
                        color: 'white', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1rem', margin: '0 auto 0.5rem'
                    }}>
                        <i className="fas fa-file-invoice"></i>
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>RIB / IBAN</h2>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '2px 0 0' }}>Coordonnées Officielles</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { label: 'Titulaire', value: rib.holderName },
                        { label: 'IBAN', value: rib.iban },
                        { label: 'BIC / SWIFT', value: rib.bic },
                        { label: 'Banque', value: 'INVIK BANK' },
                        { label: 'Type', value: rib.accountName }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            padding: '8px 12px', background: '#f8fafc', borderRadius: '12px',
                            border: '1px solid #e2e8f0', position: 'relative'
                        }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1px', letterSpacing: '0.3px' }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', wordBreak: 'break-all', paddingRight: '30px', lineHeight: '1.2' }}>
                                {item.value}
                            </div>
                            <button
                                onClick={() => copyToClipboard(item.value, item.label)}
                                style={{
                                    position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                    border: 'none', background: 'white', color: '#003366',
                                    padding: '5px', borderRadius: '8px', cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex'
                                }}
                            >
                                <i className="far fa-copy" style={{ fontSize: '0.8rem' }}></i>
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={onClose} style={{
                    width: '100%', padding: '12px', borderRadius: '14px', border: 'none',
                    background: '#003366', color: 'white', fontWeight: '800', fontSize: '0.9rem',
                    marginTop: '1rem', cursor: 'pointer', transition: 'transform 0.2s'
                }}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

const AccountCard = ({ wallet, isLoading, onRibClick, navigate }) => {
    if (isLoading || !wallet) return (
        <div style={{ background: '#f8f9fa', borderRadius: '16px', height: '240px', animation: 'pulse 1.5s infinite' }}></div>
    );

    const config = {
        main: { label: 'Compte Courant', icon: 'fa-wallet', color: '#003366' },
        savings: { label: 'Compte Épargne', icon: 'fa-piggy-bank', color: '#27ae60' },
        credit: { label: 'Réserve Crédit', icon: 'fa-hand-holding-usd', color: '#c0392b' },
        currency: { label: 'Compte Devise', icon: 'fa-globe', color: '#f39c12' }
    }[wallet.type] || { label: 'Autre Compte', icon: 'fa-university', color: '#7f8c8d' };

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
            border: '1px solid #edf2f7',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '260px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {config.label}
                    </div>
                </div>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    background: `${config.color}10`, color: config.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <i className={`fas ${config.icon}`} style={{ fontSize: '1.2rem' }}></i>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '2.2rem', fontWeight: '900',
                    color: wallet.type === 'credit' ? '#e11d48' : '#003366',
                    margin: '0 0 0.5rem'
                }}>
                    {wallet.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', fontWeight: '500' }}>{wallet.currency}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontFamily: 'monospace', opacity: 0.8 }}>
                    {wallet.iban}
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div style={{
                display: 'flex', gap: '8px', marginTop: '1.5rem',
                paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9'
            }}>
                <button
                    onClick={() => navigate('/dashboard/transfers')}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#003366', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <i className="fas fa-paper-plane" style={{ marginRight: '6px' }}></i> Virer
                </button>
                <button
                    onClick={() => navigate('/dashboard/deposit')}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#003366', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <i className="fas fa-plus" style={{ marginRight: '6px' }}></i> Déposer
                </button>
                <button
                    onClick={onRibClick}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#003366', color: 'white', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <i className="fas fa-file-invoice" style={{ marginRight: '6px' }}></i> RIB
                </button>
            </div>
        </div>
    );
};

const Accounts = () => {
    const { currentUser, userData } = useAuth();
    const { wallets, accountRequests, ribs, loading } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();

    const [selectedRib, setSelectedRib] = useState(null);
    const [isRibModalOpen, setIsRibModalOpen] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('savings');
    const [requestDetails, setRequestDetails] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Logic: displayWallets NO SORT (Sync with Dashboard)
    const displayWallets = React.useMemo(() => {
        if (!wallets) return [];
        const uniqueWallets = [];
        const seenTypes = new Set();
        // Skip sort to match Dashboard
        for (const w of wallets) {
            if (['main', 'savings', 'credit'].includes(w.type)) {
                if (!seenTypes.has(w.type)) {
                    uniqueWallets.push(w);
                    seenTypes.add(w.type);
                }
            } else {
                uniqueWallets.push(w);
            }
        }
        return uniqueWallets;
    }, [wallets]);

    // Logic: available account types (one per category rule)
    const availableTypes = React.useMemo(() => {
        const types = [
            { value: 'savings', label: 'Compte Épargne' },
            { value: 'credit', label: 'Réserve Crédit' },
            { value: 'currency', label: 'Compte Devise' }
        ];
        return types.filter(t => {
            const hasWallet = wallets.some(w => w.type === t.value);
            const hasPending = (accountRequests || []).some(r => r.type === t.value && r.status === 'pending');
            return !hasWallet && !hasPending;
        });
    }, [wallets, accountRequests]);

    const canRequest = availableTypes.length > 0;

    const handleRequestSubmit = async () => {
        if (!currentUser) return;
        try {
            await walletService.requestAccountOpening(currentUser.uid, {
                type: requestType,
                details: requestDetails
            });
            showToast("Votre demande a été envoyée avec succès.", 'success');
            setShowRequestModal(false);
            setRequestDetails('');
        } catch (error) {
            showToast("Erreur lors de l'envoi de la demande.", 'error');
        }
    };

    // Auto-healing logic
    useEffect(() => {
        const healWallets = async () => {
            if (!currentUser || loading || !userData || wallets.length > 0) return;
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
        };
        healWallets();
    }, [currentUser, loading, userData, wallets.length]);

    const styles = {
        container: { paddingBottom: '80px' },
        header: { marginBottom: '2rem' },
        title: { fontSize: '1.8rem', fontWeight: 'bold', color: '#003366', marginBottom: '0.5rem' },
        subtitle: { color: '#666' },
        grid: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        desktopGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
        addBtn: {
            background: 'white', border: '2px dashed #ccc', borderRadius: '16px', padding: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            cursor: 'pointer', color: '#666', minHeight: '180px'
        },
        modalOverlay: {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        },
        modal: {
            background: 'white', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '500px'
        }
    };

    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                {!isMobile && (
                    <div style={styles.header}>
                        <h1 style={styles.title}>Mes Comptes</h1>
                        <p style={styles.subtitle}>Gérez vos portefeuilles et consultez vos coordonnées bancaires.</p>
                    </div>
                )}

                <div style={isMobile ? styles.grid : styles.desktopGrid}>
                    {displayWallets.map(wallet => {
                        const walletRib = (ribs || []).find(r => r.walletId === wallet.id);
                        return (
                            <AccountCard
                                key={wallet.id}
                                wallet={wallet}
                                isLoading={loading}
                                navigate={navigate}
                                onRibClick={() => {
                                    setSelectedRib(walletRib);
                                    setIsRibModalOpen(true);
                                }}
                            />
                        );
                    })}

                    {canRequest && (
                        <div style={styles.addBtn} onClick={() => {
                            if (availableTypes.length > 0) setRequestType(availableTypes[0].value);
                            setShowRequestModal(true);
                        }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <i className="fas fa-plus" style={{ fontSize: '1.5rem', color: '#003366' }}></i>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ouvrir un compte</h3>
                            <p style={{ fontSize: '0.9rem' }}>Compte Épargne, Crédit ou Devise</p>
                        </div>
                    )}
                </div>

                {showRequestModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={{ marginBottom: '1.5rem', color: '#003366' }}>Ouvrir un nouveau compte</h2>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Type de compte</label>
                                <select
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                    value={requestType}
                                    onChange={e => setRequestType(e.target.value)}
                                >
                                    {availableTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message (optionnel)</label>
                                <textarea
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                                    value={requestDetails}
                                    onChange={e => setRequestDetails(e.target.value)}
                                    placeholder="Dites-nous en plus..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button style={{ flex: 1, padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }} onClick={() => setShowRequestModal(false)}>Annuler</button>
                                <button style={{ flex: 1, padding: '0.85rem', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }} onClick={handleRequestSubmit}>Confirmer</button>
                            </div>
                        </div>
                    </div>
                )}

                <RibModal
                    isOpen={isRibModalOpen}
                    onClose={() => setIsRibModalOpen(false)}
                    rib={selectedRib}
                    showToast={showToast}
                />
            </div>
        </KycVerificationBanner>
    );
};

export default Accounts;
