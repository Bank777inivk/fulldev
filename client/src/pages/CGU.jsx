import React from 'react';
import { Link } from 'react-router-dom';

const CGU = () => {
    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="legal-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>CONDITIONS GÉNÉRALES D'UTILISATION</h1>
                        <p style={styles.breadcrumb}>ACCUEIL / CONDITIONS GÉNÉRALES D'UTILISATION</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container" style={styles.contentSection}>
                <div style={styles.card} className="legal-content-card">
                    <p style={styles.lastUpdate}>Dernière mise à jour : Décembre 2025</p>

                    <p style={styles.intro}>
                        Les présentes conditions générales d’utilisation (ci-après les « <strong>CGU</strong> ») ont pour objet d’encadrer l’accès au site et aux services en ligne proposés par <strong>INVIK SA</strong>, ainsi que leur utilisation par tout utilisateur (ci-après l’« <strong>Utilisateur</strong> »).
                    </p>

                    <p style={styles.intro}>
                        En accédant au site ou en utilisant les services d’INVIK SA, vous reconnaissez avoir pris connaissance des présentes CGU et vous engagez à les respecter. Si vous n’acceptez pas ces conditions, vous êtes invité à ne pas utiliser le site ni les services associés.
                    </p>

                    <p style={styles.text}>
                        Les CGU s’appliquent en complément des autres documents contractuels d’INVIK SA, notamment les Conditions générales, les éventuelles Conditions particulières applicables à certains produits ou services, ainsi que la Politique de confidentialité et les Mentions légales.
                    </p>

                    <h2 style={styles.sectionTitle}>1. Vos droits et responsabilités en tant qu’utilisateur</h2>
                    <p style={styles.text}>
                        En tant qu’Utilisateur, vous vous engagez à utiliser le site et les services d’INVIK SA dans le respect de la loi, des présentes CGU et des règles de prudence usuelles en matière de services financiers en ligne.
                    </p>

                    <p style={styles.text}>Vous vous engagez notamment à :</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Fournir des informations personnelles, bancaires et financières exactes, complètes et à jour lors de vos demandes (ouverture de compte, demande de crédit, formulaires de contact, etc.).</li>
                        <li style={styles.listItem}>Utiliser le site et les services uniquement pour des besoins personnels et légitimes, et ne pas les détourner à des fins frauduleuses, illicites ou contraires à l’ordre public.</li>
                        <li style={styles.listItem}>Ne pas tenter de porter atteinte à la sécurité ou à l’intégrité du site, des systèmes d’information d’INVIK SA ou de ses prestataires.</li>
                        <li style={styles.listItem}>Respecter les droits de propriété intellectuelle d’INVIK SA et des tiers, et ne pas reproduire, diffuser ou modifier les contenus du site sans autorisation.</li>
                    </ul>
                    <p style={styles.text}>
                        Lorsque la création d’un espace client ou l’accès à des services spécifiques nécessite des identifiants, vous êtes responsable de leur confidentialité et de toute action effectuée au moyen de ces identifiants.
                    </p>

                    <h2 style={styles.sectionTitle}>2. Engagements d’INVIK SA, disponibilité du site et limitation de responsabilité</h2>
                    <h3 style={styles.subSectionTitle}>Qualité et sécurité des services</h3>
                    <p style={styles.text}>
                        INVIK SA met tout en œuvre pour proposer des services bancaires en ligne sécurisés, fiables et accessibles, et pour protéger vos données personnelles conformément à sa Politique de confidentialité.
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Mettre en place des mesures techniques et organisationnelles pour sécuriser l’accès au site.</li>
                        <li style={styles.listItem}>Limiter l’accès aux données personnelles aux seules personnes habilitées.</li>
                        <li style={styles.listItem}>Assurer la transparence sur les conditions de service et les frais applicables.</li>
                        <li style={styles.listItem}>Fournir une assistance client dans des délais raisonnables.</li>
                    </ul>

                    <h3 style={styles.subSectionTitle}>Disponibilité du site</h3>
                    <p style={styles.text}>
                        INVIK SA s’efforce de maintenir le site et les services accessibles 7j/7 et 24h/24. Toutefois, l’accès peut être suspendu temporairement pour des raisons techniques, de sécurité ou de maintenance.
                    </p>

                    <h3 style={styles.subSectionTitle}>Limitation de responsabilité</h3>
                    <p style={styles.text}>INVIK SA ne saurait être tenue responsable :</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>des conséquences liées à un usage non conforme du site ou des services par l’Utilisateur ;</li>
                        <li style={styles.listItem}>des dommages résultant d’un dysfonctionnement, d’une interruption ou d’une indisponibilité temporaire du site ;</li>
                        <li style={styles.listItem}>des dommages indirects, immatériels ou accessoires, tels que perte de chance, perte de données ou de revenus.</li>
                    </ul>
                    <p style={styles.text}>
                        Les informations communiquées sur le site sont fournies à titre indicatif et ne valent pas offertes contractuelles fermes.
                    </p>

                    <h3 style={styles.subSectionTitle}>Modification des CGU</h3>
                    <p style={styles.text}>
                        INVIK SA se réserve le droit de modifier à tout moment les présentes CGU. La version en vigueur est celle accessible sur cette page à la date de votre consultation.
                    </p>

                    <div style={styles.ctaWrapper}>
                        <Link to="/contact" style={styles.ctaButton} className="premium-button legal-cta-btn">
                            CONTACTER LE SERVICE CLIENT
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        paddingBottom: '5rem',
    },
    hero: {
        backgroundImage: 'url(/banner-cgu.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4rem',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '2.2rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontFamily: "'Outfit', sans-serif",
        padding: '0 1rem',
    },
    breadcrumb: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: '500',
        letterSpacing: '1px',
    },
    contentSection: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 1.5rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    },
    lastUpdate: {
        color: '#888',
        fontSize: '0.9rem',
        marginBottom: '2rem',
        fontStyle: 'italic',
    },
    intro: {
        fontSize: '1.1rem',
        color: '#444',
        lineHeight: '1.8',
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.6rem',
        color: '#003366',
        fontWeight: '700',
        marginTop: '3.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #00ccff',
        paddingBottom: '0.5rem',
        display: 'inline-block',
        fontFamily: "'Outfit', sans-serif",
    },
    subSectionTitle: {
        fontSize: '1.2rem',
        color: '#004d99',
        fontWeight: '600',
        marginTop: '2rem',
        marginBottom: '1rem',
        fontFamily: "'Outfit', sans-serif",
    },
    text: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '1rem',
    },
    list: {
        paddingLeft: '1.5rem',
        marginBottom: '2rem',
    },
    listItem: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '0.8rem',
        listStyleType: 'disc',
    },
    ctaWrapper: {
        marginTop: '4rem',
        textAlign: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '3rem',
    },
    ctaButton: {
        backgroundColor: '#003366',
        color: 'white',
        padding: '1.2rem 2.8rem',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '700',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 20px rgba(0, 51, 102, 0.2)',
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: '1px',
    },
};

export default CGU;
