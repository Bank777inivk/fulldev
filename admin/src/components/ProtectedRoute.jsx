import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#003366' }}></i>
                    <p style={{ marginTop: '1rem', color: '#666' }}>Vérification...</p>
                </div>
            </div>
        );
    }

    if (!currentUser || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
