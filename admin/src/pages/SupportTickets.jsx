import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const unsubscribe = adminService.subscribeToSupportTickets((data) => {
            setTickets(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const styles = {
        container: { padding: '2rem' },
        header: { marginBottom: '2rem' },
        title: { fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' },
        tableCard: { background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: { padding: '1.2rem', background: '#f8fafc', color: 'var(--text-light)', textAlign: 'left', fontWeight: '600', fontSize: '0.85rem' },
        td: { padding: '1.2rem', borderBottom: '1px solid var(--border)' },
        statusBadge: { padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' },
        viewBtn: { padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }
    };

    if (loading) return <div style={styles.container}>Chargement...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Tickets de Support</h1>
                <p style={{ color: 'var(--text-light)' }}>Assistance client en temps réel</p>
            </div>

            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Sujet</th>
                            <th style={styles.th}>Utilisateur</th>
                            <th style={styles.th}>Catégorie</th>
                            <th style={styles.th}>Statut</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id}>
                                <td style={styles.td}><strong>{t.subject}</strong></td>
                                <td style={styles.td}>{t.userId}</td>
                                <td style={styles.td}>{t.category}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: t.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: t.status === 'open' ? 'var(--secondary)' : '#10b981'
                                    }}>
                                        {t.status === 'open' ? 'EN COURS' : 'RÉSOLU'}
                                    </span>
                                </td>
                                <td style={styles.td}>{t.createdAt?.toDate().toLocaleDateString('fr-FR')}</td>
                                <td style={styles.td}>
                                    <button style={styles.viewBtn}>Gérer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupportTickets;
