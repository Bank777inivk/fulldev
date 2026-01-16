import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const WalletManagement = () => {
    const [users, setUsers] = useState({});
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked

    useEffect(() => {
        // Subscribe to users to get names/emails
        const unsubscribeUsers = adminService.subscribeToUsers((userData) => {
            const userMap = {};
            userData.forEach(u => userMap[u.id] = u);
            setUsers(userMap);
        });

        // Subscribe to all wallets
        const unsubscribeWallets = adminService.subscribeToAllWallets((walletData) => {
            setWallets(walletData);
            setLoading(false);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeWallets();
        };
    }, []);

    const handleUpdateBalance = async (walletId, currentBalance) => {
        const newBalance = window.prompt("Nouveau solde (€) :", currentBalance);
        if (newBalance === null || isNaN(newBalance)) return;

        try {
            await adminService.updateWalletBalance(walletId, newBalance);
        } catch (error) {
            console.error('Error updating balance:', error);
            alert('Erreur lors de la mise à jour du solde');
        }
    };

    const handleEditDetails = async (wallet) => {
        const newIban = window.prompt("Nouvel IBAN :", wallet.iban || '');
        const newBic = window.prompt("Nouvel BIC :", wallet.bic || '');

        if (newIban === null && newBic === null) return;

        try {
            await adminService.updateWalletDetails(wallet.id, {
                iban: newIban || wallet.iban,
                bic: newBic || wallet.bic
            });
        } catch (error) {
            console.error('Error updating details:', error);
            alert('Erreur lors de la mise à jour des détails');
        }
    };

    const handleToggleStatus = async (walletId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        if (!window.confirm(`Passer ce compte en statut : ${newStatus.toUpperCase()} ?`)) return;

        try {
            await adminService.updateWalletDetails(walletId, { status: newStatus });
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    // Group wallets by user
    const walletsByUser = wallets.reduce((acc, wallet) => {
        const userId = wallet.userId;
        const user = users[userId] || { firstName: 'Utilisateur', lastName: 'Inconnu', email: wallet.userId };

        // Apply search filter
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (searchTerm && !fullName.includes(searchTerm.toLowerCase()) && !user.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return acc;
        }

        // Apply status filter
        if (filterStatus !== 'all' && wallet.status !== filterStatus) {
            return acc;
        }

        if (!acc[userId]) {
            acc[userId] = {
                user: user,
                wallets: []
            };
        }
        acc[userId].wallets.push(wallet);
        return acc;
    }, {});

    if (loading) return <div style={styles.loading}>Chargement des portefeuilles...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Portefeuilles & RIB</h1>
                    <p style={styles.subtitle}>Supervisez les soldes et les coordonnées bancaires des clients.</p>
                </div>
                <div style={styles.controls}>
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        style={styles.filterSelect}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="blocked">Bloqués</option>
                    </select>
                </div>
            </header>

            <div style={styles.userList}>
                {Object.keys(walletsByUser).length > 0 ? Object.entries(walletsByUser).map(([userId, data]) => (
                    <div key={userId} style={styles.userBlock}>
                        <div style={styles.userInfoHeader}>
                            <div style={styles.avatar}>
                                {data.user.photoURL ? <img src={data.user.photoURL} alt="" style={styles.avatarImg} /> : (data.user.firstName?.[0] || 'U')}
                            </div>
                            <div style={styles.userDetail}>
                                <h3 style={styles.userName}>{data.user.firstName} {data.user.lastName}</h3>
                                <span style={styles.userEmail}>{data.user.email}</span>
                            </div>
                        </div>

                        <div style={styles.walletsGrid}>
                            {data.wallets.map(wallet => (
                                <div key={wallet.id} style={styles.walletCard}>
                                    <div style={styles.walletHeader}>
                                        <span style={styles.walletType}>{wallet.type?.toUpperCase() || 'COMPTE'}</span>
                                        <div style={{ ...styles.statusBadge, backgroundColor: wallet.status === 'active' ? '#dcfce7' : '#fee2e2', color: wallet.status === 'active' ? '#15803d' : '#b91c1c' }}>
                                            {wallet.status === 'active' ? 'ACTIF' : 'BLOQUÉ'}
                                        </div>
                                    </div>

                                    <div style={styles.balanceSection}>
                                        <span style={styles.balanceLabel}>SOLDE ACTUEL</span>
                                        <div style={styles.balanceValue}>
                                            {wallet.balance?.toLocaleString('fr-FR', { style: 'currency', currency: wallet.currency || 'EUR' })}
                                        </div>
                                    </div>

                                    <div style={styles.ribSection}>
                                        <div style={styles.ribRow}>
                                            <span style={styles.ribLabel}>IBAN</span>
                                            <span style={styles.ribValue}>{wallet.iban || 'Non défini'}</span>
                                        </div>
                                        <div style={styles.ribRow}>
                                            <span style={styles.ribLabel}>BIC</span>
                                            <span style={styles.ribValue}>{wallet.bic || 'Non défini'}</span>
                                        </div>
                                    </div>

                                    <div style={styles.actions}>
                                        <button onClick={() => handleUpdateBalance(wallet.id, wallet.balance)} style={styles.actionBtn}>
                                            <i className="fas fa-coins"></i> Solde
                                        </button>
                                        <button onClick={() => handleEditDetails(wallet)} style={styles.actionBtn}>
                                            <i className="fas fa-edit"></i> RIB
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(wallet.id, wallet.status)}
                                            style={{ ...styles.actionBtn, color: wallet.status === 'active' ? '#ef4444' : '#10b981' }}
                                        >
                                            <i className={wallet.status === 'active' ? 'fas fa-lock' : 'fas fa-lock-open'}></i>
                                            {wallet.status === 'active' ? 'Bloquer' : 'Débloquer'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div style={styles.emptyState}>
                        <i className="fas fa-wallet fa-3x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                        <h3>Aucun portefeuille trouvé</h3>
                        <p>Affinez votre recherche ou changez les filtres.</p>
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
    controls: { display: 'flex', gap: '1rem', alignItems: 'center' },
    searchInput: { padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '250px', outline: 'none', fontSize: '0.9rem' },
    filterSelect: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', color: '#64748b', cursor: 'pointer' },
    userList: { display: 'flex', flexDirection: 'column', gap: '2.5rem' },
    userBlock: { background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
    userInfoHeader: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' },
    avatar: { width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #003366 0%, #004080 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem', overflow: 'hidden' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    userDetail: { flex: 1 },
    userName: { margin: 0, fontSize: '1.4rem', color: '#1e293b' },
    userEmail: { fontSize: '1rem', color: '#64748b' },
    walletsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    walletCard: { background: '#f8fafc', borderRadius: '20px', padding: '1.5rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-5px)' } },
    walletHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    walletType: { fontSize: '0.75rem', fontWeight: '800', color: '#64748b', letterSpacing: '1px' },
    statusBadge: { fontSize: '0.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '50px' },
    balanceSection: { marginBottom: '1.5rem' },
    balanceLabel: { fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' },
    balanceValue: { fontSize: '1.8rem', fontWeight: '800', color: '#003366' },
    ribSection: { background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
    ribRow: { display: 'flex', flexDirection: 'column', marginBottom: '10px', ':last-child': { marginBottom: 0 } },
    ribLabel: { fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' },
    ribValue: { fontSize: '0.85rem', color: '#1e293b', wordBreak: 'break-all', fontFamily: 'monospace' },
    actions: { display: 'flex', gap: '10px', marginTop: 'auto' },
    actionBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#003366', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' },
    emptyState: { textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#64748b' }
};

export default WalletManagement;
