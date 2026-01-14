import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const [visibleSections, setVisibleSections] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id^="section-"]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);
    return (
        <div style={styles.page}>
            {/* Hero Section with Background */}
            <section style={styles.hero} className="about-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>À Propos de INVIK SA</h1>
                        <p style={styles.heroSubtitle}>L'excellence bancaire au service de vos ambitions.</p>
                    </div>
                </div>
            </section>

            {/* Histoire Section */}
            <section style={styles.section}>
                <div className="container">
                    <div style={styles.contentGrid} className="about-content-grid">
                        <div style={styles.imageWrapper} className="about-image-wrapper">
                            <img src="/about-meeting.jpg" alt="Histoire INVIK SA" style={styles.sectionImage} />
                        </div>
                        <div style={styles.contentWrapper}>
                            <h2 style={styles.sectionTitle}>Notre Histoire</h2>
                            <p style={styles.text}>
                                Fondée en 2009 au Luxembourg, INVIK SA est née de la vision audacieuse de redéfinir l'expérience bancaire
                                pour l'ère numérique. Nos fondateurs, experts en finance et technologie, ont identifié un besoin crucial :
                                offrir des services bancaires modernes sans compromettre la sécurité ni la relation humaine.
                            </p>
                            <p style={styles.text}>
                                Depuis nos débuts, nous avons connu une croissance remarquable, passant de quelques centaines de clients
                                à plus de 500 000 utilisateurs actifs à travers l'Europe. Cette expansion témoigne de notre engagement
                                constant envers l'innovation et l'excellence du service client.
                            </p>
                            <p style={styles.text}>
                                Aujourd'hui, INVIK SA est reconnue comme l'une des banques en ligne les plus fiables et innovantes d'Europe,
                                avec une présence établie au Luxembourg, en France, en Belgique et en Allemagne.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section style={{ ...styles.section, backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>Nos Services</h2>
                    <p style={styles.centerSubtitle}>
                        Des solutions bancaires complètes adaptées à vos besoins
                    </p>
                    <div style={styles.servicesGrid} className="servicesGrid">
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>💳</div>
                            <h3 style={styles.cardTitle}>Comptes & Cartes</h3>
                            <p style={styles.cardText}>
                                Comptes courants, épargne, cartes bancaires internationales avec protection contre la fraude
                            </p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🌍</div>
                            <h3 style={styles.cardTitle}>Transferts Internationaux</h3>
                            <p style={styles.cardText}>
                                Virements rapides et sécurisés dans plus de 150 pays avec des frais compétitifs
                            </p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>💼</div>
                            <h3 style={styles.cardTitle}>Solutions Entreprises</h3>
                            <p style={styles.cardText}>
                                Comptes professionnels, gestion de trésorerie, financement et services dédiés aux PME
                            </p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>📈</div>
                            <h3 style={styles.cardTitle}>Investissements</h3>
                            <p style={styles.cardText}>
                                Accès à des produits d'investissement diversifiés avec accompagnement personnalisé
                            </p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🏠</div>
                            <h3 style={styles.cardTitle}>Crédits & Prêts</h3>
                            <p style={styles.cardText}>
                                Prêts personnels, immobiliers et professionnels avec des taux compétitifs
                            </p>
                        </div>
                        <div className="service-card-hover" style={styles.serviceCard}>
                            <div style={styles.serviceIcon}>🛡️</div>
                            <h3 style={styles.cardTitle}>Assurances</h3>
                            <p style={styles.cardText}>
                                Protection complète : voyage, santé, vie et biens avec des partenaires de confiance
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Ambitions Section - 10 Year Roadmap */}
            <section id="section-vision" style={{
                ...styles.section,
                opacity: visibleSections['section-vision'] ? 1 : 0,
                transform: visibleSections['section-vision'] ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out',
            }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>Notre Vision 2025-2035</h2>
                    <p style={styles.centerSubtitle}>
                        Une feuille de route ambitieuse pour devenir la banque digitale de référence en Europe
                    </p>

                    {/* Timeline 10 ans */}
                    <div style={styles.timelineContainer} className="timeline-grid">
                        {/* 2025-2027 */}
                        <div className="timeline-card-hover" style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)' }}>
                            <div style={styles.timelineYear}>2025-2027</div>
                            <h3 style={styles.timelineTitle}>Phase 1 : Consolidation & Expansion</h3>
                            <ul style={styles.timelineList}>
                                <li>✓ Atteindre 1 million de clients actifs en Europe</li>
                                <li>✓ Lancement dans 5 nouveaux pays (Espagne, Italie, Pays-Bas, Autriche, Portugal)</li>
                                <li>✓ Développement de l'application mobile nouvelle génération avec IA intégrée</li>
                                <li>✓ Partenariats avec 50 fintechs européennes pour enrichir notre écosystème</li>
                                <li>✓ Certification ISO 27001 pour la sécurité des données</li>
                                <li>✓ Lancement de INVIK Business Pro pour les PME</li>
                            </ul>
                        </div>

                        {/* 2028-2030 */}
                        <div className="timeline-card-hover" style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #004d99 0%, #0066cc 100%)' }}>
                            <div style={styles.timelineYear}>2028-2030</div>
                            <h3 style={styles.timelineTitle}>Phase 2 : Innovation & Leadership</h3>
                            <ul style={styles.timelineList}>
                                <li>✓ 3 millions de clients à travers 15 pays européens</li>
                                <li>✓ Lancement de INVIK Invest : plateforme d'investissement automatisé</li>
                                <li>✓ Introduction de services bancaires basés sur la blockchain</li>
                                <li>✓ Neutralité carbone complète de toutes nos opérations</li>
                                <li>✓ Création d'un fonds d'investissement de 100M€ pour les startups vertes</li>
                                <li>✓ Ouverture de 10 hubs d'innovation dans les capitales européennes</li>
                                <li>✓ Lancement du programme INVIK Academy pour la formation financière</li>
                            </ul>
                        </div>

                        {/* 2031-2033 */}
                        <div style={{ ...styles.timelineCard, background: 'linear-gradient(135deg, #0066cc 0%, #0080ff 100%)' }} className="timeline-card-hover">
                            <div style={styles.timelineYear}>2031-2033</div>
                            <h3 style={styles.timelineTitle}>Phase 3 : Transformation Digitale</h3>
                            <ul style={styles.timelineList}>
                                <li>✓ 5 millions de clients avec présence dans 20+ pays</li>
                                <li>✓ Assistant financier IA personnalisé pour chaque client</li>
                                <li>✓ Intégration complète des crypto-monnaies et actifs numériques</li>
                                <li>✓ Lancement de INVIK Metaverse Banking Experience</li>
                                <li>✓ Partenariats avec 500+ entreprises pour solutions B2B</li>
                                <li>✓ Programme d'inclusion financière touchant 100 000 personnes non bancarisées</li>
                                <li>✓ Développement de solutions de paiement instantané transfrontalier</li>
                            </ul>
                        </div>
                    </div>

                    {/* Objectifs Chiffrés */}
                    <div style={styles.goalsSection}>
                        <h3 style={{ ...styles.centerTitle, fontSize: '2.2rem', marginTop: '4rem' }}>Objectifs Chiffrés 2035</h3>
                        <div style={styles.goalsGrid} className="goals-grid">
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #00ccff' }}>
                                <div style={styles.goalNumber}>10M+</div>
                                <div style={styles.goalLabel}>Clients Actifs</div>
                                <div style={styles.goalDesc}>À travers l'Europe et au-delà</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #0080ff' }}>
                                <div style={styles.goalNumber}>€50Mds</div>
                                <div style={styles.goalLabel}>Actifs Sous Gestion</div>
                                <div style={styles.goalDesc}>Croissance annuelle de 35%</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #0066cc' }}>
                                <div style={styles.goalNumber}>25+</div>
                                <div style={styles.goalLabel}>Pays de Présence</div>
                                <div style={styles.goalDesc}>Couverture européenne complète</div>
                            </div>
                            <div className="goal-card-special" style={{ ...styles.goalCard, borderTop: '4px solid #004d99' }}>
                                <div style={styles.goalNumber}>100%</div>
                                <div style={styles.goalLabel}>Neutre en Carbone</div>
                                <div style={styles.goalDesc}>Impact environnemental positif</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners & Shareholders Section */}
            <section style={{ ...styles.section, background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)', color: 'white' }}>
                <div className="container">
                    <h2 style={{ ...styles.centerTitle, color: 'white' }}>Partenaires & Actionnaires</h2>
                    <p style={{ ...styles.centerSubtitle, color: 'rgba(255,255,255,0.9)', marginBottom: '3rem' }}>
                        Des partenariats stratégiques au service de votre réussite
                    </p>

                    {/* Actionnaires Principaux */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>Actionnaires Principaux</h3>
                        <div style={styles.partnersGrid} className="partners-grid">
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>Luxembourg Financial Group</h4>
                                <p style={styles.partnerRole}>Actionnaire majoritaire - 45%</p>
                                <p style={styles.partnerDesc}>Leader européen de l'investissement financier</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>European Tech Ventures</h4>
                                <p style={styles.partnerRole}>Investisseur stratégique - 25%</p>
                                <p style={styles.partnerDesc}>Spécialiste des fintechs innovantes</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>Capital Partners International</h4>
                                <p style={styles.partnerRole}>Investisseur institutionnel - 20%</p>
                                <p style={styles.partnerDesc}>Fonds d'investissement de premier plan</p>
                            </div>
                        </div>
                    </div>

                    {/* Partenaires Technologiques */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>Partenaires Technologiques</h3>
                        <div style={styles.partnersGrid} className="partners-grid">
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>SecureBank Systems</h4>
                                <p style={styles.partnerDesc}>Solutions de sécurité bancaire de pointe</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>CloudFinance Solutions</h4>
                                <p style={styles.partnerDesc}>Infrastructure cloud et scalabilité</p>
                            </div>
                            <div className="partner-card-hover" style={styles.partnerCard}>
                                <h4 style={styles.partnerName}>AI Analytics Corp</h4>
                                <p style={styles.partnerDesc}>Intelligence artificielle et analyse prédictive</p>
                            </div>
                        </div>
                    </div>

                    {/* Clients Entreprises */}
                    <div style={styles.partnersSection}>
                        <h3 style={styles.partnersSectionTitle}>Grands Comptes & Entreprises Clientes</h3>
                        <p style={{ ...styles.centerSubtitle, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
                            Plus de 15 000 entreprises nous font confiance
                        </p>
                        <div style={styles.statsGrid} className="stats-grid">
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>2 500+</div>
                                <div style={styles.statLabel}>PME Partenaires</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>350+</div>
                                <div style={styles.statLabel}>Grandes Entreprises</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>12 000+</div>
                                <div style={styles.statLabel}>Startups & TPE</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>€2.5Mds</div>
                                <div style={styles.statLabel}>Volume Transactions/An</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA pour entreprises */}
                    <div style={styles.ctaSection}>
                        <h3 style={styles.ctaTitle}>Votre entreprise souhaite devenir partenaire ?</h3>
                        <p style={styles.ctaText}>
                            Rejoignez notre réseau de partenaires stratégiques et bénéficiez de solutions bancaires sur mesure
                        </p>
                        <Link to="/contact" style={{ ...styles.ctaButton, textDecoration: 'none', display: 'inline-block' }}>Contactez notre équipe Corporate</Link>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section style={{ ...styles.section, backgroundColor: '#f0f4f8' }}>
                <div className="container">
                    <h2 style={styles.centerTitle}>Nos Valeurs</h2>
                    <div style={styles.valuesGrid} className="valuesGrid">
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🔒</div>
                            <h3 style={styles.cardTitle}>Sécurité Absolue</h3>
                            <p style={styles.cardText}>
                                Protection maximale de vos données et avoirs avec les technologies de chiffrement les plus avancées
                            </p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>💡</div>
                            <h3 style={styles.cardTitle}>Innovation Continue</h3>
                            <p style={styles.cardText}>
                                Amélioration constante de nos services pour anticiper vos besoins et vous offrir le meilleur
                            </p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🤝</div>
                            <h3 style={styles.cardTitle}>Transparence Totale</h3>
                            <p style={styles.cardText}>
                                Aucun frais caché, communication claire et relation de confiance basée sur l'honnêteté
                            </p>
                        </div>
                        <div className="value-card-hover" style={styles.valueCard}>
                            <div style={styles.valueIcon}>🌱</div>
                            <h3 style={styles.cardTitle}>Responsabilité</h3>
                            <p style={styles.cardText}>
                                Engagement envers le développement durable et l'impact social positif dans toutes nos actions
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
    },
    hero: {
        backgroundImage: 'url(/banner-privacy.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 51, 102, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '3.5rem',
        marginBottom: '1rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
    },
    heroSubtitle: {
        fontSize: '1.5rem',
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
    },
    section: {
        padding: '6rem 0',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
    },
    imageWrapper: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    sectionImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    contentWrapper: {
        padding: '1rem',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        color: 'var(--primary-color)',
        marginBottom: '2rem',
        fontWeight: '700',
    },
    centerTitle: {
        textAlign: 'center',
        fontSize: '2.8rem',
        color: 'var(--primary-color)',
        marginBottom: '1rem',
        fontWeight: '800',
    },
    centerSubtitle: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '4rem',
        maxWidth: '700px',
        margin: '0 auto 4rem',
    },
    text: {
        lineHeight: 1.8,
        fontSize: '1.05rem',
        color: '#555',
        marginBottom: '1.5rem',
        textAlign: 'justify',
    },
    servicesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    serviceCard: {
        backgroundColor: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: '2px solid transparent',
        cursor: 'pointer',
    },
    serviceIcon: {
        fontSize: '3rem',
        marginBottom: '1.5rem',
    },
    cardTitle: {
        marginBottom: '1rem',
        color: 'var(--primary-color)',
        fontSize: '1.3rem',
        fontWeight: '700',
    },
    cardText: {
        color: '#666',
        lineHeight: 1.6,
        fontSize: '0.95rem',
    },
    partnersSection: {
        marginBottom: '4rem',
    },
    partnersSectionTitle: {
        fontSize: '1.8rem',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'white',
        fontWeight: '700',
    },
    partnersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
    },
    partnerCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '2rem',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
    },
    partnerName: {
        fontSize: '1.3rem',
        marginBottom: '0.5rem',
        color: 'white',
        fontWeight: '700',
    },
    partnerRole: {
        fontSize: '0.95rem',
        color: '#00ccff',
        marginBottom: '0.8rem',
        fontWeight: '600',
    },
    partnerDesc: {
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1.5,
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
    },
    statCard: {
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
    },
    statNumber: {
        fontSize: '3rem',
        fontWeight: '800',
        color: '#00ccff',
        marginBottom: '0.5rem',
    },
    statLabel: {
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    ctaSection: {
        textAlign: 'center',
        marginTop: '4rem',
        padding: '3rem',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
    },
    ctaTitle: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: 'white',
        fontWeight: '700',
    },
    ctaText: {
        fontSize: '1.1rem',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem',
    },
    ctaButton: {
        backgroundColor: '#00ccff',
        color: 'var(--primary-color)',
        padding: '1.2rem 3rem',
        fontSize: '1.1rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,204,255,0.3)',
    },
    valuesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
    },
    valueCard: {
        backgroundColor: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        border: '2px solid transparent',
    },
    valueIcon: {
        fontSize: '3.5rem',
        marginBottom: '1.5rem',
    },
    timelineContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    timelineCard: {
        padding: '2.5rem',
        borderRadius: '16px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    },
    timelineYear: {
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '1rem',
        color: '#00ccff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    timelineTitle: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        fontWeight: '700',
        color: 'white',
    },
    timelineList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    goalsSection: {
        marginTop: '5rem',
    },
    goalsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    goalCard: {
        backgroundColor: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    goalNumber: {
        fontSize: '3rem',
        fontWeight: '800',
        color: 'var(--primary-color)',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease',
    },
    goalLabel: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#333',
        marginBottom: '0.5rem',
    },
    goalDesc: {
        fontSize: '0.95rem',
        color: '#666',
    },
};

export default About;
