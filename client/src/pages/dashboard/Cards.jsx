import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { cardService } from '../../services/cardService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';

const Cards = () => {
    const { currentUser } = useAuth();
    const { cards, cardRequests, loading } = useData();
    const { showToast } = useNotifications();
    const { t } = useTranslation();
    const [showNumbers, setShowNumbers] = useState({});
    const [flippedCards, setFlippedCards] = useState({});
    const [requesting, setRequesting] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [tempLimit, setTempLimit] = useState('');
    const [tempAlias, setTempAlias] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const cardRequest = cardRequests.find(r => ['pending', 'approved', 'shipped', 'delivered'].includes(r.status));
    const rejectedRequest = cardRequests.find(r => r.status === 'rejected');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleNumber = (cardId, e) => {
        if (e) e.stopPropagation();
        setShowNumbers(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const toggleFlip = (cardId) => {
        setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const handleOrderPhysicalCard = async () => {
        if (requesting || cardRequest) return;

        setRequesting(true);
        try {
            await cardService.requestPhysicalCard(currentUser.uid, {
                cardType: 'Black Edition',
                deliveryAddress: 'Adresse associée au compte' // Simplified for now
            });
            showToast(t('cards.messages.order_success'), "success");
        } catch (error) {
            console.error("Error ordering card:", error);
            showToast(t('cards.messages.order_error'), "error");
        } finally {
            setRequesting(false);
        }
    };

    const handleToggleBlock = async (cardId, currentStatus) => {
        try {
            const newStatus = await cardService.toggleCardStatus(cardId, currentStatus);
            showToast(newStatus === 'blocked' ? t('cards.messages.blocked') : t('cards.messages.unblocked'), newStatus === 'blocked' ? "warning" : "success");
        } catch (error) {
            console.error("Error toggling block:", error);
            showToast(t('common.error'), "error");
        }
    };

    const handleShowOptions = (card) => {
        setSelectedCard(card);
        setTempLimit(card.limit || 2000);
        setTempAlias(card.alias || '');
        setShowOptionsModal(true);
    };

    const handleSaveOptions = async () => {
        try {
            await cardService.updateCard(selectedCard.id, {
                limit: Number(tempLimit),
                alias: tempAlias
            });
            setShowOptionsModal(false);
            showToast(t('cards.messages.options_saved'), "success");
        } catch (error) {
            console.error("Error saving options:", error);
            showToast(t('common.error'), "error");
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm(t('cards.messages.delete_confirm'))) return;
        try {
            await cardService.deleteCard(cardId);
            showToast(t('cards.messages.delete_success'), "success");
        } catch (error) {
            console.error("Error deleting card:", error);
            showToast(t('common.error'), "error");
        }
    };


    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm(t('cards.messages.request_cancel_confirm'))) return;
        try {
            await cardService.deleteCardRequest(requestId);
            showToast(t('cards.messages.request_cancelled'), "success");
        } catch (error) {
            console.error("Error deleting request:", error);
            showToast(t('common.error'), "error");
        }
    };

    const formatCardNumber = (number, show) => {
        if (!number) return '•••• •••• •••• ••••';
        if (show) return number;
        return `•••• •••• •••• ${number.slice(-4)}`;
    };

    if (loading && cards.length === 0) return <div style={{ textAlign: 'center', padding: '5rem' }}>{t('common.loading')}</div>;

    const renderCard = (card, mobile = false) => {
        const isFlipped = flippedCards[card.id];
        const isBlocked = card.status === 'blocked';
        const cardStyle = mobile ? styles.mobileVisualCard : styles.visualCard;
        const innerStyle = {
            ...styles.cardInner,
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            height: mobile ? '180px' : '220px',
            filter: isBlocked ? 'grayscale(1) opacity(0.8)' : 'none'
        };

        return (
            <div style={{ ...cardStyle, height: mobile ? '180px' : '220px' }} onClick={() => toggleFlip(card.id)}>
                <div style={innerStyle}>
                    {/* FRONT */}
                    <div style={styles.cardFront}>
                        <div style={styles.cardContent}>
                            <div style={styles.cardTop}>
                                <span style={styles.bankName}>BanK</span>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {card.alias && <span style={{ fontSize: '0.7rem', opacity: 0.8, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', marginBottom: '4px' }}>{card.alias}</span>}
                                    <span style={{ fontSize: '0.6rem', opacity: 0.6, letterSpacing: '1px' }}>{card.type === 'virtual' ? t('cards.details.virtual_uppercase') : t('cards.details.physical_uppercase')}</span>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={styles.cardBrand} />
                            </div>
                            {!mobile && <div style={styles.chipContainer}><div style={styles.chip}></div><i className="fas fa-wifi" style={styles.contactless}></i></div>}
                            <div style={{ ...styles.cardNumber, fontSize: mobile ? '1.2rem' : '1.3rem' }}>
                                {formatCardNumber(card.cardNumber, showNumbers[card.id])}
                            </div>
                            <div style={styles.cardBottom}>
                                <div style={styles.cardHolder}><span style={styles.label}>{t('cards.details.holder') || 'TITULAIRE'}</span><span style={styles.value}>{currentUser.displayName || 'CLIENT'}</span></div>
                                <div style={styles.cardExpiry}><span style={styles.label}>{t('cards.details.expiry') || 'EXPIRE FIN'}</span><span style={styles.value}>{card.expiryDate}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* BACK (VERSO) */}
                    <div style={styles.cardBack}>
                        <div style={styles.magneticStrip}></div>
                        <div style={styles.signatureArea}>
                            <div style={styles.cvvBox}>
                                <span style={{ fontSize: '0.6rem', color: '#888', marginRight: '10px' }}>{t('cards.details.cvv')}</span>
                                <strong>{card.cvv || '***'}</strong>
                            </div>
                        </div>
                        <div style={{ padding: '20px', color: 'white', fontSize: '0.7rem', opacity: 0.8 }}>
                            <p>{t('cards.details.property_notice')}</p>
                            <p style={{ marginTop: '10px' }}>{t('cards.details.support')}: +33 1 00 00 00 00</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <KycVerificationBanner>
                <div style={{ padding: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>{t('cards.title')}</h1>
                    {cards.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px' }}>
                            <p style={{ color: '#666' }}>{t('cards.empty.desc')}</p>
                            <button style={styles.mobileOrderBtn} onClick={handleOrderPhysicalCard} disabled={requesting}>
                                {requesting ? <i className="fas fa-spinner fa-spin"></i> : t('cards.empty.button')}
                            </button>
                        </div>
                    ) : (
                        <div style={styles.mobileCarousel}>
                            {cards.map(card => (
                                <div key={card.id} style={styles.mobileCardItem}>
                                    {renderCard(card, true)}
                                    <div style={styles.mobileActions}>
                                        <button onClick={(e) => toggleNumber(card.id, e)} style={styles.mobileActionBtn}>
                                            <i className={`fas ${showNumbers[card.id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            <span>{showNumbers[card.id] ? t('cards.actions.hide_number') : t('cards.actions.show_number')}</span>
                                        </button>
                                        <button style={styles.mobileActionBtn} onClick={(e) => { e.stopPropagation(); toggleFlip(card.id); }}>
                                            <i className="fas fa-sync"></i>
                                            <span>{t('cards.actions.flip')}</span>
                                        </button>
                                        <button
                                            style={{ ...styles.mobileActionBtn, color: card.status === 'active' ? '#e74c3c' : (card.status === 'inactive' ? '#64748b' : '#2ecc71') }}
                                            onClick={(e) => { e.stopPropagation(); if (card.status !== 'inactive') handleToggleBlock(card.id, card.status); }}
                                            disabled={card.status === 'inactive'}
                                        >
                                            <i className={card.status === 'active' ? 'fas fa-lock' : 'fas fa-lock-open'}></i>
                                            <span>{card.status === 'active' ? t('cards.actions.block') : (card.status === 'inactive' ? t('cards.actions.disabled') : t('cards.actions.activate'))}</span>
                                        </button>
                                        <button style={styles.mobileActionBtn} onClick={(e) => { e.stopPropagation(); handleShowOptions(card); }}>
                                            <i className="fas fa-cog"></i>
                                            <span>{t('cards.actions.options')}</span>
                                        </button>
                                        <button style={{ ...styles.mobileActionBtn, color: '#e74c3c' }} onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}>
                                            <i className="fas fa-trash"></i>
                                            <span>{t('cards.actions.delete')}</span>
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '1.5rem', background: 'white', borderRadius: '16px', padding: '15px', border: '1px solid #eee' }}>
                                        <h4 style={{ fontSize: '0.9rem', color: '#003366', marginBottom: '10px' }}>{t('cards.details.title')}</h4>
                                        <div style={styles.mobileDetailRow}><span>{t('cards.details.status')}</span> <strong style={{ color: card.status === 'active' ? '#2ecc71' : (card.status === 'inactive' ? '#64748b' : '#e74c3c') }}>{card.status === 'active' ? t('cards.details.active') : (card.status === 'inactive' ? t('cards.details.inactive') : t('cards.details.blocked'))}</strong></div>
                                        <div style={styles.mobileDetailRow}><span>{t('cards.details.type')}</span> <strong>{card.type === 'virtual' ? t('cards.details.virtual') : t('cards.details.physical')}</strong></div>
                                        <div style={styles.mobileDetailRow}><span>{t('cards.details.limit')}</span> <strong>{card.limit?.toLocaleString(i18n.language === 'en' ? 'en-US' : 'fr-FR')} {card.currency || '€'}</strong></div>
                                        <div style={{ ...styles.mobileDetailRow, border: 'none' }}><span>{t('cards.details.updated')}</span> <strong>{card.lastModified?.toDate ? card.lastModified.toDate().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR') : t('cards.details.recently')}</strong></div>
                                    </div>
                                </div>
                            ))}

                            {/* MOBILE ORDER SECTION */}
                            <div style={{ ...styles.orderCard, marginTop: '2rem' }}>
                                <div style={styles.orderHeader}>
                                    <i className="fas fa-box-open" style={styles.orderIcon}></i>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('cards.physical_order.mobile_title')}</h3>
                                </div>
                                <p style={styles.orderDesc}>{t('cards.physical_order.desc')}</p>

                                <div style={styles.physicalPreview}>
                                    <div style={{ ...styles.physicalMockup, width: '180px', height: '110px' }}>
                                        <div style={styles.mockupLogo}>INVIK</div>
                                        <div style={{ ...styles.mockupChip, width: '25px', height: '18px' }}></div>
                                        <div style={styles.mockupBrand}>VISA</div>
                                    </div>
                                </div>

                                <ul style={styles.featuresList}>
                                    <li style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                                        <i className="fas fa-check" style={{ color: '#27ae60' }}></i> {t('cards.physical_order.features.withdrawals')}
                                    </li>
                                    <li style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', marginTop: '8px' }}>
                                        <i className="fas fa-check" style={{ color: '#27ae60' }}></i> {t('cards.physical_order.features.contactless')}
                                    </li>
                                    <li style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', marginTop: '8px' }}>
                                        <i className="fas fa-check" style={{ color: '#27ae60' }}></i> {t('cards.physical_order.features.design')}
                                    </li>
                                </ul>

                                <button
                                    style={{
                                        ...styles.orderSubmitBtn,
                                        padding: '14px',
                                        background: cardRequest ? '#27ae60' : '#003366',
                                        opacity: requesting ? 0.7 : 1,
                                        cursor: (requesting || cardRequest) ? 'default' : 'pointer'
                                    }}
                                    onClick={handleOrderPhysicalCard}
                                    disabled={requesting || cardRequest}
                                >
                                    {requesting ? <i className="fas fa-spinner fa-spin"></i> :
                                        cardRequest ? (
                                            cardRequest.status === 'pending' ? t('cards.physical_order.status.pending') :
                                                cardRequest.status === 'delivered' ? t('cards.physical_order.status.delivered') :
                                                    t('cards.physical_order.status.shipped')
                                        ) :
                                            t('cards.physical_order.button.order_now')}
                                </button>

                                {rejectedRequest && !cardRequest && (
                                    <div style={{ marginTop: '1rem', padding: '10px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #feb2b2', fontSize: '0.8rem', color: '#c53030' }}>
                                        <i className="fas fa-exclamation-circle"></i> {t('cards.physical_order.status.rejected')} {rejectedRequest.reviewNotes || t('cards.physical_order.status.default_reject_reason')}
                                    </div>
                                )}

                                <p style={{ ...styles.orderPricing, marginBottom: 0, marginTop: '8px' }}>
                                    {cardRequest ?
                                        (cardRequest.status === 'pending' ? t('cards.physical_order.status.pending') :
                                            cardRequest.status === 'delivered' ? t('cards.physical_order.status.delivered') :
                                                t('cards.physical_order.status.shipped')) :
                                        t('cards.physical_order.status.free')
                                    }
                                </p>
                                {cardRequest && (
                                    <button
                                        onClick={() => handleDeleteRequest(cardRequest.id)}
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.75rem', marginTop: '10px', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {t('cards.physical_order.button.cancel')}
                                    </button>
                                )}
                            </div>

                            <div style={{ ...styles.virtualPromo, marginTop: '1.5rem', marginBottom: '80px' }}>
                                <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{t('cards.virtual_promo.title')}</h3>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>{t('cards.virtual_promo.desc')}</p>
                                <button style={styles.secondaryOrderBtn}>{t('cards.virtual_promo.button')}</button>
                            </div>
                        </div>
                    )}

                    {/* OPTIONS MODAL (MOBILE) */}
                    {showOptionsModal && (
                        <div style={styles.modalOverlay} onClick={() => setShowOptionsModal(false)}>
                            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                                <div style={styles.modalHeader}>
                                    <h3 style={{ margin: 0, color: '#003366' }}>{t('cards.options_modal.title')}</h3>
                                    <button style={styles.modalClose} onClick={() => setShowOptionsModal(false)}>&times;</button>
                                </div>
                                <div style={styles.modalBody}>
                                    <div style={styles.inputGroup}>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{t('cards.options_modal.alias_label')}</label>
                                        <input style={styles.modalInput} value={tempAlias} onChange={e => setTempAlias(e.target.value)} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{t('cards.options_modal.limit_label')}</label>
                                        <input type="number" style={styles.modalInput} value={tempLimit} onChange={e => setTempLimit(e.target.value)} />
                                    </div>
                                    <button style={styles.saveBtn} onClick={handleSaveOptions}>{t('cards.options_modal.save')}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </KycVerificationBanner>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>{t('cards.title')}</h1>
                    <p style={styles.subtitle}>{t('cards.subtitle')}</p>
                </header>
                {cards.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIconCircle}><i className="fas fa-credit-card" style={styles.emptyIcon}></i></div>
                        <h2>{t('cards.empty.title')}</h2>
                        <p>{t('cards.empty.desc')}</p>
                        <button style={styles.orderBtn} onClick={handleOrderPhysicalCard} disabled={requesting}>
                            {requesting ? <i className="fas fa-spinner fa-spin"></i> : t('cards.empty.button')}
                        </button>
                    </div>
                ) : (
                    <div style={styles.desktopGrid}>
                        {/* LEFT COLUMN: LIST OF CARDS */}
                        <div style={styles.cardsListColumn}>
                            <h2 style={styles.sectionTitle}>{t('cards.list_title', { count: cards.length })}</h2>
                            <div style={styles.cardsGrid}>
                                {cards.map(card => (
                                    <div key={card.id} style={styles.cardWrapper}>
                                        {renderCard(card)}
                                        <div style={styles.controls}>
                                            <div style={styles.statusBadge}>
                                                <span style={{ ...styles.dot, backgroundColor: card.status === 'active' ? '#2ecc71' : (card.status === 'inactive' ? '#64748b' : '#e74c3c') }}></span>
                                                {card.status === 'active' ? t('cards.details.active') : (card.status === 'inactive' ? t('cards.details.inactive') : t('cards.details.blocked'))}
                                            </div>
                                            <button onClick={(e) => toggleNumber(card.id, e)} style={styles.controlBtn}><i className={`fas ${showNumbers[card.id] ? 'fa-eye-slash' : 'fa-eye'}`}></i> {showNumbers[card.id] ? t('cards.actions.hide_number') : t('cards.actions.show_number')}</button>
                                            <div style={styles.actionsGrid}>
                                                <button
                                                    style={{ ...styles.actionBtn, color: card.status === 'active' ? '#e74c3c' : (card.status === 'inactive' ? '#64748b' : '#2ecc71'), opacity: card.status === 'inactive' ? 0.6 : 1 }}
                                                    onClick={() => { if (card.status !== 'inactive') handleToggleBlock(card.id, card.status); }}
                                                    disabled={card.status === 'inactive'}
                                                >
                                                    <i className={card.status === 'active' ? 'fas fa-lock' : 'fas fa-lock-open'}></i>
                                                    <span>{card.status === 'active' ? t('cards.actions.block') : (card.status === 'inactive' ? t('cards.actions.disabled') : t('cards.actions.activate'))}</span>
                                                </button>
                                                <button style={styles.actionBtn} onClick={() => handleShowOptions(card)}><i className="fas fa-cog"></i><span>{t('cards.actions.options')}</span></button>
                                                <button style={styles.actionBtn} onClick={() => toggleFlip(card.id)}><i className="fas fa-sync"></i><span>{t('cards.actions.flip')}</span></button>
                                                <button style={{ ...styles.actionBtn, color: '#e74c3c' }} onClick={() => handleDeleteCard(card.id)}>
                                                    <i className="fas fa-trash"></i>
                                                    <span>{t('cards.actions.delete')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ORDER PHYSICAL CARD */}
                        <div style={styles.orderColumn}>
                            <div style={styles.orderCard}>
                                <div style={styles.orderHeader}>
                                    <i className="fas fa-box-open" style={styles.orderIcon}></i>
                                    <h3>{t('cards.physical_order.title')}</h3>
                                </div>
                                <p style={styles.orderDesc}>{t('cards.physical_order.desc')}</p>

                                <div style={styles.physicalPreview}>
                                    <div style={styles.physicalMockup}>
                                        <div style={styles.mockupLogo}>INVIK</div>
                                        <div style={styles.mockupChip}></div>
                                        <div style={styles.mockupBrand}>VISA</div>
                                    </div>
                                </div>

                                <ul style={styles.featuresList}>
                                    <li><i className="fas fa-check"></i> {t('cards.physical_order.features.withdrawals')}</li>
                                    <li><i className="fas fa-check"></i> {t('cards.physical_order.features.contactless')}</li>
                                    <li><i className="fas fa-check"></i> {t('cards.physical_order.features.design')}</li>
                                </ul>

                                <button
                                    style={{
                                        ...styles.orderSubmitBtn,
                                        background: cardRequest ? '#27ae60' : '#003366',
                                        opacity: requesting ? 0.7 : 1,
                                        cursor: (requesting || cardRequest) ? 'default' : 'pointer'
                                    }}
                                    onClick={handleOrderPhysicalCard}
                                    disabled={requesting || cardRequest}
                                >
                                    {requesting ? <i className="fas fa-spinner fa-spin"></i> :
                                        cardRequest ? (
                                            cardRequest.status === 'pending' ? t('cards.physical_order.status.pending') :
                                                cardRequest.status === 'delivered' ? t('cards.physical_order.status.delivered') :
                                                    t('cards.physical_order.status.shipped')
                                        ) :
                                            t('cards.physical_order.button.order_now')}
                                </button>

                                {rejectedRequest && !cardRequest && (
                                    <div style={{ marginTop: '1rem', padding: '12px', background: '#fff5f5', borderRadius: '12px', border: '1px solid #feb2b2', fontSize: '0.85rem', color: '#c53030', textAlign: 'left' }}>
                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                                        <strong>{t('cards.physical_order.status.rejected')}</strong> {rejectedRequest.reviewNotes || t('cards.physical_order.status.default_reject_reason')}
                                    </div>
                                )}

                                <p style={styles.orderPricing}>
                                    {cardRequest ?
                                        (cardRequest.status === 'pending' ? t('cards.physical_order.status.pending') :
                                            cardRequest.status === 'delivered' ? t('cards.physical_order.status.delivered') :
                                                t('cards.physical_order.status.shipped')) :
                                        t('cards.physical_order.status.free')
                                    }
                                </p>
                            </div>

                            <div style={styles.virtualPromo}>
                                <h3>{t('cards.virtual_promo.title')}</h3>
                                <p>{t('cards.virtual_promo.desc')}</p>
                                <button style={styles.secondaryOrderBtn}>{t('cards.virtual_promo.button')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* OPTIONS MODAL */}
                {showOptionsModal && (
                    <div style={styles.modalOverlay} onClick={() => setShowOptionsModal(false)}>
                        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h3 style={{ margin: 0, color: '#003366' }}>{t('cards.options_modal.title')}</h3>
                                <button style={styles.modalClose} onClick={() => setShowOptionsModal(false)}>&times;</button>
                            </div>

                            <div style={styles.modalBody}>
                                <div style={styles.inputGroup}>
                                    <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{t('cards.options_modal.alias_label')}</label>
                                    <input
                                        style={styles.modalInput}
                                        value={tempAlias}
                                        onChange={e => setTempAlias(e.target.value)}
                                        placeholder={t('cards.options_modal.alias_placeholder')}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>{t('cards.options_modal.limit_label')}</label>
                                    <input
                                        type="number"
                                        style={styles.modalInput}
                                        value={tempLimit}
                                        onChange={e => setTempLimit(e.target.value)}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('cards.options_modal.limit_help')}</span>
                                </div>

                                <button style={styles.saveBtn} onClick={handleSaveOptions}>
                                    {t('cards.options_modal.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </KycVerificationBanner>
    );
};

const styles = {
    loading: { textAlign: 'center', padding: '3rem', color: '#003366' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '800', marginBottom: '0.5rem' },
    subtitle: { color: '#666', fontSize: '1rem' },
    cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' },
    desktopGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' },
    cardsListColumn: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    sectionTitle: { fontSize: '1.2rem', color: '#003366', fontWeight: 'bold' },
    orderColumn: { display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' },

    orderCard: { backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eef2f6', textAlign: 'center' },
    orderHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' },
    orderIcon: { fontSize: '1.5rem', color: '#003366' },
    orderDesc: { fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' },

    physicalPreview: { marginBottom: '2rem', display: 'flex', justifyContent: 'center' },
    physicalMockup: {
        width: '200px', height: '125px',
        background: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
        borderRadius: '12px', padding: '15px', position: 'relative', overflow: 'hidden', color: 'white', textAlign: 'left',
        boxShadow: '0 15px 25px rgba(0,0,0,0.2)'
    },
    mockupLogo: { fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' },
    mockupChip: { width: '30px', height: '22px', backgroundColor: '#d4af37', borderRadius: '4px', marginTop: '15px' },
    mockupBrand: { position: 'absolute', bottom: '15px', right: '15px', fontSize: '0.9rem', fontWeight: '800', fontStyle: 'italic' },

    featuresList: { listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' },
    featureItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569' },

    orderSubmitBtn: { width: '100%', padding: '1rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginBottom: '0.8rem', transition: '0.3s' },
    orderPricing: { fontSize: '0.8rem', color: '#94a3b8' },

    virtualPromo: { backgroundColor: '#f8fafc', borderRadius: '20px', padding: '1.5rem', border: '1px dashed #cbd5e1' },
    secondaryOrderBtn: { background: 'none', border: 'none', color: '#003366', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginTop: '10px', display: 'block' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { backgroundColor: 'white', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    modalClose: { background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#64748b', lineHeight: '1' },
    modalBody: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' },
    modalInput: { padding: '12px', borderRadius: '12px', border: '1px solid #eef2f6', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc' },
    saveBtn: { padding: '14px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },

    cardWrapper: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },

    // 3D FLIP BASE
    visualCard: { width: '100%', perspective: '1000px', cursor: 'pointer' },
    mobileVisualCard: { width: '100%', perspective: '1000px', cursor: 'pointer' },
    cardInner: { position: 'relative', width: '100%', transition: 'transform 0.6s', transformStyle: 'preserve-3d' },
    cardFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(118, 75, 162, 0.4)', color: 'white', fontFamily: "'Courier New', monospace" },
    cardBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', transform: 'rotateY(180deg)', overflow: 'hidden', boxShadow: '0 15px 35px rgba(118, 75, 162, 0.4)' },

    // CONTENT
    cardContent: { padding: '25px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    bankName: { fontSize: '1.2rem', fontWeight: '800', letterSpacing: '2px' },
    cardBrand: { height: '30px', filter: 'brightness(0) invert(1)' },
    chipContainer: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '10px 0' },
    chip: { width: '45px', height: '30px', background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)', borderRadius: '6px' },
    contactless: { fontSize: '1.2rem', opacity: 0.8, transform: 'rotate(90deg)' },
    cardNumber: { letterSpacing: '3px', fontWeight: '600', marginTop: 'auto', marginBottom: '1rem' },
    cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardHolder: { display: 'flex', flexDirection: 'column', gap: '4px' },
    cardExpiry: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' },
    label: { fontSize: '0.6rem', opacity: 0.7 },
    value: { fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' },

    // BACK DETAILS
    magneticStrip: { width: '100%', height: '45px', backgroundColor: '#111', marginTop: '25px' },
    signatureArea: { width: '80%', height: '35px', backgroundColor: '#eee', margin: '15px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10px' },
    cvvBox: { display: 'flex', alignItems: 'center' },

    // CONTROLS
    controls: { backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #eef2f6' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 0.8rem', borderRadius: '50px', backgroundColor: '#f8fbff', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1rem' },
    dot: { width: '8px', height: '8px', borderRadius: '50%' },
    controlBtn: { width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'transparent', fontSize: '0.9rem', fontWeight: '600', color: '#555', marginBottom: '1rem', cursor: 'pointer' },
    actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.8rem' },
    actionBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.8rem', border: 'none', borderRadius: '12px', backgroundColor: '#f5f7fa', color: '#555', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' },

    emptyState: { textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '20px' },
    emptyIconCircle: { width: '80px', height: '80px', backgroundColor: '#f0f4f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
    emptyIcon: { fontSize: '2rem', color: '#003366' },
    orderBtn: { marginTop: '2rem', padding: '1rem 2rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '700', cursor: 'pointer' },

    // MOBILE
    mobileCarousel: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    mobileCardItem: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mobileActions: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
    mobileActionBtn: { flex: 1, padding: '12px', background: 'white', border: '1px solid #eee', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#333', fontWeight: '600' },
    mobileOrderBtn: { padding: '12px 24px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '1rem' },
    mobileDetailRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '0.85rem' }
};

export default Cards;
