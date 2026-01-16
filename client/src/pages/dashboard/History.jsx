import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const History = () => {
    const { currentUser } = useAuth();
    const { transactions, loading } = useData();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return '...';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'deposit': return 'Dépôt';
            case 'transfer_internal': return 'Vir. Interne';
            case 'transfer_external': return 'Vir. Externe';
            default: return 'Opération';
        }
    };

    const getStatusLabel = (status) => {
        if (status === 'pending') return 'En attente';
        if (status === 'in_review') return 'Examen INVIK';
        if (status === 'rejected') return 'Refusé';
        return 'Complété';
    };

    const getStatusStyles = (status) => {
        if (status === 'pending') return { bg: '#fff3e0', color: '#e65100' };
        if (status === 'in_review') return { bg: '#e8eaf6', color: '#283593' }; // Indigo/Blue for review
        if (status === 'rejected') return { bg: '#ffebee', color: '#c62828' };
        return { bg: '#e8f5e9', color: '#2e7d32' };
    };

    // Pagination Logic
    const itemsPerPage = isMobile ? 5 : 10;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const currentTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const PaginationControls = () => {
        if (totalPages <= 1) return null;
        return (
            <div style={isMobile ? styles.mobilePagination : styles.desktopPagination}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div style={styles.pageIndicator}>Page {currentPage} sur {totalPages}</div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    style={currentPage === totalPages ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
    };

    if (loading && transactions.length === 0) return <div style={styles.loading}>Chargement...</div>;

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <div style={{ padding: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>Historique</h1>

                {transactions.length === 0 ? (
                    <div style={styles.mobileEmpty}>Aucune opération.</div>
                ) : (
                    <>
                        <div style={styles.mobileList}>
                            {currentTransactions.map(tx => (
                                <div key={tx.id} style={styles.mobileItem}>
                                    <div style={styles.mobileIcon}>
                                        <i className={tx.type === 'deposit' ? "fas fa-arrow-down" : "fas fa-arrow-up"}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tx.description || getTypeLabel(tx.type)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{formatDate(tx.createdAt)}</div>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: '50px',
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold',
                                                backgroundColor: getStatusStyles(tx.status).bg,
                                                color: getStatusStyles(tx.status).color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '0.6rem' }}></i>}
                                                {getStatusLabel(tx.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: tx.type === 'deposit' ? '#2ecc71' : '#e74c3c' }}>
                                            {tx.type === 'deposit' ? '+' : '-'}{tx.amount} €
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <PaginationControls />
                    </>
                )}
            </div>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Historique des opérations</h1>
                <p style={styles.subtitle}>Consultez et exportez vos transactions.</p>
            </header>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tr}>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Statut</th>
                            <th style={styles.th}>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map(tx => (
                            <tr key={tx.id} style={styles.trBody}>
                                <td style={styles.td}>{formatDate(tx.createdAt)}</td>
                                <td style={styles.td}>{tx.description}</td>
                                <td style={styles.td}>{getTypeLabel(tx.type)}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: getStatusStyles(tx.status).bg,
                                        color: getStatusStyles(tx.status).color,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '0.7rem' }}></i>}
                                        {getStatusLabel(tx.status)}
                                    </span>
                                </td>
                                <td style={{ ...styles.td, fontWeight: 'bold', color: tx.type === 'deposit' ? '#2ecc71' : '#e74c3c' }}>
                                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} €
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Aucune transaction trouvée.</div>}
                <PaginationControls />
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666' },
    tableCard: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '1.2rem', backgroundColor: '#f8fbff', color: '#003366', fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #eee' },
    td: { padding: '1.2rem', fontSize: '0.9rem', borderBottom: '1px solid #f9f9f9' },
    trBody: { transition: 'background 0.2s', ':hover': { backgroundColor: '#fdfdfd' } },
    badge: { padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' },

    // MOBILE
    mobileEmpty: { textAlign: 'center', padding: '3rem', color: '#888' },
    mobileList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    mobileItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee' },
    mobileIcon: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', fontSize: '0.8rem' },

    desktopPagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '1.5rem', borderTop: '1px solid #eee' },
    mobilePagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '1.5rem' },
    pageBtn: { background: '#f0f4f8', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', cursor: 'pointer', transition: 'all 0.2s' },
    pageBtnDisabled: { background: '#f5f5f5', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', cursor: 'not-allowed' },
    pageIndicator: { fontSize: '0.9rem', fontWeight: '600', color: '#555' }
};

export default History;
