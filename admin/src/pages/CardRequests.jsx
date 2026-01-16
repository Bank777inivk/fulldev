import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const CardRequests = () => {
    const [requests, setRequests] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // pending, processed, with_cards, all

    useEffect(() => {
        // Subscribe to users
        const unsubUsers = adminService.subscribeToUsers((userData) => {
            const usersMap = {};
            userData.forEach(u => {
                if (u.id) usersMap[u.id] = u;
            });
            setUsers(usersMap);
        });

        // Subscribe to card requests
        const unsubRequests = adminService.subscribeToCardRequests((data) => {
            setRequests(data || []);
            setLoading(false);
        });

        // Subscribe to active cards
        const unsubCards = adminService.subscribeToCards((data) => {
            setActiveCards(data || []);
        });

        return () => {
            unsubUsers();
            unsubRequests();
            unsubCards();
        };
    }, []);

    const handleAction = async (requestId, status) => {
        if (status === 'delete') {
            if (!window.confirm("Voulez-vous vraiment supprimer définitivement cette demande ?")) return;
            try {
                await adminService.deleteCardRequest(requestId);
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Erreur lors de la suppression');
            }
            return;
        }

        let reviewNotes = '';
        if (status === 'rejected') {
            reviewNotes = window.prompt('Veuillez saisir le motif du rejet (optionnel) :');
            if (reviewNotes === null) return;
        } else {
            const actionLabel =
                status === 'approved' ? 'marquer comme expédiée' :
                    status === 'delivered' ? 'marquer comme livrée' :
                        status === 'pending' ? 'mettre en attente' : 'réinitialiser';
            if (!window.confirm(`Voulez-vous vraiment ${actionLabel} cette demande ?`)) return;
        }

        try {
            await adminService.updateCardRequestStatus(requestId, status, reviewNotes);
            // Optionally, we could show a temporary confirmation message here
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleCardAction = async (cardId, action, currentStatus) => {
        if (action === 'delete') {
            if (!window.confirm("Voulez-vous vraiment supprimer définitivement cette carte ?")) return;
            try {
                await adminService.deleteActiveCard(cardId);
            } catch (error) {
                console.error('Error deleting card:', error);
                alert('Erreur lors de la suppression');
            }
        } else if (action === 'toggle_status') {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            const actionLabel = newStatus === 'active' ? 'débloquer' : 'bloquer';
            if (!window.confirm(`Voulez-vous vraiment ${actionLabel} cette carte ?`)) return;
            try {
                await adminService.updateActiveCardStatus(cardId, newStatus);
            } catch (error) {
                console.error('Error updating card status:', error);
                alert('Erreur lors de la mise à jour du statut');
            }
        } else if (action === 'deactivate') {
            if (!window.confirm("Voulez-vous vraiment désactiver cette carte ? Elle ne pourra plus être utilisée sauf si vous la réactivez.")) return;
            try {
                await adminService.updateActiveCardStatus(cardId, 'inactive');
            } catch (error) {
                console.error('Error deactivating card:', error);
                alert('Erreur lors de la désactivation');
            }
        }
    };

    const handleEditCardDetails = async (card) => {
        const newLimit = window.prompt("Nouveau plafond :", card.limit);
        if (newLimit === null) return;

        try {
            await adminService.updateActiveCardDetails(card.id, {
                limit: Number(newLimit)
            });
        } catch (error) {
            console.error('Error updating card details:', error);
            alert('Erreur lors de la mise à jour des détails');
        }
    };

    const handleActivateCard = async (request) => {
        if (!window.confirm("Créer officiellement cette carte dans le système ?")) return;

        const cardNumber = window.prompt("Numéro de carte (16 chiffres) :", "4000 0000 0000 0000");
        if (!cardNumber) return;

        try {
            await adminService.createCard({
                userId: request.userId,
                type: 'physical',
                cardType: request.cardType || 'Black Edition',
                cardNumber: cardNumber,
                expiryDate: "12/28",
                cvv: "123",
                limit: 2000,
                currency: 'EUR',
                lastModified: new Date().toISOString(),
                cardHolder: users[request.userId]?.firstName + ' ' + users[request.userId]?.lastName
            });
            await adminService.updateCardRequestStatus(request.id, 'activated');
            alert('Carte activée avec succès !');
        } catch (error) {
            console.error('Error creating card:', error);
            alert('Erreur lors de la création de la carte');
        }
    };

    const getCardColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('black') || t.includes('metal')) return 'linear-gradient(135deg, #0f172a 0%, #000000 100%)';
        if (t.includes('gold')) return 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)';
        if (t.includes('premium')) return 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)';
        return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
    };

    // Prepare groups
    const userIds = Object.keys(users);
    const userGroups = userIds.map(userId => {
        const user = users[userId];
        const userRequests = requests.filter(r => r.userId === userId);
        const userCards = activeCards.filter(c => c.userId === userId);

        return {
            ...user,
            requests: userRequests,
            cards: userCards,
            totalItems: userRequests.length + userCards.length
        };
    }).filter(group => {
        if (filterStatus === 'all') return group.totalItems > 0;
        if (filterStatus === 'pending') return group.requests.some(r => r.status === 'pending' || !r.status);
        if (filterStatus === 'processed') return group.requests.some(r => r.status === 'approved' || r.status === 'shipped' || r.status === 'rejected');
        if (filterStatus === 'with_cards') return group.cards.length > 0;
        return group.totalItems > 0;
    }).sort((a, b) => {
        const aHasPending = a.requests.some(r => r.status === 'pending' || !r.status);
        const bHasPending = b.requests.some(r => r.status === 'pending' || !r.status);
        if (aHasPending && !bHasPending) return -1;
        if (!aHasPending && bHasPending) return 1;
        return 0;
    });

    return (
        <div className="animate-fade-in" style={{ padding: '20px' }}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Cartes</h1>
                    <p style={styles.subtitle}>Consultez les cartes actives et les demandes par client</p>
                </div>

                <div style={styles.tabs}>
                    <button onClick={() => setFilterStatus('pending')} style={{ ...styles.tab, ...(filterStatus === 'pending' ? styles.activeTab : {}) }}>À traiter</button>
                    <button onClick={() => setFilterStatus('processed')} style={{ ...styles.tab, ...(filterStatus === 'processed' ? styles.activeTab : {}) }}>Historique</button>
                    <button onClick={() => setFilterStatus('with_cards')} style={{ ...styles.tab, ...(filterStatus === 'with_cards' ? styles.activeTab : {}) }}>Possesseurs</button>
                    <button onClick={() => setFilterStatus('all')} style={{ ...styles.tab, ...(filterStatus === 'all' ? styles.activeTab : {}) }}>Tous</button>
                </div>
            </div>

            {loading ? (
                <div style={styles.loading}>
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p style={{ marginTop: '1rem' }}>Chargement des données...</p>
                </div>
            ) : userGroups.length > 0 ? (
                <div style={styles.userList}>
                    {userGroups.map(group => (
                        <div key={group.id} style={styles.userBlock}>
                            <div style={styles.userInfoHeader}>
                                <div style={styles.avatar}>{group.firstName?.[0] || '?'}{group.lastName?.[0] || ''}</div>
                                <div style={styles.userDetail}>
                                    <h2 style={styles.userName}>{group.firstName} {group.lastName}</h2>
                                    <span style={styles.userEmail}>{group.email}</span>
                                </div>
                                <div style={styles.userStats}>
                                    <div style={styles.statItem}>
                                        <span style={styles.statVal}>{group.cards.length}</span>
                                        <span style={styles.statLabel}>Cartes</span>
                                    </div>
                                    <div style={styles.statItem}>
                                        <span style={styles.statVal}>{group.requests.filter(r => r.status === 'pending' || !r.status).length}</span>
                                        <span style={styles.statLabel}>Demandes</span>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.itemsGrid}>
                                {group.requests.map(req => {
                                    const status = req.status || 'pending';
                                    const isPending = status === 'pending';
                                    const isShipped = status === 'approved';

                                    return (
                                        <div key={req.id} style={{ ...styles.card, border: isPending ? '2px solid #f97316' : '1px solid #f1f5f9' }}>
                                            <div style={styles.requestTag}>DEMANDE : <strong>{status.toUpperCase()}</strong></div>
                                            <div style={{ ...styles.cardPreview, background: getCardColor(req.cardType), height: '140px' }}>
                                                <div style={styles.cardHeader}>
                                                    <div style={styles.cardBrand}>BanK</div>
                                                    <i className="fas fa-clock" style={{ opacity: 0.7 }}></i>
                                                </div>
                                                <div style={styles.cardFooter}>
                                                    <span style={styles.typeLabel}>{req.cardType || 'Black Edition'}</span>
                                                </div>
                                            </div>
                                            <div style={styles.infoRowSmall}>
                                                <span><i className="fas fa-map-marker-alt"></i> {req.deliveryAddress || 'Adresse client'}</span>
                                            </div>
                                            <div style={styles.actionsSmall}>
                                                {!isShipped && status !== 'delivered' && (
                                                    <button onClick={() => handleAction(req.id, 'approved')} style={styles.approveBtnSmall}>Expédier</button>
                                                )}
                                                {isShipped && (
                                                    <button onClick={() => handleAction(req.id, 'delivered')} style={styles.deliverBtnSmall}>Livrée</button>
                                                )}
                                                {status === 'delivered' && (
                                                    <button onClick={() => handleActivateCard(req)} style={styles.activateRealBtnSmall}>
                                                        <i className="fas fa-credit-card"></i> Activer
                                                    </button>
                                                )}
                                                {isPending && (
                                                    <button onClick={() => handleAction(req.id, 'rejected')} style={styles.rejectBtnSmall}>Refuser</button>
                                                )}
                                                {(status === 'approved' || status === 'delivered' || status === 'rejected') && (
                                                    <button onClick={() => handleAction(req.id, 'pending')} style={styles.resetBtnSmall}>Reset</button>
                                                )}
                                                <button onClick={() => handleAction(req.id, 'delete')} style={styles.deleteBtnSmall}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {group.cards.map(card => (
                                    <div key={card.id} style={styles.card}>
                                        <div style={styles.activeTag}>CARTE ACTIVE : <strong>{(card.status || 'OK').toUpperCase()}</strong></div>
                                        <div style={{ ...styles.cardPreview, background: getCardColor('Black Edition'), height: '140px' }}>
                                            <div style={styles.cardHeader}>
                                                <div style={styles.cardBrand}>BanK</div>
                                                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                                            </div>
                                            <div style={styles.cardFooter}>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{card.cardNumber?.slice(-4) || '••••'}</span>
                                                <span style={styles.typeLabel}>{(card.type || 'Virtual').toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div style={styles.infoRowSmall}>
                                            <span><i className="fas fa-shield-alt"></i> Limite: {card.limit} {card.currency}</span>
                                        </div>
                                        <div style={styles.infoRowSmall}>
                                            <span><i className="fas fa-calendar-check"></i> Exp: {card.expiryDate}</span>
                                        </div>
                                        <div style={styles.actionsSmall}>
                                            <button onClick={() => handleEditCardDetails(card)} style={styles.editBtnSmall}>
                                                <i className="fas fa-edit"></i> Limite
                                            </button>
                                            <button
                                                onClick={() => handleCardAction(card.id, 'toggle_status', card.status)}
                                                style={{
                                                    ...styles.blockBtnSmall,
                                                    color: card.status === 'active' ? '#f97316' : '#10b981',
                                                    borderColor: card.status === 'active' ? '#f97316' : '#10b981'
                                                }}
                                            >
                                                <i className={`fas ${card.status === 'active' ? 'fa-lock' : 'fa-lock-open'}`}></i>
                                                {card.status === 'active' ? ' Bloquer' : ' Activer'}
                                            </button>
                                            {card.status !== 'inactive' && (
                                                <button onClick={() => handleCardAction(card.id, 'deactivate')} style={styles.deactivateBtnSmall}>
                                                    <i className="fas fa-power-off"></i> Off
                                                </button>
                                            )}
                                            <button onClick={() => handleCardAction(card.id, 'delete')} style={styles.deleteBtnSmall}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <i className="fas fa-credit-card fa-3x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                    <h3>Aucun résultat</h3>
                    <p>Aucun client ne correspond à ce filtre.</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' },
    title: { fontSize: '2rem', fontWeight: '800', color: '#003366', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b', fontSize: '1rem' },
    tabs: { display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '14px', gap: '5px' },
    tab: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' },
    activeTab: { background: 'white', color: '#003366', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    userList: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    userBlock: { background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' },
    userInfoHeader: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' },
    avatar: { width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #003366 0%, #004080 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
    userDetail: { flex: 1 },
    userName: { margin: 0, fontSize: '1.2rem', color: '#1e293b' },
    userEmail: { fontSize: '0.9rem', color: '#64748b' },
    userStats: { display: 'flex', gap: '1.5rem' },
    statItem: { textAlign: 'center' },
    statVal: { display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#003366' },
    statLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' },
    itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
    card: { background: '#f8fafc', borderRadius: '20px', padding: '1rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
    requestTag: { fontSize: '0.6rem', color: '#f97316', marginBottom: '8px', letterSpacing: '0.5px' },
    activeTag: { fontSize: '0.6rem', color: '#10b981', marginBottom: '8px', letterSpacing: '0.5px' },
    cardPreview: { borderRadius: '14px', padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', overflow: 'hidden' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    typeLabel: { fontSize: '0.6rem', fontWeight: 'bold', opacity: 0.8 },
    infoRowSmall: { fontSize: '0.75rem', color: '#64748b', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px' },
    actionsSmall: { display: 'flex', gap: '5px', marginTop: 'auto', paddingTop: '10px' },
    approveBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    rejectBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ef4444', background: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    resetBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#e2e8f0', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    deliverBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    activateRealBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    editBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#003366', background: 'transparent', color: '#003366', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    blockBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'currentColor', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    deactivateBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#64748b', background: 'transparent', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    deleteBtnSmall: { width: '35px', padding: '8px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' },
    loading: { textAlign: 'center', padding: '5rem', color: '#64748b' },
    emptyState: { textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', borderWidth: '2px', borderStyle: 'dashed', borderColor: '#e2e8f0', color: '#64748b' }
};

export default CardRequests;
