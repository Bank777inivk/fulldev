import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { supportService } from '../../services/supportService';

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
    const ticketsPerPage = 5;
    const chatEndRef = useRef(null);

    const faqData = [
        {
            q: "Virements non reçus",
            a: "Un virement SEPA classique prend généralement 1 à 2 jours ouvrables. Si vous attendez un virement international, cela peut prendre jusqu'à 5 jours. Vérifiez que l'IBAN fourni est correct."
        },
        {
            q: "Plafonds de carte",
            a: "Vous pouvez consulter vos plafonds actuels dans la section 'Cartes'. Pour une augmentation temporaire ou permanente, veuillez contacter votre conseiller via un ticket de support."
        },
        {
            q: "Sécuriser mon compte",
            a: "Activez toujours l'authentification à deux facteurs (2FA). Ne partagez jamais vos codes reçus par SMS. En cas de doute sur une transaction, bloquez immédiatement votre carte depuis l'application."
        },
        {
            q: "Frais bancaires",
            a: "Nos tarifs sont transparents. Le compte standard est gratuit. Les frais de tenue de compte pour les comptes premium sont prélevés mensuellement. Consultez notre grille tarifaire dans 'Documents'."
        },
        {
            q: "Mot de passe oublié",
            a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Un lien de réinitialisation vous sera envoyé par email instantanément."
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
        if (selectedTicket) {
            const unsubMessages = supportService.subscribeToTicketMessages(selectedTicket.id, (data) => {
                setMessages(data);
            });
            // Mark as seen when opening the chat
            supportService.markAsSeen(selectedTicket.id);
            return () => unsubMessages();
        } else {
            setMessages([]);
        }
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
                showToast("Ticket créé avec succès", "success");
            }
        } catch (err) {
            showToast("Erreur lors de l'envoi", "error");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedTicket) return;

        try {
            await supportService.addMessage(selectedTicket.id, {
                text: newMessage,
                sender: 'user',
                senderName: currentUser.displayName || 'Client'
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            showToast("Erreur lors de l'envoi du message", "error");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

    if (isMobile) {
        return (
            <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {!selectedTicket ? (
                    <>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>Assistance & Support</h1>

                        <div style={styles.mobileQuickActions}>
                            <div style={styles.actionCard} onClick={() => setShowForm(!showForm)}>
                                <i className="fas fa-plus"></i>
                                <span>Nouveau ticket</span>
                            </div>
                        </div>

                        {showForm && (
                            <div style={styles.mobileForm}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Nouveau ticket</h3>
                                <input style={styles.mobileInput} placeholder="Sujet" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                <textarea style={{ ...styles.mobileInput, height: '100px' }} placeholder="Votre message..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                <button style={styles.mobileSubmitBtn} onClick={handleSubmit}>Envoyer le ticket</button>
                                <button style={{ ...styles.mobileSubmitBtn, background: 'transparent', color: '#666', marginTop: '0.5rem' }} onClick={() => setShowForm(false)}>Annuler</button>
                            </div>
                        )}

                        <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#003366' }}>FAQ & Aide</h3>
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

                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Mes tickets</h3>
                        <div style={styles.mobileTicketList}>
                            {tickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map(t => (
                                <div key={t.id} style={styles.mobileTicketItem} onClick={() => setSelectedTicket(t)}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{t.subject}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                            {t.createdAt?.toDate().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span style={{ ...styles.statusBadge, background: t.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#e8f5e9', color: t.status === 'open' ? '#003366' : '#2e7d32' }}>
                                        {t.status === 'open' ? 'En cours' : 'Résolu'}
                                    </span>
                                </div>
                            ))}
                            {tickets.length === 0 && <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>Aucun ticket actif.</p>}

                            {tickets.length > ticketsPerPage && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                    >
                                        Précédent
                                    </button>
                                    <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                        Page {currentPage} / {Math.ceil(tickets.length / ticketsPerPage)}
                                    </span>
                                    <button
                                        disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(tickets.length / ticketsPerPage) ? 0.5 : 1 }}
                                    >
                                        Suivant
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
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>{selectedTicket.status === 'open' ? 'Support en ligne' : 'Ticket résolu'}</div>
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
                                    placeholder="Répondre..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#003366', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-paper-plane" style={{ marginLeft: '-2px' }}></i>
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', background: 'white', borderTop: '1px solid #eee' }}>
                                Ce ticket a été marqué comme résolu.
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
                <h1 style={styles.title}>Assistance & Support</h1>
                <p style={styles.subtitle}>Consultez l'aide en ligne ou échangez avec un conseiller.</p>
            </header>

            <div style={styles.grid}>
                {/* FAQ & Quick Help */}
                <div style={styles.faqSection}>
                    <h2 style={{ color: '#003366', marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.3rem' }}>FAQ & Aide rapide</h2>
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
                                <h2 style={{ color: '#003366', fontSize: '1.3rem', fontWeight: '800' }}>Mes demandes</h2>
                                <button style={styles.newBtn} onClick={() => setShowForm(!showForm)}>Nouveau ticket</button>
                            </div>

                            {showForm && (
                                <div style={styles.formCard}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <select style={{ ...styles.select, flex: 1 }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="technical">Problème technique</option>
                                            <option value="billing">Question sur les frais</option>
                                            <option value="cards">Gestion des cartes</option>
                                            <option value="other">Autre</option>
                                        </select>
                                        <input style={{ ...styles.input, flex: 2 }} placeholder="Sujet" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                    </div>
                                    <textarea style={styles.textarea} placeholder="Détaillez votre demande pour un traitement plus rapide..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Annuler</button>
                                        <button style={styles.submitBtn} onClick={handleSubmit}>Créer le ticket</button>
                                    </div>
                                </div>
                            )}

                            <div style={styles.ticketList}>
                                {tickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map(t => (
                                    <div key={t.id} style={styles.ticketItem} onClick={() => setSelectedTicket(t)}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: '#003366' }}>{t.subject}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                Ouvert le {t.createdAt?.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ ...styles.statusBadge, background: t.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#ecfdf5', color: t.status === 'open' ? '#003366' : '#10b981' }}>
                                                {t.status === 'open' ? 'EN COURS' : 'RÉSOLU'}
                                            </span>
                                            <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}></i>
                                        </div>
                                    </div>
                                ))}
                                {tickets.length === 0 && !showForm && (
                                    <div style={styles.empty}>
                                        <i className="fas fa-headset" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.2 }}></i>
                                        <p>Vous n'avez aucun ticket de support actif.</p>
                                    </div>
                                )}

                                {tickets.length > ticketsPerPage && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', padding: '0 1.5rem' }}>
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            style={{ ...styles.paginationBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
                                        >
                                            <i className="fas fa-chevron-left"></i> Précédent
                                        </button>
                                        <span style={{ alignSelf: 'center', fontSize: '0.95rem', fontWeight: 'bold', color: '#003366' }}>
                                            Page {currentPage} sur {Math.ceil(tickets.length / ticketsPerPage)}
                                        </span>
                                        <button
                                            disabled={currentPage >= Math.ceil(tickets.length / ticketsPerPage)}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            style={{ ...styles.paginationBtn, opacity: currentPage >= Math.ceil(tickets.length / ticketsPerPage) ? 0.5 : 1 }}
                                        >
                                            Suivant <i className="fas fa-chevron-right"></i>
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
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Statut: {selectedTicket.status === 'open' ? 'En cours' : 'Résolu'}</span>
                                </div>
                                <span style={{ ...styles.statusBadge, background: selectedTicket.status === 'open' ? 'rgba(0, 204, 255, 0.1)' : '#ecfdf5', color: selectedTicket.status === 'open' ? '#003366' : '#10b981' }}>
                                    {selectedTicket.status === 'open' ? 'Support INVIK' : 'Clôturé'}
                                </span>
                            </div>

                            <div style={styles.messagesContainer} className="no-scrollbar">
                                {messages.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>Démarrage de la discussion...</div>}
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
                                        placeholder="Décrivez votre problème ou posez une question..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" style={styles.chatSendBtn} disabled={!newMessage.trim()}>
                                        <i className="fas fa-paper-plane" style={{ marginRight: '5px' }}></i>
                                        Envoyer
                                    </button>
                                </form>
                            ) : (
                                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #eee' }}>
                                    Ce ticket a été marqué comme résolu. Si vous avez une autre question, merci d'ouvrir un nouveau ticket.
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
