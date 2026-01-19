import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 4;

    useEffect(() => {
        const unsubscribe = adminService.subscribeToContactMessages((data) => {
            setMessages(data);
            setLoading(false);
        });

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminService.updateContactMessageStatus(id, status);
            if (selectedMessage && selectedMessage.id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    };

    const styles = {
        container: {
            padding: isMobile ? '0' : '2rem',
            height: isMobile ? 'calc(100dvh - 64px)' : 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
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
            padding: isMobile ? '1.5rem' : '0',
            display: isMobile ? 'none' : 'block'
        },
        title: { fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: '900', color: 'var(--primary)', margin: 0 },

        content: { display: 'flex', gap: isMobile ? '0' : '2rem', flex: 1, overflow: 'hidden', height: '100%' },

        // List Pane
        listSide: {
            flex: 1,
            display: (isMobile && selectedMessage) ? 'none' : 'flex',
            flexDirection: 'column',
            background: 'white',
            borderRadius: isMobile ? '0' : '24px',
            border: isMobile ? 'none' : '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
        },
        listHeader: { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' },
        listScroll: { flex: 1, overflowY: 'auto' },

        messageItem: {
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'white',
            position: 'relative'
        },
        unreadItem: { borderLeft: '4px solid var(--secondary)', background: '#f0f9ff' },
        activeItem: { background: '#f1f5f9' },

        // Detail Pane
        detailSide: {
            flex: 1.5,
            display: (isMobile && !selectedMessage) ? 'none' : 'flex',
            flexDirection: 'column',
            background: 'white',
            borderRadius: isMobile ? '0' : '24px',
            border: isMobile ? 'none' : '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
        },

        detailHeader: {
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'white'
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
            color: 'var(--primary)'
        },

        msgContent: {
            flex: 1,
            padding: isMobile ? '1.5rem' : '2.5rem',
            overflowY: 'auto',
            background: 'white',
            WebkitOverflowScrolling: 'touch'
        },
        subject: { fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '1.5rem', lineHeight: '1.2' },
        senderInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingBottom: '2rem',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '2rem'
        },
        avatar: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.1rem'
        },

        textBody: {
            fontSize: '1.05rem',
            lineHeight: '1.7',
            color: '#334155',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
        },

        infoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem',
            padding: '1.5rem',
            background: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid var(--border)'
        },
        infoLabel: { fontSize: '0.7rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' },
        infoValue: { fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' },

        readBtn: {
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--secondary)',
            color: 'white',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Récupération des messages...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Inbox Messages</h1>
                {!isMobile && <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>Consultez et répondez aux demandes du formulaire de contact.</p>}
            </header>

            <div style={styles.content}>
                {/* LISTE DES MESSAGES */}
                <div style={styles.listSide}>
                    <div style={styles.listHeader}>
                        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Messages reçus ({messages.length})
                        </h3>
                    </div>
                    <div style={styles.listScroll}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                                <i className="fas fa-paper-plane" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.1 }}></i>
                                <p style={{ fontWeight: '600' }}>Aucun message à afficher.</p>
                            </div>
                        ) : (
                            <>
                                {messages.slice((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage).map(m => (
                                    <div
                                        key={m.id}
                                        style={{
                                            ...styles.messageItem,
                                            ...(m.status === 'new' ? styles.unreadItem : {}),
                                            ...(selectedMessage?.id === m.id ? styles.activeItem : {})
                                        }}
                                        onClick={() => setSelectedMessage(m)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                                                {m.name}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>
                                                {m.createdAt?.toDate()?.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: m.status === 'new' ? 'var(--secondary)' : '#64748b', marginBottom: '4px' }}>
                                            {m.subject || 'Demande de contact'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                            {m.message}
                                        </div>
                                        {m.status === 'new' && (
                                            <div style={{ position: 'absolute', right: '1.5rem', bottom: '1.25rem', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }}></div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {messages.length > messagesPerPage && (
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
                                {currentPage} / {Math.ceil(messages.length / messagesPerPage)}
                            </span>
                            <button
                                disabled={currentPage >= Math.ceil(messages.length / messagesPerPage)}
                                onClick={() => {
                                    setCurrentPage(prev => prev + 1);
                                    document.querySelector('.no-scrollbar').scrollTop = 0;
                                }}
                                style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(messages.length / messagesPerPage) ? 0.4 : 1 }}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* DETAIL DU MESSAGE */}
                <div style={styles.detailSide}>
                    {selectedMessage ? (
                        <>
                            <div style={styles.detailHeader}>
                                <button style={styles.backBtn} onClick={() => setSelectedMessage(null)}>
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>Détails de l'expéditeur</h4>
                                </div>
                                {selectedMessage.status === 'new' && (
                                    <button
                                        style={styles.readBtn}
                                        onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                                    >
                                        <i className="fas fa-check"></i> Marquer lu
                                    </button>
                                )}
                            </div>

                            <div style={styles.msgContent}>
                                <h1 style={styles.subject}>{selectedMessage.subject || 'Formulaire de Contact'}</h1>

                                <div style={styles.senderInfo}>
                                    <div style={styles.avatar}>
                                        {selectedMessage.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>{selectedMessage.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                                            Envoyé le {selectedMessage.createdAt?.toDate()?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.textBody}>
                                    {selectedMessage.message}
                                </div>

                                <div style={styles.infoGrid}>
                                    <div>
                                        <span style={styles.infoLabel}>Email</span>
                                        <span style={styles.infoValue}>{selectedMessage.email}</span>
                                    </div>
                                    <div>
                                        <span style={styles.infoLabel}>Téléphone</span>
                                        <span style={styles.infoValue}>{selectedMessage.phone || 'Non renseigné'}</span>
                                    </div>
                                    <div>
                                        <span style={styles.infoLabel}>Mode de contact</span>
                                        <span style={styles.infoValue}>{selectedMessage.contactMode || 'Email'}</span>
                                    </div>
                                    <div>
                                        <span style={styles.infoLabel}>Statut</span>
                                        <span style={{ ...styles.infoValue, color: selectedMessage.status === 'new' ? 'var(--secondary)' : 'var(--text-light)' }}>
                                            {selectedMessage.status === 'new' ? 'NOUVEAU' : 'TRAITÉ'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Votre demande Bank'}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '1rem 2rem',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '16px',
                                            fontWeight: '900',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <i className="fas fa-reply"></i> RÉPONDRE PAR EMAIL
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1', padding: '3rem' }}>
                            <div style={{ background: '#f8fafc', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                                <i className="fas fa-envelope-open-text" style={{ fontSize: '2.5rem' }}></i>
                            </div>
                            <h3 style={{ color: 'var(--primary)', margin: '0 0 1rem 0', fontWeight: '900' }}>Messagerie Client</h3>
                            <p style={{ textAlign: 'center', maxWidth: '350px', fontSize: '1rem', lineHeight: '1.6' }}>
                                Sélectionnez un message dans la liste pour lire le contenu détaillé et répondre à l'expéditeur.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;
