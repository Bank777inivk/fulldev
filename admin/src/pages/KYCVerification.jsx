import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import ImageModal from '../components/ImageModal';

const KYCVerification = () => {
    const [kycRequests, setKycRequests] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Subscribe to users to get names/emails
        const unsubUsers = adminService.subscribeToUsers((userData) => {
            const usersMap = {};
            userData.forEach(u => usersMap[u.id] = u);
            setUsers(usersMap);
        });

        // Subscribe to KYC requests
        const unsubKYC = adminService.subscribeToKYC((data) => {
            setKycRequests(data);
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubKYC();
        };
    }, []);

    const handleVerify = async (userId, status) => {
        let reviewNotes = '';
        if (status === 'unverified') {
            reviewNotes = window.prompt('Veuillez saisir le motif du rejet (optionnel) :');
            if (reviewNotes === null) return; // Cancel
        } else {
            const actionLabel =
                status === 'submitted' ? 'réinitialiser' :
                    status === 'pending' ? 'mettre en attente' : 'vérifier';
            if (!window.confirm(`Voulez-vous vraiment ${actionLabel} cette demande KYC ?`)) return;
        }

        try {
            await adminService.updateKYCStatus(userId, status, reviewNotes);
        } catch (error) {
            console.error('Error updating KYC status:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const filteredRequests = kycRequests.filter(req => {
        const status = req.status || 'pending';
        if (filterStatus === 'all') return true;
        if (filterStatus === 'verified') return status === 'verified';
        if (filterStatus === 'unverified') return status === 'unverified';
        return status === filterStatus;
    });

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Vérification KYC</h1>
                    <p style={styles.subtitle}>Gérez les demandes de vérification d'identité</p>
                </div>
                <div style={{ width: isMobile ? '100%' : 'auto' }}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ ...styles.select, width: isMobile ? '100%' : 'auto' }}
                    >
                        <option value="pending">En attente / Soumis</option>
                        <option value="submitted">Soumis</option>
                        <option value="verified">Vérifiés</option>
                        <option value="unverified">Rejetés</option>
                        <option value="all">Tout voir</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={styles.loading}>
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p style={{ marginTop: '1rem' }}>Chargement des demandes...</p>
                </div>
            ) : filteredRequests.length > 0 ? (
                <div style={styles.requestGrid}>
                    {filteredRequests.map((req) => {
                        const user = users[req.id] || {}; // KYC ID is the same as User ID
                        const docs = req.documents || {};
                        const status = req.status || 'pending';
                        const isVerified = status === 'verified';

                        return (
                            <div key={req.id} style={styles.card} className="card-hover">
                                <div style={{
                                    ...styles.cardHeader,
                                    flexDirection: isMobile ? 'column-reverse' : 'row',
                                    gap: isMobile ? '1rem' : '0',
                                    alignItems: isMobile ? 'flex-start' : 'flex-start'
                                }}>
                                    <div style={{ ...styles.userInfo, minWidth: 0 }}>
                                        <div style={styles.avatar}>
                                            {(user.firstName || '?').charAt(0)}{(user.lastName || '?').charAt(0)}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <h3 style={styles.userName}>{user.firstName} {user.lastName}</h3>
                                            <p style={styles.userEmail}>{user.email}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        ...styles.badge,
                                        background: isVerified ? '#dcfce7' :
                                            status === 'unverified' ? '#fee2e2' : '#fef9c3',
                                        color: isVerified ? '#166534' :
                                            status === 'unverified' ? '#991b1b' : '#854d0e',
                                        alignSelf: isMobile ? 'flex-start' : 'auto',
                                        marginBottom: isMobile ? '0.25rem' : '0'
                                    }}>
                                        {isVerified ? 'Vérifié' :
                                            status === 'unverified' ? 'Rejeté' : 'En attente'}
                                    </span>
                                </div>

                                <div style={styles.docsSection}>
                                    <p style={styles.sectionTitle}>Documents soumis</p>
                                    <div style={styles.docsGrid}>
                                        {/* ID Card Front */}
                                        <div style={styles.docItem} onClick={() => setSelectedImage({ url: docs.idCardFront, alt: 'CNI Recto' })}>
                                            {docs.idCardFront ? (
                                                <img src={docs.idCardFront} alt="CNI Recto" style={styles.docThumb} />
                                            ) : (
                                                <div style={styles.docPlaceholder}><i className="fas fa-image"></i></div>
                                            )}
                                            <span style={styles.docLabel}>Recto CNI</span>
                                        </div>
                                        {/* ID Card Back */}
                                        <div style={styles.docItem} onClick={() => setSelectedImage({ url: docs.idCardBack, alt: 'CNI Verso' })}>
                                            {docs.idCardBack ? (
                                                <img src={docs.idCardBack} alt="CNI Verso" style={styles.docThumb} />
                                            ) : (
                                                <div style={styles.docPlaceholder}><i className="fas fa-image"></i></div>
                                            )}
                                            <span style={styles.docLabel}>Verso CNI</span>
                                        </div>
                                        {/* Selfie */}
                                        <div style={styles.docItem} onClick={() => setSelectedImage({ url: docs.selfie, alt: 'Selfie' })}>
                                            {docs.selfie ? (
                                                <img src={docs.selfie} alt="Selfie" style={styles.docThumb} />
                                            ) : (
                                                <div style={styles.docPlaceholder}><i className="fas fa-user"></i></div>
                                            )}
                                            <span style={styles.docLabel}>Selfie</span>
                                        </div>
                                    </div>
                                    {req.reviewNotes && (
                                        <div style={styles.notes}>
                                            <small><strong>Note:</strong> {req.reviewNotes}</small>
                                        </div>
                                    )}
                                </div>

                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleVerify(req.id, 'verified')}
                                        style={styles.approveBtn}
                                        disabled={isVerified}
                                    >
                                        <i className="fas fa-check"></i> Vérifier
                                    </button>
                                    <button
                                        onClick={() => handleVerify(req.id, 'pending')}
                                        style={styles.pendingBtn}
                                        disabled={status === 'pending' || isVerified}
                                    >
                                        <i className="fas fa-clock"></i> Attente
                                    </button>
                                    <button
                                        onClick={() => handleVerify(req.id, 'unverified')}
                                        style={styles.rejectBtn}
                                        disabled={status === 'unverified'}
                                    >
                                        <i className="fas fa-times"></i> Rejeter
                                    </button>
                                </div>
                                {(status === 'verified' || status === 'unverified') && (
                                    <button
                                        onClick={() => handleVerify(req.id, 'submitted')}
                                        style={styles.resetBtn}
                                    >
                                        <i className="fas fa-undo"></i> Réinitialiser (Remettre à Soumis)
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                        <i className="fas fa-clipboard-check"></i>
                    </div>
                    <h3>Aucune demande correspondante</h3>
                    <p>Tout est à jour ! Les nouvelles demandes apparaîtront ici.</p>
                </div>
            )}

            <ImageModal
                imageUrl={selectedImage?.url}
                altText={selectedImage?.alt}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        marginBottom: '2rem',
        flexWrap: 'wrap', // Allow wrapping
        gap: '1rem', // Add gap when wrapped
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '0.5rem',
        color: 'var(--text-main)',
    },
    subtitle: {
        color: 'var(--text-light)',
    },
    select: {
        padding: '0.75rem 2rem 0.75rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        fontSize: '0.95rem',
        outline: 'none',
        cursor: 'pointer',
        background: 'white',
        minWidth: '200px',
    },
    requestGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: '1rem', // Reverted padding
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Ensure card stays within container
        maxWidth: '100%',
        boxSizing: 'border-box',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
    },
    userInfo: {
        display: 'flex',
        gap: '1rem',
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'var(--gradient-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '1.1rem',
    },
    userName: {
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '0.25rem',
        color: 'var(--text-main)',
        maxWidth: '28ch', // Force wrapping
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
    },
    userEmail: {
        fontSize: '0.85rem',
        color: 'var(--text-light)',
        maxWidth: '28ch', // Force wrap after approx 28 chars
        overflowWrap: 'break-word',
        wordBreak: 'break-all', // Break anywhere if needed
    },
    badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
    },
    docsSection: {
        marginBottom: '1rem',
        flex: 1,
    },
    notes: {
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        color: '#64748b'
    },
    sectionTitle: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-light)',
        marginBottom: '1rem',
    },
    docsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
    },
    docItem: {
        cursor: 'pointer',
        textAlign: 'center',
    },
    docThumb: {
        width: '100%',
        height: '80px', // Reverted height
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginBottom: '0.5rem',
        transition: 'transform 0.2s',
    },
    docPlaceholder: {
        width: '100%',
        height: '80px', // Reverted height
        borderRadius: '8px',
        border: '1px dashed var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-light)',
        marginBottom: '0.5rem',
        background: 'var(--bg-main)',
    },
    docLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-light)',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap', // Allow buttons to wrap on mobile
    },
    approveBtn: { flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'var(--success)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' },
    rejectBtn: { flex: 1, padding: '0.75rem', borderRadius: '10px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'currentColor', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' },
    pendingBtn: { flex: 1, padding: '0.75rem', borderRadius: '10px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'currentColor', background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' },
    resetBtn: { width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: '10px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--border)', background: '#f8fafc', color: '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem',
        color: 'var(--text-light)',
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'white',
        borderRadius: '16px',
        border: '1px dashed var(--border)',
    },
    emptyIcon: {
        fontSize: '3rem',
        color: 'var(--primary-light)',
        marginBottom: '1rem',
        opacity: 0.5,
    }
};

export default KYCVerification;
