import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardHeader = ({ toggleSidebar }) => {
    const { userData } = useAuth();

    return (
        <header className="dashboard-header">
            <div className="header-left">
                <button className="sidebar-toggle md-only" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className="header-search sm-hide">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Rechercher une transaction..." />
                </div>
            </div>

            <div className="header-right">
                <div className="header-notifications">
                    <i className="fas fa-bell"></i>
                    <span className="notif-badge"></span>
                </div>

                <div className="header-profile">
                    <div className="profile-info sm-hide">
                        <span className="profile-name">{userData?.firstName} {userData?.lastName}</span>
                        <span className="profile-id">ID: {userData?.uid?.substring(0, 8)}</span>
                    </div>
                    <div className="profile-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
