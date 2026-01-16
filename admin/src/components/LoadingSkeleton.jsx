import React from 'react';

const LoadingSkeleton = ({ type = 'text', width, height, style }) => {
    const getStyles = () => {
        const baseStyles = {
            backgroundColor: '#e2e8f0',
            borderRadius: '4px',
            animation: 'shimmer 1.5s infinite linear',
            background: 'linear-gradient(to right, #eff6ff 4%, #e2e8f0 25%, #eff6ff 36%)',
            backgroundSize: '1000px 100%',
        };

        switch (type) {
            case 'circle':
                return {
                    ...baseStyles,
                    width: width || '40px',
                    height: height || '40px',
                    borderRadius: '50%',
                };
            case 'card':
                return {
                    ...baseStyles,
                    width: width || '100%',
                    height: height || '200px',
                    borderRadius: '16px',
                };
            case 'text':
            default:
                return {
                    ...baseStyles,
                    width: width || '100%',
                    height: height || '20px',
                    marginBottom: '8px',
                };
        }
    };

    return (
        <>
            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: -1000px 0; }
                        100% { background-position: 1000px 0; }
                    }
                `}
            </style>
            <div style={{ ...getStyles(), ...style }}></div>
        </>
    );
};

export default LoadingSkeleton;
