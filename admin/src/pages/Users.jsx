import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
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
    filters: {
        display: 'flex',
        gap: '1rem',
    },
    selectWrapper: {
        position: 'relative',
    },
    filterIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-light)',
        pointerEvents: 'none',
    },
    select: {
        padding: '0.75rem 1rem 0.75rem 2.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        fontSize: '0.95rem',
        outline: 'none',
        appearance: 'none',
        cursor: 'pointer',
        background: 'white',
        minWidth: '180px',
    },
    exportBtn: {
        padding: '0.75rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'white',
        color: 'var(--text-main)',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s',
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

    },
    td: {
        padding: '1rem 1.5rem',
        fontSize: '0.95rem',
        color: 'var(--text-main)',
        textAlign: 'left',
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'var(--gradient-secondary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '0.9rem',
    },
    userName: {
        fontWeight: '600',
    },
    statusBadge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block',
    },
    actionBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        background: 'var(--bg-main)',
        color: 'var(--primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
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
    },
    // Mobile Styles
    mobileGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '2rem',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
    },
    userCardMobile: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
    },
    cardHeaderMobile: {
        display: 'flex',
        justifyContent: 'space-between',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        maxWidth: '30ch', // Force wrapping for name (adjusted to 30)
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
    },
    userEmailMobile: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
        marginTop: '2px',
        maxWidth: '30ch', // Force wrapping (adjusted to 30)
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
    },
    cardBodyMobile: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        borderTop: '1px solid #f1f5f9',
        borderBottom: '1px solid #f1f5f9',
    },
    infoGroupMobile: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    infoLabelMobile: {
        fontSize: '0.7rem',
        color: 'var(--text-light)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    infoValueMobile: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    cardFooterMobile: {
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'center',
    },
    dateMobile: {
        fontSize: '0.75rem',
        color: 'var(--text-light)',
    },
    paginationMobile: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        marginTop: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.02)',
    }
};

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await adminService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();

        const unsubscribe = adminService.subscribeToUsers((data) => {
            setUsers(data);
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleUserClick = (user) => {
        navigate(`/users/${user.id}`);
    };



    // Filtering
    const filteredUsers = users.filter(user => {
        // Handle missing fields gracefully
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const email = user.email || '';

        const matchesSearch =
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || user.accountStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const MobileView = () => (
        <div style={{ padding: '0.75rem' }} className="animate-fade-in">
            <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#003366', marginBottom: '0.5rem' }}>Utilisateurs</h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Gérez les comptes et accès clients</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ ...styles.searchWrapper, maxWidth: '100%' }}>
                        <i className="fas fa-search" style={styles.searchIcon}></i>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={handleSearch}
                            style={styles.searchInput}
                        />
                    </div>
                    <div style={{ ...styles.selectWrapper, width: '100%' }}>
                        <i className="fas fa-filter" style={styles.filterIcon}></i>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ ...styles.select, width: '100%', minWidth: '100%' }}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actifs</option>
                            <option value="blocked">Bloqués</option>
                        </select>
                    </div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#003366' }}></i>
                </div>
            ) : currentUsers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentUsers.map((user) => (
                        <div
                            key={user.id}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '1rem',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleUserClick(user)}
                        >
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ ...styles.avatar, width: '45px', height: '45px', fontSize: '1.2rem', flexShrink: 0 }}>
                                    {user.firstName?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div style={{
                                            ...styles.statusBadge,
                                            background: user.accountStatus === 'active' ? '#dcfce7' : '#fee2e2',
                                            color: user.accountStatus === 'active' ? '#166534' : '#991b1b',
                                            fontSize: '0.65rem',
                                            padding: '2px 8px',
                                            flexShrink: 0
                                        }}>
                                            {user.accountStatus === 'active' ? 'ACTIF' : 'BLOQUÉ'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.8rem 1.2rem', borderRadius: '16px' }}>
                                <div style={styles.infoGroupMobile}>
                                    <span style={{ ...styles.infoLabelMobile, fontSize: '0.6rem' }}>SOLDE</span>
                                    <span style={{ ...styles.infoValueMobile, fontSize: '1.2rem', color: '#003366' }}>€{user.balance?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div style={{ ...styles.actionBtn, background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                                    <i className="fas fa-chevron-right"></i>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    Inscrit le {user.createdAt?.toDate().toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <i className="fas fa-users fa-3x" style={{ opacity: 0.1, marginBottom: '1rem' }}></i>
                    <h3>Aucun utilisateur</h3>
                </div>
            )}

            {filteredUsers.length > usersPerPage && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(prev - 1, 1)); }}
                        disabled={currentPage === 1}
                        style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.3 : 1, width: '40px', height: '40px' }}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span style={{ fontWeight: '700', color: '#003366', fontSize: '1rem' }}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(prev + 1, totalPages)); }}
                        disabled={currentPage === totalPages}
                        style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.3 : 1, width: '40px', height: '40px' }}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );

    const DesktopView = () => (
        <>
            {/* Users Table */}
            <div style={styles.tableCard} className="table-container">
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '25%' }}>Utilisateur</th>
                            <th style={{ ...styles.th, width: '25%' }}>Email</th>
                            <th style={{ ...styles.th, width: '100px', textAlign: 'center' }}>Statut</th>
                            <th style={{ ...styles.th, width: '120px', textAlign: 'right' }}>Solde</th>
                            <th style={{ ...styles.th, width: '120px' }}>Inscription</th>
                            <th style={{ ...styles.th, width: '80px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={styles.loadingCell}>
                                    <i className="fas fa-spinner fa-spin"></i> Chargement...
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.userCell}>
                                            <div style={styles.avatar}>
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={styles.userName}>{user.firstName} {user.lastName}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: user.accountStatus === 'active' ? '#dcfce7' : '#fee2e2',
                                            color: user.accountStatus === 'active' ? '#166534' : '#991b1b'
                                        }}>
                                            {user.accountStatus === 'active' ? 'Actif' : 'Bloqué'}
                                        </span>
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>€{user.balance?.toFixed(2) || '0.00'}</td>
                                    <td style={styles.td}>
                                        {user.createdAt?.toDate().toLocaleDateString('fr-FR')}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleUserClick(user)}
                                            style={styles.actionBtn}
                                            title="Voir détails"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr anonym>
                                <td colSpan="6" style={styles.emptyCell}>
                                    Aucun utilisateur trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={styles.pagination}>
                    <span style={styles.pageInfo}>
                        Affichage {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
                    </span>
                    <div style={styles.pageControls}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        {totalPages <= 5 ? (
                            Array.from({ length: totalPages }, (_, i) => (
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
                            ))
                        ) : (
                            <span style={styles.pageInfo}>Page {currentPage} sur {totalPages}</span>
                        )}
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
        </>
    );

    return (
        <div className="animate-fade-in">
            {/* Header Actions */}
            <div style={styles.header}>
                <div style={styles.searchWrapper}>
                    <i className="fas fa-search" style={styles.searchIcon}></i>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.filters}>
                    <div style={styles.selectWrapper}>
                        <i className="fas fa-filter" style={styles.filterIcon}></i>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={styles.select}
                        >
                            <option value="all">Tous</option>
                            <option value="active">Actifs</option>
                            <option value="blocked">Bloqués</option>
                        </select>
                    </div>
                </div>
            </div>

            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
};



export default Users;
