import React from 'react';

const partners = [
    { name: 'BNP Paribas', logo: '🏦', color: '#00965E' },
    { name: 'Société Générale', logo: '🏦', color: '#E40421' },
    { name: 'Crédit Agricole', logo: '🏦', color: '#00707B' },
    { name: 'HSBC', logo: '🏦', color: '#DB0011' },
    { name: 'Boursorama', logo: '🏦', color: '#E4004B' },
    { name: 'Revolut', logo: '🏦', color: '#000000' },
    { name: 'Hello Bank', logo: '🏦', color: '#90D1E3' },
    { name: 'LCL', logo: '🏦', color: '#003DA5' },
];

const PartnersCarousel = () => {
    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.track}>
                    {/* Double the list for seamless infinite loop */}
                    {[...partners, ...partners].map((partner, index) => (
                        <div key={index} style={styles.card}>
                            <div style={{ ...styles.logoIcon, color: partner.color }}>
                                {partner.logo}
                            </div>
                            <span style={styles.partnerName}>{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-250px * ${partners.length})); }
                }

                @media (max-width: 768px) {
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-180px * ${partners.length})); }
                    }
                }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        padding: '3rem 0',
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    wrapper: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    track: {
        display: 'flex',
        width: 'fit-content',
        animation: 'scroll 30s linear infinite',
    },
    card: {
        flex: '0 0 250px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '0 1rem',
        filter: 'grayscale(1) opacity(0.6)',
        transition: 'all 0.4s ease',
        cursor: 'default',
        '@media (max-width: 768px)': {
            flex: '0 0 180px',
        }
    },
    logoIcon: {
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    partnerName: {
        fontSize: '1.2rem',
        fontWeight: '800',
        color: 'inherit',
        fontFamily: "'Outfit', sans-serif",
    }
};

export default PartnersCarousel;
