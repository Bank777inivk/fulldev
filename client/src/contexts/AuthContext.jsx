import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updatePassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { walletService } from '../services/walletService';
import { cardService } from '../services/cardService';
import { ribService } from '../services/ribService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, profileData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            ...profileData,
            accountStatus: 'active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Create separate KYC document
        await setDoc(doc(db, "kyc", user.uid), {
            userId: user.uid,
            status: 'pending',
            submittedAt: null,
            reviewedAt: null,
            documents: {},
            verificationLevel: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Create initial wallets/accounts
        const wallets = await walletService.createInitialWallets(
            user.uid,
            profileData.accountType || 'standard',
            profileData.mainCurrency || 'EUR'
        );

        // Find main wallet for card creation
        const mainWallet = wallets.find(w => w.type === 'main');
        if (mainWallet) {
            await cardService.createInitialCard(user.uid, mainWallet.id);
        }

        // Create RIBs for all wallets
        await ribService.createInitialRibs(user.uid, wallets);

        // Send email verification
        await sendEmailVerification(user);

        return userCredential;
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch additional user data from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const updateUserData = async (newProfileData) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            ...newProfileData,
            updatedAt: serverTimestamp()
        });
        // Refresh local state
        setUserData(prev => ({ ...prev, ...newProfileData }));
    };

    const deleteAccount = async () => {
        if (!currentUser) return;
        const uid = currentUser.uid;

        // 1. Purge all Firestore data
        await userService.purgeFullUserData(uid);

        // 2. Logout (we don't delete from Auth directly as it requires re-auth/admin)
        await logout();
    };

    const checkEmailVerification = async () => {
        const user = auth.currentUser;
        if (!user) return;

        await user.reload();
        // Since reload() updates the existing object's properties, 
        // and setUserData will trigger a re-render, we just need to ensure
        // state points to the real Firebase User instance.
        setCurrentUser(user);

        // Also refresh Firestore user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            setUserData(userDoc.data());
        }
    };

    const changePassword = async (newPassword) => {
        const user = auth.currentUser;
        if (!user) return;
        await updatePassword(user, newPassword);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        user: currentUser,
        currentUser,
        userData,
        login,
        register,
        logout,
        updateUserData,
        deleteAccount,
        checkEmailVerification,
        changePassword,
        resetPassword,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
