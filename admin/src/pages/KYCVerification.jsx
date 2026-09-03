import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import ImageModal from '../components/ImageModal';

// --- Shared Sub-components ---

const downloadFile = async (url, filename) => {
    if (!url) return;

    // Cloudinary specific: Use fl_attachment to force a clean server-side download
    if (url.includes('cloudinary.com')) {
        let downloadUrl = url;

        // Ensure fl_attachment is present in the transformation part of the URL
        if (downloadUrl.includes('/upload/') && !downloadUrl.includes('fl_attachment')) {
            downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
        }

        // Remove transformations that can corrupt non-image files (like auto-format)
        downloadUrl = downloadUrl.replace(/f_auto,?|q_auto,?/g, '');

        // Clean up any double slashes that might have been created
        downloadUrl = downloadUrl.replace(/([^:]\/)\/+/g, "$1");

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    // Fallback for other sources
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download error fallback:', error);
        window.open(url, '_blank');
    }
};

const handleDownloadAll = async (docs, user) => {
    const keys = Object.keys(docs).filter(k => k !== 'documentTypes' && typeof docs[k] === 'string');
    for (const key of keys) {
        await downloadFile(docs[key], `KYC_${user.lastName || 'User'}_${key}`);
    }
};

const DocItem = ({ url, label, typeLabel, onImageClick, isMobile }) => {
    const isPDF = url && (url.toLowerCase().endsWith('.pdf') || url.includes('/raw/upload/') || url.includes('.pdf?'));
    const isImage = url && !isPDF;

    return (
        <div style={{ ...styles.docItem, padding: isMobile ? '0.4rem' : '0.5rem' }} onClick={() => isImage && onImageClick({ url, alt: label })}>
            {url ? (
                isImage ? (
                    <img src={url} alt={label} style={{ ...styles.docThumb, height: isMobile ? '60px' : '80px' }} />
                ) : (
                    <div style={{ ...styles.docPlaceholder, height: isMobile ? '60px' : '80px', background: '#fef2f2' }}>
                        <i className="fas fa-file-pdf" style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: '#ef4444' }}></i>
                    </div>
                )
            ) : (
                <div style={{ ...styles.docPlaceholder, height: isMobile ? '60px' : '80px' }}>
                    <i className="fas fa-image"></i>
                </div>
            )}
            <div style={styles.docInfo}>
                <span style={{ ...styles.docLabel, fontSize: isMobile ? '0.65rem' : '0.75rem' }}>{label}</span>
                {typeLabel && <span style={{ ...styles.docTypeDetail, fontSize: isMobile ? '0.6rem' : '0.7rem' }}>{typeLabel}</span>}
                {url && (
                    <button
                        onClick={(e) => { e.stopPropagation(); downloadFile(url, `KYC_${label.replace(/\s+/g, '_')}`); }}
                        style={styles.downloadBtn}
                    >
                        <i className="fas fa-download"></i> {isMobile ? '' : 'Télécharger'}
                    </button>
                )}
            </div>
        </div>
    );
};

