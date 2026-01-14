import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div className="container" style={styles.container}>
                <div style={styles.column}>
                    <h3 style={styles.heading}>INVIK SA</h3>
                    <p>Banque en ligne digitale de droit luxembourgeois.</p>
                </div>
                <div style={styles.column}>
                    <h4 style={styles.subHeading}>Contact</h4>
                    <p>38 PARC D'ACTIVITES CAPELLEN<br />L-8308 CAP, Capellen Luxembourg</p>
                    <p>Tél : <a href="tel:+330646723286" style={styles.link}>+33 06 46 72 32 86</a></p>
                    <p>Email : <a href="mailto:contact@inviksa.com" style={styles.link}>contact@inviksa.com</a></p>
                </div>
                <div style={styles.column}>
                    <h4 style={styles.subHeading}>Liens Rapides</h4>
                    <ul style={styles.list}>
                        <li><a href="/mentions-legales" style={styles.link}>Mentions Légales</a></li>
                        <li><a href="/confidentialite" style={styles.link}>Politique de Confidentialité</a></li>
                        <li><a href="/faq" style={styles.link}>FAQ</a></li>
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
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '3rem 0 1rem',
        marginTop: 'auto',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
    },
    column: {
        flex: 1,
        minWidth: '250px',
    },
    heading: {
        color: '#fff',
        marginBottom: '1rem',
    },
    subHeading: {
        color: '#ccc',
        marginBottom: '0.5rem',
        fontSize: '1.1rem',
    },
    link: {
        color: '#aaa',
        textDecoration: 'none',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    copyright: {
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #333',
        color: '#666',
        fontSize: '0.9rem',
    }
};

export default Footer;
