import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                }
            }
            setCheckingRole(false);
        };

        if (!loading) {
            checkUserRole();
        }
    }, [currentUser, loading]);

    if (loading || checkingRole) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="loader">Chargement...</div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Skip email verification check for admin users
    if (!isAdmin && !currentUser.emailVerified) {
        return <Navigate to="/email-verification-pending" />;
    }

    return children;
};

export default ProtectedRoute;
