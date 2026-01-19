import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../services/adminService';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        const unsubscribe = adminService.subscribeToSupportTickets((data) => {
            setTickets(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            const unsubMessages = adminService.subscribeToTicketMessages(selectedTicket.id, (data) => {
                setMessages(data);
            });
            return () => unsubMessages();
        }
    }, [selectedTicket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            await adminService.addSupportMessage(selectedTicket.id, {
                text: newMessage,
                sender: 'admin',
                senderName: 'Support INVIK'
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminService.updateSupportTicketStatus(id, status);
            if (selectedTicket && selectedTicket.id === id) {
                setSelectedTicket({ ...selectedTicket, status });
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    const styles = {
        container: { padding: '2rem', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' },
        header: { marginBottom: '2rem' },
        title: { fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' },
        content: { display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' },
        list: { flex: 1, background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflowY: 'auto', boxShadow: 'var(--shadow-sm)' },
        chat: { flex: 1.5, background: 'white', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)', overflow: 'hidden' },
        ticketItem: { padding: '1.2rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' },
        activeTicket: { background: 'rgba(0, 204, 255, 0.05)', borderLeft: '4px solid var(--secondary)' },
        statusBadge: { padding: '0.3rem 0.6rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '700' },
        chatHeader: { padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        messagesArea: { flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' },
        message: { maxWidth: '80%', padding: '1rem', borderRadius: '16px', fontSize: '0.95rem', lineHeight: '1.4' },
        adminMsg: { alignSelf: 'flex-end', background: 'var(--primary)', color: 'white', borderRadius: '16px 16px 4px 16px' },
        userMsg: { alignSelf: 'flex-start', background: 'white', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px' },
        inputArea: { padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' },
        input: { flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' },
        sendBtn: { background: 'var(--secondary)', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }
    };

    if (loading) return <div style={styles.container}>Chargement...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Tickets de Support</h1>
                <p style={{ color: 'var(--text-light)' }}>Gestion de l'assistance client</p>
            </div>

            <div style={styles.content}>
                <div style={styles.list} className="no-scrollbar">
                    {tickets.map(t => (
                        <div
                            key={t.id}
                            style={{ ...styles.ticketItem, ...(selectedTicket?.id === t.id ? styles.activeTicket : {}) }}
                            onClick={() => setSelectedTicket(t)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ ...styles.statusBadge, background: t.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#ecfdf5', color: t.status === 'open' ? 'var(--secondary)' : '#10b981' }}>
                                    {t.status === 'open' ? 'EN COURS' : 'RÉSOLU'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{t.createdAt?.toDate().toLocaleDateString()}</span>
                            </div>
                            <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.2rem' }}>{t.subject}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>ID: {t.userId}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.chat}>
                    {selectedTicket ? (
                        <>
                            <div style={styles.chatHeader}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>{selectedTicket.subject}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Client: {selectedTicket.userId}</span>
                                </div>
                                <button
                                    onClick={() => handleUpdateStatus(selectedTicket.id, selectedTicket.status === 'open' ? 'resolved' : 'open')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: selectedTicket.status === 'open' ? 'var(--secondary)' : 'var(--text-light)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {selectedTicket.status === 'open' ? 'Marquer comme résolu' : 'Réouvrir ticket'}
                                </button>
                            </div>

                            <div style={styles.messagesArea} className="no-scrollbar">
                                {messages.map(m => (
                                    <div key={m.id} style={{ ...styles.message, ...(m.sender === 'admin' ? styles.adminMsg : styles.userMsg) }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.3rem', fontWeight: 'bold' }}>
                                            {m.senderName} • {m.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {m.text}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form style={styles.inputArea} onSubmit={handleSendMessage}>
                                <input
                                    style={styles.input}
                                    placeholder="Écrivez votre réponse..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" style={styles.sendBtn}>Répondre</button>
                            </form>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
                            Sélectionnez un ticket pour commencer la discussion
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
