import React from 'react';
import { Link } from 'react-router-dom';

const MentionsLegales = () => {
    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="legal-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>MENTIONS LÉGALES</h1>
                        <p style={styles.breadcrumb}>ACCUEIL / MENTIONS LÉGALES</p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container" style={styles.contentSection}>
                <div style={styles.card} className="legal-content-card">
                    <p style={styles.lastUpdate}>Dernière mise à jour : Décembre 2025</p>

                    <p style={styles.intro}>
                        Les présentes mentions légales ont pour objet d’informer les utilisateurs des informations relatives à l’identification et à l’exploitation du site d’<strong>INVIK SA</strong>. Elles sont établies en conformité avec la réglementation applicable afin de garantir la transparence et de renforcer la confiance avec nos utilisateurs.
                    </p>

                    <p style={styles.intro}>
                        En accédant à ce site, vous reconnaissez avoir pris connaissance des présentes mentions légales et vous engagez à les respecter.
                    </p>

                    <h2 style={styles.sectionTitle}>1. Éditeur du site</h2>
                    <p style={styles.text}>Le site est édité par la société <strong>INVIK S.A.</strong></p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><strong>Dénomination sociale :</strong> INVIK S.A.</li>
                        <li style={styles.listItem}><strong>Type d’entreprise :</strong> Société anonyme de droit luxembourgeois</li>
                        <li style={styles.listItem}><strong>RCS Luxembourg :</strong> B 138.554</li>
                        <li style={styles.listItem}><strong>Capital social :</strong> 31 000 000 EUR</li>
                    </ul>

                    <h3 style={styles.subSectionTitle}>Siège social (adresse légale) :</h3>
                    <p style={styles.text}>
                        51, Boulevard Grande-Duchesse Charlotte,<br />
                        L-1331 Luxembourg, Grand-Duché de Luxembourg
                    </p>

                    <h3 style={styles.subSectionTitle}>Adresse opérationnelle / centre d’activités :</h3>
                    <p style={styles.text}>
                        38 Parc d’Activités Capellen,<br />
                        L-8308 Capellen, Grand-Duché de Luxembourg
                    </p>

                    <p style={styles.text}><strong>Pays associés :</strong> Suisse, Finlande, France, Royaume-Uni, Suède</p>

                    <h3 style={styles.subSectionTitle}>Coordonnées :</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><strong>Téléphone :</strong> +33 6 46 72 32 86</li>
                        <li style={styles.listItem}><strong>Email :</strong> contact@inviksa.com</li>
                        <li style={styles.listItem}><strong>Directeur de la publication :</strong> M. CHAINTEREAU CHRISTOPHE JEAN-PIERRE</li>
                    </ul>

                    <h3 style={styles.subSectionTitle}>Identifiants internationaux :</h3>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><strong>Identifiant de l’intermédiaire mondial :</strong> J78DUL.99999.SL.442</li>
                        <li style={styles.listItem}><strong>Code d’entité universel :</strong> 7222-8247-9450-3808</li>
                        <li style={styles.listItem}><strong>LEI (Legal Entity Identifier) :</strong> 213800ZI4ZNQZMZ4SW41</li>
                    </ul>

                    <h2 style={styles.sectionTitle}>2. Hébergeur du site</h2>
                    <p style={styles.text}>Le site est hébergé par :</p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}><strong>Raison sociale :</strong> Hostinger</li>
                        <li style={styles.listItem}><strong>Siège social :</strong> Vilnius, Lituanie</li>
                        <li style={styles.listItem}><strong>Activité :</strong> Hébergeur web</li>
                        <li style={styles.listItem}><strong>Président :</strong> Daugirdas Jankus</li>
                    </ul>

                    <h2 style={styles.sectionTitle}>3. Activité et cadre général</h2>
                    <p style={styles.text}>
                        INVIK SA propose, via sa plateforme digitale, des services financiers et bancaires en ligne, sous réserve des conditions contractuelles applicables et des législations en vigueur dans les pays d’activité concernés.
                    </p>
                    <p style={styles.text}>
                        Les produits et services présentés sur le site peuvent être soumis à des conditions d’éligibilité, à des restrictions géographiques ou à des limitations réglementaires. Il appartient à chaque utilisateur de vérifier la compatibilité des services proposés avec sa situation personnelle, fiscale et juridique.
                    </p>

                    <h2 style={styles.sectionTitle}>4. Responsabilité et utilisation du site</h2>
                    <p style={styles.text}>
                        L’utilisateur s’engage à utiliser le site dans le respect des lois et réglementations en vigueur et à ne pas porter atteinte à l’intégrité ou au bon fonctionnement du site.
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Utilisation du site dans un cadre légal et personnel uniquement.</li>
                        <li style={styles.listItem}>Interdiction de toute tentative d’accès non autorisé aux systèmes d’information.</li>
                        <li style={styles.listItem}>Interdiction de perturber, altérer ou interrompre le fonctionnement du site.</li>
                    </ul>

                    <h2 style={styles.sectionTitle}>5. Propriété intellectuelle</h2>
                    <p style={styles.text}>
                        L’ensemble des éléments composant ce site (textes, logos, marques, graphiques, vidéos, icônes, sons, logiciels, mises en page, etc.) est protégé par les lois applicables en matière de propriété intellectuelle. Toute reproduction, représentation, modification, diffusion ou exploitation, totale ou partielle, du contenu du site, par quelque procédé que ce soit, sans l’autorisation écrite préalable d’INVIK SA, est strictement interdite.
                    </p>

                    <h2 style={styles.sectionTitle}>6. Données personnelles et cookies</h2>
                    <p style={styles.text}>
                        Les modalités de collecte et de traitement de vos données personnelles, ainsi que les informations relatives à l’utilisation des cookies sur ce site, sont détaillées dans notre Politique de confidentialité.
                    </p>

                    <h2 style={styles.sectionTitle}>7. Droit applicable et juridiction compétente</h2>
                    <p style={styles.text}>
                        Le présent site ainsi que les relations pouvant en découler sont soumis à la législation luxembourgeoise. En cas de litige, les tribunaux compétents du Grand-Duché de Luxembourg seront seuls compétents.
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
        backgroundImage: 'url(/banner-mentions.jpg)',
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
        fontSize: '1.1rem',
        color: '#004d99',
        fontWeight: '700',
        marginTop: '1.5rem',
        marginBottom: '0.8rem',
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
        marginBottom: '0.6rem',
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

export default MentionsLegales;
