import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { supportService } from '../../services/supportService';
import { useTranslation } from 'react-i18next';

const Support = () => {
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: '', message: '', category: 'technical' });
    const [activeFaq, setActiveFaq] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { t, i18n } = useTranslation();
    const ticketsPerPage = 5;
    const chatEndRef = useRef(null);

    const faqData = [
        {
            q: t('support.faq.q1.q'),
            a: t('support.faq.q1.a')
        },
        {
            q: t('support.faq.q2.q'),
            a: t('support.faq.q2.a')
        },
        {
            q: t('support.faq.q3.q'),
            a: t('support.faq.q3.a')
        },
        {
            q: t('support.faq.q4.q'),
            a: t('support.faq.q4.a')
        },
        {
            q: t('support.faq.q5.q'),
            a: t('support.faq.q5.a')
        }
    ];

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = supportService.subscribeToUserTickets(currentUser.uid, (data) => {
            setTickets(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    useEffect(() => {
        if (!selectedTicket) {
            setMessages(prev => prev.length === 0 ? prev : []);
            return;
        }

        const unsubMessages = supportService.subscribeToTicketMessages(selectedTicket.id, (data) => {
            setMessages(data);
        });
        // Mark as seen when opening the chat
        supportService.markAsSeen(selectedTicket.id);
        return () => unsubMessages();
    }, [selectedTicket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) return;

        try {
            const result = await supportService.createTicket(currentUser.uid, formData);
            if (result.success) {
                // Add first message automatically
                await supportService.addMessage(result.id, {
                    text: formData.message,
                    sender: 'user',
                    senderName: currentUser.displayName || 'Client'
                });

                setShowForm(false);
                setFormData({ subject: '', message: '', category: 'technical' });
                showToast(t('support.messages.success'), "success");
            }
        } catch (err) {
            console.error("Create ticket error:", err);
            showToast(t('support.messages.error'), "error");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            await supportService.addMessage(selectedTicket.id, {
                text: newMessage,
                sender: 'user',
                senderName: currentUser.displayName || t('history.types.beneficiary')
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            showToast(t('support.messages.msg_error'), "error");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('dashboard.loading')}</div>;

    if (isMobile) {
        return (
            <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {!selectedTicket ? (
                    <>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>{t('support.title')}</h1>

                        <div style={styles.mobileQuickActions}>
                            <div style={styles.actionCard} onClick={() => setShowForm(!showForm)}>
                                <i className="fas fa-plus"></i>
                                <span>{t('support.tickets.new_btn')}</span>
                            </div>
                        </div>

                        {showForm && (
                            <div style={styles.mobileForm}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('support.tickets.new_btn')}</h3>
                                <input style={styles.mobileInput} placeholder={t('support.tickets.subject_placeholder')} value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                <textarea style={{ ...styles.mobileInput, height: '100px' }} placeholder={t('support.tickets.message_placeholder')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                <button style={styles.mobileSubmitBtn} onClick={handleSubmit}>{t('support.tickets.send_btn')}</button>
                                <button style={{ ...styles.mobileSubmitBtn, background: 'transparent', color: '#666', marginTop: '0.5rem' }} onClick={() => setShowForm(false)}>{t('support.tickets.cancel_btn')}</button>
                            </div>
                        )}

                        <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#003366' }}>{t('support.faq.title')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {faqData.map((faq, idx) => (
                                    <div key={idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                                        <div
                                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                            style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                        >
                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155' }}>{faq.q}</span>
                                            <i className={`fas fa-chevron-${activeFaq === idx ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', color: '#94a3b8' }}></i>
                                        </div>
                                        {activeFaq === idx && (
                                            <div style={{ padding: '0 15px 12px', fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{t('support.tickets.title')}</h3>
                        <div style={styles.mobileTicketList}>
                            {tickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map(ticket => (
                                <div key={ticket.id} style={styles.mobileTicketItem} onClick={() => setSelectedTicket(ticket)}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{ticket.subject}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                            {ticket.createdAt?.toDate().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                                        </div>
                                    </div>
                                    <span style={{ ...styles.statusBadge, background: ticket.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#e8f5e9', color: ticket.status === 'open' ? '#003366' : '#2e7d32' }}>
                                        {ticket.status === 'open' ? t('dashboard.status.pending') : t('dashboard.status.completed')}
                                    </span>
                                </div>
                            ))}
                            {tickets.length === 0 && <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>{t('support.tickets.empty')}</p>}

                            {tickets.length > ticketsPerPage && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        {t('common.prev')}
                                    </button>
                                    <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                        {t('deposit.pagination.page', { current: currentPage, total: Math.ceil(tickets.length / ticketsPerPage) })}
                                    </span>
                                    <button
                                        disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(tickets.length / ticketsPerPage) ? 0.5 : 1 }}
                                    >
                                        {t('common.next')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
                        <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button onClick={() => setSelectedTicket(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', color: '#003366' }}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{selectedTicket.subject}</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>{selectedTicket.status === 'open' ? t('support.tickets.status.online') : t('support.tickets.status.resolved_msg')}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {messages.map(m => (
                                <div key={m.id} style={{
                                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                    background: m.sender === 'user' ? '#003366' : 'white',
                                    color: m.sender === 'user' ? 'white' : '#334155',
                                    padding: '0.8rem 1rem',
                                    borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    maxWidth: '85%',
                                    boxShadow: m.sender === 'user' ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                                    border: m.sender === 'user' ? 'none' : '1px solid #eee'
                                }}>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.2rem', fontWeight: 'bold' }}>
                                        {m.senderName} • {m.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{m.text}</div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {selectedTicket.status === 'open' ? (
                            <form style={{ padding: '1rem', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem' }} onSubmit={handleSendMessage}>
                                <input
                                    style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '25px', border: '1px solid #eee', background: '#f8fafc', outline: 'none' }}
                                    placeholder={t('support.chat.reply_placeholder')}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#003366', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-paper-plane" style={{ marginLeft: '-2px' }}></i>
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', background: 'white', borderTop: '1px solid #eee' }}>
                                {t('support.chat.resolved_notice')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>{t('support.title')}</h1>
                <p style={styles.subtitle}>{t('support.subtitle')}</p>
            </header>

            <div style={styles.grid}>
                {/* FAQ & Quick Help */}
                <div style={styles.faqSection}>
                    <h2 style={{ color: '#003366', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.3rem' }}>{t('support.faq.title')}</h2>
                    <div style={styles.faqCard}>
                        {faqData.map((faq, idx) => (
                            <div key={idx} style={{
                                ...styles.faqItem,
                                background: activeFaq === idx ? '#f0f7ff' : '#f8fbff',
                                border: activeFaq === idx ? '1px solid #00336640' : '1px solid #eee',
                            }} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '700', color: activeFaq === idx ? '#003366' : '#334155', fontSize: '0.95rem' }}>{faq.q}</span>
                                    <i className={`fas fa-chevron-${activeFaq === idx ? 'up' : 'down'}`} style={{ color: '#003366', fontSize: '0.8rem' }}></i>
                                </div>
                                {activeFaq === idx && (
                                    <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', borderTop: '1px solid #00336610', paddingTop: '12px' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket and Chat Section */}
                <div style={styles.chatSection}>
                    {!selectedTicket ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#003366', fontSize: '1.3rem', fontWeight: '800' }}>{t('support.tickets.title')}</h2>
                                <button style={styles.newBtn} onClick={() => setShowForm(!showForm)}>{t('support.tickets.new_btn')}</button>
                            </div>

                            {showForm && (
                                <div style={styles.formCard}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <select style={{ ...styles.select, flex: 1 }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="technical">{t('support.tickets.categories.technical')}</option>
                                            <option value="billing">{t('support.tickets.categories.billing')}</option>
                                            <option value="cards">{t('support.tickets.categories.cards')}</option>
                                            <option value="other">{t('support.tickets.categories.other')}</option>
                                        </select>
                                        <input style={{ ...styles.input, flex: 2 }} placeholder={t('support.tickets.subject_placeholder')} value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                    </div>
                                    <textarea style={styles.textarea} placeholder={t('support.tickets.message_placeholder')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>{t('support.tickets.cancel_btn')}</button>
                                        <button style={styles.submitBtn} onClick={handleSubmit}>{t('support.tickets.create_btn')}</button>
                                    </div>
                                </div>
                            )}

                            <div style={styles.ticketList}>
                                {tickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map(ticket => (
                                    <div key={ticket.id} style={styles.ticketItem} onClick={() => setSelectedTicket(ticket)}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: '#003366' }}>{ticket.subject}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {t('common.at')} {ticket.createdAt?.toDate().toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long' })}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ ...styles.statusBadge, background: ticket.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#ecfdf5', color: ticket.status === 'open' ? '#003366' : '#10b981' }}>
                                                {ticket.status === 'open' ? t('support.tickets.status.open') : t('support.tickets.status.resolved')}
                                            </span>
                                            <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}></i>
                                        </div>
                                    </div>
                                ))}
                                {tickets.length === 0 && !showForm && (
                                    <div style={styles.empty}>
                                        <i className="fas fa-headset" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.2 }}></i>
                                        <p>{t('support.tickets.empty')}</p>
                                    </div>
                                )}

                                {tickets.length > ticketsPerPage && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', padding: '0 1.5rem' }}>
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                        >
                                            <i className="fas fa-chevron-left"></i> {t('common.prev')}
                                        </button>
                                        <span style={{ alignSelf: 'center', fontSize: '0.95rem', fontWeight: 'bold', color: '#003366' }}>
                                            {t('deposit.pagination.page', { current: currentPage, total: Math.ceil(tickets.length / ticketsPerPage) })}
                                        </span>
                                        <button
                                            disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(tickets.length / ticketsPerPage) ? 0.5 : 1 }}
                                        >
                                            {t('common.next')} <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Desktop Chat View */
                        <div style={styles.chatContainer}>
                            <div style={styles.chatHeader}>
                                <button style={styles.backBtn} onClick={() => setSelectedTicket(null)}>
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#003366' }}>{selectedTicket.subject}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t('dashboard.status.status_label')}: {selectedTicket.status === 'open' ? t('dashboard.status.pending') : t('dashboard.status.completed')}</span>
                                </div>
                                <span style={{ ...styles.statusBadge, background: selectedTicket.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#ecfdf5', color: selectedTicket.status === 'open' ? '#003366' : '#10b981' }}>
                                    {selectedTicket.status === 'open' ? t('support.chat.support_name') : t('support.tickets.status.closed')}
                                </span>
                            </div>

                            <div style={styles.messagesContainer} className="no-scrollbar">
                                {messages.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>{t('support.chat.starting')}</div>}
                                {messages.map(m => (
                                    <div key={m.id} style={{
                                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%',
                                    }}>
                                        <div style={{
                                            ...styles.messageBubble,
                                            background: m.sender === 'user' ? '#003366' : 'white',
                                            color: m.sender === 'user' ? 'white' : '#334155',
                                            borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            border: m.sender === 'user' ? 'none' : '1px solid #eee',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.3rem', fontWeight: 'bold' }}>
                                                {m.senderName} • {m.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div style={{ lineHeight: '1.4' }}>{m.text}</div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {selectedTicket.status === 'open' ? (
                                <form style={styles.chatInputArea} onSubmit={handleSendMessage}>
                                    <input
                                        style={styles.chatInput}
                                        placeholder={t('support.chat.input_placeholder')}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" style={styles.chatSendBtn} disabled={!newMessage.trim()}>
                                        <i className="fas fa-paper-plane" style={{ marginRight: '5px' }}></i>
                                        {t('support.chat.send')}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #eee' }}>
                                    {t('support.chat.resolved_notice')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', height: '100%', padding: '1rem 0' },
    header: { marginBottom: '2.5rem' },
    title: { fontSize: '2.2rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#64748b', fontSize: '1.1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', minHeight: '600px' },

    faqSection: { background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #eee', height: 'fit-content' },
    faqCard: { display: 'flex', flexDirection: 'column', gap: '12px' },
    faqItem: { padding: '15px 18px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #eee' },

    chatSection: { background: 'white', border: '1px solid #eee', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' },
    newBtn: { padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#003366', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' },
    formCard: { background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', margin: '0 1.5rem 1.5rem 1.5rem', border: '1px solid #e2e8f0' },
    input: { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' },
    select: { padding: '12px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' },
    textarea: { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', minHeight: '100px', background: 'white', boxSizing: 'border-box', fontFamilies: 'inherit' },
    submitBtn: { padding: '10px 25px', background: '#003366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { padding: '10px 20px', background: 'transparent', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer' },

    ticketList: { display: 'flex', flexDirection: 'column', padding: '0 1.5rem 1.5rem 1.5rem' },
    ticketItem: { display: 'flex', alignItems: 'center', padding: '1.2rem', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px', marginBottom: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' },
    statusBadge: { padding: '5px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800' },
    empty: { textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' },

    /* Desktop Chat */
    chatContainer: { display: 'flex', flexDirection: 'column', height: '650px' },
    chatHeader: { padding: '1.25rem 1.5rem', background: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem' },
    backBtn: { width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #eee', background: 'white', color: '#003366', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    messagesContainer: { flex: 1, padding: '1.5rem', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    messageBubble: { padding: '1rem 1.25rem', fontSize: '0.95rem' },
    chatInputArea: { padding: '1.25rem 1.5rem', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' },
    chatInput: { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none', fontSize: '0.95rem' },
    chatSendBtn: { padding: '0 25px', background: '#003366', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },

    /* MOBILE Helper Classes */
    mobileQuickActions: { display: 'flex', gap: '12px', marginBottom: '1.5rem' },
    actionCard: { flex: 1, background: '#003366', padding: '1.2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 'bold' },
    mobileForm: { background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #eee', marginBottom: '1.5rem' },
    mobileInput: { width: '100%', padding: '14px', marginBottom: '10px', background: '#f8fafc', border: '1px solid #eee', borderRadius: '12px', boxSizing: 'border-box' },
    mobileSubmitBtn: { width: '100%', padding: '15px', background: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
    mobileTicketList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    mobileTicketItem: { background: 'white', padding: '1.2rem', borderRadius: '16px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    paginationBtn: {
        padding: '8px 16px',
        background: '#003366',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    }
};

export default Support;
