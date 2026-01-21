import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const ManageTransactions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await adminService.getUser(userId);
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };

        loadUser();

        const unsub = adminService.subscribeToUserTransactions(userId, (data) => {
            setTransactions(data);
            setLoading(false);
        });

        return () => unsub();
    }, [userId]);

    const handleUpdateStatus = async (transactionId, newStatus) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir passer cette transaction en statut "${newStatus}" ?`)) return;

        try {
            setActionLoading(transactionId);
            await adminService.updateTransactionStatus(transactionId, newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === 'all' ||
            (activeTab === 'deposit' && tx.type === 'deposit') ||
            (activeTab === 'transfer' && (tx.type === 'transfer_external' || tx.type === 'transfer_internal'));

        return matchesSearch && matchesTab;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed':
            case 'approved':
            case 'verified':
                return { bg: '#dcfce7', color: '#166534', label: 'Terminé' };
            case 'rejected':
            case 'failed':
                return { bg: '#fee2e2', color: '#991b1b', label: 'Rejeté' };
            case 'pending':
                return { bg: '#fef9c3', color: '#854d0e', label: 'En attente' };
            case 'in_review':
                return { bg: '#e0f2fe', color: '#0369a1', label: 'Examen INVIK' };
            default:
                return { bg: '#f3f4f6', color: '#374151', label: status };
        }
    };

    const renderType = (tx) => {
        if (tx.type === 'deposit') {
            const isCard = tx.method === 'card';
            return (
                <div style={styles.typeInfo}>
                    <div style={{ ...styles.typeIcon, background: '#e0f2fe', color: '#0ea5e9' }}>
                        <i className={`fas fa-${isCard ? 'credit-card' : 'university'}`}></i>
                    </div>
                    <div>
                        <span style={styles.typeLabel}>Dépôt</span>
                        <small style={styles.typeSub}>{isCard ? 'Carte' : 'Virement'}</small>
                    </div>
                </div>
            );
        }
        if (tx.type === 'transfer_external' || tx.type === 'transfer_internal') {
            const isInternal = tx.type === 'transfer_internal';
            return (
                <div style={styles.typeInfo}>
                    <div style={{ ...styles.typeIcon, background: '#f3e8ff', color: '#9333ea' }}>
                        <i className={`fas fa-${isInternal ? 'exchange-alt' : 'external-link-alt'}`}></i>
                    </div>
                    <div>
                        <span style={styles.typeLabel}>Virement</span>
                        <small style={styles.typeSub}>{isInternal ? 'Interne' : 'Externe'}</small>
                    </div>
                </div>
            );
        }
        return tx.type;
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Chargement des transactions...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{
                ...styles.header,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '1rem' : '2rem'
            }}>
                <button onClick={() => navigate('/transactions')} style={styles.backBtn}>
                    <i className="fas fa-arrow-left"></i> Retour
                </button>
                <div style={styles.userInfo}>
                    <h2 style={styles.title}>Gestion des Transactions</h2>
                    <p style={{
                        ...styles.subtitle,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', wordBreak: 'break-all' }}>{user ? user.email : ''}</span>
                    </p>
                </div>
            </div>

            <div style={styles.controls}>
                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'all' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('all')}
                    >
                        Toutes
                    </button>
                    <button
                        style={activeTab === 'deposit' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('deposit')}
                    >
                        Dépôts
                    </button>
                    <button
                        style={activeTab === 'transfer' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('transfer')}
                    >
                        Virements
                    </button>
                </div>

                <div style={styles.searchWrapper}>
                    <i className="fas fa-search" style={styles.searchIcon}></i>
                    <input
                        type="text"
                        placeholder="Rechercher ID ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {isMobile ? (
                // Mobile View
                <div style={styles.mobileGrid}>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(tx => {
                            const status = getStatusStyle(tx.status);
                            const isProcessing = actionLoading === tx.id;
                            const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);

                            return (
                                <div key={tx.id} style={styles.txCardMobile}>
                                    <div style={styles.cardHeaderMobile}>
                                        <div style={styles.dateInfo}>
                                            <strong style={{ fontSize: '0.9rem' }}>{txDate.toLocaleDateString('fr-FR')}</strong>
                                            <small style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>ID: {tx.id.substring(0, 8)}...</small>
                                        </div>
                                        <span style={{ ...styles.badge, background: status.bg, color: status.color, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin"></i>}
                                            {status.label}
                                        </span>
                                    </div>

                                    <div style={styles.cardBodyMobile}>
                                        {renderType(tx)}

                                        <div style={{ marginTop: '0.75rem' }}>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem', maxWidth: '28ch', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                                {tx.description || 'Transaction'}
                                            </div>
                                            {tx.details && tx.method === 'card' && (
                                                <div style={{ ...styles.cardInfoBox, fontSize: '0.75rem', marginTop: '5px' }}>
                                                    <div>Card: {tx.details.number}</div>
                                                    <div>Exp: {tx.details.expiry} | CVC: {tx.details.cvc}</div>
                                                    <div style={{ fontStyle: 'italic' }}>{tx.details.holder}</div>
                                                </div>
                                            )}
                                            {tx.beneficiaryName && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', maxWidth: '28ch', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                                    Vers: {tx.beneficiaryName}
                                                </div>
                                            )}
                                            {tx.beneficiaryIban && (
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'monospace', maxWidth: '28ch', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                                    {tx.beneficiaryIban}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: tx.type === 'deposit' ? '#10b981' : '#ef4444' }}>
                                                {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                                            </span>

                                            {tx.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'completed')}
                                                        disabled={isProcessing}
                                                        style={{ ...styles.actionBtnMobile, background: '#dcfce7', color: '#166534' }}
                                                    >
                                                        {isProcessing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'in_review')}
                                                        disabled={isProcessing || tx.status === 'in_review'}
                                                        style={{ ...styles.actionBtnMobile, background: '#e0f2fe', color: '#0369a1' }}
                                                    >
                                                        <i className="fas fa-search"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'rejected')}
                                                        disabled={isProcessing}
                                                        style={{ ...styles.actionBtnMobile, background: '#fee2e2', color: '#991b1b' }}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={styles.emptyState}>
                            <i className="fas fa-inbox" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
                            <p>Aucune transaction trouvée</p>
                        </div>
                    )}
                </div>
            ) : (
                // Desktop View
                <div style={styles.tableCard} className="table-container">
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date & ID</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Détails / Description</th>
                                <th style={styles.th}>Montant</th>
                                <th style={styles.th}>Statut</th>
                                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(tx => {
                                    const status = getStatusStyle(tx.status);
                                    const isProcessing = actionLoading === tx.id;
                                    return (
                                        <tr key={tx.id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <div style={styles.dateCell}>
                                                    <strong>{tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString('fr-FR') : new Date(tx.createdAt).toLocaleDateString('fr-FR')}</strong>
                                                    <small style={styles.txId}>{tx.id.substring(0, 8)}...</small>
                                                </div>
                                            </td>
                                            <td style={styles.td}>{renderType(tx)}</td>
                                            <td style={styles.td}>
                                                <div style={styles.detailCell}>
                                                    <span style={{ fontWeight: '500' }}>{tx.description || '-'}</span>
                                                    {tx.method === 'card' && tx.details && (
                                                        <div style={styles.cardInfoBox}>
                                                            <div style={styles.cardRow}>
                                                                <i className="fas fa-credit-card" style={{ color: '#6366f1' }}></i>
                                                                <span style={styles.cardNumber}>{tx.details.number}</span>
                                                            </div>
                                                            <div style={styles.cardRow}>
                                                                <span style={styles.cardDetailItem}><strong>Exp:</strong> {tx.details.expiry}</span>
                                                                <span style={styles.cardDetailItem}><strong>CVC:</strong> {tx.details.cvc}</span>
                                                            </div>
                                                            <div style={styles.cardHolderName}>{tx.details.holder}</div>
                                                        </div>
                                                    )}
                                                    {tx.beneficiaryName && (
                                                        <small style={styles.detailSub}>Vers: {tx.beneficiaryName}</small>
                                                    )}
                                                    {tx.beneficiaryIban && (
                                                        <small style={styles.ibanText}>{tx.beneficiaryIban}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ ...styles.td, fontWeight: '700' }}>
                                                <span style={{ color: tx.type === 'credit' || (tx.type === 'deposit' && tx.status === 'completed') ? 'var(--success)' : (tx.amount < 0 || tx.type.includes('transfer') ? 'var(--danger)' : 'var(--text-main)') }}>
                                                    {tx.type === 'deposit' ? '+' : (tx.type.includes('transfer') ? '-' : '')}{tx.amount} {tx.currency}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.badge, background: status.bg, color: status.color, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin"></i>}
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'right' }}>
                                                <div style={styles.actions}>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'completed')}
                                                        disabled={tx.status === 'completed' || isProcessing}
                                                        style={{ ...styles.actionBtn, background: '#dcfce7', color: '#166534' }}
                                                        title="Approuver"
                                                    >
                                                        <i className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'pending')}
                                                        disabled={tx.status === 'pending' || isProcessing}
                                                        style={{ ...styles.actionBtn, background: '#fef9c3', color: '#854d0e' }}
                                                        title="En attente"
                                                    >
                                                        <i className="fas fa-clock"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'in_review')}
                                                        disabled={tx.status === 'completed' || tx.status === 'in_review' || isProcessing}
                                                        style={{ ...styles.actionBtn, background: '#e0f2fe', color: '#0369a1' }}
                                                        title="Mise en examen"
                                                    >
                                                        <i className="fas fa-search"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(tx.id, 'rejected')}
                                                        disabled={tx.status === 'rejected' || isProcessing}
                                                        style={{ ...styles.actionBtn, background: '#fee2e2', color: '#991b1b' }}
                                                        title="Rejeter"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" style={styles.emptyCell}>Aucune transaction correspondante</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const styles = {
    center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' },
    loanGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
    header: { display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' },
    backBtn: { background: 'white', border: '1px solid var(--border)', padding: '0.6rem 1rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' },
    userInfo: { flex: 1 },
    title: { margin: 0, fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: '700' },
    subtitle: { margin: '0.25rem 0 0', color: 'var(--text-light)', fontSize: '0.9rem' },
    controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    tabs: { display: 'flex', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', gap: '0.2rem' },
    tab: { padding: '0.5rem 1.2rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#64748b', transition: 'all 0.2s' },
    tabActive: { padding: '0.5rem 1.2rem', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    searchWrapper: { position: 'relative', flex: 1, maxWidth: '350px' },
    searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '0.65rem 1rem 0.65rem 2.8rem', borderRadius: '10px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' },
    tableCard: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid var(--border)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '1.2rem 1.5rem', textAlign: 'left', background: '#f8fafc', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em', borderBottom: '1px solid var(--border)' },
    tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.1s' },
    td: { padding: '1.2rem 1.5rem', fontSize: '0.9rem' },
    walletsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
    dateCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    txId: { color: '#94a3b8', fontFamily: 'monospace' },
    typeInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
    typeIcon: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' },
    typeLabel: { display: 'block', fontWeight: '600', color: 'var(--text-main)' },
    typeSub: { color: '#94a3b8', fontSize: '0.75rem' },
    detailCell: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
    detailSub: { fontSize: '0.8rem', color: '#64748b', fontWeight: '500' },
    ibanText: { fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' },
    badge: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
    actions: { display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' },
    actionBtn: { width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' },
    emptyCell: { padding: '5rem', textAlign: 'center', color: '#64748b', fontSize: '1rem' },
    // Mobile Styles
    mobileGrid: { display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem', width: '100%', maxWidth: '100%', overflowX: 'hidden' },
    txCardMobile: { background: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid var(--border)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' },
    cardHeaderMobile: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' },
    cardBodyMobile: { display: 'flex', flexDirection: 'column' },
    dateInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
    actionBtnMobile: { width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '600' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', color: 'var(--text-light)' },
    cardInfoBox: {
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '8px 12px',
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
    },
    cardRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' },
    cardNumber: { fontFamily: 'monospace', fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem' },
    cardDetailItem: { fontSize: '0.8rem', color: '#64748b' },
    cardHolderName: { fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', marginTop: '2px' }
};

export default ManageTransactions;
