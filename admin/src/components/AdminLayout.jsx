import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLayout = () => {
    const { currentUser, logout } = useAdminAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifications] = useState([
        { id: 1, text: 'Nouvelle demande KYC', time: '5m' },
        { id: 2, text: 'Transaction suspecte détectée', time: '1h' }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    const [pendingKYC, setPendingKYC] = useState(0);
    const [pendingCards, setPendingCards] = useState(0);

    useEffect(() => {
        const unsubKYC = adminService.subscribeToKYC(data => {
            setPendingKYC(data.filter(k => k.status === 'submitted').length);
        });

        const unsubCards = adminService.subscribeToCardRequests(data => {
            setPendingCards(data.filter(c => c.status === 'pending').length);
        });

        return () => {
            unsubKYC();
            unsubCards();
        };
    }, []);

    const menuItems = [
        { path: '/', icon: 'fas fa-chart-line', label: 'Tableau de bord' },
        { path: '/users', icon: 'fas fa-users', label: 'Utilisateurs' },
        { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
        { path: '/kyc', icon: 'fas fa-id-card', label: 'Vérifications KYC', badge: pendingKYC || null },
        { path: '/cards', icon: 'fas fa-credit-card', label: 'Cartes Bancaires', badge: pendingCards || null },
        { path: '/wallets', icon: 'fas fa-wallet', label: 'Portefeuilles' },
        { path: '/loans', icon: 'fas fa-hand-holding-usd', label: 'Prêts' },
    ];

    const handleLogout = async () => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            await logout();
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={{ ...styles.sidebar, width: sidebarOpen ? '280px' : '88px' }}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div style={{ ...styles.logoText, opacity: sidebarOpen ? 1 : 0 }}>
                            BanK <span style={styles.logoSubtitle}>Admin</span>
                        </div>
                    </div>
                </div>

                <div style={styles.navWrapper}>
                    <nav style={styles.nav}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        ...styles.navItem,
                                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        borderRight: isActive ? '3px solid #00ccff' : '3px solid transparent'
                                    }}
                                    className="nav-item-hover"
                                >
                                    <div style={{ ...styles.navIcon, color: isActive ? '#00ccff' : 'rgba(255,255,255,0.7)' }}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <span style={{
                                        ...styles.navLabel,
                                        opacity: sidebarOpen ? 1 : 0,
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.8)'
                                    }}>
                                        {item.label}
                                    </span>
                                    {sidebarOpen && item.badge && (
                                        <span style={styles.badge}>{item.badge}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <i className="fas fa-sign-out-alt" style={styles.logoutIcon}></i>
                        <span style={{ ...styles.logoutText, opacity: sidebarOpen ? 1 : 0 }}>Déconnexion</span>
                    </button>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={styles.toggleBtn}
                    >
                        <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                ...styles.main,
                marginLeft: sidebarOpen ? '280px' : '88px'
            }}>
                {/* Header */}
                <header style={{
                    ...styles.header,
                    left: sidebarOpen ? '280px' : '88px',
                    width: `calc(100% - ${sidebarOpen ? '280px' : '88px'})`
                }}>
                    <div style={styles.headerLeft}>
                        <h2 style={styles.headerTitle}>
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Administration'}
                        </h2>
                        <span style={styles.date}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>

                    <div style={styles.headerRight}>
                        {/* Notifications */}
                        <div style={styles.notificationWrapper}>
                            <button
                                style={styles.iconBtn}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="fas fa-bell"></i>
                                <span style={styles.notificationBadge}>2</span>
                            </button>

                            {showNotifications && (
                                <div style={styles.notificationDropdown} className="animate-fade-in">
                                    <div style={styles.notificationHeader}>
                                        <h3>Notifications</h3>
                                        <span style={styles.notificationCount}>2 nouvelles</span>
                                    </div>
                                    <div style={styles.notificationList}>
                                        {notifications.map(notif => (
                                            <div key={notif.id} style={styles.notificationItem}>
                                                <div style={styles.notificationDot}></div>
                                                <div style={styles.notificationContent}>
                                                    <p>{notif.text}</p>
                                                    <span>{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button style={styles.viewAllBtn}>Voir tout</button>
                                </div>
                            )}
                        </div>

                        {/* Admin Profile */}
                        <div style={styles.profileWrapper}>
                            <div style={styles.avatar}>
                                {currentUser?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div style={styles.adminInfo}>
                                <span style={styles.adminName}>Administrateur</span>
                                <span style={styles.adminRole}>Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={styles.contentWrapper}>
                    <div style={styles.content} className="animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)',
    },
    sidebar: {
        background: 'var(--gradient-dark)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        overflow: 'hidden',
    },
    sidebarHeader: {
        padding: '2rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        height: '88px',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        minWidth: '40px',
        borderRadius: '12px',
        background: 'var(--gradient-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        boxShadow: '0 4px 15px rgba(0, 204, 255, 0.3)',
    },
    logoText: {
        fontSize: '1.4rem',
        fontWeight: '800',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s',
        fontFamily: 'var(--font-display)',
    },
    logoSubtitle: {
        color: 'var(--secondary)',
        fontWeight: '400',
    },
    navWrapper: {
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 0',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '1rem 1.5rem',
        textDecoration: 'none',
        transition: 'all 0.2s',
        height: '56px',
        position: 'relative',
        overflow: 'hidden',
    },
    navIcon: {
        fontSize: '1.2rem',
        width: '24px',
        textAlign: 'center',
        transition: 'color 0.2s',
    },
    navLabel: {
        fontSize: '0.95rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s, color 0.2s',
    },
    badge: {
        marginLeft: 'auto',
        background: 'var(--secondary)',
        color: 'white',
        fontSize: '0.75rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '20px',
        fontWeight: '700',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    sidebarFooter: {
        padding: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0.75rem',
        background: 'rgba(231, 76, 60, 0.1)',
        border: '1px solid rgba(231, 76, 60, 0.2)',
        color: '#ff6b6b',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
        width: '100%',
        overflow: 'hidden',
    },
    logoutIcon: {
        fontSize: '1.1rem',
        minWidth: '24px',
    },
    logoutText: {
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s',
    },
    toggleBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: 'rgba(255,255,255,0.8)',
        height: '32px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'all 0.2s',
    },
    main: {
        flex: 1,
        marginLeft: '280px', // Matches sidebar width
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '0 0.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        right: 0,
        height: '88px',
        zIndex: 40,
        borderBottom: '1px solid var(--border)',
        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)',
        marginBottom: '0.25rem',
    },
    date: {
        color: 'var(--text-light)',
        fontSize: '0.9rem',
        textTransform: 'capitalize',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
    },
    notificationWrapper: {
        position: 'relative',
    },
    iconBtn: {
        background: 'white',
        border: '1px solid var(--border)',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-light)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '1.2rem',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: 'var(--danger)',
        color: 'white',
        fontSize: '0.75rem',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        border: '2px solid white',
    },
    notificationDropdown: {
        position: 'absolute',
        top: '60px',
        right: 0,
        width: '320px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
    },
    notificationHeader: {
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationCount: {
        fontSize: '0.8rem',
        color: 'var(--secondary)',
        fontWeight: '600',
        background: 'rgba(0, 204, 255, 0.1)',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
    },
    notificationList: {
        maxHeight: '300px',
        overflowY: 'auto',
    },
    notificationItem: {
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    notificationDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'var(--secondary)',
        marginTop: '0.4rem',
    },
    notificationContent: {
        flex: 1,
        fontSize: '0.9rem',
    },
    viewAllBtn: {
        width: '100%',
        padding: '1rem',
        border: 'none',
        background: 'var(--bg-main)',
        color: 'var(--primary)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    profileWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem',
        paddingRight: '1.5rem',
        borderRadius: '50px',
        background: 'white',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '1.1rem',
    },
    adminInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    adminName: {
        fontSize: '0.9rem',
        fontWeight: '700',
        color: 'var(--primary)',
    },
    adminRole: {
        fontSize: '0.8rem',
        color: 'var(--text-light)',
    },
    contentWrapper: {
        padding: '1rem 0.5rem',
        flex: 1,
        marginTop: '88px',
        width: '100%',
    },
    content: {
        width: '100%',
    }
};

export default AdminLayout;
