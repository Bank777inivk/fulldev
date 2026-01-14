import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <div style={styles.logo}>
                    <Link to="/" style={styles.logoLink}>
                        <img src="/logo.png" alt="INVIK SA" style={{ height: '90px' }} />
                    </Link>
                </div>
                <div style={styles.links}>
                    <Link to="/" style={styles.link}>ACCUEIL</Link>
                    <Link to="/about" style={styles.link}>À PROPOS</Link>
                    <Link to="/services" style={styles.link}>NOS SERVICES</Link>
                    <Link to="/cards" style={styles.link}>NOS CARTES</Link>
                    <Link to="/faq" style={styles.link}>FAQ'S</Link>
                    <Link to="/contact" style={styles.link}>CONTACT</Link>
                    <Link to="/login" style={styles.button}>CONNEXION / INSCRIPTION</Link>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
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
    },
    logoLink: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
    },
    link: {
        color: 'var(--text-color)',
        fontWeight: 500,
        textDecoration: 'none',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 500,
    }
};

export default Navbar;
