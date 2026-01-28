import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DashboardHeader = ({ toggleSidebar }) => {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (!userData?.uid) return;

        // Subscribe to notifications in real-time
        const unsubscribe = notificationService.subscribeToNotifications(
            userData.uid,
            (data) => setNotifications(data)
        );

        return () => unsubscribe();
    }, [userData?.uid]);

    // Close notifications when clicking outside (minimalist implementation)
    useEffect(() => {
        const handleClick = () => setShowNotifications(false);
        if (showNotifications) {
            window.addEventListener('click', handleClick);
        }
        return () => window.removeEventListener('click', handleClick);
    }, [showNotifications]);

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="sidebar-toggle md-only" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className="header-search sm-hide">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder={t('header.search_placeholder')} />
                </div>
            </div>

            <div className="header-right">
                <div
                    className="header-notifications"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifications(!showNotifications);
                    }}
                >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount}</span>
                    )}

                    {showNotifications && (
                        <NotificationDropdown
                            notifications={notifications}
                            onClose={() => setShowNotifications(false)}
                        />
                    )}
                </div>

                <div
                    className="header-profile"
                    onClick={() => navigate('/dashboard/settings')}
                    title={t('header.profile_title')}
                >
                    <div className="profile-avatar">
                        {userData?.firstName?.charAt(0) || <i className="fas fa-user"></i>}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
