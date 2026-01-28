import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { beneficiaryService } from '../../services/beneficiaryService';
import { transactionService } from '../../services/transactionService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next';

// IBAN Validation function (outside component to avoid recreation)
const validateIban = (iban) => {
    if (!iban) return false;
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
    return ibanRegex.test(cleanIban);
};

const Beneficiaries = () => {
    const { currentUser } = useAuth();
    const { beneficiaries, loading } = useData();
    const { showToast, confirm: showConfirm } = useNotifications();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Form States
    const [name, setName] = useState('');
    const [iban, setIban] = useState('');
    const [bic, setBic] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAdd = useCallback(async (e) => {
        e.preventDefault();

        if (!validateIban(iban)) {
            showToast(t('beneficiaries.form.validation.iban_invalid'), "error");
            return;
        }

        setSubmitting(true);
        try {
            await beneficiaryService.addBeneficiary(currentUser.uid, {
                name,
                iban,
                bic: bic || '',
                email: email || ''
            });
            setName('');
            setIban('');
            setBic('');
            setEmail('');
            setShowForm(false);
            showToast(t('beneficiaries.toasts.add_success'), "success");
        } catch (err) {
            showToast(t('beneficiaries.toasts.add_error'), "error");
        } finally {
            setSubmitting(false);
        }
    }, [iban, name, bic, email, currentUser.uid, showToast]);

    const handleDelete = useCallback(async (id) => {
        const confirmed = await showConfirm(t('beneficiaries.confirm_delete'));
        if (confirmed) {
            try {
                await beneficiaryService.deleteBeneficiary(currentUser.uid, id);
                showToast(t('beneficiaries.toasts.delete_success'), "info");
            } catch (err) {
                showToast(t('beneficiaries.toasts.delete_error'), "error");
            }
        }
    }, [currentUser.uid, showConfirm, showToast, t]);

    const handleQuickTransfer = useCallback((beneficiary) => {
        navigate(`/${i18n.language}/dashboard/transfers`, { state: { beneficiary } });
    }, [navigate, i18n.language]);

    const filteredBeneficiaries = useMemo(() =>
        beneficiaries.filter(b =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.iban.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [beneficiaries, searchTerm]
    );

    const invikCount = useMemo(() =>
        beneficiaries.filter(b => transactionService.isInvikIban(b.iban)).length,
        [beneficiaries]
    );

    if (loading && beneficiaries.length === 0) return <div style={styles.loading}>{t('loading')}</div>;

    return (
        <KycVerificationBanner>
            {isMobile ? (
                <MobileView
                    beneficiaries={filteredBeneficiaries}
                    invikCount={invikCount}
                    totalCount={beneficiaries.length}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    name={name}
                    setName={setName}
                    iban={iban}
                    setIban={setIban}
                    bic={bic}
                    setBic={setBic}
                    email={email}
                    setEmail={setEmail}
                    submitting={submitting}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    handleQuickTransfer={handleQuickTransfer}
                />
            ) : (
                <DesktopView
                    beneficiaries={filteredBeneficiaries}
                    invikCount={invikCount}
                    totalCount={beneficiaries.length}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    name={name}
                    setName={setName}
                    iban={iban}
                    setIban={setIban}
                    bic={bic}
                    setBic={setBic}
                    email={email}
                    setEmail={setEmail}
                    submitting={submitting}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    handleQuickTransfer={handleQuickTransfer}
                />
            )}

            <style>{`
                .mobile-beneficiary-card {
                    animation: fadeInUp 0.3s ease-out;
                }
                .desktop-beneficiary-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .desktop-beneficiary-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
                .slide-up {
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </KycVerificationBanner>
    );
};

// Mobile View Component (outside main component to prevent recreation)
const MobileView = React.memo(({
    beneficiaries, invikCount, totalCount, showForm, setShowForm,
    name, setName, iban, setIban, bic, setBic, email, setEmail,
    submitting, handleAdd, handleDelete, handleQuickTransfer
}) => {
    const { t } = useTranslation();
    return (
        <div style={styles.mobileContainer}>
            {/* Header avec gradient */}
            <div style={styles.mobileHeader}>
                <div style={styles.mobileHeaderContent}>
                    <h1 style={styles.mobileTitle}>{t('beneficiaries.title')}</h1>
                    <p style={styles.mobileSubtitle}>{t('beneficiaries.subtitle')}</p>
                </div>
                <div style={styles.statsRow}>
                    <div style={styles.statBadge}>
                        <i className="fas fa-users" style={{ fontSize: '0.9rem', marginRight: '6px' }}></i>
                        {t('beneficiaries.stats.total', { count: totalCount })}
                    </div>
                    <div style={{ ...styles.statBadge, background: '#e3f2fd', color: '#003366' }}>
                        <i className="fas fa-bolt" style={{ fontSize: '0.9rem', marginRight: '6px' }}></i>
                        {t('beneficiaries.stats.invik', { count: invikCount })}
                    </div>
                </div>
            </div>

            {/* Liste des bénéficiaires */}
            <div style={styles.mobileList}>
                {beneficiaries.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}><i className="fas fa-user-friends"></i></div>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '700', fontSize: '1.1rem' }}>{t('beneficiaries.empty.title')}</p>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{t('beneficiaries.empty.subtitle')}</span>
                    </div>
                ) : (
                    beneficiaries.map(b => (
                        <div key={b.id} style={styles.mobileCard} className="mobile-beneficiary-card">
                            <div style={styles.mobileCardHeader}>
                                <div style={styles.mobileAvatar}>
                                    {b.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={styles.mobileCardName}>{b.name}</div>
                                    <div style={styles.mobileCardIban}>
                                        <i className="fas fa-university" style={{ fontSize: '0.7rem', marginRight: '5px' }}></i>
                                        {b.iban.substring(0, 4)} •••• {b.iban.slice(-4)}
                                    </div>
                                    {(b.bic || b.email) && (
                                        <div style={styles.mobileCardMeta}>
                                            {b.bic && <span><i className="fas fa-code"></i> {b.bic}</span>}
                                            {b.email && <span><i className="fas fa-envelope"></i> {b.email}</span>}
                                        </div>
                                    )}
                                </div>
                                {transactionService.isInvikIban(b.iban) && (
                                    <div style={styles.invikBadgeMobile}>
                                        <i className="fas fa-bolt"></i>
                                    </div>
                                )}
                            </div>
                            <div style={styles.mobileCardActions}>
                                <button
                                    style={styles.mobileActionBtn}
                                    onClick={() => handleQuickTransfer(b)}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                    {t('beneficiaries.card.actions.transfer')}
                                </button>
                                <button
                                    style={{ ...styles.mobileActionBtn, background: '#fff1f2', color: '#f43f5e' }}
                                    onClick={() => handleDelete(b.id)}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bouton flottant d'ajout */}
            <button style={styles.mobileFab} onClick={() => setShowForm(true)}>
                <i className="fas fa-plus"></i>
            </button>

            {/* Modal formulaire */}
            {showForm && (
                <div style={styles.mobileModal} onClick={() => setShowForm(false)}>
                    <div style={styles.mobileModalContent} onClick={(e) => e.stopPropagation()} className="slide-up">
                        <div style={styles.mobileModalHeader}>
                            <h3 style={styles.mobileModalTitle}>{t('beneficiaries.form.new_title')}</h3>
                            <button style={styles.mobileModalClose} onClick={() => setShowForm(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAdd} style={styles.mobileForm}>
                            <div style={styles.mobileInputGroup}>
                                <label style={styles.mobileLabel}>{t('beneficiaries.form.name_label')}</label>
                                <input
                                    style={styles.mobileInput}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={t('beneficiaries.form.name_placeholder')}
                                    required
                                />
                            </div>
                            <div style={styles.mobileInputGroup}>
                                <label style={styles.mobileLabel}>{t('beneficiaries.form.iban_label')}</label>
                                <input
                                    style={{
                                        ...styles.mobileInput,
                                        borderColor: iban && !validateIban(iban) ? '#f43f5e' : '#e2e8f0'
                                    }}
                                    value={iban}
                                    onChange={e => setIban(e.target.value)}
                                    placeholder={t('beneficiaries.form.iban_placeholder')}
                                    required
                                />
                                {iban && validateIban(iban) && (
                                    <div style={styles.validationSuccess}>
                                        <i className="fas fa-check-circle"></i> {t('beneficiaries.form.validation.iban_valid')}
                                    </div>
                                )}
                            </div>
                            <div style={styles.mobileInputGroup}>
                                <label style={styles.mobileLabel}>{t('beneficiaries.form.bic_label')}</label>
                                <input
                                    style={styles.mobileInput}
                                    value={bic}
                                    onChange={e => setBic(e.target.value)}
                                    placeholder={t('beneficiaries.form.bic_placeholder')}
                                />
                            </div>
                            <div style={styles.mobileInputGroup}>
                                <label style={styles.mobileLabel}>{t('beneficiaries.form.email_label')}</label>
                                <input
                                    style={styles.mobileInput}
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={t('beneficiaries.form.email_placeholder')}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});

// Desktop View Component (outside main component to prevent recreation)
const DesktopView = React.memo(({
    beneficiaries, invikCount, totalCount, searchTerm, setSearchTerm,
    name, setName, iban, setIban, bic, setBic, email, setEmail,
    submitting, handleAdd, handleDelete, handleQuickTransfer
}) => {
    const { t } = useTranslation();
    return (
        <div style={styles.desktopContainer}>
            <div style={styles.desktopHeader}>
                <div>
                    <h1 style={styles.desktopTitle}>{t('beneficiaries.title')}</h1>
                    <p style={styles.desktopSubtitle}>
                        {t('beneficiaries.stats.total', { count: totalCount })} • {t('beneficiaries.stats.invik', { count: invikCount })}
                    </p>
                </div>
            </div>

            <div style={styles.desktopLayout}>
                {/* Formulaire à gauche */}
                <div style={styles.desktopFormPanel}>
                    <div style={styles.desktopFormCard}>
                        <h3 style={styles.desktopFormTitle}>
                            <i className="fas fa-user-plus" style={{ marginRight: '10px', color: '#003366' }}></i>
                            {t('beneficiaries.form.add_title')}
                        </h3>
                        <form onSubmit={handleAdd} style={styles.desktopForm}>
                            <div style={styles.desktopInputGroup}>
                                <label style={styles.desktopLabel}>{t('beneficiaries.form.name_label')}</label>
                                <input
                                    style={styles.desktopInput}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={t('beneficiaries.form.name_placeholder')}
                                    required
                                />
                            </div>
                            <div style={styles.desktopInputGroup}>
                                <label style={styles.desktopLabel}>{t('beneficiaries.form.iban_label')}</label>
                                <input
                                    style={{
                                        ...styles.desktopInput,
                                        borderColor: iban && !validateIban(iban) ? '#f43f5e' : '#e2e8f0'
                                    }}
                                    value={iban}
                                    onChange={e => setIban(e.target.value)}
                                    placeholder={t('beneficiaries.form.iban_placeholder')}
                                    required
                                />
                                {iban && validateIban(iban) && (
                                    <div style={styles.validationSuccess}>
                                        <i className="fas fa-check-circle"></i> {t('beneficiaries.form.validation.iban_valid')}
                                    </div>
                                )}
                            </div>
                            <div style={styles.desktopInputGroup}>
                                <label style={styles.desktopLabel}>{t('beneficiaries.form.bic_label')}</label>
                                <input
                                    style={styles.desktopInput}
                                    value={bic}
                                    onChange={e => setBic(e.target.value)}
                                    placeholder={t('beneficiaries.form.bic_placeholder')}
                                />
                            </div>
                            <div style={styles.desktopInputGroup}>
                                <label style={styles.desktopLabel}>{t('beneficiaries.form.email_label')}</label>
                                <input
                                    style={styles.desktopInput}
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder={t('beneficiaries.form.email_placeholder')}
                                />
                            </div>
                            <button type="submit" style={styles.desktopSubmitBtn} disabled={submitting}>
                                {submitting ? <i className="fas fa-spinner fa-spin"></i> : t('beneficiaries.form.confirm_submit')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Liste à droite */}
                <div style={styles.desktopListPanel}>
                    <div style={styles.desktopSearchBar}>
                        <i className="fas fa-search" style={styles.searchIcon}></i>
                        <input
                            style={styles.desktopSearchInput}
                            placeholder={t('beneficiaries.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={styles.desktopGrid}>
                        {beneficiaries.length === 0 ? (
                            <div style={styles.emptyState}>
                                <div style={styles.emptyIcon}><i className="fas fa-user-friends"></i></div>
                                <p style={{ margin: '0 0 8px 0', fontWeight: '700', fontSize: '1.2rem' }}>{t('beneficiaries.empty.search_no_results')}</p>
                                <span style={{ fontSize: '0.95rem', color: '#64748b' }}>{t('beneficiaries.empty.search_try_again')}</span>
                            </div>
                        ) : (
                            beneficiaries.map(b => (
                                <div key={b.id} style={styles.desktopCard} className="desktop-beneficiary-card">
                                    <div style={styles.desktopCardHeader}>
                                        <div style={styles.desktopAvatar}>
                                            {b.name.charAt(0).toUpperCase()}
                                        </div>
                                        {transactionService.isInvikIban(b.iban) && (
                                            <div style={styles.invikBadge}>
                                                <i className="fas fa-bolt"></i> INVIK
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.desktopCardBody}>
                                        <h3 style={styles.desktopCardName}>{b.name}</h3>
                                        <div style={styles.desktopCardInfo}>
                                            <div style={styles.infoRow}>
                                                <i className="fas fa-university"></i>
                                                <span>{b.iban}</span>
                                            </div>
                                            {b.bic && (
                                                <div style={styles.infoRow}>
                                                    <i className="fas fa-code"></i>
                                                    <span>{b.bic}</span>
                                                </div>
                                            )}
                                            {b.email && (
                                                <div style={styles.infoRow}>
                                                    <i className="fas fa-envelope"></i>
                                                    <span>{b.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

const styles = {
    loading: { textAlign: 'center', padding: '10rem', color: '#003366', fontSize: '1.2rem', fontWeight: '600' },

    // Mobile Styles
    mobileContainer: { minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' },
    mobileHeader: {
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        padding: '2rem 1.5rem 1.5rem',
        color: 'white',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 10px 30px rgba(0,51,102,0.2)'
    },
    mobileHeaderContent: { marginBottom: '1.5rem' },
    mobileTitle: { fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px', color: 'white' },
    mobileSubtitle: { fontSize: '0.95rem', margin: 0, opacity: 0.9 },
    statsRow: { display: 'flex', gap: '12px' },
    statBadge: {
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center'
    },
    mobileList: { padding: '1.5rem 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '12px' },
    mobileCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '1.2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9'
    },
    mobileCardHeader: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' },
    mobileAvatar: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        fontWeight: '900',
        flexShrink: 0
    },
    mobileCardName: { fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' },
    mobileCardIban: { fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', display: 'flex', alignItems: 'center' },
    mobileCardMeta: {
        display: 'flex',
        gap: '12px',
        marginTop: '6px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        flexWrap: 'wrap'
    },
    invikBadgeMobile: {
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: '#e3f2fd',
        color: '#003366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        flexShrink: 0
    },
    mobileCardActions: { display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
    mobileActionBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: 'none',
        background: '#003366',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    mobileFab: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        color: 'white',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,51,102,0.3)',
        zIndex: 100
    },
    mobileModal: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end'
    },
    mobileModalContent: {
        background: 'white',
        borderRadius: '32px 32px 0 0',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '1.5rem'
    },
    mobileModalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    mobileModalTitle: { fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', margin: 0 },
    mobileModalClose: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: 'none',
        background: '#f1f5f9',
        color: '#64748b',
        fontSize: '1.2rem',
        cursor: 'pointer'
    },
    mobileForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
    mobileInputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    mobileLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    mobileInput: {
        padding: '14px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '1rem',
        outline: 'none',
        background: '#f8fafc',
        transition: 'border-color 0.2s'
    },
    mobileSubmitBtn: {
        padding: '16px',
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '8px'
    },

    // Desktop Styles
    desktopContainer: { maxWidth: '1400px', margin: '0 auto', padding: '2rem' },
    desktopHeader: { marginBottom: '2.5rem' },
    desktopTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-1px' },
    desktopSubtitle: { fontSize: '1.1rem', color: '#64748b', margin: 0 },
    desktopLayout: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'start' },
    desktopFormPanel: { position: 'sticky', top: '2rem' },
    desktopFormCard: {
        background: 'white',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
    },
    desktopFormTitle: { fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center' },
    desktopForm: { display: 'flex', flexDirection: 'column', gap: '20px' },
    desktopInputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    desktopLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    desktopInput: {
        padding: '14px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        fontSize: '1rem',
        outline: 'none',
        background: '#f8fafc',
        transition: 'border-color 0.2s'
    },
    desktopSubmitBtn: {
        padding: '16px',
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '8px'
    },
    desktopListPanel: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    desktopSearchBar: { position: 'relative' },
    searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1rem' },
    desktopSearchInput: {
        width: '100%',
        padding: '14px 14px 14px 45px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        fontSize: '1rem',
        outline: 'none',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    desktopGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
    desktopCard: {
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    desktopCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    desktopAvatar: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '900'
    },
    invikBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        background: '#e3f2fd',
        color: '#003366',
        fontSize: '0.75rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    desktopCardBody: { flex: 1 },
    desktopCardName: { fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' },
    desktopCardInfo: { display: 'flex', flexDirection: 'column', gap: '8px' },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        color: '#64748b'
    },
    desktopCardActions: { display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' },
    desktopActionBtn: {
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: 'none',
        background: '#003366',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    desktopDeleteBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: 'none',
        background: '#fff1f2',
        color: '#f43f5e',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Shared
    validationSuccess: {
        fontSize: '0.85rem',
        color: '#16a34a',
        fontWeight: '600',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    emptyState: {
        gridColumn: '1/-1',
        textAlign: 'center',
        padding: '4rem 2rem',
        background: '#f8fafc',
        borderRadius: '24px',
        border: '2px dashed #e2e8f0'
    },
    emptyIcon: { fontSize: '4rem', color: '#cbd5e1', marginBottom: '1rem' }
};

export default Beneficiaries;
