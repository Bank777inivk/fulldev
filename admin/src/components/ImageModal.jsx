import React from 'react';

const ImageModal = ({ imageUrl, altText, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div style={styles.overlay} onClick={onClose} className="animate-fade-in">
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <img src={imageUrl} alt={altText || 'Document'} style={styles.image} />
                <button style={styles.closeBtn} onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    modalContent: {
        position: 'relative',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '90vh',
        objectFit: 'contain',
        display: 'block',
    },
    closeBtn: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s'
    }
};

export default ImageModal;
