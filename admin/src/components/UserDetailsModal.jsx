import React from 'react';
import ReactDOM from 'react-dom';

const UserDetailsModal = ({ user, onClose, onAction, transactions = [], kycData }) => {
    if (!user) return null;

    return ReactDOM.createPortal(
        <div style={styles.overlay} onClick={onClose} className="animate-fade-in">
            <div style={styles.modal} onClick={e => e.stopPropagation()} className="animate-slide-up">
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user.firstName?.charAt(0).toUpperCase()}
                            {user.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={styles.name}>{user.firstName} {user.lastName}</h2>
                            <p style={styles.email}>{user.email}</p>
                        </div>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content */}
                <div style={styles.content}>
                    {/* Status Banner */}
                    <div style={{
                        ...styles.statusBanner,
                        background: user.accountStatus === 'active' ? '#dcfce7' : '#fee2e2',
                        color: user.accountStatus === 'active' ? '#166534' : '#991b1b'
                    }}>
                        <div style={styles.statusInfo}>
                            <i className={`fas fa-${user.accountStatus === 'active' ? 'check-circle' : 'ban'}`}></i>
                            <span>Compte {user.accountStatus === 'active' ? 'Actif' : 'Bloqué'}</span>
                        </div>
                        <span style={styles.date}>Inscrit le {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div style={styles.grid}>
                        {/* Personal Info */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Infos Personnelles</h3>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Téléphone</span>
                                <span style={styles.value}>{user.phone || 'Non renseigné'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Adresse</span>
                                <span style={styles.value}>{user.address || 'Non renseigné'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Ville</span>
                                <span style={styles.value}>{user.city || 'Non renseigné'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Pays</span>
                                <span style={styles.value}>{user.countryOfResidence || user.country || 'Non renseigné'}</span>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Aperçu du Compte</h3>
                            <div style={styles.statsRow}>
                                <div style={styles.statBox}>
                                    <span style={styles.statLabel}>Solde Actuel</span>
                                    <span style={styles.statValue}>
                                        {(user.balance || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </span>
                                </div>
                                <div style={styles.statBox}>
                                    <span style={styles.statLabel}>Transactions</span>
                                    <span style={styles.statValue}>{transactions.length}</span>
                                </div>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Niveau KYC</span>
                                {(() => {
                                    // Logic to determine effective level
                                    // If explicit level > 0, use it.
                                    // If status is "approved" or "verified", force level 2.
                                    // Otherwise fallback to existing level or 0.
                                    let effectiveLevel = kycData?.verificationLevel || 0;
                                    const status = kycData?.status;

                                    if (effectiveLevel === 0 && (status === 'approved' || status === 'verified')) {
                                        effectiveLevel = 2;
                                    } else if (effectiveLevel === 0 && status === 'pending') {
                                        effectiveLevel = 1;
                                    }

                                    return (
                                        <span style={{
                                            ...styles.badge,
                                            background: getKYCColor(effectiveLevel),
                                            color: getKYCTextColor(effectiveLevel)
                                        }}>
                                            {getKYCLabel(effectiveLevel)}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Dernières Transactions</h3>
                        <div style={styles.transactionList}>
                            {transactions.slice(0, 3).map(tx => (
                                <div key={tx.id} style={styles.transactionItem}>
                                    <div style={{
                                        ...styles.txIcon,
                                        background: tx.type === 'credit' ? '#dcfce7' : '#fee2e2',
                                        color: tx.type === 'credit' ? '#166534' : '#991b1b'
                                    }}>
                                        <i className={`fas fa-arrow-${tx.type === 'credit' ? 'down' : 'up'}`}></i>
                                    </div>
                                    <div style={styles.txInfo}>
                                        <span style={styles.txTitle}>{tx.description || 'Transaction'}</span>
                                        <span style={styles.txDate}>{tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString() : new Date(tx.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span style={{
                                        ...styles.txAmount,
                                        color: tx.type === 'credit' ? '#166534' : '#991b1b'
                                    }}>
                                        {tx.type === 'credit' ? '+' : '-'}{tx.amount} {tx.currency}
                                    </span>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <p style={styles.emptyText}>Aucune transaction récente</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={styles.footer}>
                    <button
                        onClick={() => onAction('toggleStatus', user)}
                        style={{
                            ...styles.actionBtn,
                            background: user.accountStatus === 'active' ? '#fee2e2' : '#dcfce7',
                            color: user.accountStatus === 'active' ? '#991b1b' : '#166534'
                        }}
                    >
                        <i className={`fas fa-${user.accountStatus === 'active' ? 'ban' : 'unlock'}`}></i>
                        {user.accountStatus === 'active' ? 'Bloquer le compte' : 'Débloquer le compte'}
                    </button>
                    <button style={styles.primaryBtn} onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Helper functions for KYC Levels
const getKYCLabel = (level) => {
    switch (Number(level)) {
        case 2: return 'Niveau 2 - Vérifié';
        case 1: return 'Niveau 1 - En attente de validation';
        default: return 'Niveau 0 - Non vérifié';
    }
};

const getKYCColor = (level) => {
    switch (Number(level)) {
        case 2: return '#dcfce7'; // green-100
        case 1: return '#ffedd5'; // orange-100
        default: return '#fee2e2'; // red-100
    }
};

const getKYCTextColor = (level) => {
    switch (Number(level)) {
        case 2: return '#166534'; // green-800
        case 1: return '#9a3412'; // orange-800
        default: return '#991b1b'; // red-800
    }
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        overflow: 'hidden',
    },
    header: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '16px',
        background: 'var(--gradient-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: '700',
    },
    name: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: 0,
    },
    email: {
        color: 'var(--text-light)',
        fontSize: '0.9rem',
        margin: 0,
    },
    closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', transition: 'all 0.2s' },
    content: {
        padding: '2rem',
        overflowY: 'auto',
        flex: 1,
    },
    statusBanner: {
        padding: '1rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    statusInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
    },
    date: {
        fontSize: '0.9rem',
        opacity: 0.8,
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' },
    section: {
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '1rem',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--border)',
    },
    label: {
        color: 'var(--text-light)',
        fontSize: '0.9rem',
    },
    value: {
        fontWeight: '500',
        color: 'var(--text-main)',
    },
    statsRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
    },
    statBox: {
        flex: 1,
        background: 'var(--bg-main)',
        padding: '1rem',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    statLabel: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    statValue: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: 'var(--primary)',
    },
    badge: {
        padding: '0.25rem 0.75rem',
        background: 'var(--info-light)',
        color: 'var(--info)',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    transactionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem',
        borderRadius: '12px',
        background: 'var(--bg-main)',
    },
    txIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
    },
    txInfo: {
        flex: 1,
    },
    txTitle: {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-main)',
    },
    txDate: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    txAmount: {
        fontWeight: '700',
        fontSize: '0.95rem',
    },
    emptyText: {
        textAlign: 'center',
        color: 'var(--text-light)',
        fontStyle: 'italic',
        marginTop: '1rem',
    },
    footer: {
        padding: '1.5rem 2rem',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
    },
    actionBtn: {
        padding: '0.75rem 1.5rem',
        borderRadius: '10px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s',
    },
    primaryBtn: {
        padding: '0.75rem 1.5rem',
        borderRadius: '10px',
        border: 'none',
        background: 'var(--primary)',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};

export default UserDetailsModal;
