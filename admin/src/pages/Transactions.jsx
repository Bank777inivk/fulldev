import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersData, txData] = await Promise.all([
                    adminService.getAllUsers(),
                    adminService.getAllTransactions()
                ]);
                setUsers(usersData);
                setTransactions(txData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        const unsubUsers = adminService.subscribeToUsers(setUsers);
        const unsubTx = adminService.subscribeToTransactions(setTransactions);

        return () => {
            unsubUsers();
            unsubTx();
        };
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Group transactions by User ID
    const userTransactionsMap = transactions.reduce((acc, tx) => {
        if (!tx.userId) return acc;
        if (!acc[tx.userId]) {
            acc[tx.userId] = {
                count: 0,
                lastDate: null,
                totalCredit: 0,
                totalDebit: 0,
                transactions: []
            };
        }

        const userStats = acc[tx.userId];
        userStats.count++;
        userStats.transactions.push(tx);

        const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
        if (!userStats.lastDate || txDate > userStats.lastDate) {
            userStats.lastDate = txDate;
        }

        if (tx.type === 'credit') {
            userStats.totalCredit += Number(tx.amount || 0);
        } else {
            userStats.totalDebit += Number(tx.amount || 0);
        }

        return acc;
    }, {});

    // Create display list combining user info and stats
    const displayList = users.map(user => {
        const stats = userTransactionsMap[user.id] || { count: 0, totalCredit: 0, totalDebit: 0, lastDate: null };
        return {
            ...user,
            ...stats
        };
    }).filter(item => item.count > 0); // Only show users with transactions? Or all users? User request implies managing transactions, so likely those with activity. Let's show those with activity for now as "Transaction Management" usually implies managing existing ones.
    // Actually, "Transactions" page usually shows history. If we grouping by user, we are showing "Users with Transactions". 
    // Let's filter to only those with `count > 0` to keep it relevant to "Transactions".

    // Filter by search
    const filteredList = displayList.filter(item => {
        const name = `${item.firstName} ${item.lastName}`.toLowerCase();
        const email = (item.email || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || email.includes(term) || item.id.toLowerCase().includes(term);
    });

    // Sort by latest activity desc
    filteredList.sort((a, b) => {
        if (!a.lastDate) return 1;
        if (!b.lastDate) return -1;
        return b.lastDate - a.lastDate;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.searchWrapper}>
                    <i className="fas fa-search" style={styles.searchIcon}></i>
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={styles.searchInput}
                    />
                </div>
            </div>

            {/* Transactions User Group Table */}
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '100px' }}>Action</th>
                            <th style={styles.th}>Utilisateur</th>
                            <th style={styles.th}>Dernière Activité</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Transactions</th>
                            <th style={{ ...styles.th, textAlign: 'right' }}>Total Entrant</th>
                            <th style={{ ...styles.th, textAlign: 'right' }}>Total Sortant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={styles.loadingCell}>
                                    <i className="fas fa-spinner fa-spin"></i> Chargement...
                                </td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => navigate(`/transactions/user/${item.id}`)}
                                            style={styles.manageBtn}
                                        >
                                            <i className="fas fa-cog"></i> Gérer
                                        </button>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.userCell}>
                                            <div style={styles.avatar}>
                                                {item.firstName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={styles.userInfo}>
                                                <span style={styles.userName}>{item.firstName} {item.lastName}</span>
                                                <span style={styles.userEmail}>{item.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        {item.lastDate ? (
                                            <div style={styles.dateCell}>
                                                <span style={styles.dateMain}>{item.lastDate.toLocaleDateString('fr-FR')}</span>
                                                <span style={styles.dateSub}>{item.lastDate.toLocaleTimeString('fr-FR')}</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <span style={styles.countBadge}>{item.count}</span>
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'right', color: 'var(--success)' }}>
                                        +€{item.totalCredit.toFixed(2)}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'right', color: 'var(--danger)' }}>
                                        -€{item.totalDebit.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={styles.emptyCell}>
                                    Aucune transaction trouvée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={styles.pagination}>
                    <span style={styles.pageInfo}>
                        Affichage {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredList.length)} sur {filteredList.length} utilisateurs
                    </span>
                    <div style={styles.pageControls}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    ...styles.pageNumber,
                                    background: currentPage === i + 1 ? 'var(--primary)' : 'transparent',
                                    color: currentPage === i + 1 ? 'white' : 'var(--text-main)'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    searchWrapper: {
        position: 'relative',
        flex: 1,
        maxWidth: '400px',
    },
    searchIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-light)',
    },
    searchInput: {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 2.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
        boxShadow: 'var(--shadow-sm)',
    },
    tableCard: {
        background: 'white',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '1rem 1.5rem',
        textAlign: 'left',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-light)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-main)',
    },
    tr: {
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.1s',
        ':hover': {
            background: 'var(--bg-main)',
        }
    },
    td: {
        padding: '1rem 1.5rem',
        fontSize: '0.95rem',
        color: 'var(--text-main)',
        verticalAlign: 'middle',
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--gradient-secondary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '1rem',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontWeight: '600',
        fontSize: '0.95rem',
    },
    userEmail: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    dateCell: {
        display: 'flex',
        flexDirection: 'column',
    },
    dateMain: {
        fontWeight: '500',
        color: 'var(--text-main)',
    },
    dateSub: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    manageBtn: {
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
    },
    countBadge: {
        background: 'var(--bg-main)',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '0.85rem',
        color: 'var(--primary)',
    },
    loadingCell: {
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-light)',
    },
    emptyCell: {
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-light)',
    },
    pagination: {
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pageInfo: {
        fontSize: '0.9rem',
        color: 'var(--text-light)',
    },
    pageControls: {
        display: 'flex',
        gap: '0.5rem',
    },
    pageBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        background: 'white',
        color: 'var(--text-main)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNumber: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
    }
};

export default Transactions;
