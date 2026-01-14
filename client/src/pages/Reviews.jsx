import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Reviews = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        pays: '',
        rating: 5,
        comment: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Avis soumis:', formData);
        setSubmitted(true);
        // Reset form or redirect after a delay
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div style={styles.page}>
            {/* Header Section */}
            <section style={styles.header} className="reviews-header">
                <div className="container">
                    <h1 style={styles.title}>Votre avis compte</h1>
                    <p style={styles.subtitle}>Partagez votre expérience avec la communauté INVIK SA</p>
                </div>
            </section>

            <div className="container" style={styles.content}>
                <div style={styles.grid} className="reviews-grid">
                    {/* Form Side */}
                    <div style={styles.formCard} className="fadeInUp reviews-form-card">
                        <h2 style={styles.formTitle}>Laissez un témoignage</h2>
                        {submitted ? (
                            <div style={styles.successMsg}>
                                <h3>Merci ! 🎉</h3>
                                <p>Votre avis a été envoyé avec succès et sera publié après modération.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.row} className="reviews-form-row">
                                    <div style={styles.group}>
                                        <label style={styles.label}>Nom</label>
                                        <input
                                            type="text" required placeholder="Ex: Martin"
                                            style={styles.input}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        />
                                    </div>
                                    <div style={styles.group}>
                                        <label style={styles.label}>Prénom</label>
                                        <input
                                            type="text" required placeholder="Ex: Jean"
                                            style={styles.input}
                                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={styles.group}>
                                    <label style={styles.label}>Pays</label>
                                    <input
                                        type="text" required placeholder="Ex: France"
                                        style={styles.input}
                                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                                    />
                                </div>

                                <div style={styles.group}>
                                    <label style={styles.label}>Note (Étoiles)</label>
                                    <div style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ ...styles.star, color: formData.rating >= star ? '#f4c150' : '#ddd' }}
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.group}>
                                    <label style={styles.label}>Votre commentaire</label>
                                    <textarea
                                        required placeholder="Dites-nous ce que vous pensez de nos services..."
                                        style={styles.textarea}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    ></textarea>
                                </div>

                                <button type="submit" style={styles.submitBtn} className="submit-btn-hover reviews-submit-btn">
                                    Publier mon avis
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info Side */}
                    <div style={styles.infoSide} className="reviews-info-side">
                        <div style={styles.infoCard} className="reviews-info-card">
                            <h3 style={styles.infoTitle}>Pourquoi témoigner ?</h3>
                            <p style={styles.infoText}>Votre retour nous aide à améliorer nos services financiers au quotidien pour mieux vous satisfaire.</p>

                            <div style={styles.statBox}>
                                <span style={styles.statNum}>98%</span>
                                <span style={styles.statLabel}>Clients satisfaits</span>
                            </div>

                            <div style={styles.trustBox}>
                                🛡️ <span>Vos données sont protégées et votre anonymat peut être préservé sur demande.</span>
                            </div>
                        </div>

                        <Link to="/" style={styles.backLink}>← Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f4f7fa' },
    header: {
        backgroundColor: '#003366',
        padding: '5rem 1rem',
        textAlign: 'center',
        color: 'white',
        backgroundImage: 'linear-gradient(rgba(0,51,102,0.9), rgba(0,51,102,0.9)), url(/background/testimonial-bg-2.jpg)',
        backgroundSize: 'cover'
    },
    title: { fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' },
    subtitle: { fontSize: '1.2rem', opacity: 0.9 },
    content: { padding: '4rem 1rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' },
    formCard: { backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' },
    formTitle: { color: '#003366', marginBottom: '2rem', fontSize: '1.8rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    group: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    label: { fontWeight: '700', color: '#444', fontSize: '0.9rem' },
    input: { padding: '1rem', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fdfdfd', outline: 'none', transition: 'all 0.3s' },
    textarea: { padding: '1rem', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#fdfdfd', minHeight: '150px', outline: 'none', resize: 'vertical' },
    starsContainer: { display: 'flex', gap: '0.5rem', fontSize: '1.8rem' },
    star: { cursor: 'pointer', transition: 'transform 0.2s' },
    submitBtn: {
        padding: '1.2rem',
        backgroundColor: '#00ccff',
        color: '#003366',
        border: 'none',
        borderRadius: '50px',
        fontWeight: '800',
        fontSize: '1rem',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(0,204,255,0.3)'
    },
    successMsg: { textAlign: 'center', padding: '3rem' },
    infoSide: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    infoCard: { backgroundColor: '#003366', color: 'white', padding: '3rem', borderRadius: '24px' },
    infoTitle: { fontSize: '1.8rem', marginBottom: '1.5rem' },
    infoText: { opacity: 0.8, lineHeight: '1.7', marginBottom: '2rem' },
    statBox: { backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', textAlign: 'center', marginBottom: '1.5rem' },
    statNum: { display: 'block', fontSize: '2.5rem', fontWeight: '900', color: '#00ccff' },
    statLabel: { fontSize: '0.9rem', opacity: 0.8 },
    trustBox: { display: 'flex', gap: '1rem', fontSize: '0.85rem', opacity: 0.7, fontStyle: 'italic' },
    backLink: { color: '#003366', textDecoration: 'none', fontWeight: '700' }
};

export default Reviews;
