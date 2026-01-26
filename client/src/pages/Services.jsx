import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Services = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const getPath = (path) => `/${currentLang}${path}`;

    // Static assets mapping based on ID
    const serviceAssets = {
        5: { image: "/service/service-5.jpg", icon: "🏠" },
        4: { image: "/service/service-4.jpg", icon: "📈" },
        1: { image: "/service/service-1.jpg", icon: "💳" },
        2: { image: "/service/service-2.jpg", icon: "🌍" },
        6: { image: "/service/service-6.jpg", icon: "🛡️" },
        3: { image: "/service/service-3.jpg", icon: "💼" }
    };

    const servicesData = t('services_page.services_list', { returnObjects: true });

    // Merge translation data with assets
    const services = Array.isArray(servicesData) ? servicesData.map(service => ({
        ...service,
        items: service.features, // translation uses 'features' key, component uses features
        ...serviceAssets[service.id]
    })) : [];

    const handleNavigate = (path) => {
        navigate(getPath(path));
    };

    const handleServiceAction = (id) => {
        if (id >= 1 && id <= 4) {
            handleNavigate('/register');
        } else if (id === 5) {
            handleNavigate('/credit-request');
        } else {
            handleNavigate('/contact');
        }
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="services-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>{t('services_page.hero.title')}</h1>
                        <p style={styles.heroSubtitle}>{t('services_page.hero.subtitle')}</p>
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
                                    <h3 style={styles.featuresTitle}>{t('services_page.features_title')}</h3>
                                    <ul style={styles.featuresList}>
                                        {/* Translation json uses features key array */}
                                        {service.features && service.features.map((feature, idx) => (
                                            <li key={idx} style={styles.featureItem}>
                                                <span style={styles.checkmark}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleServiceAction(service.id)}
                                    style={styles.ctaButton}
                                >
                                    {service.id === 5 ? t('services_page.buttons.simulate') : t('services_page.buttons.open_account')}
                                </button>
                            </div>
                        </div>

                        {/* Use Cases - Full Width Below */}
                        <div style={styles.useCasesSection}>
                            <h3 style={styles.useCasesTitle}>{t('services_page.use_cases_title')}</h3>
                            <div style={styles.useCasesGrid} className="use-cases-grid">
                                {service.useCases && service.useCases.map((useCase, idx) => (
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
                    <h2 style={styles.ctaTitle}>{t('services_page.cta.title')}</h2>
                    <p style={styles.ctaText}>
                        {t('services_page.cta.text')}
                    </p>
                    <button onClick={() => handleNavigate('/register')} style={styles.ctaButtonLarge}>{t('services_page.cta.button')}</button>
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
