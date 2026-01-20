import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const ManageAdmins = () => {
    const { isSuperAdmin, currentUser } = useAdminAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isSuperAdmin: false
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins();
        }
    }, [isSuperAdmin]);

    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', message: 'Création en cours...' });
        try {
            await adminService.createAdminAccount(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                isSuperAdmin: formData.isSuperAdmin
            });
            setStatus({ type: 'success', message: 'Compte administrateur créé avec succès !' });
            setShowModal(false);
            setFormData({ email: '', password: '', firstName: '', lastName: '', isSuperAdmin: false });
            fetchAdmins();
        } catch (error) {
            console.error("Error creating admin:", error);
            setStatus({ type: 'error', message: `Erreur: ${error.message}` });
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (adminId === currentUser?.uid) {
            alert("Vous ne pouvez pas supprimer votre propre compte.");
            return;
        }

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte administrateur de ${adminName} ? Cette action bloquera ses accès.`)) {
            try {
                await adminService.deleteAdminAccount(adminId);
                setStatus({ type: 'success', message: 'Compte administrateur supprimé.' });
                fetchAdmins();
            } catch (error) {
                console.error("Error deleting admin:", error);
                setStatus({ type: 'error', message: `Erreur lors de la suppression: ${error.message}` });
            }
        }
    };

    if (!isSuperAdmin) {
        return (
            <div style={styles.errorContainer}>
                <i className="fas fa-lock fa-3x" style={{ color: '#e74c3c', marginBottom: '1rem' }}></i>
                <h2>Accès Restreint</h2>
                <p>Seul le Super Administrateur peut accéder à cette page.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Administrateurs</h1>
                    <p style={styles.subtitle}>Gérez les comptes administratifs et les permissions.</p>
                </div>
                <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Nouvel Admin
                </button>
            </header>

            {status.message && (
                <div style={{
                    ...styles.alert,
                    backgroundColor: status.type === 'success' ? '#dcfce7' : (status.type === 'error' ? '#fee2e2' : '#e0f2fe'),
                    color: status.type === 'success' ? '#15803d' : (status.type === 'error' ? '#b91c1c' : '#0369a1')
                }}>
                    {status.message}
                </div>
            )}

            <div style={styles.grid}>
                {loading ? (
                    <div style={styles.loading}>Chargement des administrateurs...</div>
                ) : (
                    admins.map(admin => (
                        <div key={admin.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div style={styles.avatar}>
                                    {admin.firstName?.[0]?.toUpperCase()}
                                </div>
                                <div style={styles.info}>
                                    <h3 style={styles.name}>{admin.firstName} {admin.lastName}</h3>
                                    <span style={styles.email}>{admin.email}</span>
                                </div>
                                {admin.isSuperAdmin && (
                                    <span style={styles.superBadge}>SUPER ADMIN</span>
                                )}
                                <button
                                    onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                                    style={styles.deleteBtn}
                                    title="Supprimer l'administrateur"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                            <div style={styles.cardFooter}>
                                <span style={styles.status}>Status: <strong style={{ color: '#2ecc71' }}>{admin.accountStatus || 'Actif'}</strong></span>
                                <span style={styles.date}>Créé le: {admin.createdAt?.toDate ? admin.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de création */}
            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal} className="animate-slide-up">
                        <div style={styles.modalHeader}>
                            <h2>Créer un nouvel Administrateur</h2>
                            <button onClick={() => setShowModal(false)} style={styles.closeBtn}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateAdmin} style={styles.form}>
                            <div style={styles.row}>
                                <div style={styles.inputGroup}>
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Jean"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Email professionnel</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@inviksa.com"
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label>Mot de passe provisoire</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    minLength="8"
                                />
                                <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px' }}>
                                    L'admin pourra le changer lors de sa première connexion.
                                </small>
                            </div>
                            <div style={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="superAdmin"
                                    checked={formData.isSuperAdmin}
                                    onChange={e => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                                />
                                <label htmlFor="superAdmin">Définir comme Super Administrateur</label>
                            </div>

                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Annuler</button>
                                <button type="submit" style={styles.submitBtn}>Créer le compte</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: '800', margin: 0 },
    subtitle: { color: '#64748b', margin: '0.25rem 0 0 0' },
    addBtn: {
        background: 'var(--gradient-primary)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0, 51, 102, 0.2)'
    },
    alert: { padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: '500' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
    card: {
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative' },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '15px',
        background: '#003366',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: '800'
    },
    info: { display: 'flex', flexDirection: 'column' },
    name: { margin: 0, fontSize: '1.1rem', color: '#1e293b' },
    email: { fontSize: '0.85rem', color: '#64748b' },
    superBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '0.65rem',
        fontWeight: '800',
        padding: '4px 8px',
        borderRadius: '50px',
        background: '#e0f2fe',
        color: '#0369a1'
    },
    cardFooter: {
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#64748b'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        background: 'white',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    checkboxGroup: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px' },
    modalActions: { display: 'flex', gap: '1rem', marginTop: '1rem' },
    cancelBtn: { flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' },
    submitBtn: { flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: '#003366', color: 'white', fontWeight: '600', cursor: 'pointer' },
    deleteBtn: {
        background: 'none',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto'
    },
    errorContainer: { textAlign: 'center', padding: '5rem', color: '#64748b' },
    loading: { textAlign: 'center', padding: '3rem', color: '#64748b' }
};

export default ManageAdmins;
