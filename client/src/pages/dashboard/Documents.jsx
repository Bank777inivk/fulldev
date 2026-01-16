import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ribService } from '../../services/ribService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { jsPDF } from 'jspdf';

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

    // Helper to load image
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    // Helper to add standard Header & Footer to PDF
    const addPdfBranding = async (doc, title) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // --- Header ---
        doc.setFillColor(0, 51, 102); // Navy Blue
        doc.rect(0, 0, pageWidth, 40, 'F');

        try {
            const logoData = await loadImage('/logo.png');
            doc.addImage(logoData, 'PNG', 20, 8, 25, 25);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("INVIK S.A.", 50, 25);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Banque Digitale Premium", 50, 32);
        } catch (e) {
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("INVIK S.A.", 20, 25);
        }

        // Document Title
        doc.setTextColor(0, 51, 102);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), 20, 60);

        // Date
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 68);

        // --- Footer ---
        doc.setDrawColor(240, 240, 240);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("Ce document est un acte officiel généré par les services numériques de INVIK S.A.", pageWidth / 2, pageHeight - 22, { align: "center" });
        doc.text("INVIK S.A. - S.A. de droit luxembourgeois - RCS Luxembourg B 138.554 - Capital 31.000.000 EUR", pageWidth / 2, pageHeight - 17, { align: "center" });
        doc.text("Siège social : 51, Boulevard Grande-Duchesse Charlotte, L-1331 Luxembourg", pageWidth / 2, pageHeight - 12, { align: "center" });
    };

    const handleDownload = async (rib) => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            await addPdfBranding(doc, "RELEVÉ D'IDENTITÉ BANCAIRE");

            // --- Holder Info ---
            doc.setDrawColor(240, 240, 240);
            doc.line(20, 75, pageWidth - 20, 75);

            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("TITULAIRE DU COMPTE", 20, 85);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || rib.holderName || "Client INVIK BANK";
            doc.text(fullName, 20, 93);
            doc.text(userData?.address || "Adresse non renseignée", 20, 100);
            if (userData?.zipCode || userData?.city) {
                doc.text(`${userData?.zipCode || ""} ${userData?.city || ""}`, 20, 107);
            }

            // --- Bank Info ---
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("ÉTABLISSEMENT BANCAIRE", 120, 85);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("INVIK S.A.", 120, 93);
            doc.setFontSize(9);
            doc.text("51, Blvd Grande-Duchesse Charlotte", 120, 100);
            doc.text("L-1331 Luxembourg", 120, 107);

            // --- Banking Details Table ---
            doc.setFillColor(248, 251, 255);
            doc.rect(20, 120, pageWidth - 40, 60, 'F');
            doc.setDrawColor(0, 51, 102);
            doc.setLineWidth(0.5);
            doc.rect(20, 120, pageWidth - 40, 60, 'S');

            doc.setDrawColor(230, 230, 230);
            doc.line(55, 120, 55, 180);
            doc.line(90, 120, 90, 180);
            doc.line(pageWidth - 45, 120, pageWidth - 45, 180);

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "bold");
            doc.text("CODE BANQUE", 25, 130);
            doc.text("CODE GUICHET", 60, 130);
            doc.text("NUMÉRO DE COMPTE", 95, 130);
            doc.text("CLÉ", pageWidth - 40, 130);

            doc.setFontSize(11);
            doc.setTextColor(0, 51, 102);
            doc.setFont("courier", "bold");
            doc.text(rib.bankCode || "12345", 25, 145);
            doc.text(rib.branchCode || "67890", 60, 145);
            doc.text(rib.accountNumber || "XXXXXXXX", 95, 145);
            doc.text(rib.ribKey || "00", pageWidth - 38, 145);

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text("IBAN :", 25, 160);
            doc.text("BIC (SWIFT) :", 25, 172);

            doc.setFont("courier", "bold");
            doc.text(rib.iban || "Non défini", 55, 160);
            doc.setFont("helvetica", "normal");
            doc.text(rib.bic || "INVKFR2P", 55, 172);

            doc.save(`RIB_INVIK_SA_${rib.accountName.split(' ').join('_')}.pdf`);
            showToast("RIB généré avec succès !", "success");
        } catch (error) {
            console.error("PDF Generation error:", error);
            showToast("Erreur lors de la génération du PDF", "error");
        }
    };

    const handleDownloadContract = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || "Client INVIK BANK";

            // Pre-load logo to avoid signature errors
            let logoData = null;
            try {
                logoData = await loadImage('/logo.png');
            } catch (e) {
                console.warn("Could not load logo", e);
            }

            await addPdfBranding(doc, "CONTRAT D'OUVERTURE DE COMPTE PARTICULIER");

            // --- Parties ---
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("ENTRE LES SOUSSIGNÉS :", 20, 85);

            doc.setFont("helvetica", "normal");
            doc.text("1. L'établissement bancaire INVIK S.A., ci-après dénommé 'La Banque'.", 25, 95);
            doc.text(`2. M./Mme ${fullName}, ci-après dénommé 'Le Client'.`, 25, 102);
            doc.setFontSize(10);
            doc.text(`Demeurant au : ${userData?.address || "Non renseigné"}, ${userData?.zipCode || ""} ${userData?.city || ""}`, 30, 108);

            // --- Body ---
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("OBJET DU CONTRAT", 20, 125);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const intro = "Le présent contrat a pour objet de définir les conditions générales et particulières d'ouverture et de fonctionnement des comptes ouverts au nom du Client dans les livres de INVIK S.A.";
            const splitIntro = doc.splitTextToSize(intro, pageWidth - 40);
            doc.text(splitIntro, 20, 135);

            doc.setFont("helvetica", "bold");
            doc.text("CONDITIONS D'UTILISATION", 20, 150);
            doc.setFont("helvetica", "normal");
            const terms = [
                "- Le Client bénéficie d'un accès permanent à ses comptes via l'interface digitale sécurisée.",
                "- La Banque s'engage à assurer la sécurité des fonds et la confidentialité des données conformément au RGPD.",
                "- Le Client est responsable du maintien de la confidentialité de ses accès bancaires.",
                "- Les opérations de virement et de paiement sont soumises aux plafonds définis dans les conditions tarifaires."
            ];
            doc.text(terms, 25, 160);

            doc.setFont("helvetica", "bold");
            doc.text("DURÉE ET RÉSILIATION", 20, 195);
            doc.setFont("helvetica", "normal");
            doc.text("Ce contrat est conclu pour une durée indéterminée. Chaque partie peut y mettre fin à tout moment sous réserve d'un préavis de 30 jours, conformément à la réglementation en vigueur.", 20, 205, { maxWidth: pageWidth - 40 });

            // --- Signatures ---
            doc.setFont("helvetica", "bold");
            doc.text("SIGNATURES", 20, 230);

            doc.setFontSize(9);
            doc.text("Fait à Luxembourg, le " + new Date().toLocaleDateString('fr-FR'), 20, 238);

            doc.rect(20, 245, 70, 30); // Client Box
            doc.text("Signature du Client", 25, 250);
            doc.setFontSize(8);
            doc.text("(Signature numérique certifiée)", 25, 270);

            doc.rect(pageWidth - 90, 245, 70, 30); // Bank Box
            doc.setFontSize(9);
            doc.text("Pour INVIK S.A.", pageWidth - 85, 250);

            if (logoData) {
                doc.addImage(logoData, 'PNG', pageWidth - 55, 255, 15, 15);
            }

            doc.save(`CONTRAT_INVIK_SA_${fullName.split(' ').join('_')}.pdf`);
            showToast("Contrat généré avec succès !", "success");
        } catch (error) {
            console.error("Contract Generation error:", error);
            showToast("Erreur lors de la génération du contrat", "error");
        }
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
                                            <div style={styles.ribDetails}>
                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>Titulaire:</span>
                                                    <span style={styles.detailValue}>{rib.holderName || (userData?.firstName + ' ' + userData?.lastName)}</span>
                                                </div>

                                                {/* French RIB Standard Display */}
                                                <div style={styles.ribTableContainer}>
                                                    <div style={styles.ribTable}>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>Code Banque</span>
                                                            <span style={styles.ribTableValue}>{rib.bankCode || '12345'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>Code Guichet</span>
                                                            <span style={styles.ribTableValue}>{rib.branchCode || '67890'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>Numéro Compte</span>
                                                            <span style={styles.ribTableValue}>{rib.accountNumber || 'XXXXXXXX'}</span>
                                                        </div>
                                                        <div style={styles.ribTableCol}>
                                                            <span style={styles.ribTableLabel}>Clé RIB</span>
                                                            <span style={styles.ribTableValue}>{rib.ribKey || '00'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>IBAN:</span>
                                                    <span style={styles.detailValue} className="monospace">{rib.iban}</span>
                                                </div>
                                                <div style={styles.detailRow}>
                                                    <span style={styles.detailLabel}>BIC:</span>
                                                    <span style={styles.detailValue}>{rib.bic || 'INVKFR2P'}</span>
                                                </div>
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
                                <button onClick={handleDownloadContract} style={styles.downloadBtn}>
                                    <i className="fas fa-file-pdf"></i>
                                    <span>TÉLÉCHARGER PDF</span>
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
                        <button onClick={handleDownloadContract} style={styles.mobileActionBtnPrimary}>
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
    cardLeftBorder: (type) => ({ width: '8px', backgroundColor: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : '#e74c3c'), flexShrink: 0 }),
    cardContent: { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' },
    cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '1.2rem' },
    iconBox: (type) => ({ width: '64px', height: '64px', backgroundColor: type === 'main' ? '#f0f4f8' : (type === 'savings' ? '#eafaf1' : (type === 'credit' ? '#fdeaea' : '#f0f0f0')), color: type === 'main' ? '#003366' : (type === 'savings' ? '#27ae60' : (type === 'credit' ? '#e74c3c' : '#7f8c8d')), borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }),
    cardInfo: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
    docTitle: { fontSize: '1.2rem', fontWeight: '900', color: '#003366', marginBottom: '0.8rem' },
    ribDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
    detailRow: { display: 'flex', gap: '12px', alignItems: 'baseline' },
    detailLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', width: '90px', flexShrink: 0 },
    detailValue: { fontSize: '0.95rem', color: '#1e293b', fontWeight: '600', wordBreak: 'break-all' },

    ribTableContainer: { backgroundColor: '#f8fbff', padding: '12px', borderRadius: '12px', border: '1px solid #eef6ff', margin: '5px 0' },
    ribTable: { display: 'flex', justifyContent: 'space-between', gap: '10px' },
    ribTableCol: { display: 'flex', flexDirection: 'column', gap: '2px' },
    ribTableLabel: { fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
    ribTableValue: { fontSize: '0.85rem', color: '#003366', fontWeight: '850', fontFamily: 'monospace' },

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
