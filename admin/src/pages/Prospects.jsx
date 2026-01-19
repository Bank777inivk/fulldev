import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const Prospects = () => {
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedProspect, setSelectedProspect] = useState(null);

    useEffect(() => {
        const unsubscribe = adminService.subscribeToLeads((data) => {
            setProspects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getScoreColor = (score) => {
        switch (score) {
            case 'GREEN': return '#10b981';
            case 'YELLOW': return '#f59e0b';
            case 'RED': return '#ef4444';
            default: return '#64748b';
        }
    };

    const filteredProspects = prospects.filter(p => {
        const matchesSearch =
            p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const styles = {
        container: { padding: '2rem' },
        header: { marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        title: { fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' },
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
        statCard: { background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' },
        statLabel: { fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' },
        statValue: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' },
        controls: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
        search: { flex: 1, minWidth: '300px', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' },
        select: { padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white' },
        tableCard: { background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' },
        table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
        th: { padding: '1.2rem 1.5rem', background: '#f8fafc', color: 'var(--text-light)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' },
        td: { padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },
        badge: { padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' },
        scoreDot: { width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' },
        viewBtn: { padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' },
        modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' },
        modalContent: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', boxShadow: 'var(--shadow-2xl)' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
        label: { display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
        value: { display: 'block', fontSize: '1rem', color: 'var(--primary)', fontWeight: '600' },
        sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.2rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)' }
    };

    if (loading) return <div style={styles.container}>Chargement...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Gestion des Prospects</h1>
                    <p style={{ color: 'var(--text-light)' }}>Suivi des demandes de crédit public</p>
                </div>
            </div>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Total Prospects</div>
                    <div style={styles.statValue}>{prospects.length}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Éligibilité Haute</div>
                    <div style={{ ...styles.statValue, color: '#10b981' }}>{prospects.filter(p => p.score === 'GREEN').length}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Nouveaux aujourd'hui</div>
                    <div style={{ ...styles.statValue, color: 'var(--secondary)' }}>
                        {prospects.filter(p => p.createdAt?.toDate().toDateString() === new Date().toDateString()).length}
                    </div>
                </div>
            </div>

            <div style={styles.controls}>
                <input
                    style={styles.search}
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    style={styles.select}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Tous les statuts</option>
                    <option value="new">Nouveau</option>
                    <option value="contacted">Contacté</option>
                    <option value="closed">Clôturé</option>
                </select>
            </div>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Prospect</th>
                            <th style={styles.th}>Montant & Objet</th>
                            <th style={styles.th}>Éligibilité</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProspects.map(p => (
                            <tr key={p.id}>
                                <td style={styles.td}>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{p.nom} {p.prenom}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.email}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.telephone}</div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>{p.montant?.toLocaleString()} {p.devise || 'EUR'}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.objet}</div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ ...styles.scoreDot, backgroundColor: getScoreColor(p.score) }}></span>
                                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.score}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ fontSize: '0.9rem' }}>{p.createdAt?.toDate().toLocaleDateString('fr-FR')}</div>
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.viewBtn} onClick={() => setSelectedProspect(p)}>Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedProspect && (
                <div style={styles.modal} onClick={() => setSelectedProspect(null)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>Détails du Prospect</h2>
                            <button
                                onClick={() => setSelectedProspect(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={styles.sectionTitle}>Identité & Contact</h3>
                            <div style={styles.grid}>
                                <div>
                                    <span style={styles.label}>Nom Complet</span>
                                    <span style={styles.value}>{selectedProspect.civilite} {selectedProspect.nom} {selectedProspect.prenom}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Email</span>
                                    <span style={styles.value}>{selectedProspect.email}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Téléphone</span>
                                    <span style={styles.value}>{selectedProspect.telephone}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Date de naissance</span>
                                    <span style={styles.value}>{selectedProspect.dateNaissance}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={styles.sectionTitle}>Demande de Crédit</h3>
                            <div style={styles.grid}>
                                <div>
                                    <span style={styles.label}>Montant demandé</span>
                                    <span style={{ ...styles.value, color: 'var(--secondary)', fontSize: '1.2rem' }}>{selectedProspect.montant?.toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Durée</span>
                                    <span style={styles.value}>{selectedProspect.duree} mois</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Objet</span>
                                    <span style={styles.value}>{selectedProspect.objet}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Type de crédit</span>
                                    <span style={styles.value}>{selectedProspect.typeCredit}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={styles.sectionTitle}>Situation Financière</h3>
                            <div style={styles.grid}>
                                <div>
                                    <span style={styles.label}>Revenus mensuels</span>
                                    <span style={styles.value}>{selectedProspect.revenusMensuels?.toLocaleString()} {selectedProspect.devise || 'EUR'}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Statut professionnel</span>
                                    <span style={styles.value}>{selectedProspect.statutPro}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Incident bancaire</span>
                                    <span style={{ ...styles.value, color: selectedProspect.incidentBancaire === 'oui' ? 'red' : 'green' }}>{selectedProspect.incidentBancaire?.toUpperCase()}</span>
                                </div>
                                <div>
                                    <span style={styles.label}>Banque actuelle</span>
                                    <span style={styles.value}>{selectedProspect.banqueActuelle}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button
                                style={{ ...styles.viewBtn, background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem 2.5rem' }}
                                onClick={() => setSelectedProspect(null)}
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prospects;
