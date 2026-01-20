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

    // Helper to get formatted date parts
    const getDateParts = (timestamp) => {
        if (!timestamp) return { day: '..', month: '...' };
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return {
            day: date.toLocaleDateString('fr-FR', { day: '2-digit' }),
            month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '')
        };
    };

    const getTitle = (tx) => {
        if (tx.type === 'deposit') return `Dépôt sur compte`;
        if (tx.type === 'transfer_internal') return `Virement vers ${tx.toAccountName || 'Compte interne'}`;
        if (tx.type === 'transfer_instant') return `Virement instantané -> ${tx.beneficiaryName || 'Bénéficiaire'}`;
        if (tx.type === 'receive_instant') return `Virement instantané reçu`;
        if (tx.type === 'transfer_external') return `Virement SEPA -> ${tx.beneficiaryName || 'Bénéficiaire'}`;
        return 'Opération bancaire';
    };

    const getDescription = (tx) => {
        if (tx.description) return tx.description;
        if (tx.type === 'receive_instant') return `De: ${tx.senderName || 'Inconnu'}`;
        return ''; // Default empty if no specific description
    };

    // Calculate generic fees (mock logic as per requirement, usually 0 for internal/instant)
    const getFees = (tx) => {
        // Example logic: 0.00 € for everything for now
        return '0,00 €';
    };

    // Pagination Logic
    const itemsPerPage = isMobile ? 8 : 10;
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
            <div style={{ padding: '1rem', paddingBottom: '80px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#003366', marginBottom: '1.5rem' }}>Historique</h1>

                {transactions.length === 0 ? (
                    <div style={styles.mobileEmpty}>Aucune opération.</div>
                ) : (
                    <>
                        <div style={styles.mobileList}>
                            {currentTransactions.map(tx => {
                                const { day, month } = getDateParts(tx.createdAt);
                                return (
                                    <div key={tx.id} style={styles.mobileItem}>
                                        {/* Date Stack */}
                                        <div style={styles.dateStackMobile}>
                                            <div style={styles.dateDay}>{day}</div>
                                            <div style={styles.dateMonth}>{month}</div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, paddingLeft: '12px' }}>
                                            <div style={{ fontWeight: '600', color: '#333', fontSize: '0.9rem', marginBottom: '2px' }}>
                                                {getTitle(tx)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>
                                                {getDescription(tx)}
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {tx.beneficiaryIban && (
                                                    <span style={styles.miniBadge}>IBAN: {tx.beneficiaryIban.substring(0, 8)}...</span>
                                                )}
                                                <span style={styles.miniBadge}>Réf: {tx.id.substring(0, 5)}...</span>
                                            </div>
                                        </div>

                                        {/* Wrappers right */}
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                            <div style={{
                                                fontWeight: '700',
                                                fontSize: '0.95rem',
                                                color: tx.type === 'deposit' || tx.type === 'receive_instant' ? '#00b894' : '#2d3436'
                                            }}>
                                                {tx.type === 'deposit' || tx.type === 'receive_instant' ? '+' : '-'}{parseFloat(tx.amount).toFixed(2)} €
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#b2bec3' }}>
                                                Frais: {getFees(tx)}
                                            </div>
                                            <span style={styles.categoryBadgeMobile}>A catégoriser</span>
                                        </div>
                                    </div>
                                );
                            })}
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
                <p style={styles.subtitle}>Consultez et exportez vos transactions en détail.</p>
            </header>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>DATE</th>
                            <th style={styles.th}>TYPE</th>
                            <th style={styles.th}>CATÉGORIE</th>
                            <th style={styles.th}>MONTANT</th>
                            <th style={styles.th}>FRAIS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map(tx => {
                            const { day, month } = getDateParts(tx.createdAt);
                            return (
                                <tr key={tx.id} style={styles.trBody}>
                                    {/* DATE */}
                                    <td style={{ ...styles.td, width: '80px' }}>
                                        <div style={styles.dateStack}>
                                            <div style={styles.dateDay}>{day}</div>
                                            <div style={styles.dateMonth}>{month}</div>
                                        </div>
                                    </td>

                                    {/* TYPE (Rich) */}
                                    <td style={styles.td}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ fontWeight: '600', color: '#2d3436', fontSize: '0.95rem' }}>
                                                {getTitle(tx)}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#636e72' }}>
                                                {getDescription(tx)}
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                                {tx.beneficiaryIban && (
                                                    <span style={styles.metaText}>IBAN : {tx.beneficiaryIban}</span>
                                                )}
                                                <span style={styles.metaText}>Réf : {tx.id.substring(0, 5)}...</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CATEGORIE */}
                                    <td style={styles.td}>
                                        <span style={styles.categoryBadge}>A catégoriser</span>
                                    </td>

                                    {/* MONTANT */}
                                    <td style={styles.td}>
                                        <span style={{
                                            fontWeight: '700',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            backgroundColor: tx.type === 'deposit' || tx.type === 'receive_instant'
                                                ? 'rgba(0, 184, 148, 0.1)' // Green bg
                                                : 'rgba(214, 48, 49, 0.1)', // Red bg
                                            color: tx.type === 'deposit' || tx.type === 'receive_instant'
                                                ? '#00b894' // Green text
                                                : '#d63031' // Red text
                                        }}>
                                            {tx.type === 'deposit' || tx.type === 'receive_instant' ? '+' : '-'}
                                            {parseFloat(tx.amount).toFixed(2)} €
                                        </span>
                                    </td>

                                    {/* FRAIS */}
                                    <td style={{ ...styles.td, color: '#636e72', fontSize: '0.9rem' }}>
                                        {getFees(tx)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {transactions.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Aucune transaction trouvée.</div>}
                <PaginationControls />
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' },
    loading: { textAlign: 'center', padding: '4rem', color: '#003366' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', color: '#003366', fontWeight: '800', letterSpacing: '-0.5px' },
    subtitle: { color: '#666', marginTop: '5px' },

    tableCard: { backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #f0f0f0' },
    table: { width: '100%', borderCollapse: 'collapse' },

    th: {
        textAlign: 'left',
        padding: '1.5rem',
        backgroundColor: 'white',
        color: '#b2bec3',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '1px solid #f0f0f0'
    },
    td: {
        padding: '1.5rem',
        borderBottom: '1px solid #f9f9f9',
        verticalAlign: 'top'
    },
    trBody: { transition: 'background 0.2s', ':hover': { backgroundColor: '#fcfcfc' } },

    // Date Stack Styles
    dateStack: { textAlign: 'center', width: '50px' },
    dateStackMobile: {
        textAlign: 'center',
        minWidth: '45px',
        paddingRight: '12px',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    dateDay: { fontSize: '1.4rem', fontWeight: '700', color: '#2d3436', lineHeight: '1' },
    dateMonth: { fontSize: '0.7rem', fontWeight: '700', color: '#b2bec3', textTransform: 'uppercase', marginTop: '2px' },

    // Meta Text
    metaText: { fontSize: '0.75rem', color: '#b2bec3' },

    // Badges
    categoryBadge: {
        backgroundColor: '#dfe6e9',
        color: '#636e72',
        padding: '6px 12px',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    categoryBadgeMobile: {
        backgroundColor: '#f1f2f6',
        color: '#a4b0be',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        marginTop: '6px'
    },
    miniBadge: {
        fontSize: '0.65rem',
        color: '#b2bec3',
        backgroundColor: '#f7f7f7',
        padding: '2px 6px',
        borderRadius: '4px'
    },

    // MOBILE specific
    mobileEmpty: { textAlign: 'center', padding: '3rem', color: '#888' },
    mobileList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mobileItem: {
        display: 'flex',
        alignItems: 'stretch',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        border: '1px solid #f5f5f5'
    },

    desktopPagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '2rem', borderTop: '1px solid #f0f0f0' },
    mobilePagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '1.5rem' },
    pageBtn: { background: '#f0f4f8', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', cursor: 'pointer', transition: 'all 0.2s' },
    pageBtnDisabled: { background: '#f5f5f5', border: 'none', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dfe6e9', cursor: 'not-allowed' },
    pageIndicator: { fontSize: '0.9rem', fontWeight: '600', color: '#636e72' }
};

export default History;
