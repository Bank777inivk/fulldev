import React from 'react';
import { notificationService } from '../../services/notificationService';
import { useTranslation } from 'react-i18next';

const NotificationDropdown = ({ notifications, onClose }) => {
    const { t, i18n } = useTranslation();

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(notifications);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
        return d.toLocaleDateString(locale, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="notifications-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
                <h3>{t('notifications.title')}</h3>
                <button onClick={handleMarkAllAsRead} className="mark-all-read">
                    {t('notifications.mark_all_read')}
                </button>
            </div>

            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`notification-item ${!notif.read ? 'unread' : ''}`}
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                        >
                            <div className="notif-icon-wrapper">
                                <i className={`fas ${notif.type === 'deposit' ? 'fa-wallet' : 'fa-bell'}`}></i>
                            </div>
                            <div className="notif-content">
                                <p className="notif-title">
                                    {notif.titleKey ? t(notif.titleKey) : notif.title}
                                </p>
                                <p className="notif-message">
                                    {notif.messageKey ? t(notif.messageKey, notif.messageParams) : notif.message}
                                </p>
                                <span className="notif-time">{formatDate(notif.createdAt)}</span>
                            </div>
                            {!notif.read && <div className="unread-dot"></div>}
                        </div>
                    ))
                ) : (
                    <div className="no-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>{t('notifications.empty')}</p>
                    </div>
                )}
            </div>

            <div className="notifications-footer" onClick={onClose}>
                {t('notifications.close')}
            </div>
        </div>
    );
};

export default NotificationDropdown;