const UserHeader = ({ user, status, isVerified, isMobile, onDownloadAll, docs }) => (
    <div style={{
        ...styles.cardHeader,
        flexDirection: isMobile ? 'row' : 'row',
        alignItems: 'flex-start',
        gap: '0.5rem'
    }}>
        <div style={styles.userInfo}>
            <div style={{ ...styles.avatar, width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', fontSize: isMobile ? '0.8rem' : '1rem' }}>
                {(user.firstName || '?').charAt(0)}{(user.lastName || '?').charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ ...styles.userName, fontSize: isMobile ? '0.85rem' : '1rem' }}>{user.firstName} {user.lastName}</h3>
                <p style={{ ...styles.userEmail, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>{user.email}</p>
                <button
                    onClick={() => onDownloadAll(docs, user)}
                    style={styles.downloadAllBtn}
                >
                    <i className="fas fa-file-archive"></i> Tout télécharger (Auto)
                </button>
            </div>
        </div>
        <span style={{
            ...styles.badge,
            background: isVerified ? '#dcfce7' : status === 'unverified' ? '#fee2e2' : '#fef9c3',
            color: isVerified ? '#166534' : status === 'unverified' ? '#991b1b' : '#854d0e',
            whiteSpace: 'nowrap',
            fontSize: isMobile ? '0.6rem' : '0.75rem'
        }}>
            {isVerified ? 'Vérifié' : status === 'unverified' ? 'Rejeté' : (isMobile ? 'À exam.' : 'À examiner')}
        </span>
    </div>
);

// --- platform Specific Views ---

const DesktopView = ({ requests, users, onVerify, onDelete, onImageClick, formatDocType }) => (
    <div style={styles.requestGridDesktop}>
        {requests.map((req) => {
            const user = users[req.id] || {};
            const docs = req.documents || {};
            const types = docs.documentTypes || {};
            const status = req.status || 'pending';
            const isVerified = status === 'verified';

            return (
                <div key={req.id} style={styles.card} className="card-hover">
                    <UserHeader user={user} status={status} isVerified={isVerified} isMobile={false} onDownloadAll={handleDownloadAll} docs={docs} />

                    <div style={styles.docsGridDesktop}>
                        <DocItem url={docs.id1Front} label="ID 1 Recto" typeLabel={formatDocType(types.id1)} onImageClick={onImageClick} />
                        <DocItem url={docs.id1Back} label="ID 1 Verso" onImageClick={onImageClick} />
                        <DocItem url={docs.selfie} label="Selfie Simple" onImageClick={onImageClick} />
                        <DocItem url={docs.selfieWithId} label="Selfie + ID" onImageClick={onImageClick} />
                        <DocItem url={docs.addressProof} label="Domicile" typeLabel={formatDocType(types.address)} onImageClick={onImageClick} />
                        <DocItem url={docs.incomeProof} label="Revenus" typeLabel={formatDocType(types.income)} onImageClick={onImageClick} />
                        <DocItem url={docs.rib} label="RIB / IBAN" onImageClick={onImageClick} />
                    </div>

                    {req.reviewNotes && (
                        <div style={styles.notes}>
                            <small><strong>Motif de rejet:</strong> {req.reviewNotes}</small>
                        </div>
                    )}

                    <div style={styles.actionsRow}>
                        <button onClick={() => onVerify(req.id, 'verified')} style={styles.approveBtn} disabled={isVerified}>
                            <i className="fas fa-check"></i> Valider le dossier
                        </button>
                        <button onClick={() => onVerify(req.id, 'pending')} style={styles.pendingBtn} disabled={status === 'pending' || isVerified}>
                            <i className="fas fa-clock"></i> En attente
                        </button>
                        <button onClick={() => onVerify(req.id, 'unverified')} style={styles.rejectBtn} disabled={status === 'unverified'}>
                            <i className="fas fa-times"></i> Rejeter
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(req.id); }} style={styles.deleteBtn}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
);

const MobileView = ({ requests, users, onVerify, onDelete, onImageClick, formatDocType }) => (
    <div style={styles.requestGridMobile}>
        {requests.map((req) => {
            const user = users[req.id] || {};
            const docs = req.documents || {};
            const types = docs.documentTypes || {};
            const status = req.status || 'pending';
            const isVerified = status === 'verified';

            return (
                <div key={req.id} style={styles.cardMobile} className="card-hover">
                    <UserHeader user={user} status={status} isVerified={isVerified} isMobile={true} onDownloadAll={handleDownloadAll} docs={docs} />

                    <div style={styles.docsGridMobile}>
                        <DocItem url={docs.id1Front} label="ID 1 Rec" typeLabel={formatDocType(types.id1)} onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.id1Back} label="ID 1 Ver" onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.selfie} label="Selfie" onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.selfieWithId} label="Selfie+ID" onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.addressProof} label="Domicile" typeLabel={formatDocType(types.address)} onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.incomeProof} label="Revenus" typeLabel={formatDocType(types.income)} onImageClick={onImageClick} isMobile={true} />
                        <DocItem url={docs.rib} label="RIB" onImageClick={onImageClick} isMobile={true} />
                    </div>

                    {req.reviewNotes && (
                        <div style={styles.notesMobile}>
                            <small><strong>Motif:</strong> {req.reviewNotes}</small>
                        </div>
                    )}

                    <div style={styles.actionsStack}>
                        <button onClick={() => onVerify(req.id, 'verified')} style={styles.approveBtnMobile} disabled={isVerified}>
                            <i className="fas fa-check"></i> Valider
                        </button>
                        <div style={styles.actionsGrid2}>
                            <button onClick={() => onVerify(req.id, 'pending')} style={styles.pendingBtnMobile} disabled={status === 'pending' || isVerified}>
                                <i className="fas fa-clock"></i> Suspendre
                            </button>
                            <button onClick={() => onVerify(req.id, 'unverified')} style={styles.rejectBtnMobile} disabled={status === 'unverified'}>
                                <i className="fas fa-times"></i> Rejeter
                            </button>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(req.id); }} style={styles.deleteBtnMobile}>
                            <i className="fas fa-trash"></i> Supprimer le dossier
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
);

// --- Main Component ---

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
        const unsubUsers = adminService.subscribeToUsers((userData) => {
            const usersMap = {};
            userData.forEach(u => usersMap[u.id] = u);
            setUsers(usersMap);
        });

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
            if (reviewNotes === null) return;
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

    const handleDelete = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce dossier KYC ? Cette action est irréversible.')) return;
        try {
            await adminService.deleteKYC(userId);
            setKycRequests(prev => prev.filter(req => req.id !== userId));
        } catch (error) {
            console.error('Error deleting KYC:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const formatDocType = (type) => {
        if (!type) return null;
        const map = {
            'cni': 'CNI',
            'passport': 'Passeport',
            'driver_license': 'Permis',
            'residence_permit': 'Titre Séjour',
            'utility_bill': 'Élec/Eau',
            'telecom_bill': 'Tel/Net',
            'tax_notice': 'Imposition',
            'rent_receipt': 'Loyer',
            'payslip': 'Salaire',
            'work_contract': 'Contrat',
            'kbis': 'Kbis',
            'bank_statement': 'Relevé'
        };
        return map[type] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    const filteredRequests = kycRequests.filter(req => {
        const status = req.status || 'pending';
        if (filterStatus === 'all') return true;
        if (filterStatus === 'verified') return status === 'verified';
        if (filterStatus === 'unverified') return status === 'unverified';
        return status === filterStatus;
    }).sort((a, b) => {
        const getMillis = (dateObj) => {
            if (!dateObj) return 0;
            if (dateObj.toMillis) return dateObj.toMillis();
            if (dateObj.seconds) return dateObj.seconds * 1000;
            const time = new Date(dateObj).getTime();
            return isNaN(time) ? 0 : time;
        };
        // Use updatedAt or createdAt, whichever is more recent, or fallback to the other
        const dateA = a.updatedAt || a.createdAt;
        const dateB = b.updatedAt || b.createdAt;
        return getMillis(dateB) - getMillis(dateA);
    });

    return (
        <div className="animate-fade-in" style={styles.pageContainer}>
            <div style={{
                ...styles.header,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center'
            }}>
                <div style={{ marginBottom: isMobile ? '1rem' : '0' }}>
                    <h1 style={styles.title}>Vérification KYC</h1>
                    <p style={styles.subtitle}>Gestion des justificatifs et conformité client</p>
                </div>
                <div style={{ width: isMobile ? '100%' : 'auto' }}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            ...styles.select,
                            width: isMobile ? '100%' : '240px'
                        }}
                    >
                        <option value="pending">⏳ À examiner / En attente</option>
                        <option value="submitted">📥 Soumissions récentes</option>
                        <option value="verified">✅ Documents validés</option>
                        <option value="unverified">❌ Dossiers rejetés</option>
                        <option value="all">📁 Tout voir</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={styles.loading}>
                    <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--primary)' }}></i>
                    <p style={{ marginTop: '1.5rem', color: 'var(--text-light)', fontWeight: '600' }}>Chargement des dossiers...</p>
                </div>
            ) : filteredRequests.length > 0 ? (
                isMobile ? (
                    <MobileView
                        requests={filteredRequests}
                        users={users}
                        onVerify={handleVerify}
                        onDelete={handleDelete}
                        onImageClick={setSelectedImage}
                        formatDocType={formatDocType}
                    />
                ) : (
                    <DesktopView
                        requests={filteredRequests}
                        users={users}
                        onVerify={handleVerify}
                        onDelete={handleDelete}
                        onImageClick={setSelectedImage}
                        formatDocType={formatDocType}
                    />
                )
            ) : (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIconContainer}>
                        <i className="fas fa-check-double" style={styles.emptyIcon}></i>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>Tout est à jour !</h3>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Aucun dossier KYC ne correspond à ce filtre.</p>
                </div>
            )}

            <ImageModal imageUrl={selectedImage?.url} altText={selectedImage?.alt} onClose={() => setSelectedImage(null)} />
        </div>
    );
};

