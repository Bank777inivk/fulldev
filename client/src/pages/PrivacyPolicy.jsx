import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="legal-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>POLITIQUE DE CONFIDENTIALITÉ</h1>
                        <p style={styles.breadcrumb}>ACCUEIL / POLITIQUE DE CONFIDENTIALITÉ</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container" style={styles.contentSection}>
                <div style={styles.card} className="legal-content-card">
                    <p style={styles.lastUpdate}>Dernière mise à jour : Décembre 2025</p>

                    <p style={styles.intro}>
                        Chez <strong>INVIK SA</strong>, nous attachons une importance primordiale à la confidentialité et à la sécurité des données personnelles des utilisateurs et des clients. La présente politique de confidentialité décrit la manière dont nous collectons, utilisons, conservons et protégeons vos informations lorsque vous utilisez notre site et nos services en ligne.
                    </p>

                    <p style={styles.intro}>
                        INVIK SA agit dans le respect de la réglementation applicable en matière de protection des données personnelles, notamment le Règlement général sur la protection des données (RGPD). En accédant à nos services, vous reconnaissez avoir pris connaissance de la présente politique et vous engagez à l’accepter.
                    </p>

                    <h2 style={styles.sectionTitle}>1. Quelles données collectons-nous et pour quelles finalités ?</h2>
                    <p style={styles.text}>
                        Nous collectons uniquement les informations nécessaires à la fourniture, à la gestion et à l’amélioration de nos services, ainsi qu’au respect de nos obligations légales et réglementaires. Selon les cas, les catégories de données que nous pouvons traiter sont :
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><strong>Données d’identification :</strong> nom, prénom, date de naissance, nationalité, pays de résidence, coordonnées (adresse, téléphone, email), profession.</li>
                        <li style={styles.listItem}><strong>Données de contact et d’échange :</strong> informations transmises via les formulaires (contact, demande de crédit, ouverture de compte) et échanges avec notre service client.</li>
                        <li style={styles.listItem}><strong>Données financières et de relation bancaire :</strong> informations relatives à vos comptes, opérations, demandes de crédit, revenus déclarés et autres données nécessaires à l’étude et à la gestion de votre dossier.</li>
                        <li style={styles.listItem}><strong>Données de navigation et techniques :</strong> adresse IP, type de navigateur, pages consultées, horodatage des visites, afin d’assurer la sécurité du site, de prévenir la fraude et d’améliorer l’expérience utilisateur.</li>
                    </ul>
                    <p style={styles.text}>
                        Ces données peuvent être collectées directement auprès de vous (formulaires, échanges avec notre équipe) ou, le cas échéant, via des sources autorisées (par exemple, lorsque la loi exige certaines vérifications).
                    </p>

                    <h2 style={styles.sectionTitle}>2. Bases légales, durée de conservation et partage des données</h2>
                    <p style={styles.text}>
                        Le traitement de vos données personnelles par INVIK SA repose, selon les situations, sur plusieurs bases légales : l’exécution de mesures précontractuelles ou d’un contrat, le respect d’obligations légales et réglementaires, l’intérêt légitime d’INVIK SA ou, lorsque cela est requis, votre consentement.
                    </p>

                    <h3 style={styles.subSectionTitle}>Durée de conservation</h3>
                    <p style={styles.text}>
                        Nous conservons vos données personnelles pendant une durée n’excédant pas celle nécessaire aux finalités pour lesquelles elles sont collectées, augmentée le cas échéant des délais de prescription légale ou des obligations de conservation imposées par la réglementation.
                    </p>

                    <h3 style={styles.subSectionTitle}>Partage des données</h3>
                    <p style={styles.text}>
                        INVIK SA ne vend pas vos données personnelles. Elles peuvent toutefois être communiquées aux catégories de destinataires suivantes :
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Services internes d’INVIK SA habilités à traiter votre demande.</li>
                        <li style={styles.listItem}>Prestataires techniques et partenaires intervenant pour le compte d’INVIK SA (hébergement, outils de sécurité).</li>
                        <li style={styles.listItem}>Autorités administratives, judiciaires ou de contrôle, lorsque la loi l’exige.</li>
                    </ul>

                    <h3 style={styles.subSectionTitle}>Mesures de sécurité</h3>
                    <p style={styles.text}>
                        INVIK SA met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la perte, l’accès non autorisé ou la divulgation :
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Utilisation de solutions d’hébergement sécurisées et de pare-feu.</li>
                        <li style={styles.listItem}>Contrôles d’accès et limitation des données aux seules personnes habilitées.</li>
                        <li style={styles.listItem}>Procédures internes de sécurité et audits réguliers.</li>
                    </ul>

                    <h2 style={styles.sectionTitle}>3. Vos droits, les cookies et comment nous contacter</h2>
                    <h3 style={styles.subSectionTitle}>Vos droits sur vos données</h3>
                    <p style={styles.text}>
                        Conformément à la réglementation, vous disposez des droits suivants :
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Droit d’accès, de rectification et d’effacement de vos données.</li>
                        <li style={styles.listItem}>Droit à la limitation du traitement et droit d’opposition.</li>
                        <li style={styles.listItem}>Droit à la portabilité des données, lorsque cela est applicable.</li>
                    </ul>
                    <p style={styles.text}>
                        Vous pouvez exercer ces droits en nous contactant par email à : <strong>contact@inviksa.com</strong>.
                    </p>

                    <h3 style={styles.subSectionTitle}>Cookies et traceurs</h3>
                    <p style={styles.text}>
                        Lors de votre navigation, des cookies peuvent être déposés sur votre terminal pour assurer le bon fonctionnement du site et réaliser des statistiques. Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
                    </p>

                    <h3 style={styles.subSectionTitle}>Questions et réclamations</h3>
                    <p style={styles.text}>
                        Si vous avez des questions concernant la présente politique, vous pouvez nous contacter via notre formulaire en ligne ou par email. Vous disposez également du droit d’introduire une réclamation auprès de l’autorité de contrôle compétente.
                    </p>

                    <div style={styles.ctaWrapper}>
                        <Link to="/contact" style={styles.ctaButton} className="premium-button legal-cta-btn">
                            NOUS CONTACTER AU SUJET DE VOS DONNÉES
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
        backgroundImage: 'url(/banner-privacy.jpg)',
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
        fontSize: '2.5rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: "'Outfit', sans-serif",
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
        marginTop: '3rem',
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
        marginBottom: '1.5rem',
    },
    listItem: {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.7',
        marginBottom: '0.8rem',
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
        padding: '1.2rem 2.5rem',
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

export default PrivacyPolicy;
