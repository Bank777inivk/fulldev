import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const LoanManagement = () => {
    const [users, setUsers] = useState({});
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // pending, approved, rejected, all

    useEffect(() => {
        // Subscribe to users
        const unsubscribeUsers = adminService.subscribeToUsers((userData) => {
            const userMap = {};
            userData.forEach(u => userMap[u.id] = u);
            setUsers(userMap);
        });

        // Subscribe to loans
        const unsubscribeLoans = adminService.subscribeToLoans((loanData) => {
            setLoans(loanData);
            setLoading(false);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeLoans();
        };
    }, []);

    const handleAction = async (loanId, status) => {
        let reviewNotes = '';
        if (status === 'rejected') {
            reviewNotes = window.prompt('Motif du refus :');
            if (reviewNotes === null) return;
        } else {
            if (!window.confirm(`Confirmer l'approbation de ce prêt ?`)) return;
        }

        try {
            await adminService.updateLoanStatus(loanId, status, reviewNotes);
        } catch (error) {
            console.error('Error updating loan status:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleDelete = async (loanId) => {
        if (!window.confirm("Supprimer définitivement cette demande de prêt ?")) return;
        try {
            await adminService.deleteLoan(loanId);
        } catch (error) {
            console.error('Error deleting loan:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const filteredLoans = loans.filter(loan => {
        if (filterStatus === 'all') return true;
        return loan.status === filterStatus;
    });

    if (loading) return <div style={styles.loading}>Chargement des demandes de prêt...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Prêts</h1>
                    <p style={styles.subtitle}>Analysez et traitez les demandes de financement des clients.</p>
                </div>
                <div style={styles.tabs}>
                    <button
                        style={{ ...styles.tab, ...(filterStatus === 'pending' ? styles.activeTab : {}) }}
                        onClick={() => setFilterStatus('pending')}
                    >
                        À traiter
                    </button>
                    <button
                        style={{ ...styles.tab, ...(filterStatus === 'approved' ? styles.activeTab : {}) }}
                        onClick={() => setFilterStatus('approved')}
                    >
                        Approuvés
                    </button>
                    <button
                        style={{ ...styles.tab, ...(filterStatus === 'rejected' ? styles.activeTab : {}) }}
                        onClick={() => setFilterStatus('rejected')}
                    >
                        Refusés
                    </button>
                    <button
                        style={{ ...styles.tab, ...(filterStatus === 'all' ? styles.activeTab : {}) }}
                        onClick={() => setFilterStatus('all')}
                    >
                        Tous
                    </button>
                </div>
            </header>

            <div style={styles.loanGrid}>
                {filteredLoans.length > 0 ? filteredLoans.map(loan => {
                    const user = users[loan.userId] || { firstName: 'Utilisateur', lastName: 'Inconnu', email: loan.userId };
                    return (
                        <div key={loan.id} style={styles.loanCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.userRef}>
                                    <div style={styles.miniAvatar}>{user.firstName?.[0]}</div>
                                    <div>
                                        <h4 style={styles.userName}>{user.firstName} {user.lastName}</h4>
                                        <span style={styles.userEmail}>{user.email}</span>
                                    </div>
                                </div>
                                <div style={{ ...styles.statusBadge, ...styles[loan.status + 'Badge'] }}>
                                    {loan.status?.toUpperCase()}
                                </div>
                            </div>

                            <div style={styles.loanDetails}>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>MONTANT</span>
                                    <span style={styles.detailValue}>{loan.amount?.toLocaleString('fr-FR')} {loan.currency || '€'}</span>
                                </div>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>TYPE</span>
                                    <span style={styles.detailValue}>{loan.loanType || 'Prêt Personnel'}</span>
                                </div>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>DURÉE</span>
                                    <span style={styles.detailValue}>{loan.duration} mois</span>
                                </div>
                                <div style={styles.detailRow}>
                                    <span style={styles.detailLabel}>PROJET</span>
                                    <p style={styles.projectDesc}>{loan.purpose || 'Non spécifié'}</p>
                                </div>
                            </div>

                            {loan.documents && (
                                <div style={styles.docsSection}>
                                    <h5 style={styles.docsTitle}>Justificatifs</h5>
                                    <div style={styles.docsGrid}>
                                        {Object.entries(loan.documents).map(([key, url]) => (
                                            <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={styles.docLink}>
                                                <i className="fas fa-file-pdf"></i> {key}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {loan.reviewNotes && (
                                <div style={styles.notesBox}>
                                    <strong>Note Admin :</strong> {loan.reviewNotes}
                                </div>
                            )}

                            <div style={styles.cardActions}>
                                {loan.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleAction(loan.id, 'approved')} style={styles.approveBtn}>Approuver</button>
                                        <button onClick={() => handleAction(loan.id, 'rejected')} style={styles.rejectBtn}>Refuser</button>
                                    </>
                                )}
                                {(loan.status === 'approved' || loan.status === 'rejected') && (
                                    <button onClick={() => handleAction(loan.id, 'pending')} style={styles.resetBtn}>Reset</button>
                                )}
                                <button onClick={() => handleDelete(loan.id)} style={styles.deleteBtn}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    );
                }) : (
                    <div style={styles.emptyState}>
                        <i className="fas fa-hand-holding-usd fa-3x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                        <h3>Aucune demande</h3>
                        <p>Il n'y a aucune demande de prêt avec ce statut.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    loading: { textAlign: 'center', padding: '5rem', color: '#64748b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' },
    title: { fontSize: '2rem', fontWeight: '800', color: '#003366', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b', fontSize: '1rem' },
    tabs: { display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '14px', gap: '5px' },
    tab: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' },
    activeTab: { background: 'white', color: '#003366', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    loanGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' },
    loanCard: { background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' },
    userRef: { display: 'flex', alignItems: 'center', gap: '10px' },
    miniAvatar: { width: '35px', height: '35px', borderRadius: '10px', background: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' },
    userName: { margin: 0, fontSize: '1rem', color: '#1e293b' },
    userEmail: { fontSize: '0.75rem', color: '#64748b' },
    statusBadge: { fontSize: '0.65rem', fontWeight: '800', padding: '4px 10px', borderRadius: '50px' },
    pendingBadge: { background: '#fef3c7', color: '#92400e' },
    approvedBadge: { background: '#dcfce7', color: '#15803d' },
    rejectedBadge: { background: '#fee2e2', color: '#b91c1c' },
    loanDetails: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' },
    detailRow: { display: 'flex', flexDirection: 'column', gap: '4px' },
    detailLabel: { fontSize: '0.6rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' },
    detailValue: { fontSize: '1rem', fontWeight: 'bold', color: '#003366' },
    projectDesc: { fontSize: '0.85rem', color: '#475569', margin: 0, fontStyle: 'italic', lineHeight: '1.4' },
    docsSection: { marginBottom: '1.5rem' },
    docsTitle: { fontSize: '0.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' },
    docsGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    docLink: { padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#003366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' },
    notesBox: { padding: '10px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', fontSize: '0.8rem', color: '#92400e', marginBottom: '1.5rem' },
    cardActions: { display: 'flex', gap: '10px', marginTop: 'auto' },
    approveBtn: { flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },
    rejectBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },
    resetBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#e2e8f0', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },
    deleteBtn: { padding: '10px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#64748b', width: '100%', gridColumn: '1 / -1' }
};

export default LoanManagement;
