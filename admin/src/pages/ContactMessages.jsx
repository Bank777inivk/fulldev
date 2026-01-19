import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        const unsubscribe = adminService.subscribeToContactMessages((data) => {
            setMessages(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const styles = {
        container: { padding: '2rem' },
        header: { marginBottom: '2rem' },
        title: { fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
        messageCard: { background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.3s' },
        cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
        subject: { fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem' },
        sender: { color: 'var(--text-light)', fontSize: '0.9rem' },
        date: { color: 'var(--text-light)', fontSize: '0.8rem' },
        preview: { color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
        modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' },
        modalContent: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '700px', padding: '2.5rem', boxShadow: 'var(--shadow-2xl)' },
        label: { fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }
    };

    if (loading) return <div style={styles.container}>Chargement...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Messages de Contact</h1>
                <p style={{ color: 'var(--text-light)' }}>Gestion des formulaires de contact public</p>
            </div>

            <div style={styles.grid}>
                {messages.map(m => (
                    <div
                        key={m.id}
                        style={styles.messageCard}
                        onClick={() => setSelectedMessage(m)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={styles.cardHeader}>
                            <span style={styles.date}>{m.createdAt?.toDate()?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            {m.status === 'new' && <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.8rem' }}>NOUVEAU</span>}
                        </div>
                        <h3 style={styles.subject}>{m.subject || 'Demande de contact'}</h3>
                        <div style={styles.sender}>{m.name} ({m.email})</div>
                        <p style={styles.preview}>{m.message}</p>
                    </div>
                ))}
            </div>

            {selectedMessage && (
                <div style={styles.modal} onClick={() => setSelectedMessage(null)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            {selectedMessage.subject || 'Détails du message'}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <span style={styles.label}>Expéditeur</span>
                                <div style={{ fontWeight: '600' }}>{selectedMessage.name}</div>
                            </div>
                            <div>
                                <span style={styles.label}>Email</span>
                                <div style={{ fontWeight: '600' }}>{selectedMessage.email}</div>
                            </div>
                            <div>
                                <span style={styles.label}>Téléphone</span>
                                <div style={{ fontWeight: '600' }}>{selectedMessage.phone || 'Non renseigné'}</div>
                            </div>
                            <div>
                                <span style={styles.label}>Mode préféré</span>
                                <div style={{ fontWeight: '600' }}>{selectedMessage.contactMode || 'Email'}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <span style={styles.label}>Message</span>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', lineHeight: '1.6', color: 'var(--text-main)' }}>
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button
                                style={{ padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                                onClick={() => setSelectedMessage(null)}
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

export default ContactMessages;