const styles = {
    pageContainer: { padding: '1rem 0' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem' },
    title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' },
    subtitle: { color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: '500' },
    select: { padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'white', fontSize: '0.9rem', fontWeight: '600', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' },

    // Grid layouts
    requestGridDesktop: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' },
    requestGridMobile: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },

    // Card styles
    card: { background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    cardMobile: { background: 'white', borderRadius: '24px', padding: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' },

    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
    userInfo: { display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0, flex: 1 },
    avatar: { borderRadius: '14px', background: 'var(--gradient-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 },
    userName: { fontWeight: '800', margin: '0 0 2px 0', color: 'var(--text-main)' },
    userEmail: { color: 'var(--text-light)', wordBreak: 'break-all', fontWeight: '500', marginBottom: '4px' },
    downloadAllBtn: { background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 10px', fontSize: '0.7rem', fontWeight: '800', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease', marginTop: '4px' },
    badge: { padding: '6px 14px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' },

    // Doc grids
    docsGridDesktop: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' },
    docsGridMobile: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' },

    docItem: { cursor: 'pointer', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', transition: 'all 0.2s ease' },
    docThumb: { width: '100%', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.4rem' },
    docPlaceholder: { width: '100%', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '0.4rem' },
    docInfo: { display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'center', padding: '0 4px 4px 4px' },
    docLabel: { fontWeight: '700', color: '#475569' },
    docTypeDetail: { color: '#0ea5e9', fontWeight: '700' },
    downloadBtn: { marginTop: '6px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 10px', fontSize: '0.65rem', fontWeight: '800', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', width: '100%' },

    // Actions
    actionsRow: { display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' },
    actionsStack: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' },
    actionsGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },

    approveBtn: { flex: 2, padding: '0.85rem', borderRadius: '14px', background: 'var(--success)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' },
    approveBtnMobile: { width: '100%', padding: '1rem', borderRadius: '16px', background: 'var(--success)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' },
    rejectBtn: { flex: 1, padding: '0.85rem', borderRadius: '14px', background: '#fef2f2', color: 'var(--danger)', border: '1px solid var(--danger)', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    rejectBtnMobile: { padding: '0.9rem', borderRadius: '16px', background: '#fef2f2', color: 'var(--danger)', border: '1px solid var(--danger)', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    pendingBtn: { flex: 1, padding: '0.85rem', borderRadius: '14px', background: '#fffbeb', color: '#b45309', border: '1px solid #d97706', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },
    pendingBtnMobile: { padding: '0.9rem', borderRadius: '16px', background: '#fffbeb', color: '#b45309', border: '1px solid #d97706', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' },

    notes: { padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '14px', color: '#991b1b', fontSize: '0.85rem' },
    notesMobile: { padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#991b1b', fontSize: '0.8rem' },

    loading: { textAlign: 'center', padding: '6rem 0' },
    emptyState: { textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '32px', border: '1px dashed var(--border)', maxWidth: '500px', margin: '0 auto' },
    emptyIconContainer: { width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' },
    emptyIcon: { fontSize: '2.5rem', color: '#94a3b8' },

    deleteBtn: { padding: '0.85rem', borderRadius: '14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    deleteBtnMobile: { padding: '0.9rem', borderRadius: '16px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '0.5rem' }
};

export default KYCVerification;
