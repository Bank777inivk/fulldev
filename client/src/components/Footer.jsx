import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container footer-container" style={styles.container}>
                {/* Colonne 1: Logo & Info */}
                <div style={styles.columnLogo} className="footer-column">
                    <img src="/logo.png" alt="INVIK SA Logo" style={styles.logo} className="footer-logo" />
                    <p style={styles.description}>
                        INVIK SA est une banque en ligne digitale de droit luxembourgeois, basée au 38 PARC D'ACTIVITES CAPELLEN L-8308 CAP, Capellen Luxembourg. Contact : +33 06 46 72 32 86 — Email : contact@inviksa.com
                    </p>
                    <div style={styles.socialIcons}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle} className="footer-social"><i className="fab fa-facebook-f"></i></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle} className="footer-social"><i className="fab fa-youtube"></i></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.iconCircle} className="footer-social"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                {/* Colonne 2: Informations légales */}
                <div style={{ ...styles.column, animationDelay: '0.2s' }} className="footer-column">
                    <h4 style={styles.subHeading}>Informations légales</h4>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><Link to="/confidentialite" style={styles.link} className="footer-link">• Politique de confidentialité</Link></li>
                        <li style={styles.listItem}><Link to="/cgu" style={styles.link} className="footer-link">• Conditions générales d'utilisation</Link></li>
                        <li style={styles.listItem}><Link to="/mentions-legales" style={styles.link} className="footer-link">• Mentions légales</Link></li>
                        <li style={styles.listItem}><Link to="/reviews" style={styles.link} className="footer-link">• Avis clients</Link></li>
                    </ul>
                </div>

                {/* Colonne 3: Navigation */}
                <div style={{ ...styles.column, animationDelay: '0.4s' }} className="footer-column">
                    <h4 style={styles.subHeading}>Navigation</h4>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><Link to="/" style={styles.link} className="footer-link">• ACCUEIL</Link></li>
                        <li style={styles.listItem}><Link to="/about" style={styles.link} className="footer-link">• À PROPOS</Link></li>
                        <li style={styles.listItem}><Link to="/services" style={styles.link} className="footer-link">• NOS SERVICES</Link></li>
                        <li style={styles.listItem}><Link to="/cards" style={styles.link} className="footer-link">• NOS CARTES</Link></li>
                        <li style={styles.listItem}><Link to="/faq" style={styles.link} className="footer-link">• FAQ'S</Link></li>
                    </ul>
                </div>

                {/* Colonne 4: Support */}
                <div style={{ ...styles.column, animationDelay: '0.6s' }} className="footer-column">
                    <h4 style={styles.subHeading}>Support</h4>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><Link to="/contact" style={styles.link} className="footer-link">• CONTACT</Link></li>
                        <li style={styles.listItem}><Link to="/credit-request" style={styles.link} className="footer-link">• FAIRE UNE DEMANDE DE CREDIT</Link></li>
                    </ul>
                </div>
            </div>

            <div style={styles.copyright}>
                &copy; {new Date().getFullYear()} INVIK SA. Tous droits réservés.
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#050a14',
        color: '#fff',
        padding: '2rem 0 1rem',
        marginTop: 'auto',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
    },
    columnLogo: {
        flex: '1.2',
        minWidth: '250px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
    },
    logo: {
        width: '120px',
        height: 'auto'
    },
    description: {
        fontSize: '0.75rem',
        lineHeight: '1.4',
        color: '#ccc',
        maxWidth: '300px'
    },
    socialIcons: {
        display: 'flex',
        gap: '0.6rem'
    },
    iconCircle: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textDecoration: 'none',
        fontSize: '11px'
    },
    column: {
        flex: '1',
        minWidth: '160px'
    },
    subHeading: {
        color: '#fff',
        marginBottom: '0.8rem',
        fontSize: '0.9rem',
        fontWeight: '700',
        fontFamily: "'Outfit', sans-serif",
        textTransform: 'none'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    },
    listItem: {
        marginBottom: '0.4rem'
    },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '0.75rem',
        transition: 'color 0.3s',
        textTransform: 'uppercase'
    },
    copyright: {
        textAlign: 'center',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: '#666',
        fontSize: '0.7rem'
    }
};

export default Footer;
