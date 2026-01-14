import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            closeMenu();
            navigate('/login');
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        }
    };

    return (
        <nav style={styles.nav} className="navbar-fixed">
            <div className="container" style={styles.container}>
                <div style={styles.logo}>
                    <Link to="/" style={styles.logoLink} onClick={closeMenu}>
                        <img src="/logo.png" alt="INVIK SA" className="nav-logo" />
                    </Link>
                </div>

                {/* Mobile Actions (Login Icon + Hamburger) */}
                <div className="nav-mobile-actions">
                    <Link to="/login" className="nav-mobile-user" onClick={closeMenu}>
                        <i className="fas fa-user-circle"></i>
                    </Link>
                    <div className="nav-toggle" style={styles.toggle} onClick={toggleMenu}>
                        <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} style={styles.links}>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>ACCUEIL</NavLink>
                    <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>À PROPOS</NavLink>
                    <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>NOS SERVICES</NavLink>
                    <NavLink to="/cards" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>NOS CARTES</NavLink>
                    <NavLink to="/faq" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>FAQ'S</NavLink>
                    <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>CONTACT</NavLink>

                    {currentUser ? (
                        <>
                            <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>DASHBOARD</NavLink>
                            <button onClick={handleLogout} className="nav-button logout-btn" style={{ ...styles.button, backgroundColor: '#e74c3c' }}>DÉCONNEXION</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className="nav-button" style={styles.button}>CONNEXION / INSCRIPTION</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.8rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
    },
    logoLink: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    links: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
    },
    toggle: {
        display: 'none', // Hidden on desktop
    }
};

export default Navbar;
