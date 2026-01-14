import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: '/banner-6.jpg',
        title: "Accédez à vos comptes en un clic",
        subtitle: "Connectez-vous et gérez vos finances en toute simplicité. Avec INVIK SA, suivez vos transactions, consultez vos soldes et accédez à des services bancaires complets en ligne, depuis un espace client sécurisé."
    },
    {
        image: '/banner-7.jpg',
        title: "Un nouveau départ financier avec INVIK SA",
        subtitle: "Rejoignez la communauté INVIK SA et bénéficiez d'une banque en ligne innovante, sécurisée et conçue pour simplifier vos opérations bancaires. Profitez de services personnalisés, pensés pour s’adapter à votre situation et à vos objectifs."
    },
    {
        image: '/banner-8.jpg',
        title: "Gérez vos finances en toute confiance",
        subtitle: "Avec INVIK SA, découvrez une banque en ligne sécurisée, rapide et fiable pour simplifier vos transactions. Rejoignez-nous et profitez d'un service sur mesure, conçu pour accompagner vos besoins financiers au quotidien."
    },
    {
        image: '/banner-9.jpg',
        title: "Accédez à vos comptes en un clic",
        subtitle: "Connectez-vous et gérez vos finances en toute simplicité. Avec INVIK SA, suivez vos transactions, consultez vos soldes et accédez à des services bancaires complets en ligne, depuis un espace client sécurisé."
    }
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // --- Simulator State & Logic ---
    const [amount, setAmount] = useState(150000);
    const [duration, setDuration] = useState(120);
    const [interestRate, setInterestRate] = useState(2.99);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const rates = [
        1.99, 2.50, 2.99, 3.50, 3.99, 4.50, 4.99, 5.50, 5.99, 6.50, 7.00
    ];

    useEffect(() => {
        const monthlyRate = interestRate / 100 / 12;
        const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
        setMonthlyPayment(payment);
    }, [amount, duration, interestRate]);

    const services = [
        {
            title: "Compte courant",
            icon: "💳",
            features: ["Gestion simple en ligne", "Soldes en temps réel", "Suivi complet"]
        },
        {
            title: "Épargne",
            icon: "🏦",
            features: ["Options flexibles", "Taux compétitifs", "Accessibilité 24/7"]
        },
        {
            title: "Prêts personnels",
            icon: "💸",
            features: ["Étude simplifiée", "Taux compétitifs", "Zéro frais cachés"]
        },
        {
            title: "Transferts",
            icon: "🌍",
            features: ["Frais réduits", "Conversion instantanée", "Traçabilité totale"]
        },
        {
            title: "Cartes bancaires",
            icon: "💎",
            features: ["Débit / Crédit", "Sans contact", "Paiements mobiles"]
        },
        {
            title: "Investissements",
            icon: "📈",
            features: ["Gestion de fortune", "Bourse en ligne", "Assurance vie"]
        },
        {
            title: "Crédit Immobilier",
            icon: "🏠",
            features: ["Taux fixes", "Accompagnement", "Rachat de crédit"]
        },
        {
            title: "Banque Pro",
            icon: "💼",
            features: ["Compte entreprise", "TPE / Terminaux", "Prêts pro"]
        },
        {
            title: "Assurances",
            icon: "🛡️",
            features: ["Auto & Habitation", "Prévoyance", "Protection famille"]
        }
    ];

    const testimonials = [
        { name: "Lucien Martin", role: "Entrepreneur", image: "/testimonial-1.png", text: "En tant qu'entrepreneur, INVIK SA m'aide à gérer mes finances simplement et efficacement. Le service client est disponible, ce qui me rassure." },
        { name: "Stephen Lefevre", role: "Freelance", image: "/avatar-male.png", text: "Je suis impressionnée par la flexibilité et l'accessibilité des services INVIK SA. Je peux gérer mes comptes à tout moment." },
        { name: "Lucas Dupont", role: "Manager", image: "/testimonial-3.png", text: "INVIK SA m'a simplifié la vie. J'apprécie la sécurité et la rapidité des services bancaires en ligne. Je recommande vivement." },
        { name: "Marie Dubois", role: "Consultante", image: "/avatar-female.png", text: "La plateforme INVIK SA est intuitive et moderne. J'ai pu ouvrir mon compte en quelques minutes et les frais sont très compétitifs." },
        { name: "Thomas Bernard", role: "Développeur", image: "/testimonial-5.png", text: "En tant que digital nomad, j'avais besoin d'une banque flexible. INVIK SA répond parfaitement à mes attentes partout dans le monde." },
        { name: "Sophie Laurent", role: "Architecte", image: "/testimonial-6.jpg", text: "Le support client d'INVIK SA est exceptionnel. Chaque fois que j'ai eu une question, j'ai reçu une réponse rapide et claire." },
        { name: "Pierre Moreau", role: "Commerçant", image: "/testimonial-7.jpg", text: "Les virements internationaux sont rapides et les frais sont transparents. INVIK SA m'a permis de développer mon activité à l'international." },
        { name: "Isabelle Petit", role: "Médecin", image: "/testimonial-8.jpg", text: "La sécurité est ma priorité et INVIK SA utilise les meilleures technologies de protection. Je me sens en confiance pour toutes mes transactions." },
        { name: "Alexandre Roux", role: "Étudiant", image: "/testimonial-9.jpg", text: "En tant qu'étudiant, j'apprécie les frais réduits et la facilité d'utilisation de l'application mobile. INVIK SA est parfait." },
        { name: "Céline Garnier", role: "Photographe", image: "/testimonial-10.jpg", text: "La gestion multi-devises est un vrai plus pour mon activité internationale. INVIK SA simplifie vraiment mes opérations financières." },
        { name: "Julien Faure", role: "Ingénieur", image: "/avatar-male.png", text: "J'ai testé plusieurs banques en ligne, mais INVIK SA se démarque par sa réactivité et ses services innovants." },
        { name: "Nathalie Simon", role: "Avocate", image: "/avatar-female.png", text: "La transparence des frais et la qualité du service client font d'INVIK SA mon choix numéro un. Une banque moderne et efficace." },
        { name: "Olivier Blanc", role: "Chef d'entreprise", image: "/avatar-male.png", text: "INVIK SA m'accompagne dans le développement de mon entreprise avec des solutions adaptées et un service personnalisé." }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                // On mobile (window width < 768px), cycle only between first 2 slides
                const isMobile = window.innerWidth < 768;
                const maxSlides = isMobile ? 2 : slides.length;
                return (prev + 1) % maxSlides;
            });
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="hero-section">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="hero-slide"
                        style={{
                            ...styles.slide,
                            backgroundImage: `url(${slide.image})`,
                            opacity: currentSlide === index ? 1 : 0,
                        }}
                    />
                ))}

                <div style={styles.overlay} className="hero-overlay">
                    <div className="container" style={styles.heroSplit}>
                        <div style={styles.heroLeft} className="hero-content fadeInUp">
                            <h1 style={styles.heroTitle} className="hero-title mobile-hero-title">{slides[currentSlide].title}</h1>
                            <p style={styles.heroSubtitle} className="hero-subtitle mobile-hero-subtitle">{slides[currentSlide].subtitle}</p>
                            <div style={styles.heroButtons} className="hero-buttons">
                                <Link to="/register" style={styles.primaryButton}>Ouvrir un compte</Link>
                                <Link to="/services" style={styles.secondaryButton}>Nos Services</Link>
                            </div>
                        </div>

                        <div style={styles.heroRight} className="hero-right fadeInUp">
                            <div style={styles.simulatorBox} className="simulator-card">
                                <h3 style={styles.simTitle}>Simulateur de Crédit</h3>
                                <p style={styles.simSubtitle}>Calculez vos mensualités en temps réel ⚡</p>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        Montant souhaité : <span style={styles.simValue}>{amount.toLocaleString()} €</span>
                                    </label>
                                    <input
                                        type="range" min="5000" max="900000" step="5000"
                                        value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                        style={styles.range}
                                    />
                                </div>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        Durée : <span style={styles.simValue}>{duration} mois ({Math.floor(duration / 12)} ans)</span>
                                    </label>
                                    <input
                                        type="range" min="12" max="360" step="12"
                                        value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                                        style={styles.range}
                                    />
                                </div>

                                <div style={styles.simGroup}>
                                    <label style={styles.simLabel}>
                                        Taux d'intérêt choisi : <span style={styles.simValue}>{interestRate}%</span>
                                    </label>
                                    <select
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(Number(e.target.value))}
                                        style={styles.simSelect}
                                    >
                                        {rates.map(r => <option key={r} value={r}>{r}%</option>)}
                                    </select>
                                </div>

                                <div style={styles.simResults}>
                                    <div style={styles.simResultItem}>
                                        <span style={styles.simResLabel}>Type de Taux</span>
                                        <span style={styles.simResVal}>Fixe</span>
                                    </div>
                                    <div style={styles.simResultItem}>
                                        <span style={styles.simResLabel}>Mensualité fixe</span>
                                        <span style={styles.simResValHighlight}>{monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                    </div>
                                </div>

                                <Link
                                    to="/credit-request"
                                    state={{ amount, duration, interestRate }}
                                    style={styles.simBtn}
                                >
                                    Demander ce crédit
                                </Link>
                                <p style={styles.simDisclaimer}>Estimation gratuite • Réponse immmédiate</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.dots} className="hero-dots">
                    {slides.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)}
                            style={{
                                ...styles.dot,
                                backgroundColor: currentSlide === index ? '#00ccff' : 'rgba(255,255,255,0.3)',
                                width: currentSlide === index ? '30px' : '10px',
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Mobile Hero Section - Visible only on mobile */}
            <section className="mobile-hero-section">
                <div className="mobile-hero-content">
                    <h1 className="mobile-hero-h1">{slides[currentSlide].title}</h1>
                    <p className="mobile-hero-p">{slides[currentSlide].subtitle}</p>
                    <div className="mobile-hero-actions">
                        <Link to="/register" className="mobile-hero-btn mobile-hero-btn-primary">
                            Ouvrir un compte
                        </Link>
                        <Link to="/services" className="mobile-hero-btn mobile-hero-btn-secondary">
                            Nos Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mobile Calculator Section - Visible only on mobile */}
            <section className="mobile-calculator-section">
                <div className="container">
                    <div style={styles.simulatorBox} className="simulator-card mobile-simulator">
                        <h3 style={styles.simTitle}>Simulateur de Crédit</h3>
                        <p style={styles.simSubtitle}>Calculez vos mensualités en temps réel ⚡</p>

                        <div style={styles.simGroup}>
                            <label style={styles.simLabel}>
                                Montant souhaité : <span style={styles.simValue}>{amount.toLocaleString()} €</span>
                            </label>
                            <input
                                type="range" min="5000" max="900000" step="5000"
                                value={amount} onChange={(e) => setAmount(Number(e.target.value))}
                                style={styles.range}
                            />
                        </div>

                        <div style={styles.simGroup}>
                            <label style={styles.simLabel}>
                                Durée : <span style={styles.simValue}>{duration} mois ({Math.floor(duration / 12)} ans)</span>
                            </label>
                            <input
                                type="range" min="12" max="360" step="12"
                                value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                                style={styles.range}
                            />
                        </div>

                        <div style={styles.simGroup}>
                            <label style={styles.simLabel}>
                                Taux d'intérêt choisi : <span style={styles.simValue}>{interestRate}%</span>
                            </label>
                            <select
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                style={styles.simSelect}
                            >
                                {rates.map(r => <option key={r} value={r}>{r}%</option>)}
                            </select>
                        </div>

                        <div style={styles.simResults}>
                            <div style={styles.simResultItem}>
                                <span style={styles.simResLabel}>Type de Taux</span>
                                <span style={styles.simResVal}>Fixe</span>
                            </div>
                            <div style={styles.simResultItem}>
                                <span style={styles.simResLabel}>Mensualité fixe</span>
                                <span style={styles.simResValHighlight}>{monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                            </div>
                        </div>

                        <Link
                            to="/credit-request"
                            state={{ amount, duration, interestRate }}
                            style={styles.simBtn}
                        >
                            Demander ce crédit
                        </Link>
                        <p style={styles.simDisclaimer}>Estimation gratuite • Réponse immmédiate</p>
                    </div>
                </div>
            </section>

            {/* Features Info Section */}
            <section style={styles.infoSection} className="info-section">
                <div className="container">
                    <div style={styles.infoGrid} className="info-grid">
                        <div className="info-card">
                            <div className="icon-circle">🛡️</div>
                            <h3 style={styles.infoTitle}>Transactions internationales sécurisées</h3>
                            <p style={styles.infoText}>Effectuez des transactions partout dans le monde en toute sécurité avec nos protocoles de protection reconnus.</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">📞</div>
                            <h3 style={styles.infoTitle}>Assistance 24/7 par une équipe dédiée</h3>
                            <p style={styles.infoText}>Notre équipe est disponible jour et nuit pour vous accompagner sur tous vos canaux de contact préférés.</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">💸</div>
                            <h3 style={styles.infoTitle}>Frais parmi les plus compétitifs</h3>
                            <p style={styles.infoText}>Économisez avec INVIK SA grâce à une tarification transparente et abordable pour tous vos services bancaires.</p>
                        </div>
                        <div className="info-card">
                            <div className="icon-circle">⏱️</div>
                            <h3 style={styles.infoTitle}>Étude ultra-rapide des prêts</h3>
                            <p style={styles.infoText}>Profitez d'un parcours simplifié et d'une réponse de principe immédiate pour toutes vos demandes de financement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section style={styles.aboutSection} className="about-section">
                <div style={styles.aboutContainer} className="container about-container">
                    <div style={styles.aboutImageWrapper} className="about-image-wrapper">
                        <div className="dot-pattern"></div>
                        <img src="/about-meeting.jpg" alt="About" style={styles.aboutImage} className="about-image" />
                        <div style={styles.reviewBadge} className="review-badge">★★★★★<br />Banque 5 étoiles</div>
                        <div style={styles.experienceBadge} className="experience-badge">
                            <span style={styles.experienceNumber}>15</span>
                            <span style={styles.experienceText}>Années d'expertise</span>
                        </div>
                    </div>
                    <div style={styles.aboutContent} className="about-content">
                        <div style={styles.aboutLabel}>À PROPOS</div>
                        <h2 style={styles.aboutTitle}>INVIK SA, votre partenaire bancaire en ligne de confiance</h2>
                        <p style={styles.aboutText}>
                            INVIK SA est une banque en ligne innovante, dédiée à offrir des services financiers sécurisés, rapides et simples. En combinant technologie de pointe et expertise bancaire, nous nous engageons à rendre la gestion de vos finances plus accessible et plus sûre, que vous soyez en France ou à l’international.
                        </p>
                        <p style={styles.aboutText}>
                            Notre objectif est de simplifier l'expérience bancaire pour nos clients, avec des frais compétitifs, un support client disponible 24/7, et des solutions personnalisées, selon vos besoins.
                        </p>
                        <p style={styles.aboutText}>
                            Chez INVIK SA, nous croyons en un avenir financier où la technologie simplifie chaque étape de votre expérience bancaire. En restant à l'avant-garde des innovations, nous sommes déterminés à proposer des services toujours plus adaptés aux attentes d'une clientèle moderne et connectée. Faites confiance à INVIK SA pour évoluer avec vous, aujourd'hui et demain.
                            <br /><br />
                            <strong>Rejoignez INVIK SA et découvrez une nouvelle manière de gérer vos finances en toute sérénité.</strong>
                        </p>
                        <Link to="/about" style={styles.primaryButton}>En savoir plus</Link>
                    </div>
                </div>
            </section>

            {/* Mobile About Section - Visible only on mobile */}
            <section className="mobile-about-section">
                <div className="container">
                    <div className="mobile-about-image-container">
                        <img src="/mobile-about-person.png" alt="Professional Banking" className="mobile-about-image" />
                    </div>
                    <div className="mobile-about-header">
                        <span className="mobile-about-label">À PROPOS</span>
                        <h2 className="mobile-about-title">INVIK SA, votre partenaire bancaire en ligne de confiance</h2>
                    </div>
                    <div className="mobile-about-body">
                        <p>
                            INVIK SA est une banque en ligne innovante, dédiée à offrir des services financiers sécurisés, rapides et simples. En combinant technologie de pointe et expertise bancaire, nous nous engageons à rendre la gestion de vos finances plus accessible et plus sûre, que vous soyez en France ou à l’international.
                        </p>
                        <p>
                            Notre objectif est de simplifier l'expérience bancaire pour nos clients, avec des frais compétitifs, un support client disponible 24/7, et des solutions personnalisées, selon vos besoins.
                        </p>
                        <p>
                            Chez INVIK SA, nous croyons en un avenir financier où la technologie simplifie chaque étape de votre expérience bancaire. En restant à l'avant-garde des innovations, nous sommes déterminés à proposer des services toujours plus adaptés aux attentes d'une clientèle moderne et connectée. Faites confiance à INVIK SA pour évoluer avec vous, aujourd'hui et demain.
                        </p>
                        <p className="mobile-about-highlight">
                            <strong>Rejoignez INVIK SA et découvrez une nouvelle manière de gérer vos finances en toute sérénité.</strong>
                        </p>
                    </div>
                    <div className="mobile-about-actions">
                        <Link to="/about" style={styles.primaryButton}>En savoir plus</Link>
                    </div>
                </div>
            </section>

            {/* Services Section - 8 CARDS */}
            <section style={styles.servicesSection} className="services-section">
                <div className="container">
                    <div style={styles.servicesHeader}>
                        <h2 style={styles.sectionTitle}>Nos services</h2>
                        <p style={styles.sectionSubtitle}>Des solutions bancaires conçues pour simplifier votre quotidien</p>
                    </div>
                    <div style={styles.servicesGrid} className="servicesGrid">
                        {services.map((s, i) => (
                            <div key={i} className="service-card">
                                <div style={styles.serviceCardContent}>
                                    <div style={styles.serviceCardText}>
                                        <h3>{s.title}</h3>
                                        <ul>{s.features.map((f, fi) => <li key={fi}>{f}</li>)}</ul>
                                    </div>
                                    <div className="service-icon-wrapper-large">
                                        <span className="service-icon-floating-large">{s.icon}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section - HORIZONTAL AUTO-SLIDER */}
            <section style={styles.testimonialsSection}>
                <div className="container">
                    <div style={styles.testimonialsHeader}>
                        <div style={styles.testimonialsLabel}>TÉMOIGNAGES</div>
                        <h2 style={styles.testimonialsTitle}>Ce que nos clients disent</h2>
                    </div>
                </div>

                <div style={styles.testiSliderContainer}>
                    <div style={styles.testiTrack}>
                        {/* Double the list for infinite scroll effect */}
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <Link key={i} to="/reviews" style={{ ...styles.testimonialCardSlider, textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <div style={styles.tAvatar}>
                                    <img src={t.image} alt={t.name} style={styles.tImg} />
                                </div>
                                <h4 style={{ color: '#003366', margin: '0.5rem 0' }}>{t.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: '#666' }}>{t.role}</p>
                                <div style={styles.stars}>★★★★★</div>
                                <p style={styles.testimonialText}>"{t.text}"</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#fff' },
    hero: { position: 'relative', height: '800px', backgroundColor: '#000', overflow: 'hidden' },
    slide: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1s ease-in-out', zIndex: 1 },
    overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 30, 60, 0.45)', zIndex: 2, display: 'flex', alignItems: 'center' },
    heroSplit: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'center' },
    heroLeft: { color: 'white' },
    heroTitle: { fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem' },
    heroSubtitle: { fontSize: '1.2rem', color: '#f0f0f0', marginBottom: '2.5rem', maxWidth: '600px' },
    heroButtons: { display: 'flex', gap: '1.5rem' },
    primaryButton: { backgroundColor: '#00ccff', color: 'white', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: '700' },
    secondaryButton: { border: '2px solid white', color: 'white', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: '700' },
    heroRight: { display: 'flex', justifyContent: 'flex-end' },
    simulatorBox: { width: '100%', maxWidth: '420px', backgroundColor: 'rgba(255,255,255,0.98)', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' },
    simTitle: { fontSize: '1.6rem', color: '#003366', fontWeight: '800', marginBottom: '0.5rem' },
    simSubtitle: { color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' },
    simGroup: { marginBottom: '1.5rem' },
    simLabel: { display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' },
    simValue: { float: 'right', color: '#00ccff', fontWeight: '800' },
    range: { width: '100%', accentColor: '#003366' },
    simSelect: {
        width: '100%',
        padding: '0.8rem',
        borderRadius: '12px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        color: '#333',
        fontWeight: '600',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: 'linear-gradient(45deg, transparent 50%, #003366 50%), linear-gradient(135deg, #003366 50%, transparent 50%)',
        backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
        backgroundSize: '5px 5px, 5px 5px',
        backgroundRepeat: 'no-repeat'
    },
    simResults: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f7ff', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem' },
    simResultItem: { display: 'flex', flexDirection: 'column' },
    simResLabel: { fontSize: '0.65rem', color: '#888', textTransform: 'uppercase' },
    simResVal: { fontWeight: '800' },
    simResValHighlight: { fontSize: '1.3rem', fontWeight: '900', color: '#00ccff' },
    simBtn: { display: 'block', padding: '1rem', backgroundColor: '#003366', color: 'white', textDecoration: 'none', textAlign: 'center', borderRadius: '12px', fontWeight: '800' },
    simDisclaimer: { textAlign: 'center', fontSize: '0.7rem', color: '#999', marginTop: '0.8rem' },
    dots: { position: 'absolute', bottom: '40px', left: '10%', display: 'flex', gap: '0.8rem', zIndex: 10 },
    dot: { height: '10px', borderRadius: '10px', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer' },
    infoSection: { padding: '6rem 0', backgroundColor: '#f8f9fa' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
    infoTitle: { color: '#003366', fontSize: '1.1rem', margin: '1rem 0', fontWeight: '700' },
    infoText: { color: '#666', fontSize: '0.9rem', lineHeight: '1.6' },
    aboutSection: { padding: '7rem 0', overflow: 'hidden' },
    aboutContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' },
    aboutImageWrapper: { position: 'relative' },
    aboutImage: { width: '100%', borderRadius: '12px' },
    reviewBadge: { position: 'absolute', top: '20px', left: '-10px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', fontWeight: '700', color: '#f4c150' },
    experienceBadge: { position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: '#00ccff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' },
    experienceNumber: { fontSize: '2.5rem', fontWeight: '900' },
    experienceText: { fontSize: '0.7rem', fontWeight: '600' },
    aboutLabel: { color: '#00ccff', fontWeight: '800', marginBottom: '1rem' },
    aboutTitle: { fontSize: '2.2rem', color: '#003366', fontWeight: '800', marginBottom: '1.5rem' },
    aboutText: { color: '#555', marginBottom: '1.5rem', lineHeight: '1.7' },
    servicesSection: { padding: '7rem 0', backgroundColor: '#f4f7fa' },
    servicesHeader: { textAlign: 'center', marginBottom: '4rem' },
    sectionTitle: { fontSize: '2.5rem', color: '#003366', fontWeight: '800' },
    sectionSubtitle: { color: '#666' },
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' },
    serviceCardContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' },
    serviceCardText: { flex: 1 },

    testimonialsSection: { padding: '7rem 0', overflow: 'hidden' },
    testimonialsHeader: { textAlign: 'center', marginBottom: '4rem' },
    testimonialsLabel: { color: '#00ccff', fontWeight: '800' },
    testimonialsTitle: { fontSize: '2.5rem', color: '#003366', fontWeight: '800' },

    // Slider Styles
    testiSliderContainer: { width: '100%', overflow: 'hidden', padding: '2rem 0' },
    testiTrack: {
        display: 'flex',
        width: 'fit-content',
        animation: 'scrollTestimonials 60s linear infinite',
        gap: '2rem'
    },
    testimonialCardSlider: {
        flex: '0 0 380px',
        backgroundColor: '#fcfcfc',
        padding: '2.5rem',
        borderRadius: '24px',
        textAlign: 'center',
        border: '1px solid #eee'
    },

    tAvatar: { width: '80px', height: '80px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid #00ccff' },
    tImg: { width: '100%', height: '100%', objectFit: 'cover' },
    stars: { color: '#f4c150', margin: '0.5rem 0' },
    testimonialText: { color: '#555', fontStyle: 'italic', lineHeight: '1.6', marginTop: '1rem' }
};

export default Home;
