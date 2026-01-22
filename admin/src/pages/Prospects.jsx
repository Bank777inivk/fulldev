import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const Prospects = () => {
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);
    const prospectsPerPage = 5;

    useEffect(() => {
        const unsubscribe = adminService.subscribeToLeads((data) => {
            setProspects(data);
            setLoading(false);
        });

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminService.updateLeadStatus(id, newStatus);
            if (selectedProspect && selectedProspect.id === id) {
                setSelectedProspect({ ...selectedProspect, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating lead status:", error);
        }
    };

    const getScoreColor = (score) => {
        switch (score) {
            case 'GREEN': return '#10b981';
            case 'YELLOW': return '#f59e0b';
            case 'RED': return '#ef4444';
            default: return '#64748b';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'new': return { bg: '#eff6ff', color: '#1d4ed8', label: 'Nouveau' };
            case 'contacted': return { bg: '#fef3c7', color: '#b45309', label: 'Contacté' };
            case 'closed': return { bg: '#f1f5f9', color: '#475569', label: 'Clôturé' };
            default: return { bg: '#f1f5f9', color: '#475569', label: 'Inconnu' };
        }
    };

    const filteredProspects = prospects.filter(p => {
        const matchesSearch =
            p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const paginatedProspects = filteredProspects.slice(
        (currentPage - 1) * prospectsPerPage,
        currentPage * prospectsPerPage
    );

    const styles = {
        container: { padding: isMobile ? '1rem' : '2rem', maxWidth: '1400px', margin: '0 auto' },
        header: { marginBottom: '2rem' },
        title: { fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' },
        subtitle: { color: 'var(--text-light)', fontSize: isMobile ? '0.9rem' : '1.1rem' },

        statsGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.25rem',
            marginBottom: '2.5rem'
        },
        statCard: {
            background: 'white',
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
        },
        statIcon: {
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
        },
        statInfo: { display: 'flex', flexDirection: 'column' },
        statLabel: { fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
        statValue: { fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.2' },

        controls: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexDirection: isMobile ? 'column' : 'row',
            background: 'white',
            padding: '1rem',
            borderRadius: '20px',
            border: '1px solid var(--border)'
        },
        searchWrapper: { position: 'relative', flex: 1 },
        searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
        search: {
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.8rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: 'base',
            background: '#f8fafc',
            boxSizing: 'border-box'
        },
        select: {
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            fontSize: 'base',
            fontWeight: '600',
            color: 'var(--primary)',
            outline: 'none'
        },

        // Desktop Table
        tableCard: { background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' },
        table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
        th: { padding: '1.2rem 1.5rem', background: '#f8fafc', color: 'var(--text-light)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border)' },
        td: { padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },

        // Mobile Cards
        mobileList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        prospectCard: {
            background: 'white',
            padding: '1.25rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        },

        badge: { padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' },
        scoreBadge: { padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white' },

        viewBtn: {
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            border: 'none',
            background: '#f1f5f9',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },

        // Page Detail Redesign
        detailView: {
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '64px' : '0',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'white',
            zIndex: 100,
            overflowY: 'auto',
            padding: isMobile ? '1.5rem 1rem 5rem 1rem' : '0',
            WebkitOverflowScrolling: 'touch'
        },
        detailHero: {
            background: 'white',
            borderRadius: isMobile ? '0' : '32px',
            padding: isMobile ? '0' : '2.5rem 3rem',
            boxShadow: isMobile ? 'none' : 'var(--shadow-md)',
            border: isMobile ? 'none' : '1px solid var(--border)',
            marginBottom: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.25rem',
            borderRadius: '12px',
            border: 'none',
            background: '#f1f5f9',
            color: 'var(--primary)',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginBottom: isMobile ? '1.5rem' : '2rem',
            transition: 'all 0.2s'
        },
        detailSection: { marginBottom: '2.5rem' },
        sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' },
        sectionTitle: { fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' },

        dataGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: isMobile ? '1.25rem' : '2rem'
        },
        dataItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
        dataLabel: { fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
        dataValue: { fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '700', color: 'var(--primary)', wordBreak: 'break-word' },

        statusGrid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1.5rem',
            padding: isMobile ? '0' : '1.5rem',
            background: isMobile ? 'transparent' : '#f8fafc',
            borderRadius: '20px',
            border: isMobile ? 'none' : '1px solid var(--border)'
        },
        statusBtn: {
            padding: '1rem',
            borderRadius: '14px',
            border: '2px solid transparent',
            cursor: 'pointer',
            fontWeight: '800',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            textAlign: 'center'
        },
        paginationContainer: {
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.5rem',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        },
        paginationBtn: {
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
        },
        paginationInfo: {
            fontSize: '0.95rem',
            fontWeight: '800',
            color: 'var(--primary)',
            letterSpacing: '0.5px'
        }
    };

    if (loading) return (
        <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontWeight: '600' }}>Chargement des dossiers...</p>
        </div>
    );

    // VUE DETAIL
    if (selectedProspect) {
        return (
            <div style={styles.detailView}>
                <div style={styles.detailHero}>
                    <button style={styles.backBtn} onClick={() => setSelectedProspect(null)}>
                        <i className="fas fa-arrow-left"></i> RETOUR
                    </button>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>
                                Dossier #{selectedProspect.id?.substring(0, 5).toUpperCase()}
                            </h2>
                            <span style={{ ...styles.scoreBadge, background: getScoreColor(selectedProspect.score), padding: '6px 12px', fontSize: '0.85rem' }}>
                                {selectedProspect.score}
                            </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: '500' }}>
                            {selectedProspect.civilite} {selectedProspect.nom} {selectedProspect.prenom}
                        </p>
                    </div>

                    {/* Section 1: Identité */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-user-circle" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Identité & Contact</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Civilité</span>
                                <span style={styles.dataValue}>{selectedProspect.civilite || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Email</span>
                                <span style={styles.dataValue}>{selectedProspect.email}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Téléphone</span>
                                <span style={styles.dataValue}>{selectedProspect.telephone || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Date de naissance</span>
                                <span style={styles.dataValue}>{selectedProspect.dateNaissance || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Lieu de naissance</span>
                                <span style={styles.dataValue}>{selectedProspect.lieuNaissance || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Nationalité</span>
                                <span style={styles.dataValue}>{selectedProspect.nationalite || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Pièce d'identité</span>
                                <span style={styles.dataValue}>
                                    {selectedProspect.typePieceIdentite?.toUpperCase() || 'N/A'}
                                    {selectedProspect.dateExpPiece ? ` (Exp: ${selectedProspect.dateExpPiece})` : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section: Domiciliation & Situation Familiale */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-home" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Domiciliation & Famille</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={{ ...styles.dataItem, gridColumn: 'span 2' }}>
                                <span style={styles.dataLabel}>Adresse complète</span>
                                <span style={styles.dataValue}>
                                    {selectedProspect.adresseRue ? (
                                        `${selectedProspect.adresseRue}, ${selectedProspect.adresseCodePostal || ''} ${selectedProspect.adresseVille || ''} (${selectedProspect.adressePays || ''})`
                                    ) : (
                                        selectedProspect.adresseVille || 'Non renseignée'
                                    )}
                                </span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Situation Matrimoniale</span>
                                <span style={styles.dataValue}>{selectedProspect.situationMatrimoniale || 'Non renseignée'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Enfants à charge</span>
                                <span style={styles.dataValue}>{selectedProspect.nbEnfants || 0}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Type de logement</span>
                                <span style={styles.dataValue}>{selectedProspect.typeLogement || 'N/A'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Depuis (mois)</span>
                                <span style={styles.dataValue}>{selectedProspect.ancienneteAdresse || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Projet */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-file-invoice-dollar" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Projet de Crédit</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Montant requis</span>
                                <span style={{ ...styles.dataValue, color: 'var(--secondary)', fontSize: isMobile ? '1.2rem' : '1.4rem' }}>
                                    {selectedProspect.montant?.toLocaleString()} {selectedProspect.devise || 'EUR'}
                                </span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Durée</span>
                                <span style={styles.dataValue}>{selectedProspect.duree} mois</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Objet</span>
                                <span style={styles.dataValue}>{selectedProspect.objet || 'Non renseigné'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Type de crédit</span>
                                <span style={styles.dataValue}>{selectedProspect.typeCredit}</span>
                            </div>
                        </div>

                        {/* Simulator specific details */}
                        {(selectedProspect.taux || selectedProspect.interestRate || selectedProspect.mensualite || selectedProspect.monthlyPayment) && (
                            <div style={{ ...styles.dataGrid, marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                                <div style={styles.dataItem}>
                                    <span style={styles.dataLabel}>Taux TAEG</span>
                                    <span style={{ ...styles.dataValue, color: '#6366f1' }}>
                                        {selectedProspect.taux || selectedProspect.interestRate}%
                                    </span>
                                </div>
                                <div style={styles.dataItem}>
                                    <span style={styles.dataLabel}>Mensualité simulée</span>
                                    <span style={{ ...styles.dataValue, color: '#6366f1' }}>
                                        {parseFloat(selectedProspect.mensualite || selectedProspect.monthlyPayment || 0).toFixed(2)} €
                                    </span>
                                </div>
                                <div style={styles.dataItem}>
                                    <span style={styles.dataLabel}>Coût total crédit</span>
                                    <span style={{ ...styles.dataValue, color: '#6366f1' }}>
                                        {parseFloat(selectedProspect.coutTotal || selectedProspect.totalCost || 0).toFixed(2)} €
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Section 3: Situation Professionnelle */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-briefcase" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Situation Professionnelle</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Contrat / Statut</span>
                                <span style={styles.dataValue}>{selectedProspect.statutPro?.toUpperCase()} ({selectedProspect.typeContrat || 'N/A'})</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Employeur / Secteur</span>
                                <span style={styles.dataValue}>{selectedProspect.nomEmployeur || 'N/A'} ({selectedProspect.secteurActivite || 'N/A'})</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Poste / Ancienneté</span>
                                <span style={styles.dataValue}>{selectedProspect.posteOccupe || 'N/A'} ({selectedProspect.anciennetePro || 0} mois)</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Revenus mensuels</span>
                                <span style={{ ...styles.dataValue, color: '#10b981', fontWeight: '800' }}>
                                    {(selectedProspect.revenusMensuels || 0).toLocaleString()} {selectedProspect.devise || 'EUR'}
                                </span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Autres revenus</span>
                                <span style={styles.dataValue}>{(selectedProspect.autresRevenus || 0).toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Situation Financière Detailed */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-chart-line" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Charges & Situation Financière</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Charges mensuelles</span>
                                <span style={{ ...styles.dataValue, color: '#ef4444' }}>{(selectedProspect.chargesMensuelles || 0).toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Dont Loyer</span>
                                <span style={styles.dataValue}>{(selectedProspect.loyer || 0).toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Crédits en cours</span>
                                <span style={styles.dataValue}>{(selectedProspect.autresCredits || 0).toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Incident Bancaire</span>
                                <span style={{ ...styles.dataValue, color: selectedProspect.incidentBancaire === 'oui' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                    {selectedProspect.incidentBancaire?.toUpperCase() || 'NON'}
                                </span>
                            </div>
                            {selectedProspect.incidentDetail && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <span style={styles.dataLabel}>Détails incident</span>
                                    <p style={{ ...styles.dataValue, fontSize: '0.85rem', fontStyle: 'italic', margin: '4px 0 0 0' }}>{selectedProspect.incidentDetail}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 5: Informations Bancaires */}
                    <div style={styles.detailSection}>
                        <div style={styles.sectionHeader}>
                            <i className="fas fa-university" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}></i>
                            <h3 style={styles.sectionTitle}>Informations Bancaires</h3>
                        </div>
                        <div style={styles.dataGrid}>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Banque Actuelle</span>
                                <span style={styles.dataValue}>{selectedProspect.banqueActuelle} {selectedProspect.autreBanqueNom ? `(${selectedProspect.autreBanqueNom})` : ''}</span>
                            </div>
                            <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Ancienneté Compte</span>
                                <span style={styles.dataValue}>{selectedProspect.ancienneteCompte || 0} mois</span>
                            </div>
                            {selectedProspect.iban && (
                                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginTop: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={styles.dataLabel}>IBAN</span>
                                    <div style={{ ...styles.dataValue, fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '1px', marginTop: '4px' }}>{selectedProspect.iban}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Action Status */}
                    <div style={{ marginTop: '2rem' }}>
                        <span style={styles.dataLabel}>Mettre à jour le statut du dossier</span>
                        <div style={styles.statusGrid}>
                            <button
                                onClick={() => handleStatusChange(selectedProspect.id, 'new')}
                                style={{
                                    ...styles.statusBtn,
                                    background: selectedProspect.status === 'new' ? '#eff6ff' : 'white',
                                    color: selectedProspect.status === 'new' ? '#1d4ed8' : '#64748b',
                                    borderColor: selectedProspect.status === 'new' ? '#1d4ed8' : '#e2e8f0',
                                    marginBottom: isMobile ? '0.75rem' : '0'
                                }}
                            >
                                NOUVEAU
                            </button>
                            <button
                                onClick={() => handleStatusChange(selectedProspect.id, 'contacted')}
                                style={{
                                    ...styles.statusBtn,
                                    background: selectedProspect.status === 'contacted' ? '#fff7ed' : 'white',
                                    color: selectedProspect.status === 'contacted' ? '#f97316' : '#64748b',
                                    borderColor: selectedProspect.status === 'contacted' ? '#f97316' : '#e2e8f0',
                                    marginBottom: isMobile ? '0.75rem' : '0'
                                }}
                            >
                                CONTACTÉ
                            </button>
                            <button
                                onClick={() => handleStatusChange(selectedProspect.id, 'closed')}
                                style={{
                                    ...styles.statusBtn,
                                    background: selectedProspect.status === 'closed' ? '#f1f5f9' : 'white',
                                    color: selectedProspect.status === 'closed' ? '#475569' : '#64748b',
                                    borderColor: selectedProspect.status === 'closed' ? '#475569' : '#e2e8f0'
                                }}
                            >
                                CLÔTURÉ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // VUE LISTE (Header + Stats + Controls + List)
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Prospects & Leads</h1>
                <p style={styles.subtitle}>Supervisez et gérez les nouvelles demandes de crédit.</p>
            </header>

            <div style={styles.statsGrid}>
                {/* Stat 1 */}
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: '#eff6ff', color: '#1d4ed8' }}>
                        <i className="fas fa-users"></i>
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Total Dossiers</span>
                        <span style={styles.statValue}>{prospects.length}</span>
                    </div>
                </div>
                {/* Stat 2 */}
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: '#ecfdf5', color: '#10b981' }}>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Éligibilité OK</span>
                        <span style={{ ...styles.statValue, color: '#10b981' }}>{prospects.filter(p => p.score === 'GREEN').length}</span>
                    </div>
                </div>
                {/* Stat 3 */}
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: '#fff7ed', color: '#f97316' }}>
                        <i className="fas fa-clock"></i>
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>Aujourd'hui</span>
                        <span style={{ ...styles.statValue, color: '#f97316' }}>
                            {prospects.filter(p => p.createdAt?.toDate().toDateString() === new Date().toDateString()).length}
                        </span>
                    </div>
                </div>
            </div>

            <div style={styles.controls}>
                <div style={styles.searchWrapper}>
                    <i className="fas fa-search" style={styles.searchIcon}></i>
                    <input
                        style={styles.search}
                        placeholder="Rechercher un prospect (nom, email)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    style={styles.select}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="new">🆕 Nouveaux</option>
                    <option value="contacted">📞 Contactés</option>
                    <option value="closed">✅ Clôturés</option>
                </select>
            </div>

            {!isMobile ? (
                /* Desktop Table View */
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Client</th>
                                <th style={styles.th}>Projet & Montant</th>
                                <th style={styles.th}>Score</th>
                                <th style={styles.th}>Statut</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProspects.map(p => {
                                const status = getStatusStyle(p.status);
                                return (
                                    <tr key={p.id}>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '800', color: 'var(--primary)', marginBottom: '2px' }}>{p.nom} {p.prenom}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{p.email}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontWeight: '800', color: 'var(--secondary)', fontSize: '1rem' }}>{p.montant?.toLocaleString()} {p.devise || 'EUR'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>{p.objet}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ ...styles.scoreBadge, background: getScoreColor(p.score) }}>
                                                {p.score}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
                                                <i className={`fas fa-${p.status === 'new' ? 'bolt' : p.status === 'contacted' ? 'phone' : 'check'}`}></i>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)' }}>
                                                {p.createdAt?.toDate().toLocaleDateString('fr-FR')}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <button style={styles.viewBtn} onClick={() => {
                                                setSelectedProspect(p);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}>
                                                Détails <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Mobile Card View */
                <div style={styles.mobileList}>
                    {paginatedProspects.map(p => {
                        const status = getStatusStyle(p.status);
                        return (
                            <div key={p.id} style={styles.prospectCard} onClick={() => {
                                setSelectedProspect(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
                                        {status.label}
                                    </span>
                                    <span style={{ ...styles.scoreBadge, background: getScoreColor(p.score) }}>
                                        Score: {p.score}
                                    </span>
                                </div>
                                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                                    {p.nom} {p.prenom}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.25rem' }}>
                                    {p.montant?.toLocaleString()} {p.devise || 'EUR'} • {p.objet}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                                        {p.createdAt?.toDate().toLocaleDateString('fr-FR')}
                                    </span>
                                    <div style={{ color: 'var(--secondary)', fontWeight: '800', fontSize: '0.9rem' }}>
                                        Gérer <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {filteredProspects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-light)' }}>
                    <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}></i>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Aucun prospect ne correspond à votre recherche.</p>
                </div>
            )}

            {/* Pagination Controls */}
            {filteredProspects.length > prospectsPerPage && (
                <div style={styles.paginationContainer}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(prev => prev - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.3 : 1 }}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div style={styles.paginationInfo}>
                        Page {currentPage} sur {Math.ceil(filteredProspects.length / prospectsPerPage)}
                    </div>

                    <button
                        disabled={currentPage >= Math.ceil(filteredProspects.length / prospectsPerPage)}
                        onClick={() => {
                            setCurrentPage(prev => prev + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(filteredProspects.length / prospectsPerPage) ? 0.3 : 1 }}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Prospects;
