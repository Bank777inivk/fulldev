import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AccountRequests = () => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState({});
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Subscribe to users
        const unsubscribeUsers = adminService.subscribeToUsers((userData) => {
            const userMap = {};
            userData.forEach(u => userMap[u.id] = u);
            setUsers(userMap);
        });

        // Subscribe to requests
        const unsubscribeRequests = adminService.subscribeToAccountRequests((requestData) => {
            setRequests(requestData);
            setLoading(false);
        });

        // Subscribe to wallets to check for duplicates
        const unsubscribeWallets = adminService.subscribeToAllWallets((walletData) => {
            setWallets(walletData);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeRequests();
            unsubscribeWallets();
        };
    }, []);

    const handleApprove = async (req) => {
        if (!window.confirm(`Confirmer l'ouverture du compte ${req.type.toUpperCase()} pour ce client ?`)) return;
        try {
            await adminService.approveAccountRequest(req.id, req.userId, req.type, 'EUR');
            alert("Compte ouvert avec succès !");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ouverture du compte.");
        }
    };

    const handleReject = async (req) => {
        const reason = window.prompt("Motif du refus :", "Dossier incomplet");
        if (reason === null) return;
        try {
            await adminService.rejectAccountRequest(req.id, reason);
            alert("Demande refusée.");
        } catch (error) {
            alert("Erreur lors du refus.");
        }
    };

    const handleDelete = async (reqId) => {
        if (!window.confirm("Supprimer définitivement cette demande de l'historique ?")) return;
        try {
            await adminService.deleteAccountRequest(reqId);
        } catch (error) {
            alert("Erreur lors de la suppression.");
        }
    };

    const checkIfUserHasWalletType = (userId, type) => {
        return wallets.some(w => w.userId === userId && w.type === type);
    };

    const countPendingByType = (userId, type) => {
        return requests.filter(r => r.userId === userId && r.type === type && r.status === 'pending').length;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fff7ed', color: '#9a3412', label: 'En attente', icon: 'fa-clock' };
            case 'approved': return { bg: '#f0fdf4', color: '#166534', label: 'Approuvée', icon: 'fa-check-circle' };
            case 'rejected': return { bg: '#fef2f2', color: '#991b1b', label: 'Refusée', icon: 'fa-times-circle' };
            default: return { bg: '#f1f5f9', color: '#475569', label: status, icon: 'fa-question-circle' };
        }
    };

    const filteredRequests = requests.filter(req => {
        const user = users[req.userId] || {};
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const matchesSearch = !searchTerm || fullName.includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const styles = {
        container: { padding: isMobile ? '10px' : '2rem', background: '#f8fafc', minHeight: '100vh' },
        header: {
            background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        },
        titleSection: { flex: 1, minWidth: '200px' },
        title: { fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.5px' },
        subtitle: { color: '#64748b', fontSize: '0.9rem', marginTop: '4px' },
        filters: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
        searchWrapper: { position: 'relative' },
        searchInput: {
            padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0',
            width: isMobile ? '100%' : '260px', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s'
        },
        searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
        select: { padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' },

        // Desktop Table
        tableContainer: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #edf2f7' },
        table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
        th: { padding: '1.2rem', background: '#f1f5f9', color: '#475569', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
        td: { padding: '1.2rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem', color: '#334155' },

        // Mobile Cards
        card: { background: 'white', borderRadius: '20px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
        userBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
        avatar: { width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #003366, #00509e)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },

        // Actions
        btnGroup: { display: 'flex', gap: '8px' },
        actionBtn: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
        btnCheck: { background: '#dcfce7', color: '#166534' },
        btnTimes: { background: '#fee2e2', color: '#991b1b' },
        btnTrash: { background: '#f1f5f9', color: '#64748b' },

        // Warning
        warning: { fontSize: '0.75rem', background: '#fffbeb', color: '#92400e', padding: '4px 8px', borderRadius: '6px', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' },
        statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600' }
    };

    const renderEmpty = () => (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', color: '#e2e8f0', marginBottom: '1rem' }}><i className="fas fa-inbox"></i></div>
            <h3 style={{ color: '#64748b', margin: 0 }}>Aucune demande trouvée</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Les demandes apparaîtront ici dès qu'un client remplira le formulaire.</p>
        </div>
    );

    return (
        <div style={styles.container} className="animate-fade-in">
            <header style={styles.header}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>Demandes Comptes</h1>
                    <p style={styles.subtitle}>Supervision des ouvertures de comptes rubriques</p>
                </div>
                <div style={styles.filters}>
                    <div style={styles.searchWrapper}>
                        <i className="fas fa-search" style={styles.searchIcon}></i>
                        <input
                            style={styles.searchInput}
                            placeholder="Client ou email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select style={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="pending">En attente uniquement</option>
                        <option value="all">Tout l'historique</option>
                        <option value="approved">Approuvées</option>
                        <option value="rejected">Refusées</option>
                    </select>
                </div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <div className="spinner"></div>
                </div>
            ) : filteredRequests.length === 0 ? renderEmpty() : (
                isMobile ? (
                    // MOBILE VIEW
                    <div>
                        {filteredRequests.map(req => {
                            const user = users[req.userId] || { firstName: 'Inconnu', email: req.userId };
                            const status = getStatusStyle(req.status);
                            const hasAlready = checkIfUserHasWalletType(req.userId, req.type);
                            const otherPending = countPendingByType(req.userId, req.type) - 1;

                            return (
                                <div key={req.id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.userBadge}>
                                            <div style={styles.avatar}>{user.firstName?.charAt(0)}</div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: '700', color: '#1e293b', wordBreak: 'break-word' }}>{user.firstName} {user.lastName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b', wordBreak: 'break-all' }}>{user.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                                            <i className={`fas ${status.icon}`}></i> {status.label}
                                        </div>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>TYPE DE COMPTE</div>
                                        <div style={{ fontWeight: '700', color: '#003366', textTransform: 'capitalize' }}>
                                            {req.type === 'savings' ? '🏦 Épargne' : (req.type === 'credit' ? '💳 Crédit' : '💱 Devise')}
                                        </div>
                                        {hasAlready && <div style={styles.warning}><i className="fas fa-exclamation-triangle"></i> Déjà possédé</div>}
                                        {otherPending > 0 && <div style={styles.warning}><i className="fas fa-layer-group"></i> {otherPending} autre(s) en attente</div>}
                                    </div>

                                    {req.details && <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#444', marginBottom: '1.2rem', padding: '0 0.5rem' }}>"{req.details}"</div>}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{req.createdAt?.toDate?.().toLocaleDateString('fr-FR')}</span>
                                        <div style={styles.btnGroup}>
                                            {req.status === 'pending' && (
                                                <>
                                                    <button style={{ ...styles.actionBtn, ...styles.btnCheck }} onClick={() => handleApprove(req)}><i className="fas fa-check"></i></button>
                                                    <button style={{ ...styles.actionBtn, ...styles.btnTimes }} onClick={() => handleReject(req)}><i className="fas fa-times"></i></button>
                                                </>
                                            )}
                                            <button style={{ ...styles.actionBtn, ...styles.btnTrash }} onClick={() => handleDelete(req.id)}><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // DESKTOP VIEW
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Client</th>
                                    <th style={styles.th}>Type Demandé</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Remarques</th>
                                    <th style={styles.th}>Statut</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map(req => {
                                    const user = users[req.userId] || { firstName: 'Inconnu', email: req.userId };
                                    const status = getStatusStyle(req.status);
                                    const hasAlready = checkIfUserHasWalletType(req.userId, req.type);
                                    const otherPending = countPendingByType(req.userId, req.type) - 1;

                                    return (
                                        <tr key={req.id}>
                                            <td style={styles.td}>
                                                <div style={styles.userBadge}>
                                                    <div style={styles.avatar}>{user.firstName?.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: '700' }}>{user.firstName} {user.lastName}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '600', color: '#003366', textTransform: 'capitalize' }}>
                                                    {req.type === 'savings' ? 'Épargne' : (req.type === 'credit' ? 'Crédit' : req.type)}
                                                </div>
                                                {hasAlready && <div style={styles.warning}><i className="fas fa-exclamation-triangle"></i> Déjà possédé</div>}
                                                {otherPending > 0 && <div style={styles.warning}><i className="fas fa-layer-group"></i> {otherPending} doublon(s)</div>}
                                            </td>
                                            <td style={styles.td}>{req.createdAt?.toDate?.().toLocaleDateString('fr-FR')}</td>
                                            <td style={{ ...styles.td, maxWidth: '250px', fontSize: '0.85rem', fontStyle: 'italic', color: '#64748b' }}>
                                                {req.details ? `"${req.details}"` : '-'}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                                                    <i className={`fas ${status.icon}`}></i> {status.label}
                                                </div>
                                                {req.reviewNotes && <div style={{ fontSize: '0.7rem', color: '#991b1b', marginTop: '4px' }}>{req.reviewNotes}</div>}
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.btnGroup}>
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <button
                                                                style={{ ...styles.actionBtn, ...styles.btnCheck }}
                                                                onClick={() => handleApprove(req)}
                                                                title="Approuver"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                style={{ ...styles.actionBtn, ...styles.btnTimes }}
                                                                onClick={() => handleReject(req)}
                                                                title="Rejeter"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        style={{ ...styles.actionBtn, ...styles.btnTrash }}
                                                        onClick={() => handleDelete(req.id)}
                                                        title="Supprimer"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default AccountRequests;
