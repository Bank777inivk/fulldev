import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { beneficiaryService } from '../../services/beneficiaryService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const Beneficiaries = () => {
    const { currentUser } = useAuth();
    const { beneficiaries, loading } = useData();
    const { showToast, confirm: showConfirm } = useNotifications();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form States
    const [name, setName] = useState('');
    const [iban, setIban] = useState('');
    const [submitting, setSubmitting] = useState(false);


    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await beneficiaryService.addBeneficiary(currentUser.uid, { name, iban });
            setName('');
            setIban('');
            showToast("Bénéficiaire ajouté avec succès", "success");
        } catch (err) {
            showToast("Erreur lors de l'ajout", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showConfirm('Voulez-vous vraiment supprimer ce bénéficiaire ?');
        if (confirmed) {
            try {
                await beneficiaryService.deleteBeneficiary(currentUser.uid, id);
                showToast("Bénéficiaire supprimé", "info");
            } catch (err) {
                showToast("Erreur lors de la suppression", "error");
            }
        }
    };

    const filteredBeneficiaries = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.iban.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && beneficiaries.length === 0) return <div style={styles.loading}>Chargement...</div>;

    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <div style={styles.headerText}>
                        <h1 style={styles.title}>Mes Bénéficiaires</h1>
                        <p style={styles.subtitle}>Gérez vos contacts et effectuez des virements en quelques clics.</p>
                    </div>
                    <button
                        style={{ ...styles.addBtn, background: showForm ? '#f1f5f9' : '#003366', color: showForm ? '#64748b' : 'white' }}
                        onClick={() => setShowForm(!showForm)}
                    >
                        <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
                        <span>{showForm ? 'Annuler' : 'Nouveau Bénéficiaire'}</span>
                    </button>
                </header>

                {showForm && (
                    <div style={styles.formContainer} className="fadeIn">
                        <form onSubmit={handleAdd} style={styles.form}>
                            <h3 style={styles.formTitle}>Ajouter un nouveau bénéficiaire</h3>
                            <div style={styles.inputGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nom complet / Société</label>
                                    <input
                                        style={styles.input}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Ex: Jean Dupont"
                                        required
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>IBAN</label>
                                    <input
                                        style={styles.input}
                                        value={iban}
                                        onChange={e => setIban(e.target.value)}
                                        placeholder="FR76 ..."
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" style={styles.submitBtn} disabled={submitting}>
                                {submitting ? <i className="fas fa-spinner fa-spin"></i> : 'Confirmer l\'ajout'}
                            </button>
                        </form>
                    </div>
                )}

                <div style={styles.searchBarContainer}>
                    <div style={styles.searchBar}>
                        <i className="fas fa-search" style={styles.searchIcon}></i>
                        <input
                            style={styles.searchInput}
                            placeholder="Rechercher par nom ou IBAN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div style={styles.grid}>
                    {filteredBeneficiaries.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}><i className="fas fa-user-friends"></i></div>
                            <p style={{ margin: 0, fontWeight: '600' }}>Aucun bénéficiaire trouvé</p>
                            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Essayez de modifier votre recherche ou d'en ajouter un nouveau.</span>
                        </div>
                    ) : (
                        filteredBeneficiaries.map(b => (
                            <div key={b.id} style={styles.card} className="beneficiary-card">
                                <div style={styles.cardHeader}>
                                    <div style={styles.avatar}>
                                        {b.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={styles.cardActions}>
                                        <button style={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.cardContent}>
                                    <h3 style={styles.cardName}>{b.name}</h3>
                                    <div style={styles.ibanBadge}>
                                        <i className="fas fa-university" style={{ fontSize: '0.7rem' }}></i>
                                        <span style={styles.cardIban}>{b.iban.substring(0, 4)} •••• {b.iban.slice(-4)}</span>
                                    </div>
                                </div>
                                <div style={styles.cardFooter}>
                                    <button style={styles.virementQuickLink} onClick={() => showToast('Virement vers ' + b.name, 'info')}>
                                        Envoyer de l'argent <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .beneficiary-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .beneficiary-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }
                .fadeIn { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </KycVerificationBanner>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
    loading: { textAlign: 'center', padding: '10rem', color: '#003366', fontSize: '1.2rem', fontWeight: '600' },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '20px'
    },
    headerText: { textAlign: 'left' },
    title: { fontSize: '2.5rem', color: '#001a41', fontWeight: '900', margin: 0, letterSpacing: '-1px' },
    subtitle: { color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' },

    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 24px',
        borderRadius: '16px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '700',
        boxShadow: '0 10px 20px rgba(0, 51, 102, 0.15)',
        transition: 'all 0.2s'
    },

    formContainer: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '3rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9'
    },
    formTitle: { margin: '0 0 2rem 0', color: '#001a41', fontSize: '1.25rem', fontWeight: '800' },
    inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { padding: '15px', borderRadius: '12px', border: '1.5px solid #f1f5f9', fontSize: '1rem', outline: 'none', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' },
    submitBtn: { padding: '16px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' },

    searchBarContainer: { marginBottom: '2.5rem' },
    searchBar: { position: 'relative', maxWidth: '500px' },
    searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    searchInput: { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },

    card: {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%)',
        color: '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: '900',
        border: '1px solid #e2e8f0'
    },
    cardActions: { display: 'flex', gap: '10px' },
    deleteBtn: { background: '#fff1f2', border: 'none', color: '#f43f5e', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },

    cardContent: { textAlign: 'left' },
    cardName: { margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' },
    ibanBadge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' },
    cardIban: { fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace', paddingTop: '2px' },

    cardFooter: { borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' },
    virementQuickLink: { width: '100%', background: 'transparent', border: 'none', color: '#6366f1', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'gap 0.2s' },

    emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', backgroundColor: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' },
    emptyIcon: { fontSize: '4rem', color: '#cbd5e1', marginBottom: '1.5rem' }
};

export default Beneficiaries;
