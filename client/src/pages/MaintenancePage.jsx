import React from 'react';
import { useTranslation } from 'react-i18next';

const MaintenancePage = () => {
    const { t } = useTranslation();

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.iconWrapper}>
                    <i className="fas fa-tools" style={styles.icon}></i>
                </div>
                <h1 style={styles.title}>{t('maintenance.title')}</h1>
                <p style={styles.message}>{t('maintenance.message')}</p>
                <div style={styles.timeInfo}>
                    <p>{t('maintenance.estimated_time')}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(242, 246, 252) 0%, rgb(248, 250, 252) 90%)',
        padding: '2rem'
    },
    content: {
        textAlign: 'center',
        maxWidth: '600px',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 51, 102, 0.1)',
        animation: 'fadeInUp 0.6s ease-out'
    },
    iconWrapper: {
        width: '80px',
        height: '80px',
        backgroundColor: '#eefff6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        color: '#00cc88'
    },
    icon: {
        fontSize: '2.5rem'
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    message: {
        fontSize: '1.1rem',
        color: '#64748b',
        lineHeight: '1.6',
        marginBottom: '2rem'
    },
    timeInfo: {
        padding: '1rem 2rem',
        backgroundColor: '#f1f5f9',
        borderRadius: '50px',
        display: 'inline-block',
        color: '#475569',
        fontSize: '0.95rem',
        fontWeight: '500'
    }
};

// Add keyframes for animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(styleSheet);

export default MaintenancePage;
