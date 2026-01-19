import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../services/adminService';

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 4;
    const chatEndRef = useRef(null);

    useEffect(() => {
        const unsubscribe = adminService.subscribeToSupportTickets((data) => {
            setTickets(data);
            setLoading(false);
        });

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
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
        container: {
            padding: isMobile ? '0' : '2rem',
            height: isMobile ? 'calc(100dvh - 64px)' : 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            background: isMobile ? 'white' : 'transparent',
            overflow: 'hidden',
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '64px' : 'auto',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 80
        },
        header: {
            marginBottom: isMobile ? '0' : '2rem',
            padding: isMobile ? '1rem' : '0',
            display: isMobile ? 'none' : 'block'
        },
        title: { fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', color: 'var(--primary)', margin: 0 },

        content: { display: 'flex', gap: isMobile ? '0' : '2rem', flex: 1, overflow: 'hidden', height: '100%' },

        // List Sidebar
        listSide: {
            flex: 1,
            display: (isMobile && selectedTicket) ? 'none' : 'flex',
            flexDirection: 'column',
            background: 'white',
            borderRadius: isMobile ? '0' : '24px',
            border: isMobile ? 'none' : '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
        },
        listHeader: { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' },
        listScroll: { flex: 1, overflowY: 'auto' },

        ticketItem: {
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        activeTicket: { background: '#eff6ff', borderLeft: '4px solid var(--secondary)' },

        // Chat Area
        chatSide: {
            flex: 2,
            display: (isMobile && !selectedTicket) ? 'none' : 'flex',
            flexDirection: 'column',
            background: 'white',
            borderRadius: isMobile ? '0' : '24px',
            border: isMobile ? 'none' : '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
        },

        statusBadge: {
            padding: '4px 10px',
            borderRadius: '50px',
            fontSize: '0.65rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },

        chatHeader: {
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'white',
            zIndex: 10
        },
        backBtn: {
            display: isMobile ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: '#f1f5f9',
            color: 'var(--primary)',
            fontSize: '1.2rem'
        },

        messagesArea: {
            flex: 1,
            padding: isMobile ? '1rem' : '1.5rem',
            paddingBottom: isMobile ? '2rem' : '1.5rem', // Extra space for a smooth feel
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: '#f8fafc',
            WebkitOverflowScrolling: 'touch'
        },

        messageRow: { display: 'flex', flexDirection: 'column', maxWidth: '80%' },
        adminRow: { alignSelf: 'flex-end', alignItems: 'flex-end' },
        userRow: { alignSelf: 'flex-start', alignItems: 'flex-start' },

        bubble: {
            padding: '1rem 1.25rem',
            borderRadius: '20px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        },
        adminBubble: { background: 'var(--primary)', color: 'white', borderRadius: '20px 20px 4px 20px' },
        userBubble: { background: 'white', border: '1px solid var(--border)', borderRadius: '20px 20px 20px 4px', color: 'var(--primary)' },

        msgInfo: { fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontWeight: 'bold' },

        inputArea: {
            padding: isMobile ? '0.75rem 1rem' : '1.25rem 1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.75rem',
            background: 'white',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            padding: '0.8rem 1.25rem',
            borderRadius: '25px',
            border: '1px solid var(--border)',
            outline: 'none',
            fontSize: '0.95rem',
            background: '#f8fafc'
        },
        sendBtn: {
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'var(--secondary)',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.1rem'
        },

        emptyView: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '2rem',
            color: '#cbd5e1'
        },
        paginationBtn: {
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem'
        }
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Connexion au support...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Support & Messagerie</h1>
                {!isMobile && <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>Gérez les tickets d'assistance en temps réel.</p>}
            </header>

            <div style={styles.content}>
                {/* LISTE DES TICKETS */}
                <div style={styles.listSide}>
                    <div style={styles.listHeader}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Tickets Actifs ({tickets.length})
                        </h3>
                    </div>
                    <div style={styles.listScroll}>
                        {tickets.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                                <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.2 }}></i>
                                <p style={{ fontSize: '0.85rem' }}>Aucun ticket pour le moment.</p>
                            </div>
                        ) : (
                            <>
                                {tickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map(t => (
                                    <div
                                        key={t.id}
                                        style={{ ...styles.ticketItem, ...(selectedTicket?.id === t.id ? styles.activeTicket : {}) }}
                                        onClick={() => setSelectedTicket(t)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                background: t.status === 'open' ? '#eff6ff' : '#ecfdf5',
                                                color: t.status === 'open' ? '#1d4ed8' : '#10b981'
                                            }}>
                                                {t.status === 'open' ? 'En cours' : 'Résolu'}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>
                                                {t.createdAt?.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>{t.subject}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Client #{t.userId.substring(0, 8)}</div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {tickets.length > ticketsPerPage && (
                        <div style={{
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            borderTop: '1px solid var(--border)',
                            background: '#f8fafc'
                        }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => {
                                    setCurrentPage(prev => prev - 1);
                                    document.querySelector('.no-scrollbar').scrollTop = 0;
                                }}
                                style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {currentPage} / {Math.ceil(tickets.length / ticketsPerPage)}
                            </span>
                            <button
                                disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)}
                                onClick={() => {
                                    setCurrentPage(prev => prev + 1);
                                    document.querySelector('.no-scrollbar').scrollTop = 0;
                                }}
                                style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(tickets.length / ticketsPerPage) ? 0.4 : 1 }}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* ZONE DE CHAT */}
                <div style={styles.chatSide}>
                    {selectedTicket ? (
                        <>
                            <div style={styles.chatHeader}>
                                <button style={styles.backBtn} onClick={() => setSelectedTicket(null)}>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem', fontWeight: '900' }}>{selectedTicket.subject}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Conversation avec le client</span>
                                </div>
                                {!isMobile && (
                                    <button
                                        onClick={() => handleUpdateStatus(selectedTicket.id, selectedTicket.status === 'open' ? 'resolved' : 'open')}
                                        style={{
                                            padding: '0.6rem 1.25rem',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: selectedTicket.status === 'open' ? '#fee2e2' : '#f1f5f9',
                                            color: selectedTicket.status === 'open' ? '#ef4444' : '#475569',
                                            fontWeight: '800',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {selectedTicket.status === 'open' ? 'CLÔTURER' : 'RÉOUVRIR'}
                                    </button>
                                )}
                            </div>

                            <div style={styles.messagesArea}>
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        Démarrage sécurisé de la discussion...
                                    </div>
                                ) : (
                                    messages.map(m => (
                                        <div key={m.id} style={{ ...styles.messageRow, ...(m.sender === 'admin' ? styles.adminRow : styles.userRow) }}>
                                            <div style={{ ...styles.bubble, ...(m.sender === 'admin' ? styles.adminBubble : styles.userBubble) }}>
                                                {m.text}
                                            </div>
                                            <div style={styles.msgInfo}>
                                                {m.senderName} • {m.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {selectedTicket.status === 'open' ? (
                                <form style={styles.inputArea} onSubmit={handleSendMessage}>
                                    <input
                                        style={styles.input}
                                        placeholder="Taper votre message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" style={styles.sendBtn} disabled={!newMessage.trim()}>
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </form>
                            ) : (
                                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', fontSize: '0.85rem', fontWeight: '600' }}>
                                    Ticket clôturé. Déverrouillez pour répondre.
                                    {isMobile && (
                                        <button
                                            onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                                            style={{ display: 'block', margin: '10px auto', background: 'var(--secondary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}
                                        >
                                            Réouvrir maintenant
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={styles.emptyView}>
                            <div style={{ background: '#f1f5f9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <i className="fas fa-comments" style={{ fontSize: '2rem', color: '#cbd5e1' }}></i>
                            </div>
                            <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0', fontWeight: '900' }}>Support Client</h3>
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '300px' }}>Sélectionnez un ticket à gauche pour voir la conversation et répondre au client.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;
