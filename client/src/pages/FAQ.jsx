import React, { useState } from 'react';

const FAQ = () => {
    // State to track which FAQ item is open. 
    const [activeIndex, setActiveIndex] = useState(0); // Open first one by default

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        // Column 1 (First 6 items)
        {
            question: "Comment puis-je ouvrir un compte chez INVIK SA ?",
            answer: "Pour ouvrir un compte, rendez-vous sur notre page d’inscription, remplissez le formulaire avec vos informations personnelles, puis suivez les étapes de vérification de votre identité et de validation de votre dossier."
        },
        {
            question: "Comment puis-je effectuer un transfert international ?",
            answer: "Les transferts internationaux se réalisent depuis votre espace client en choisissant l’option « Transfert international ». Saisissez les coordonnées de votre bénéficiaire, le montant et la devise, puis validez l’opération après vérification des informations."
        },
        {
            question: "Quels documents sont nécessaires pour l’ouverture de compte ?",
            answer: "Vous aurez généralement besoin d’une pièce d’identité valide (passeport, carte d’identité) et d’un justificatif de domicile de moins de trois mois. Des documents complémentaires peuvent être demandés selon votre situation."
        },
        {
            question: "Est-ce que mes informations sont sécurisées chez INVIK SA ?",
            answer: "Oui. INVIK SA utilise des technologies de chiffrement et des protocoles de sécurité avancés pour protéger vos données personnelles et financières, ainsi que vos opérations en ligne."
        },
        {
            question: "Comment puis-je commander une carte bancaire INVIK SA ?",
            answer: "Une fois votre compte ouvert, vous pouvez demander une carte bancaire directement depuis votre espace client en ligne, dans la section « Mes cartes », puis suivre les instructions pour la commande et l’activation."
        },
        {
            question: "Quels sont les plafonds de paiement et de retrait de mes cartes INVIK SA ?",
            answer: "Chaque carte INVIK SA dispose de plafonds de paiement et de retrait définis par défaut (par jour et/ou par mois). Ces limites peuvent varier selon votre profil, le type de carte et votre historique. Vous pouvez consulter et ajuster vos plafonds, dans la limite des montants autorisés, directement depuis votre espace client ou notre application, si cette option est disponible."
        },

        // Column 2 (Last 6 items)
        {
            question: "Est-ce qu’INVIK SA propose des solutions de prêts ?",
            answer: "Oui, INVIK SA propose plusieurs types de prêts, y compris des prêts personnels et des solutions de financement adaptées à vos projets, selon conditions et sous réserve d’acceptation. Consultez notre page « Nos services » pour plus de détails."
        },
        {
            question: "Quels sont les frais de retrait aux distributeurs (DAB/ATM) ?",
            answer: "Les retraits peuvent être gratuits jusqu’à un certain montant ou un certain nombre d’opérations par mois, puis facturés selon la grille tarifaire en vigueur. Les frais peuvent différer entre les retraits effectués en zone euro et à l’international (hors zone euro). Pour connaître le détail des frais de retrait (montant forfaitaire et/ou pourcentage), consultez la rubrique « Tarifs » de votre espace client ou notre documentation tarifaire."
        },
        {
            question: "Quels frais sont associés aux comptes INVIK SA ?",
            answer: "Nos frais sont conçus pour être transparents et compétitifs. Vous pouvez consulter l’ensemble des tarifs (tenue de compte, cartes, opérations, etc.) sur notre page dédiée à la grille tarifaire mise à jour."
        },
        {
            question: "Comment contacter le service client d’INVIK SA ?",
            answer: "Notre service client est disponible pour vous accompagner. Vous pouvez nous contacter par téléphone, par e-mail ou via le formulaire de contact ou le chat en ligne, selon les canaux indiqués sur notre page « Contact »."
        },
        {
            question: "Puis-je gérer mon compte INVIK SA depuis un mobile ?",
            answer: "Oui, notre plateforme est optimisée pour une utilisation sur mobile, tablette et ordinateur. Vous pouvez ainsi consulter vos soldes, suivre vos opérations et gérer vos services où que vous soyez."
        },
        {
            question: "Que faire en cas de perte ou de vol de ma carte INVIK SA ?",
            answer: "En cas de perte ou de vol, bloquez immédiatement votre carte depuis votre espace client, si cette fonctionnalité est disponible, et/ou contactez sans attendre notre service client pour mettre la carte en opposition et demander un remplacement."
        },
        {
            question: "Quels sont les pays éligibles pour un crédit chez la banque INVIK ?",
            answer: "La banque INVIK propose des crédits aux résidents de tous les pays d'Europe (Zone Euro, Union Européenne, Suisse, Royaume-Uni, etc.) et des pays des Amériques (États-Unis, Canada, Mexique, Brésil, Argentine, etc.). Pour être éligible, vous devez disposer d'un passeport valide, être en mesure de prouver votre identité et pouvoir justifier de revenus réguliers et suffisants pour le remboursement du prêt."
        }
    ];

    // Splitting data for 2 columns visual
    const midPoint = Math.ceil(faqData.length / 2);
    const leftColumnData = faqData.slice(0, midPoint);
    const rightColumnData = faqData.slice(midPoint);

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero} className="faq-hero">
                <div style={styles.heroOverlay}>
                    <div className="container">
                        <h1 style={styles.heroTitle}>FAQ'S</h1>
                        <p style={styles.breadcrumb}>ACCUEIL / FAQ'S</p>
                    </div>
                </div>
            </section>

            {/* FAQ Items Grid */}
            <div className="container faq-grid" style={styles.contentContainer}>

                {/* Left Column */}
                <div style={styles.column} className="faq-column">
                    {leftColumnData.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={activeIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                {/* Right Column */}
                <div style={styles.column} className="faq-column">
                    {rightColumnData.map((item, index) => (
                        <FAQItem
                            key={index + midPoint}
                            item={item}
                            isOpen={activeIndex === (index + midPoint)}
                            onClick={() => toggleFAQ(index + midPoint)}
                        />
                    ))}
                </div>

            </div>

            {/* CTA Section */}
            <section style={styles.ctaSection} className="faq-cta-banner">
                <div className="container" style={styles.ctaContainer}>
                    <h2 style={styles.ctaTitle}>Vous ne trouvez pas votre réponse ?</h2>
                    <p style={styles.ctaText}>Nos conseillers sont là pour vous aider ou pour vous accompagner dans l'ouverture de votre compte.</p>
                    <div style={styles.ctaButtons} className="faq-cta-buttons">
                        <button style={styles.btnPrimary} onClick={() => window.location.href = '/register'}>
                            OUVRIR UN COMPTE
                        </button>
                        <button style={styles.btnSecondary} onClick={() => window.location.href = '/contact'}>
                            NOUS CONTACTER
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Sub-component for individual item
const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div style={styles.faqItem} className="faq-item-card">
            <div style={styles.questionRow} onClick={onClick} className="faq-question-row">
                <h3 style={styles.questionText}>{item.question}</h3>
                <div style={styles.iconContainer}>
                    {isOpen ? (
                        <span style={styles.iconMinus}>−</span>
                    ) : (
                        <span style={styles.iconPlus}>+</span>
                    )}
                </div>
            </div>
            <div
                style={{
                    ...styles.answerContainer,
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0,
                    paddingTop: isOpen ? '1rem' : '0',
                }}
                className="faq-answer-container"
            >
                <p style={styles.answerText}>{item.answer}</p>
            </div>
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
        backgroundImage: 'url(/banner-faq.jpg)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: '3rem',
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '3px',
    },
    breadcrumb: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    contentContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '6rem',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    faqItem: {
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        border: '1px solid #eee',
    },
    questionRow: {
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'background-color 0.2s',
    },
    questionText: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#222',
        margin: 0,
        flex: 1,
        paddingRight: '1rem',
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
    },
    iconPlus: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#555',
        lineHeight: 1,
    },
    iconMinus: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#00ccff',
        lineHeight: 1,
        backgroundColor: '#e6f7ff',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },
    answerContainer: {
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: 'white',
    },
    answerText: {
        color: '#666',
        lineHeight: '1.6',
        fontSize: '0.95rem',
        marginBottom: '1.5rem',
        marginTop: 0,
    },
    // CTA Section Styles
    ctaSection: {
        backgroundColor: '#003366',
        padding: '3rem 1rem',
        textAlign: 'center',
        marginTop: '4rem',
        borderRadius: '20px',
        margin: '0 2rem',
    },
    ctaContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    ctaTitle: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    ctaText: {
        color: '#b3d1ff',
        fontSize: '1.1rem',
        marginBottom: '2.5rem',
        lineHeight: '1.6',
    },
    ctaButtons: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        backgroundColor: '#00ccff',
        color: '#003366',
        padding: '1rem 2.5rem',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 10px 20px rgba(0, 204, 255, 0.3)',
        transition: 'all 0.3s ease',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        padding: '1rem 2.5rem',
        border: '2px solid #00ccff',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default FAQ;
