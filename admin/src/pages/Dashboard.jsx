import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import LoadingSkeleton from '../components/LoadingSkeleton';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTransactions: 0,
        pendingKYC: 0,
        pendingCards: 0,
        totalRevenue: 125000,
        activeUsers: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mock data for charts (replace with real data later)
    const chartData = [
        { name: 'Lun', transactions: 4000, users: 2400 },
        { name: 'Mar', transactions: 3000, users: 1398 },
        { name: 'Mer', transactions: 2000, users: 9800 },
        { name: 'Jeu', transactions: 2780, users: 3908 },
        { name: 'Ven', transactions: 1890, users: 4800 },
        { name: 'Sam', transactions: 2390, users: 3800 },
        { name: 'Dim', transactions: 3490, users: 4300 },
    ];

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [users, transactions, kycs, cards, leads, messages, tickets] = await Promise.all([
                    adminService.getAllUsers(),
                    adminService.getAllTransactions(),
                    adminService.getAllKYC(),
                    adminService.getAllCardRequests(),
                    new Promise(resolve => adminService.subscribeToLeads(data => resolve(data))),
                    new Promise(resolve => adminService.subscribeToContactMessages(data => resolve(data))),
                    new Promise(resolve => adminService.subscribeToSupportTickets(data => resolve(data)))
                ]);

                setStats(prev => ({
                    ...prev,
                    totalUsers: users.length,
                    totalTransactions: transactions.length,
                    activeUsers: users.filter(u => u.accountStatus === 'active').length,
                    pendingKYC: kycs.filter(k => k.status === 'submitted').length,
                    pendingCards: cards.filter(c => c.status === 'pending').length,
                    newLeads: leads.filter(l => l.status === 'new').length,
                    newMessages: messages.filter(m => m.status === 'new').length,
                    openTickets: tickets.filter(t => t.status === 'open').length,
                }));

                setRecentActivity(transactions.slice(0, 5));
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();

        // Subscriptions
        const unsubTransactions = adminService.subscribeToTransactions(data => {
            setStats(prev => ({ ...prev, totalTransactions: data.length }));
            setRecentActivity(data.slice(0, 5));
        });

        const unsubUsers = adminService.subscribeToUsers(data => {
            setStats(prev => ({
                ...prev,
                totalUsers: data.length,
                activeUsers: data.filter(u => u.accountStatus === 'active').length
            }));
        });

        const unsubKYC = adminService.subscribeToKYC(data => {
            setStats(prev => ({ ...prev, pendingKYC: data.filter(k => k.status === 'submitted').length }));
        });

        const unsubCards = adminService.subscribeToCardRequests(data => {
            setStats(prev => ({ ...prev, pendingCards: data.filter(c => c.status === 'pending').length }));
        });

        const unsubLeads = adminService.subscribeToLeads(data => {
            setStats(prev => ({ ...prev, newLeads: data.filter(l => l.status === 'new').length }));
        });

        const unsubMessages = adminService.subscribeToContactMessages(data => {
            setStats(prev => ({ ...prev, newMessages: data.filter(m => m.status === 'new').length }));
        });

        const unsubTickets = adminService.subscribeToSupportTickets(data => {
            setStats(prev => ({ ...prev, openTickets: data.filter(t => t.status === 'open').length }));
        });

        return () => {
            unsubTransactions();
            unsubUsers();
            unsubKYC();
            unsubCards();
            unsubLeads();
            unsubMessages();
            unsubTickets();
        };
    }, []);

    const statCards = [
        {
            title: 'Utilisateurs Totaux',
            value: stats.totalUsers,
            icon: 'fas fa-users',
            color: '#3498db',
            bg: '#ebf5fb',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Transactions',
            value: stats.totalTransactions,
            icon: 'fas fa-exchange-alt',
            color: '#2ecc71',
            bg: '#e9f7ef',
            trend: '+5%',
            trendUp: true
        },
        {
            title: 'Alertes Système',
            value: (stats.pendingKYC || 0) + (stats.pendingCards || 0),
            icon: 'fas fa-exclamation-triangle',
            color: '#e74c3c',
            bg: '#fdedec',
            trend: 'KYC/Cartes',
            trendUp: false
        },
        {
            title: 'Nouveaux Prospects',
            value: stats.newLeads || 0,
            icon: 'fas fa-user-tie',
            color: '#f39c12',
            bg: '#fef5e7',
            trend: 'Nouveaux',
            trendUp: true
        },
        {
            title: 'Nouveaux Messages',
            value: stats.newMessages || 0,
            icon: 'fas fa-comment-alt',
            color: '#00ccff',
            bg: '#e0f2fe',
            trend: 'Contact',
            trendUp: true
        },
        {
            title: 'Tickets Ouverts',
            value: stats.openTickets || 0,
            icon: 'fas fa-headset',
            color: '#9b59b6',
            bg: '#f4ecf7',
            trend: 'Support',
            trendUp: true
        },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} type="card" height="160px" />)}
            </div>
        );
    }

    const MobileView = () => (
        <div className="mobile-dashboard">
            {/* Horizontal Scroll Stats */}
            <div style={styles.mobileStatsGrid}>
                {statCards.map((stat, index) => (
                    <div key={index} style={{ ...styles.statCardMobile, borderLeft: `4px solid ${stat.color}` }}>
                        <div style={styles.statIconSmall}>
                            <i className={stat.icon} style={{ color: stat.color }}></i>
                        </div>
                        <div>
                            <p style={styles.statTitleSmall}>{stat.title}</p>
                            <h3 style={styles.statValueSmall}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Grid */}
            <div style={{ marginTop: '1.5rem' }}>
                <h3 style={styles.sectionTitleMobile}>Actions Rapides</h3>
                <div style={styles.quickActionsMobile}>
                    <button style={styles.quickActionBtnMobile}>
                        <i className="fas fa-user-plus"></i>
                        <span>Utilisateur</span>
                    </button>
                    <button style={styles.quickActionBtnMobile}>
                        <i className="fas fa-file-invoice"></i>
                        <span>Rapport</span>
                    </button>
                    <button style={styles.quickActionBtnMobile}>
                        <i className="fas fa-envelope"></i>
                        <span>Message</span>
                    </button>
                    <button style={styles.quickActionBtnMobile}>
                        <i className="fas fa-shield-alt"></i>
                        <span>Sécurité</span>
                    </button>
                </div>
            </div>

            {/* Simplified Chart */}
            <div style={{ ...styles.chartCard, marginTop: '1.5rem', padding: '1rem' }}>
                <h3 style={styles.chartTitleSmall}>Activité Hebdomadaire</h3>
                <div style={{ width: '100%', height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={chartData}>
                            <Area type="monotone" dataKey="transactions" stroke="#00ccff" fill="#e0f2fe" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity List */}
            <div style={{ marginTop: '1.5rem', paddingBottom: '2rem' }}>
                <h3 style={styles.sectionTitleMobile}>Dernières Opérations</h3>
                <div style={styles.activityListMobile}>
                    {recentActivity.map((activity) => (
                        <div key={activity.id} style={styles.activityItemMobile}>
                            <div style={{ ...styles.activityIconSmall, color: activity.type === 'credit' ? '#10b981' : '#ef4444' }}>
                                <i className={`fas fa-${activity.type === 'credit' ? 'arrow-down' : 'arrow-up'}`}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={styles.activityTextSmall}>{activity.description || 'Transaction'}</p>
                                <span style={styles.activityDateSmall}>{activity.createdAt?.toDate().toLocaleDateString('fr-FR')}</span>
                            </div>
                            <span style={{ ...styles.activityAmountSmall, color: activity.type === 'credit' ? '#10b981' : '#ef4444' }}>
                                {activity.type === 'credit' ? '+' : '-'}
                                {(activity.amount || 0).toLocaleString('fr-FR', {
                                    style: 'currency',
                                    currency: (activity.currency === '€' ? 'EUR' : (activity.currency || 'EUR'))
                                })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const DesktopView = () => (
        <>
            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div>
                    <h1 style={styles.title}>Tableau de bord</h1>
                    <p style={styles.subtitle}>Aperçu des performances et activités récentes</p>
                </div>
                <div style={styles.dateFilter}>
                    <button
                        style={dateRange === 'week' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setDateRange('week')}
                    >
                        Semaine
                    </button>
                    <button
                        style={dateRange === 'month' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setDateRange('month')}
                    >
                        Mois
                    </button>
                    <button
                        style={dateRange === 'year' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setDateRange('year')}
                    >
                        Année
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                {statCards.map((stat, index) => (
                    <div key={index} style={styles.statCard} className="card-hover">
                        <div style={styles.statHeader}>
                            <div style={{ ...styles.statIcon, color: stat.color, background: stat.bg }}>
                                <i className={stat.icon}></i>
                            </div>
                            <span style={{
                                ...styles.trend,
                                color: stat.trendUp ? 'var(--success)' : 'var(--danger)',
                                background: stat.trendUp ? 'var(--success-light)' : 'var(--danger-light)'
                            }}>
                                <i className={`fas fa-arrow-${stat.trendUp ? 'up' : 'down'}`}></i>
                                {stat.trend}
                            </span>
                        </div>
                        <h3 style={styles.statValue}>{stat.value}</h3>
                        <p style={styles.statTitle}>{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={styles.chartsGrid}>
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Volume des Transactions</h3>
                        <button style={styles.actionBtn}><i className="fas fa-ellipsis-h"></i></button>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer minWidth={0}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ccff" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="transactions" stroke="#00ccff" strokeWidth={3} fillOpacity={1} fill="url(#colorTrans)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Nouveaux Utilisateurs</h3>
                        <button style={styles.actionBtn}><i className="fas fa-ellipsis-h"></i></button>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer minWidth={0}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#003366' : '#004d99'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="dashboard-grid">
                {/* Recent Activity */}
                <div style={styles.listCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Activité Récente</h3>
                        <button style={styles.linkBtn}>Voir tout</button>
                    </div>
                    <div style={styles.activityList}>
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} style={styles.activityItem}>
                                    <div style={{
                                        ...styles.activityIcon,
                                        color: activity.type === 'credit' ? '#27ae60' : '#e74c3c',
                                        background: activity.type === 'credit' ? '#dcfce7' : '#fee2e2'
                                    }}>
                                        <i className={`fas fa-${activity.type === 'credit' ? 'arrow-down' : 'arrow-up'}`}></i>
                                    </div>
                                    <div style={styles.activityContent}>
                                        <p style={styles.activityText}>{activity.description || 'Transaction'}</p>
                                        <p style={styles.activitySubtext}>
                                            {activity.createdAt?.toDate().toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                    <span style={{
                                        ...styles.activityAmount,
                                        color: activity.type === 'credit' ? '#27ae60' : '#e74c3c'
                                    }}>
                                        {activity.type === 'credit' ? '+' : '-'}
                                        {(activity.amount || 0).toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: (activity.currency === '€' ? 'EUR' : (activity.currency || 'EUR'))
                                        })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={styles.emptyState}>
                                <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#cbd5e1' }}></i>
                                <p>Aucune activité récente</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.listCard}>
                    <div style={styles.chartHeader}>
                        <h3 style={styles.chartTitle}>Actions Rapides</h3>
                    </div>
                    <div style={styles.quickActions}>
                        <button style={styles.quickActionBtn}>
                            <div style={{ ...styles.quickActionIcon, background: '#e0f2fe', color: '#0ea5e9' }}>
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <span>Ajouter Utilisateur</span>
                        </button>
                        <button style={styles.quickActionBtn}>
                            <div style={{ ...styles.quickActionIcon, background: '#fef9c3', color: '#eab308' }}>
                                <i className="fas fa-file-invoice"></i>
                            </div>
                            <span>Rapport Financier</span>
                        </button>
                        <button style={styles.quickActionBtn}>
                            <div style={{ ...styles.quickActionIcon, background: '#fee2e2', color: '#ef4444' }}>
                                <i className="fas fa-ban"></i>
                            </div>
                            <span>Comptes Bloqués</span>
                        </button>
                        <button style={styles.quickActionBtn}>
                            <div style={{ ...styles.quickActionIcon, background: '#dcfce7', color: '#22c55e' }}>
                                <i className="fas fa-envelope"></i>
                            </div>
                            <span>Envoyer Message</span>
                        </button>
                    </div>

                    {/* Pending Tasks */}
                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={styles.sectionTitle}>Tâches en attente</h4>
                        <div style={styles.taskList}>
                            <div style={styles.taskItem}>
                                <div style={styles.taskCheckbox}></div>
                                <span style={styles.taskText}>Valider 3 demandes KYC</span>
                                <span style={{ ...styles.badge, background: '#fef3c7', color: '#d97706' }}>Urgent</span>
                            </div>
                            <div style={styles.taskItem}>
                                <div style={styles.taskCheckbox}></div>
                                <span style={styles.taskText}>Revoir les limites de transaction</span>
                                <span style={{ ...styles.badge, background: '#e0f2fe', color: '#0ea5e9' }}>Normal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="animate-fade-in">
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
};

const styles = {
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--text-light)',
    },
    dateFilter: {
        display: 'flex',
        background: 'white',
        padding: '0.25rem',
        borderRadius: '8px',
        border: '1px solid var(--border)',
    },
    filterBtn: {
        padding: '0.5rem 1rem',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-light)',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
    },
    filterBtnActive: {
        padding: '0.5rem 1rem',
        border: 'none',
        background: 'var(--primary)',
        color: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    statCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
    },
    statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    statIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
    },
    trend: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0.25rem 0.5rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '0.25rem',
    },
    statTitle: {
        color: 'var(--text-light)',
        fontSize: '0.9rem',
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
    },
    chartCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
    },
    chartHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    chartTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
    },
    actionBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-light)',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    bottomGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
    },
    listCard: {
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        height: '100%',
    },
    linkBtn: {
        background: 'transparent',
        border: 'none',
        color: 'var(--secondary)',
        fontWeight: '600',
        cursor: 'pointer',
    },
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    activityItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '12px', transition: 'background 0.2s' },
    activityIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontWeight: '600',
        color: 'var(--text-main)',
        margin: 0,
    },
    activitySubtext: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
        margin: '2px 0 0 0',
    },
    activityAmount: {
        fontWeight: '700',
    },
    quickActions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    quickActionBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: 'var(--bg-main)', border: '1px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' },
    quickActionIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '1rem',
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    taskItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'var(--bg-main)',
        borderRadius: '8px',
    },
    taskCheckbox: {
        width: '20px',
        height: '20px',
        border: '2px solid var(--border)',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    taskText: {
        flex: 1,
        fontSize: '0.9rem',
        color: 'var(--text-main)',
    },
    badge: {
        fontSize: '0.7rem',
        fontWeight: '700',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-light)',
    },
    // Mobile Styles
    mobileStatsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        padding: '0.5rem 0',
    },
    statCardMobile: {
        background: 'white',
        borderRadius: '12px',
        padding: '0.85rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        border: '1px solid var(--border)',
    },
    statIconSmall: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
    },
    statTitleSmall: {
        color: '#64748b',
        fontSize: '0.75rem',
        margin: 0,
    },
    statValueSmall: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#1e293b',
        margin: 0,
    },
    sectionTitleMobile: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '1rem',
    },
    quickActionsMobile: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
    },
    quickActionBtnMobile: {
        background: 'white',
        border: '1px solid #f1f5f9',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    },
    chartTitleSmall: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '1.5rem',
    },
    activityListMobile: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    activityItemMobile: {
        background: 'white',
        borderRadius: '14px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
    },
    activityIconSmall: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
    },
    activityTextSmall: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#1e293b',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    activityDateSmall: {
        fontSize: '0.7rem',
        color: '#94a3b8',
    },
    activityAmountSmall: {
        fontSize: '0.9rem',
        fontWeight: '700',
    },
};

export default Dashboard;
