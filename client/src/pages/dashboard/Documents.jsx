import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ribService } from '../../services/ribService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const Documents = () => {
    const { currentUser, userData } = useAuth();
    const { ribs, loading } = useData();
    const { showToast } = useNotifications();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDownload = (rib) => {
        showToast(`Téléchargement du RIB pour le ${rib.accountName} en cours...`, "info");
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = (rib) => {
        if (navigator.share) {
            navigator.share({
                title: `RIB - ${rib.accountName}`,
                text: `Voici mon RIB pour le compte ${rib.accountName} (IBAN: ${rib.iban})`,
                url: window.location.href // In real app, this would be the PDF URL
            }).catch(console.error);
        } else {
            // Fallback
            navigator.clipboard.writeText(rib.iban);
            showToast("IBAN copié dans le presse-papier !", "success");
        }
    };

    if (loading && ribs.length === 0) {
        return <div style={styles.loading}>Chargement...</div>;
    }

    // --- DESKTOP VIEW ---
    const DesktopView = () => (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Mes Documents</h1>
                <p style={styles.subtitle}>Téléchargez vos relevés d'identité bancaire et attestations officielles.</p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <i className="fas fa-university" style={styles.titleIcon}></i>
                    Relevés d'Identité Bancaire (RIB)
                </h2>

                {ribs.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIconCircle}>
                            <i className="fas fa-file-invoice" style={styles.emptyIcon}></i>
                        </div>
                        <p>Aucun document disponible.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {ribs.map(rib => (
                            <div key={rib.id} style={styles.card} className="doc-card">
                                <div style={styles.cardLeftBorder(rib.walletType)}></div>
                                <div style={styles.cardContent}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.iconBox(rib.walletType)}>
                                            <i className="fas fa-file-invoice-dollar"></i>
                                        </div>
                                        <div style={styles.cardInfo}>
                                            <h3 style={styles.docTitle}>RIB - {rib.accountName}</h3>
                                            <div style={styles.ibanContainer}>
                                                <span style={styles.ibanLabel}>IBAN:</span>
                                                <span style={styles.ibanValue}>{rib.iban}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.actions}>
                                        <button onClick={() => handleDownload(rib)} style={styles.downloadBtn}>
                                            <i className="fas fa-download"></i>
                                            <span>Télécharger PDF</span>
                                        </button>
                                        <button onClick={handlePrint} style={styles.printBtn} title="Imprimer">
                                            <i className="fas fa-print"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <i className="fas fa-file-contract" style={styles.titleIcon}></i>
                    Attestations & Contrats
                </h2>
                <div style={styles.grid}>
                    <div style={styles.card} className="doc-card">
                        <div style={styles.cardLeftBorder('contract')}></div>
                        <div style={styles.cardContent}>
                            <div style={styles.cardHeader}>
                                <div style={{ ...styles.iconBox('contract'), backgroundColor: '#eef2f6', color: '#666' }}>
                                    <i className="fas fa-signature"></i>
                                </div>
                                <div style={styles.cardInfo}>
                                    <h3 style={styles.docTitle}>Contrat d'ouverture</h3>
                                    <p style={styles.docMeta}>
                                        <i className="far fa-clock" style={{ marginRight: '5px' }}></i>
                                        Signé le {userData?.createdAt?.toDate().toLocaleDateString('fr-FR') || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div style={styles.actions}>
                                <button style={styles.downloadBtn}>
                                    <i className="fas fa-download"></i>
                                    <span>Télécharger PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    // --- MOBILE VIEW ---
    const MobileView = () => (
        <div style={styles.mobileContainer}>
            <div style={styles.mobileHeader}>
                <h1>Documents</h1>
                <span style={styles.mobileBadge}>{ribs.length} Dispo.</span>
            </div>

            <div style={styles.mobileList}>
                {ribs.map(rib => (
                    <div key={rib.id} style={styles.mobileCard}>
                        <div style={styles.mobileCardTop}>
                            <div style={{ ...styles.mobileIconBadge, backgroundColor: rib.walletType === 'main' ? '#e3f2fd' : (rib.walletType === 'savings' ? '#e8f5e9' : '#ffebee'), color: rib.walletType === 'main' ? '#1565c0' : (rib.walletType === 'savings' ? '#2e7d32' : '#c62828') }}>
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <div style={styles.mobileCardInfo}>
                                <h3>{rib.accountName}</h3>
                                <p>{rib.iban.match(/.{1,4}/g).join(' ').substring(0, 20)}...</p>
                            </div>
                        </div>
                        <div style={styles.mobileCardActions}>
                            <button onClick={() => handleDownload(rib)} style={styles.mobileActionBtnPrimary}>
                                <i className="fas fa-download"></i> PDF
                            </button>
                            <button onClick={() => handleShare(rib)} style={styles.mobileActionBtnSecondary}>
                                <i className="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                ))}

                <div style={styles.mobileCard}>
                    <div style={styles.mobileCardTop}>
                        <div style={{ ...styles.mobileIconBadge, backgroundColor: '#f5f5f5', color: '#616161' }}>
                            <i className="fas fa-signature"></i>
                        </div>
                        <div style={styles.mobileCardInfo}>
                            <h3>Contrat Client</h3>
                            <p>Signé le {userData?.createdAt?.toDate().toLocaleDateString('fr-FR') || 'N/A'}</p>
                        </div>
                    </div>
                    <div style={styles.mobileCardActions}>
                        <button style={styles.mobileActionBtnPrimary}>
                            <i className="fas fa-download"></i> PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return <KycVerificationBanner>{isMobile ? <MobileView /> : <DesktopView />}</KycVerificationBanner>;
};

const styles = {
    // Shared / Desktop
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366', fontSize: '1.2rem', fontWeight: '500' },
    header: { marginBottom: '3rem', textAlign: 'center' },
    title: { fontSize: '2.5rem', color: '#003366', fontWeight: '800', marginBottom: '0.8rem' },
    subtitle: { color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },
    section: { marginBottom: '4rem' },
    sectionTitle: { fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '1rem' },
    titleIcon: { color: '#003366' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
    card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', overflow: 'hidden', transition: 'transform 0.3s ease', cursor: 'default', position: 'relative' },
    cardLeftBorder: (type) => ({ width: '6px', backgroundColor: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : '#e74c3c'), flexShrink: 0 }),
    cardContent: { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '1.2rem' },
    iconBox: (type) => ({ width: '56px', height: '56px', backgroundColor: type === 'main' ? '#f0f4f8' : (type === 'savings' ? '#eafaf1' : (type === 'credit' ? '#fdeaea' : '#f0f0f0')), color: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : (type === 'credit' ? '#e74c3c' : '#7f8c8d')), borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }),
    cardInfo: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
    docTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#2c3e50', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    ibanContainer: { display: 'flex', flexDirection: 'column', gap: '2px' },
    ibanLabel: { fontSize: '0.7rem', color: '#95a5a6', textTransform: 'uppercase', fontWeight: '600' },
    ibanValue: { fontSize: '0.9rem', color: '#555', fontFamily: "'Roboto Mono', monospace", fontWeight: '500', wordBreak: 'break-all' },
    docMeta: { fontSize: '0.9rem', color: '#7f8c8d' },
    actions: { display: 'flex', gap: '1rem', marginTop: 'auto' },
    downloadBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.8rem 1.2rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(0, 51, 102, 0.2)' },
    printBtn: { width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem' },
    emptyState: { padding: '4rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center', color: '#666' },
    emptyIconCircle: { width: '80px', height: '80px', backgroundColor: '#f8fbff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
    emptyIcon: { fontSize: '2.5rem', color: '#003366' },

    // Mobile Specific
    mobileContainer: { padding: '1rem', backgroundColor: '#f4f6f9', minHeight: '80vh' },
    mobileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    mobileBadge: { backgroundColor: '#e3f2fd', color: '#1565c0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' },
    mobileList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    mobileCard: { backgroundColor: 'white', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    mobileCardTop: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' },
    mobileIconBadge: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    mobileCardInfo: { flex: 1 },
    mobileCardActions: { display: 'flex', gap: '0.8rem' },
    mobileActionBtnPrimary: { flex: 1, padding: '0.8rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    mobileActionBtnSecondary: { width: '48px', backgroundColor: '#f5f5f5', color: '#333', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }
};

export default Documents;
