import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState(null);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const showModal = useCallback((options) => {
        return new Promise((resolve) => {
            setModal({
                ...options,
                onConfirm: () => {
                    setModal(null);
                    resolve(true);
                },
                onCancel: () => {
                    setModal(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const value = {
        showToast,
        showModal,
        alert: (message, title = 'Notification') => showModal({ title, message, type: 'alert' }),
        confirm: (message, title = 'Confirmation') => showModal({ title, message, type: 'confirm' })
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer toasts={toasts} modal={modal} />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = ({ toasts, modal }) => {
    return (
        <>
            {/* Toasts Container */}
            <div style={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} style={{ ...styles.toast, ...styles[toast.type] }}>
                        <i className={getIcon(toast.type)} style={styles.toastIcon}></i>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {modal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{ ...styles.modalHeader, borderBottom: `2px solid ${getBrandColor(modal.type)}` }}>
                            <i className={getIcon(modal.type)} style={{ ...styles.modalHeaderIcon, color: getBrandColor(modal.type) }}></i>
                            <h3 style={styles.modalTitle}>{modal.title || 'Notification'}</h3>
                        </div>
                        <div style={styles.modalBody}>
                            {modal.message}
                        </div>
                        <div style={styles.modalFooter}>
                            {modal.type === 'confirm' && (
                                <button style={styles.cancelBtn} onClick={modal.onCancel}>Annuler</button>
                            )}
                            <button
                                style={{ ...styles.confirmBtn, backgroundColor: getBrandColor(modal.type) }}
                                onClick={modal.onConfirm}
                            >
                                {modal.confirmText || 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeInScale {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                `}
            </style>
        </>
    );
};

const getIcon = (type) => {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'confirm': return 'fas fa-question-circle';
        default: return 'fas fa-info-circle';
    }
};

const getBrandColor = (type) => {
    switch (type) {
        case 'success': return '#27ae60';
        case 'error': return '#e74c3c';
        case 'warning': return '#f39c12';
        default: return '#003366'; // App base color
    }
};

const styles = {
    toastContainer: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10000,
    },
    toast: {
        padding: '12px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '250px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    info: { background: 'rgba(0, 51, 102, 0.9)' },
    success: { background: 'rgba(39, 174, 96, 0.9)' },
    error: { background: 'rgba(231, 76, 60, 0.9)' },
    warning: { background: 'rgba(243, 156, 18, 0.9)' },
    toastIcon: { fontSize: '1.2rem' },

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 5, 15, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
    },
    modalContent: {
        background: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '450px',
        padding: '0',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
        animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    modalHeader: {
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    modalHeaderIcon: {
        fontSize: '2rem',
    },
    modalTitle: {
        margin: 0,
        fontSize: '1.4rem',
        fontWeight: '800',
        color: '#003366',
    },
    modalBody: {
        padding: '24px',
        fontSize: '1.1rem',
        color: '#475569',
        lineHeight: '1.6',
    },
    modalFooter: {
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        background: '#f8fafc',
    },
    cancelBtn: {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        background: '#e2e8f0',
        color: '#64748b',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    confirmBtn: {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        color: 'white',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
};
