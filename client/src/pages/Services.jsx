import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();
    const services = [
        {
            id: 5,
            title: "Crédits & Prêts",
            image: "/service/service-5.jpg",
            icon: "🏠",
            description: "Concrétisez vos projets avec nos solutions de financement flexibles. Prêt personnel, crédit immobilier ou financement professionnel, bénéficiez de taux compétitifs et d'une réponse rapide.",
            features: [
                "Prêt personnel de 1 000€ à 75 000€",
                "Crédit immobilier jusqu'à 500 000€",
                "Taux à partir de 2,0% TAEG",
                "Simulation en ligne instantanée",
                "Réponse de principe en 48h",
                "Remboursement anticipé sans frais"
            ],
            useCases: [
                {
                    title: "Thomas, Achat d'une voiture",
                    case: "Thomas a obtenu un prêt personnel de 15 000€ sur 5 ans à 2,9% TAEG pour acheter une voiture électrique. Sa mensualité de 268€ est 40€ moins chère que l'offre de sa banque traditionnelle. Il a reçu l'argent sur son compte en 3 jours ouvrés."
                },
                {
                    title: "Famille Dubois, Achat résidence principale",
                    case: "Les Dubois ont financé leur maison de 280 000€ avec un crédit immobilier INVIK SA à 1,85% sur 25 ans. Grâce au taux compétitif, ils économisent 18 000€ d'intérêts sur la durée totale du prêt par rapport à leur première offre bancaire."
                }
            ]
        },
        {
            id: 4,
            title: "Investissements & Épargne",
            image: "/service/service-4.jpg",
            icon: "📈",
            description: "Faites fructifier votre argent avec nos solutions d'investissement diversifiées. Du compte épargne rémunéré aux portefeuilles d'investissement automatisés, nous vous accompagnons dans la construction de votre patrimoine.",
            features: [
                "Compte épargne rémunéré jusqu'à 3% par an",
                "Portefeuilles d'investissement automatisés",
                "Accès aux ETF et fonds indiciels",
                "Investissement socialement responsable (ISR)",
                "Conseils personnalisés selon votre profil",
                "Frais de gestion parmi les plus bas du marché"
            ],
            useCases: [
                {
                    title: "Julie, 32 ans, Cadre en entreprise",
                    case: "Julie a ouvert un compte épargne INVIK SA avec un taux de 2,8% et investit 300€/mois dans un portefeuille ETF diversifié (60% actions, 40% obligations). Après 3 ans, son épargne de 10 800€ a généré 1 450€ de gains, soit un rendement annuel moyen de 4,5%."
                },
                {
                    title: "Pierre & Anne, Couple de retraités",
                    case: "Ce couple a transféré leur épargne de 150 000€ chez INVIK SA. Ils ont opté pour un portefeuille conservateur (20% actions, 80% obligations) qui leur rapporte en moyenne 3,2% par an, soit 4 800€ de revenus annuels, tout en préservant leur capital."
                }
            ]
        },
        {
            id: 1,
            title: "Comptes Courants & Cartes",
            image: "/service/service-1.jpg",
            icon: "💳",
            description: "Gérez votre argent au quotidien avec nos comptes courants flexibles et nos cartes bancaires internationales. Profitez d'une gestion simplifiée et d'une sécurité maximale pour toutes vos transactions.",
            features: [
                "Compte courant en EUR avec IBAN européen",
                "Carte de débit Mastercard ou Visa",
                "Virements SEPA gratuits et illimités",
                "Retraits gratuits dans toute l'Europe",
                "Application mobile intuitive",
                "Notifications en temps réel"
            ],
            useCases: [
                {
                    title: "Sophie, Freelance Designer",
                    case: "Sophie utilise son compte INVIK SA pour recevoir les paiements de ses clients internationaux. Grâce aux virements SEPA gratuits, elle économise plus de 200€ par an en frais bancaires. L'application mobile lui permet de suivre ses revenus en temps réel et de catégoriser ses dépenses professionnelles."
                },
                {
                    title: "Marc, Étudiant Erasmus",
                    case: "En échange universitaire en Espagne, Marc profite de sa carte INVIK SA pour retirer de l'argent sans frais dans toute l'Europe. Il reçoit son allocation mensuelle instantanément et peut payer ses achats en ligne sans surcoût."
                }
            ]
        },
        {
            id: 2,
            title: "Transferts Internationaux",
            image: "/service/service-2.jpg",
            icon: "🌍",
            description: "Envoyez et recevez de l'argent partout dans le monde en quelques clics. Nos transferts internationaux sont rapides, sécurisés et à des tarifs compétitifs, avec une transparence totale sur les frais et les taux de change.",
            features: [
                "Transferts vers plus de 150 pays",
                "Taux de change en temps réel",
                "Frais réduits et transparents",
                "Délai de traitement : 1-3 jours ouvrés",
                "Suivi en temps réel de vos transferts",
                "Support multi-devises (USD, GBP, CHF, etc.)"
            ],
            useCases: [
                {
                    title: "Ahmed, Entrepreneur Import-Export",
                    case: "Ahmed importe des produits d'Asie et exporte vers l'Afrique. Avec INVIK SA, il effectue des transferts internationaux en USD et CNY à des taux 40% plus avantageux que sa banque traditionnelle. Il a économisé plus de 5 000€ en frais de change l'année dernière."
                },
                {
                    title: "Maria, Expatriée au Luxembourg",
                    case: "Maria envoie chaque mois 500€ à sa famille au Portugal. Grâce aux transferts SEPA gratuits d'INVIK SA, l'argent arrive en 24h sans aucun frais, contrairement à son ancienne banque qui prélevait 15€ par virement."
                }
            ]
        },
        {
            id: 6,
            title: "Assurances & Protection",
            image: "/service/service-6.jpg",
            icon: "🛡️",
            description: "Protégez ce qui compte le plus avec nos solutions d'assurance complètes. En partenariat avec les meilleurs assureurs européens, nous vous offrons une protection optimale à des tarifs négociés.",
            features: [
                "Assurance voyage internationale",
                "Assurance santé complémentaire",
                "Assurance vie et prévoyance",
                "Protection des moyens de paiement",
                "Assurance habitation et auto",
                "Assistance juridique 24/7"
            ],
            useCases: [
                {
                    title: "Emma, Digital Nomad",
                    case: "Emma voyage 8 mois par an pour son travail. Son assurance voyage INVIK SA (45€/mois) couvre tous ses déplacements dans 180 pays, incluant rapatriement, frais médicaux jusqu'à 500 000€, et assurance bagages. Elle a été remboursée 2 800€ suite à une hospitalisation en Thaïlande."
                },
                {
                    title: "Famille Martin, Protection complète",
                    case: "Les Martin ont souscrit un pack famille INVIK SA (120€/mois) incluant assurance habitation, 2 voitures, santé complémentaire et prévoyance. Ils économisent 35% par rapport à leurs anciennes assurances séparées et gèrent tout depuis une seule application."
                }
            ]
        },
        {
            id: 3,
            title: "Solutions Entreprises",
            image: "/service/service-3.jpg",
            icon: "💼",
            description: "Des solutions bancaires professionnelles adaptées aux besoins des PME, startups et indépendants. Gérez votre trésorerie, vos factures et vos paiements avec des outils dédiés aux professionnels.",
            features: [
                "Compte professionnel multi-utilisateurs",
                "Cartes bancaires d'entreprise illimitées",
                "Gestion de trésorerie avancée",
                "Facturation et comptabilité intégrées",
                "API pour intégration ERP/CRM",
                "Conseiller dédié pour les entreprises"
            ],
            useCases: [
                {
                    title: "TechStart SaaS, Startup de 15 employés",
                    case: "TechStart utilise INVIK Business Pro pour gérer sa trésorerie. Chaque département dispose de sa propre carte virtuelle avec limite personnalisée. Le CEO suit les denses en temps réel via le dashboard et exporte automatiquement les données vers leur logiciel comptable. Gain de temps : 10h/mois."
                },
                {
                    title: "Dupont & Fils, Commerce de détail",
                    case: "Cette PME familiale a centralisé tous ses comptes chez INVIK SA. Ils utilisent l'API pour synchroniser leurs ventes avec leur compte bancaire, automatisant ainsi la réconciliation bancaire. Leur conseiller dédié les a aidés à optimiser leur trésorerie et à obtenir une ligne de crédit de 50 000€."
                }
            ]
        }
    ];

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="services-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>Nos Services</h1>
                        <p style={styles.heroSubtitle}>Des solutions bancaires conçues pour simplifier votre quotidien</p>
                    </div>
                </div>
            </section>

            {/* Services Sections */}
            {/* Navigation Anchor Buttons */}
            <div style={styles.navContainer} className="services-nav-sticky">
                <div className="container no-scrollbar" style={styles.navGrid}>
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => {
                                const element = document.getElementById(`service-${service.id}`);
                                if (element) {
                                    const offset = 100; // Header height offset
                                    const elementPosition = element.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                }
                            }}
                            className="nav-button-hover"
                            style={styles.navButton}
                        >
                            <span style={styles.navIcon}>{service.icon}</span>
                            <span style={styles.navText}>{service.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="container services-list-container" style={{ padding: '4rem 2rem' }}>
                {services.map((service, index) => (
                    <section key={service.id} id={`service-${service.id}`} style={styles.serviceSection} className="service-item-card">
                        <div style={{
                            ...styles.topSection,
                            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                        }} className="service-top-split">
                            {/* Image */}
                            <div style={styles.imageContainer} className="service-image-hover service-image-wrapper">
                                <img src={service.image} alt={service.title} style={styles.serviceImage} />
                            </div>

                            {/* Content */}
                            <div style={styles.contentContainer} className="service-content-wrapper">
                                <div style={styles.iconBadge} className="service-icon-badge">{service.icon}</div>
                                <h2 style={styles.serviceTitle}>{service.title}</h2>
                                <p style={styles.serviceDescription}>{service.description}</p>

                                {/* Features */}
                                <div style={styles.featuresSection}>
                                    <h3 style={styles.featuresTitle}>Fonctionnalités clés</h3>
                                    <ul style={styles.featuresList}>
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} style={styles.featureItem}>
                                                <span style={styles.checkmark}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => {
                                        if (service.id >= 1 && service.id <= 4) {
                                            navigate('/register');
                                        } else if (service.id === 5) {
                                            navigate('/credit-request');
                                        } else {
                                            navigate('/contact');
                                        }
                                    }}
                                    style={styles.ctaButton}
                                >
                                    {service.id === 5 ? 'Simuler mon crédit' : 'Ouvrir un compte'}
                                </button>
                            </div>
                        </div>

                        {/* Use Cases - Full Width Below */}
                        <div style={styles.useCasesSection}>
                            <h3 style={styles.useCasesTitle}>Cas pratiques</h3>
                            <div style={styles.useCasesGrid} className="use-cases-grid">
                                {service.useCases.map((useCase, idx) => (
                                    <div key={idx} className="use-case-hover" style={styles.useCaseCard}>
                                        <h4 style={styles.useCaseTitle}>{useCase.title}</h4>
                                        <p style={styles.useCaseText}>{useCase.case}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <section style={styles.ctaSection} className="cta-banner">
                <div className="container">
                    <h2 style={styles.ctaTitle}>Prêt à rejoindre INVIK SA ?</h2>
                    <p style={styles.ctaText}>
                        Ouvrez votre compte en moins de 10 minutes et profitez de tous nos services
                    </p>
                    <button onClick={() => navigate('/register')} style={styles.ctaButtonLarge}>Ouvrir un compte gratuitement</button>
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
        backgroundImage: 'url(/banner-cards.jpg)',
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
    navContainer: {
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: '110px', // Increased to avoid overlap with main navbar
        zIndex: 90, // Lower than navbar usually
        padding: '1rem 0',
    },
    navGrid: {
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1rem',
        justifyContent: 'center',
        overflowX: 'auto',
        padding: '0.5rem 1rem',
        maxWidth: '100%',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE 10+
    },
    navButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.6rem 1.2rem',
        border: '1px solid rgba(0, 51, 102, 0.1)',
        borderRadius: '50px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '0.85rem',
        color: '#444',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    navIcon: {
        fontSize: '1.2rem',
    },
    serviceSection: {
        marginBottom: '6rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    topSection: {
        display: 'flex',
        gap: '3rem',
        marginBottom: '3rem',
        alignItems: 'center',
    },
    imageContainer: {
        flex: '1',
        minWidth: '400px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease',
        height: '400px',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    contentContainer: {
        flex: '1',
        minWidth: '400px',
    },
    iconBadge: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    serviceTitle: {
        fontSize: '2.5rem',
        color: 'var(--primary-color)',
        marginBottom: '1.5rem',
        fontWeight: '700',
    },
    serviceDescription: {
        fontSize: '1.1rem',
        color: '#555',
        lineHeight: 1.8,
        marginBottom: '2rem',
    },
    featuresSection: {
        marginBottom: '2.5rem',
    },
    featuresTitle: {
        fontSize: '1.5rem',
        color: 'var(--primary-color)',
        marginBottom: '1rem',
        fontWeight: '700',
    },
    featuresList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    featureItem: {
        padding: '0.8rem 0',
        fontSize: '1.05rem',
        color: '#444',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
    },
    checkmark: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: '1.3rem',
    },
    useCasesSection: {
        marginBottom: '2.5rem',
    },
    useCasesTitle: {
        fontSize: '1.5rem',
        color: 'var(--primary-color)',
        marginBottom: '1.5rem',
        fontWeight: '700',
    },
    useCaseCard: {
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        borderLeft: '4px solid var(--primary-color)',
        transition: 'all 0.3s ease',
    },
    useCaseTitle: {
        fontSize: '1.1rem',
        color: 'var(--primary-color)',
        marginBottom: '0.8rem',
        fontWeight: '600',
    },
    useCaseText: {
        fontSize: '0.95rem',
        color: '#555',
        lineHeight: 1.7,
        margin: 0,
    },
    ctaButton: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '1rem 2.5rem',
        fontSize: '1.1rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,51,102,0.3)',
    },
    ctaSection: {
        background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        color: 'white',
    },
    ctaTitle: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontWeight: '800',
    },
    ctaText: {
        fontSize: '1.2rem',
        marginBottom: '2.5rem',
        opacity: 0.95,
    },
    ctaButtonLarge: {
        backgroundColor: '#00ccff',
        color: 'var(--primary-color)',
        padding: '1.2rem 3rem',
        fontSize: '1.2rem',
        fontWeight: '700',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,204,255,0.3)',
    },
};

export default Services;
