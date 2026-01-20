import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLayout = () => {
    const { currentUser, logout, isSuperAdmin } = useAdminAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [pendingKYC, setPendingKYC] = useState(0);
    const [pendingCards, setPendingCards] = useState(0);
    const [pendingAccounts, setPendingAccounts] = useState(0);
    const [newLeads, setNewLeads] = useState(0);
    const [newMessages, setNewMessages] = useState(0);
    const [openTickets, setOpenTickets] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        const unsubKYC = adminService.subscribeToKYC(data => {
            setPendingKYC(data.filter(k => k.status === 'submitted').length);
        });

        const unsubCards = adminService.subscribeToCardRequests(data => {
            setPendingCards(data.filter(c => c.status === 'pending').length);
        });

        const unsubAccounts = adminService.subscribeToAccountRequests(data => {
            setPendingAccounts(data.filter(r => r.status === 'pending').length);
        });

        const unsubLeads = adminService.subscribeToLeads(data => {
            setNewLeads(data.filter(l => l.status === 'new').length);
        });

        const unsubMessages = adminService.subscribeToContactMessages(data => {
            setNewMessages(data.filter(m => m.status === 'new').length);
        });

        const unsubTickets = adminService.subscribeToSupportTickets(data => {
            setOpenTickets(data.filter(t => t.status === 'open').length);
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubKYC();
            unsubCards();
            unsubAccounts();
            unsubLeads();
            unsubMessages();
            unsubTickets();
        };
    }, []);

    const menuItems = [
        { path: '/', icon: 'fas fa-chart-line', label: 'Dashboard' },
        { path: '/users', icon: 'fas fa-users', label: 'Utilisateurs' },
        { path: '/kyc', icon: 'fas fa-id-card', label: 'Vérifications KYC', badge: pendingKYC || null },
        { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transactions' },
        { path: '/wallets', icon: 'fas fa-wallet', label: 'Portefeuilles' },
        { path: '/cards', icon: 'fas fa-credit-card', label: 'Cartes Bancaires', badge: pendingCards || null },
        { path: '/account-requests', icon: 'fas fa-envelope-open-text', label: 'Demandes Comptes', badge: pendingAccounts || null },
        { path: '/loans', icon: 'fas fa-hand-holding-usd', label: 'Prêts' },
        { path: '/prospects', icon: 'fas fa-user-tie', label: 'Prospects (Leads)', badge: newLeads || null },
        { path: '/support', icon: 'fas fa-headset', label: 'Tickets Support', badge: openTickets || null },
        { path: '/messages', icon: 'fas fa-comment-alt', label: 'Messages Contact', badge: newMessages || null },
        ...(isSuperAdmin ? [{ path: '/manage-admins', icon: 'fas fa-user-shield', label: 'Gestion Admins' }] : []),
    ];

    const handleLogout = async () => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            await logout();
        }
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
            zIndex: 100,
            overflow: 'hidden',
        },
        mobileOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 95,
        },
        closeMobileBtn: {
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
        },
        hamburgerBtn: {
            background: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        sidebarHeader: {
            padding: isMobile ? '0.5rem 1rem' : '0.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: isMobile ? '50px' : '60px',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
        },
        logoIcon: {
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            minWidth: isMobile ? '30px' : '34px',
            borderRadius: '10px',
            background: 'var(--gradient-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.9rem' : '1rem',
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
            padding: '1rem 0',
        },
        nav: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '0.3rem 0.75rem' : '0.4rem 1rem',
            textDecoration: 'none',
            borderRadius: '0 50px 50px 0',
            margin: '0px 0',
            transition: 'var(--transition-fast)',
            gap: '0.75rem',
            height: isMobile ? '34px' : '38px',
            position: 'relative',
            overflow: 'hidden',
        },
        navIcon: {
            fontSize: isMobile ? '0.9rem' : '1rem',
            width: '24px',
            textAlign: 'center',
            transition: 'color 0.2s',
        },
        navLabel: {
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.3s',
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
            padding: '0.5rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
        },
        logoutBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: isMobile ? '0.4rem 0.6rem' : '0.6rem',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            color: '#ff6b6b',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
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
            transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
        },
        header: {
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            padding: isMobile ? '0 0.75rem' : '0 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: isMobile ? '64px' : '88px',
            zIndex: 90,
            borderBottom: '1px solid var(--border)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        headerLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
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
            gap: '0.5rem',
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
            padding: isMobile ? '0.75rem' : '1rem 0.5rem',
            flex: 1,
            marginTop: isMobile ? '64px' : '88px',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
        },
        content: {
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
        }
    };

    return (
        <div style={styles.container} >
            {/* Mobile Overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    style={styles.mobileOverlay}
                    onClick={() => setMobileMenuOpen(false)}
                    className="animate-fade-in"
                />
            )
            }

            {/* Sidebar */}
            <aside
                style={{
                    ...styles.sidebar,
                    width: isMobile ? '280px' : (sidebarOpen ? '280px' : '88px'),
                    transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none'
                }}
                className="no-scrollbar"
            >
                <div style={styles.sidebarHeader}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div style={{ ...styles.logoText, opacity: (isMobile || sidebarOpen) ? 1 : 0 }}>
                            BanK <span style={styles.logoSubtitle}>Admin</span>
                        </div>
                    </div>
                    {isMobile && (
                        <button style={styles.closeMobileBtn} onClick={() => setMobileMenuOpen(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>

                <div style={styles.navWrapper} className="no-scrollbar">
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
                                    onClick={() => isMobile && setMobileMenuOpen(false)}
                                >
                                    <div style={{ ...styles.navIcon, color: isActive ? '#00ccff' : 'rgba(255,255,255,0.7)' }}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <span style={{
                                        ...styles.navLabel,
                                        opacity: (isMobile || sidebarOpen) ? 1 : 0,
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.8)'
                                    }}>
                                        {item.label}
                                    </span>
                                    {(isMobile || sidebarOpen) && item.badge && (
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
                        <span style={{ ...styles.logoutText, opacity: (isMobile || sidebarOpen) ? 1 : 0 }}>Déconnexion</span>
                    </button>
                    {!isMobile && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={styles.toggleBtn}
                        >
                            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                ...styles.main,
                marginLeft: isMobile ? 0 : (sidebarOpen ? '280px' : '88px'),
                paddingTop: isMobile ? '0' : '0'
            }}>
                {/* Header */}
                <header style={{
                    ...styles.header,
                    position: 'fixed',
                    top: 0,
                    left: isMobile ? 0 : (sidebarOpen ? '280px' : '88px'),
                    width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? '280px' : '88px'})`,
                    zIndex: 90
                }}>
                    <div style={styles.headerLeft}>
                        {isMobile && (
                            <button style={styles.hamburgerBtn} onClick={() => setMobileMenuOpen(true)}>
                                <i className="fas fa-bars"></i>
                            </button>
                        )}
                        {!isMobile && (
                            <div>
                                <h2 style={styles.headerTitle}>
                                    {menuItems.find(item => item.path === location.pathname)?.label || 'Administration'}
                                </h2>
                                <span style={styles.date}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            </div>
                        )}
                        {isMobile && (
                            <h2 style={{ ...styles.headerTitle, fontSize: '1.2rem', margin: 0 }}>
                                {menuItems.find(item => item.path === location.pathname)?.label || 'BanK'}
                            </h2>
                        )}
                    </div>

                    <div style={styles.headerRight}>
                        {/* Admin Profile */}
                        <div style={styles.profileWrapper}>
                            <div style={styles.avatar}>
                                {currentUser?.email?.charAt(0).toUpperCase()}
                            </div>
                            {!isMobile && (
                                <div style={styles.adminInfo}>
                                    <span style={styles.adminName}>{currentUser?.firstName || 'Administrateur'}</span>
                                    <span style={styles.adminRole}>{isSuperAdmin ? 'Super Admin' : 'Administrateur'}</span>
                                </div>
                            )}
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
        </div >
    );
};


export default AdminLayout;
