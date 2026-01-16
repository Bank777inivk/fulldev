import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { supportService } from '../../services/supportService';

const Support = () => {
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '', category: 'technical' });

    useEffect(() => {
        const fetchTickets = async () => {
            if (currentUser) {
                try {
                    const data = await supportService.getUserTickets(currentUser.uid);
                    setTickets(data);
                } catch (err) { console.error(err); } finally { setLoading(false); }
            }
        };
        fetchTickets();
    }, [currentUser]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await supportService.createTicket(currentUser.uid, formData);
            setShowForm(false);
            setFormData({ subject: '', message: '', category: 'technical' });
            // Refresh tickets
            const data = await supportService.getUserTickets(currentUser.uid);
            setTickets(data);
            showToast("Ticket créé avec succès", "success");
        } catch (err) {
            showToast("Erreur lors de l'envoi", "error");
        }
    };

    if (isMobile) {
        return (
            <div style={{ padding: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>Espace Support</h1>

                <div style={styles.mobileQuickActions}>
                    <div style={styles.actionCard}><i className="fas fa-phone-alt"></i><span>Appeler</span></div>
                    <div style={styles.actionCard}><i className="fas fa-comments"></i><span>Chat</span></div>
                    <div style={styles.actionCard} onClick={() => setShowForm(!showForm)}><i className="fas fa-paper-plane"></i><span>Ticket</span></div>
                </div>

                {showForm && (
                    <div style={styles.mobileForm}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nouveau ticket</h3>
                        <input style={styles.mobileInput} placeholder="Sujet" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                        <textarea style={{ ...styles.mobileInput, height: '100px' }} placeholder="Votre message..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                        <button style={styles.mobileSubmitBtn} onClick={handleSubmit}>Envoyer le message</button>
                    </div>
                )}

                <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Mes discussions</h3>
                {tickets.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#888' }}>Aucun ticket ouvert.</p>
                ) : (
                    <div style={styles.mobileTicketList}>
                        {tickets.map(t => (
                            <div key={t.id} style={styles.mobileTicketItem}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t.subject}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{t.category}</div>
                                </div>
                                <span style={{ ...styles.statusBadge, background: t.status === 'open' ? '#e1f5fe' : '#e8f5e9', color: t.status === 'open' ? '#0288d1' : '#2e7d32' }}>
                                    {t.status === 'open' ? 'En cours' : 'Résolu'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Assistance & Support</h1>
                <p style={styles.subtitle}>Nous sommes là pour vous aider 24h/24 et 7j/7.</p>
            </header>

            <div style={styles.grid}>
                <div style={styles.faqSection}>
                    <h2 style={{ color: '#003366', marginBottom: '1.5rem' }}>FAQ & Aide rapide</h2>
                    <div style={styles.faqCard}>
                        {['Virements non reçus', 'Plafonds de carte', 'Sécuriser mon compte', 'Frais bancaires'].map(q => (
                            <div key={q} style={styles.faqItem}>
                                <span>{q}</span>
                                <i className="fas fa-chevron-right"></i>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.ticketSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: '#003366' }}>Mes demandes</h2>
                        <button style={styles.newBtn} onClick={() => setShowForm(!showForm)}>Nouveau ticket</button>
                    </div>

                    {showForm && (
                        <div style={styles.formCard}>
                            <select style={styles.select} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="technical">Problème technique</option>
                                <option value="billing">Question sur les frais</option>
                                <option value="cards">Gestion des cartes</option>
                                <option value="other">Autre</option>
                            </select>
                            <input style={styles.input} placeholder="Sujet de votre demande" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                            <textarea style={styles.textarea} placeholder="Détaillez votre demande ici..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={styles.submitBtn} onClick={handleSubmit}>Envoyer</button>
                                <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Annuler</button>
                            </div>
                        </div>
                    )}

                    <div style={styles.ticketList}>
                        {tickets.map(t => (
                            <div key={t.id} style={styles.ticketItem}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{t.subject}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Ouvert le {t.createdAt?.toDate().toLocaleDateString()}</div>
                                </div>
                                <span style={{ ...styles.statusBadge, background: t.status === 'open' ? '#e1f5fe' : '#e8f5e9', color: t.status === 'open' ? '#0288d1' : '#2e7d32' }}>
                                    {t.status === 'open' ? 'En cours' : 'Traité'}
                                </span>
                            </div>
                        ))}
                        {tickets.length === 0 && !showForm && <div style={styles.empty}>Vous n'avez aucun ticket actif.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' },

    faqSection: { background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eee' },
    faqCard: { display: 'flex', flexDirection: 'column', gap: '10px' },
    faqItem: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '12px', background: '#f8fbff', cursor: 'pointer', transition: '0.2s' },

    ticketSection: { background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eee' },
    newBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#003366', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    formCard: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' },
    textarea: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' },
    submitBtn: { padding: '10px 20px', background: '#003366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
    cancelBtn: { padding: '10px 20px', background: 'transparent', border: 'none', color: '#666' },

    ticketList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    ticketItem: { display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f5f5f5' },
    statusBadge: { padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' },
    empty: { textAlign: 'center', padding: '2rem', color: '#888', fontStyle: 'italic' },

    // MOBILE
    mobileQuickActions: { display: 'flex', gap: '10px', marginBottom: '1.5rem' },
    actionCard: { flex: 1, background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#003366', fontWeight: 'bold' },
    mobileForm: { background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee' },
    mobileInput: { width: '100%', padding: '12px', marginBottom: '10px', background: '#f7f9fc', border: '1px solid #eee', borderRadius: '10px', boxSizing: 'border-box' },
    mobileSubmitBtn: { width: '100%', padding: '14px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
    mobileTicketList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mobileTicketItem: { background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
};

export default Support;
