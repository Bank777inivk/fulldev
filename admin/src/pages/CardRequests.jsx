import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const CardRequests = () => {
    const [requests, setRequests] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const unsubUsers = adminService.subscribeToUsers((userData) => {
            const usersMap = {};
            userData.forEach(u => { if (u.id) usersMap[u.id] = u; });
            setUsers(usersMap);
        });
        const unsubRequests = adminService.subscribeToCardRequests((data) => {
            setRequests(data || []);
            setLoading(false);
        });
        const unsubCards = adminService.subscribeToCards((data) => {
            setActiveCards(data || []);
        });
        return () => { unsubUsers(); unsubRequests(); unsubCards(); };
    }, []);

    const handleAction = async (requestId, status) => {
        if (status === 'delete') {
            if (!window.confirm("Supprimer définitivement cette demande ?")) return;
            try { await adminService.deleteCardRequest(requestId); } catch (e) { alert('Erreur'); }
            return;
        }
        let reviewNotes = '';
        if (status === 'rejected') {
            reviewNotes = window.prompt('Motif du rejet (optionnel) :');
            if (reviewNotes === null) return;
        } else {
            if (!window.confirm(`Confirmer l'action ?`)) return;
        }
        try { await adminService.updateCardRequestStatus(requestId, status, reviewNotes); } catch (e) { alert('Erreur'); }
    };

    const handleCardAction = async (cardId, action, currentStatus) => {
        if (action === 'delete') {
            if (!window.confirm("Supprimer cette carte ?")) return;
            try { await adminService.deleteActiveCard(cardId); } catch (e) { alert('Erreur'); }
        } else if (action === 'toggle_status') {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            if (!window.confirm(`Voulez-vous ${newStatus === 'active' ? 'débloquer' : 'bloquer'} ?`)) return;
            try { await adminService.updateActiveCardStatus(cardId, newStatus); } catch (e) { alert('Erreur'); }
        } else if (action === 'deactivate') {
            if (!window.confirm("Désactiver cette carte ?")) return;
            try { await adminService.updateActiveCardStatus(cardId, 'inactive'); } catch (e) { alert('Erreur'); }
        }
    };

    const handleEditCardDetails = async (card) => {
        const newNumber = window.prompt("Numéro de carte (16 chiffres) :", card.cardNumber);
        if (newNumber === null) return;
        const newExpiry = window.prompt("Date d'expiration (MM/AA) :", card.expiryDate);
        if (newExpiry === null) return;
        const newCvv = window.prompt("CVV :", card.cvv);
        if (newCvv === null) return;
        const newLimit = window.prompt("Nouveau plafond :", card.limit);
        if (newLimit === null) return;

        try {
            await adminService.updateActiveCardDetails(card.id, {
                cardNumber: newNumber,
                expiryDate: newExpiry,
                cvv: newCvv,
                limit: Number(newLimit)
            });
            alert('Carte mise à jour');
        } catch (e) { alert('Erreur'); }
    };

    const handleActivateCard = async (request) => {
        if (!window.confirm("Créer officiellement cette carte ?")) return;
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
        } catch (e) { alert('Erreur'); }
    };

    const getCardColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('black') || t.includes('metal')) return 'linear-gradient(135deg, #0f172a 0%, #000000 100%)';
        if (t.includes('gold')) return 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)';
        if (t.includes('premium')) return 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)';
        return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)';
    };

    const userIds = Object.keys(users);
    const userGroups = userIds.map(userId => {
        const user = users[userId];
        const userRequests = requests.filter(r => r.userId === userId);
        const userCards = activeCards.filter(c => c.userId === userId);
        return { ...user, requests: userRequests, cards: userCards, totalItems: userRequests.length + userCards.length };
    }).filter(group => {
        if (filterStatus === 'all') return group.totalItems > 0;
        if (filterStatus === 'pending') return group.requests.some(r => r.status === 'pending' || !r.status);
        if (filterStatus === 'processed') return group.requests.some(r => r.status === 'approved' || r.status === 'shipped' || r.status === 'rejected');
        if (filterStatus === 'with_cards') return group.cards.length > 0;
        return group.totalItems > 0;
    }).sort((a, b) => {
        const aHasPending = a.requests.some(r => r.status === 'pending' || !r.status);
        const bHasPending = b.requests.some(r => r.status === 'pending' || !r.status);
        return aHasPending && !bHasPending ? -1 : (!aHasPending && bHasPending ? 1 : 0);
    });

    // --- MOBILE VIEW ---
    const MobileView = () => (
        <div style={{ padding: '0.75rem' }} className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#003366', marginBottom: '0.5rem' }}>Gestion des Cartes</h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Consultez les cartes et demandes</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', background: '#f1f5f9', padding: '8px', borderRadius: '16px', marginTop: '1rem' }}>
                    <button onClick={() => setFilterStatus('pending')} style={{ ...styles.tab, ...(filterStatus === 'pending' ? styles.activeTab : {}), flex: 1, padding: '8px 4px' }}>À traiter</button>
                    <button onClick={() => setFilterStatus('processed')} style={{ ...styles.tab, ...(filterStatus === 'processed' ? styles.activeTab : {}), flex: 1, padding: '8px 4px' }}>Historique</button>
                    <button onClick={() => setFilterStatus('with_cards')} style={{ ...styles.tab, ...(filterStatus === 'with_cards' ? styles.activeTab : {}), flex: 1, padding: '8px 4px' }}>Clients</button>
                    <button onClick={() => setFilterStatus('all')} style={{ ...styles.tab, ...(filterStatus === 'all' ? styles.activeTab : {}), flex: 1, padding: '8px 4px' }}>Tous</button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {userGroups.map(group => (
                    <div key={group.id} style={{ background: 'white', borderRadius: '20px', padding: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid #f8fafc' }}>
                            <div style={{ ...styles.avatar, width: '40px', height: '40px', fontSize: '1rem' }}>{group.firstName?.[0]}{group.lastName?.[0]}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: '700', color: '#1e293b' }}>{group.firstName} {group.lastName}</h2>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, wordBreak: 'break-all' }}>{group.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Requests */}
                            {group.requests.map(req => {
                                const status = req.status || 'pending';
                                return (
                                    <div key={req.id} style={{ ...styles.card, padding: '0.8rem', border: status === 'pending' ? '2px solid #f97316' : '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 'bold' }}>DEMANDE : {status.toUpperCase()}</span>
                                            <button onClick={() => handleAction(req.id, 'delete')} style={styles.deleteBtnSmall}><i className="fas fa-trash"></i></button>
                                        </div>
                                        <div style={{ ...styles.cardPreview, height: '90px', padding: '0.8rem', background: getCardColor(req.cardType) }}>
                                            <div style={styles.cardHeader}><div style={styles.cardBrand}>BanK</div><i className="fas fa-clock"></i></div>
                                            <div style={styles.cardFooter}><span style={styles.typeLabel}>{req.cardType || 'Black Edition'}</span></div>
                                        </div>
                                        <div style={{ ...styles.infoRowSmall, margin: '8px 0' }}>
                                            <i className="fas fa-map-marker-alt"></i> {req.deliveryAddress || 'Adresse client'}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '5px' }}>
                                            {status === 'pending' && <button onClick={() => handleAction(req.id, 'approved')} style={{ ...styles.approveBtnSmall, padding: '10px' }}>EXPÉDIER</button>}
                                            {status === 'approved' && <button onClick={() => handleAction(req.id, 'delivered')} style={{ ...styles.deliverBtnSmall, padding: '10px' }}>MARQUER COMME LIVRÉE</button>}
                                            {status === 'delivered' && <button onClick={() => handleActivateCard(req)} style={{ ...styles.activateRealBtnSmall, padding: '10px' }}>ACTIVER CETTE CARTE</button>}
                                            {status === 'pending' && <button onClick={() => handleAction(req.id, 'rejected')} style={{ ...styles.rejectBtnSmall, padding: '10px', color: '#ef4444' }}>REFUSER</button>}
                                            {(status === 'approved' || status === 'delivered' || status === 'rejected') && <button onClick={() => handleAction(req.id, 'pending')} style={styles.resetBtnSmall}>RÉINITIALISER STATUT</button>}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Active Cards */}
                            {group.cards.map(card => (
                                <div key={card.id} style={{ ...styles.card, padding: '0.8rem', border: '1px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 'bold' }}>CARTE ACTIVE : {(card.status || 'OK').toUpperCase()}</span>
                                        <button onClick={() => handleCardAction(card.id, 'delete')} style={styles.deleteBtnSmall}><i className="fas fa-trash"></i></button>
                                    </div>
                                    <div style={{ ...styles.cardPreview, height: '90px', padding: '0.8rem', background: getCardColor('Black Edition') }}>
                                        <div style={styles.cardHeader}><div style={styles.cardBrand}>BanK</div><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i></div>
                                        <div style={styles.cardFooter}>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.9, letterSpacing: '1px' }}>{card.cardNumber}</span>
                                            <span style={styles.typeLabel}>{(card.type || 'Virtual').toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={styles.infoRowSmall}><i className="fas fa-shield-alt"></i> Limite: {card.limit} {card.currency}</div>
                                        <div style={styles.infoRowSmall}><i className="fas fa-calendar-check"></i> Exp: {card.expiryDate} | CVV: {card.cvv}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '10px' }}>
                                        <button onClick={() => handleEditCardDetails(card)} style={{ ...styles.editBtnSmall, padding: '10px' }}>MODIFIER LA CARTE</button>
                                        <button onClick={() => handleCardAction(card.id, 'toggle_status', card.status)} style={{ ...styles.blockBtnSmall, padding: '10px', color: card.status === 'active' ? '#f97316' : '#10b981', borderColor: card.status === 'active' ? '#f97316' : '#10b981' }}>
                                            {card.status === 'active' ? 'BLOQUER LA CARTE' : 'DÉBLOQUER LA CARTE'}
                                        </button>
                                        {card.status !== 'inactive' && <button onClick={() => handleCardAction(card.id, 'deactivate')} style={{ ...styles.deactivateBtnSmall, padding: '10px' }}>OFF / DÉSACTIVER</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {userGroups.length === 0 && (
                <div style={{ ...styles.emptyState, padding: '3rem 1rem' }}>
                    <i className="fas fa-credit-card fa-2x" style={{ opacity: 0.2, marginBottom: '1rem' }}></i>
                    <h3>Aucun résultat</h3>
                </div>
            )}
        </div>
    );

    // --- DESKTOP VIEW ---
    const DesktopView = () => (
        <div style={{ padding: '2rem' }}>
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

            {userGroups.map(group => (
                <div key={group.id} style={styles.userBlock}>
                    <div style={styles.userInfoHeader}>
                        <div style={styles.avatar}>{group.firstName?.[0]}{group.lastName?.[0]}</div>
                        <div style={styles.userDetail}>
                            <h2 style={styles.userName}>{group.firstName} {group.lastName}</h2>
                            <span style={styles.userEmail}>{group.email}</span>
                        </div>
                        <div style={styles.userStats}>
                            <div style={styles.statItem}><span style={styles.statVal}>{group.cards.length}</span><span style={styles.statLabel}>Cartes</span></div>
                            <div style={styles.statItem}><span style={styles.statVal}>{group.requests.filter(r => r.status === 'pending' || !r.status).length}</span><span style={styles.statLabel}>Demandes</span></div>
                        </div>
                    </div>

                    <div style={styles.itemsGrid}>
                        {group.requests.map(req => {
                            const status = req.status || 'pending';
                            return (
                                <div key={req.id} style={{ ...styles.card, border: status === 'pending' ? '2px solid #f97316' : '1px solid #f1f5f9' }}>
                                    <div style={styles.requestTag}>DEMANDE : {status.toUpperCase()}</div>
                                    <div style={{ ...styles.cardPreview, background: getCardColor(req.cardType), height: '140px' }}>
                                        <div style={styles.cardHeader}><div style={styles.cardBrand}>BanK</div><i className="fas fa-clock"></i></div>
                                        <div style={styles.cardFooter}><span style={styles.typeLabel}>{req.cardType || 'Black Edition'}</span></div>
                                    </div>
                                    <div style={styles.infoRowSmall}><i className="fas fa-map-marker-alt"></i> {req.deliveryAddress}</div>
                                    <div style={styles.actionsSmall}>
                                        {status === 'pending' && <button onClick={() => handleAction(req.id, 'approved')} style={styles.approveBtnSmall}>Expédier</button>}
                                        {req.status === 'approved' && <button onClick={() => handleAction(req.id, 'delivered')} style={styles.deliverBtnSmall}>Livrée</button>}
                                        {status === 'delivered' && <button onClick={() => handleActivateCard(req)} style={styles.activateRealBtnSmall}>Activer</button>}
                                        {status === 'pending' && <button onClick={() => handleAction(req.id, 'rejected')} style={styles.rejectBtnSmall}>Refuser</button>}
                                        <button onClick={() => handleAction(req.id, 'delete')} style={styles.deleteBtnSmall}><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            );
                        })}
                        {group.cards.map(card => (
                            <div key={card.id} style={styles.card}>
                                <div style={styles.activeTag}>CARTE ACTIVE</div>
                                <div style={{ ...styles.cardPreview, background: getCardColor('Black Edition'), height: '140px' }}>
                                    <div style={styles.cardHeader}><div style={styles.cardBrand}>BanK</div><i className="fas fa-check-circle"></i></div>
                                    <div style={styles.cardFooter}><span style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>{card.cardNumber}</span><span style={styles.typeLabel}>{card.type}</span></div>
                                </div>
                                <div style={styles.infoRowSmall}><i className="fas fa-calendar-check" style={{ marginRight: '5px' }}></i> {card.expiryDate} | CVV: {card.cvv} | Limite: {(card.limit || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                                <div style={styles.actionsSmall}>
                                    <button onClick={() => handleEditCardDetails(card)} style={styles.editBtnSmall}>Modifier</button>
                                    <button onClick={() => handleCardAction(card.id, 'toggle_status', card.status)} style={styles.blockBtnSmall}>{card.status === 'active' ? 'Bloquer' : 'Débloquer'}</button>
                                    <button onClick={() => handleCardAction(card.id, 'delete')} style={styles.deleteBtnSmall}><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return <div style={styles.loading}><i className="fas fa-spinner fa-spin fa-3x"></i></div>;

    return isMobile ? <MobileView /> : <DesktopView />;
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' },
    title: { fontSize: '2rem', fontWeight: '800', color: '#003366', margin: 0 },
    subtitle: { color: '#64748b', margin: '0.5rem 0 0 0' },
    tabs: { display: 'flex', background: '#f1f5f9', padding: '5px', borderRadius: '14px', gap: '5px' },
    tab: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' },
    activeTab: { background: 'white', color: '#003366', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    userList: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    userBlock: { background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', marginBottom: '2rem' },
    userInfoHeader: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' },
    avatar: { width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #003366 0%, #004080 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
    userDetail: { flex: 1 },
    userName: { margin: 0, fontSize: '1.2rem', color: '#1e293b' },
    userEmail: { fontSize: '0.9rem', color: '#64748b' },
    userStats: { display: 'flex', gap: '1.5rem' },
    statItem: { textAlign: 'center' },
    statVal: { display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: '#003366' },
    statLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' },
    itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
    card: { background: '#f8fafc', borderRadius: '20px', padding: '1rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
    requestTag: { fontSize: '0.6rem', color: '#f97316', marginBottom: '8px', fontWeight: 'bold' },
    activeTag: { fontSize: '0.6rem', color: '#10b981', marginBottom: '8px', fontWeight: 'bold' },
    cardPreview: { borderRadius: '14px', padding: '1rem', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    typeLabel: { fontSize: '0.6rem', fontWeight: 'bold', opacity: 0.8 },
    infoRowSmall: { fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' },
    actionsSmall: { display: 'flex', gap: '5px', marginTop: 'auto', paddingTop: '10px' },
    approveBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    rejectBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    deliverBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    activateRealBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    editBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #003366', background: 'transparent', color: '#003366', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    blockBtnSmall: { flex: 2, padding: '8px', borderRadius: '8px', border: '1px solid currentColor', background: 'transparent', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    deactivateBtnSmall: { flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #64748b', background: 'transparent', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    deleteBtnSmall: { padding: '5px 8px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem' },
    resetBtnSmall: { padding: '8px', borderRadius: '8px', border: 'none', background: '#e2e8f0', color: '#64748b', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.7rem', width: '100%' },
    loading: { textAlign: 'center', padding: '5rem', color: '#64748b' },
    emptyState: { textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', borderWidth: '2px', borderStyle: 'dashed', borderColor: '#e2e8f0', color: '#64748b' }
};

export default CardRequests;
