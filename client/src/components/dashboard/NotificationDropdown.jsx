import React from 'react';
import { notificationService } from '../../services/notificationService';

const NotificationDropdown = ({ notifications, onClose }) => {
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
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="notifications-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <div className="notifications-header">
                <h3>Notifications</h3>
                <button onClick={handleMarkAllAsRead} className="mark-all-read">
                    Tout marquer comme lu
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
                                <p className="notif-title">{notif.title}</p>
                                <p className="notif-message">{notif.message}</p>
                                <span className="notif-time">{formatDate(notif.createdAt)}</span>
                            </div>
                            {!notif.read && <div className="unread-dot"></div>}
                        </div>
                    ))
                ) : (
                    <div className="no-notifications">
                        <i className="fas fa-bell-slash"></i>
                        <p>Aucune notification</p>
                    </div>
                )}
            </div>

            <div className="notifications-footer" onClick={onClose}>
                Fermer
            </div>
        </div>
    );
};

export default NotificationDropdown;
