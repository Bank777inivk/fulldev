import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    serverTimestamp,
    addDoc,
    deleteDoc // Added
} from 'firebase/firestore';

const WALLETS_COLLECTION = 'wallets';

export const walletService = {
    // ... (existing methods)

    // Delete a wallet
    deleteWallet: async (walletId) => {
        try {
            await deleteDoc(doc(db, WALLETS_COLLECTION, walletId));
        } catch (error) {
            console.error("Error deleting wallet:", error);
            throw error;
        }
    },

    // Fetch all wallets for a specific user
    // Fetch all wallets for a specific user
    getUserWallets: async (userId) => {
        try {
            const q = query(collection(db, WALLETS_COLLECTION), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const wallets = [];
            querySnapshot.forEach((doc) => {
                wallets.push({ id: doc.id, ...doc.data() });
            });
            return wallets;
        } catch (error) {
            console.error("Error fetching wallets:", error);
            throw error;
        }
    },

    // Create initial wallets for a new user
    createInitialWallets: async (userId, accountType = 'standard', mainCurrency = 'EUR') => {
        try {
            const wallets = [];

            // 1. Main Wallet (always created)
            const mainWallet = {
                userId,
                type: 'main',
                currency: mainCurrency,
                balance: 0,
                iban: generateIBAN('main', userId),
                bic: 'INVKFR2P',
                createdAt: serverTimestamp()
            };
            wallets.push(mainWallet);

            // 2. If account with savings, create savings and credit wallets
            if (accountType === 'savings') {
                const savingsWallet = {
                    userId,
                    type: 'savings',
                    currency: mainCurrency,
                    balance: 0,
                    iban: generateIBAN('savings', userId),
                    bic: 'INVKFR2P',
                    createdAt: serverTimestamp()
                };
                const creditWallet = {
                    userId,
                    type: 'credit',
                    currency: mainCurrency,
                    balance: 0,
                    iban: generateIBAN('credit', userId),
                    bic: 'INVKFR2P',
                    createdAt: serverTimestamp()
                };
                wallets.push(savingsWallet, creditWallet);
            }

            // Save all wallets to Firestore and collect IDs
            const createdWallets = [];
            for (const walletData of wallets) {
                const docRef = await addDoc(collection(db, WALLETS_COLLECTION), walletData);
                createdWallets.push({ id: docRef.id, ...walletData });
            }

            return createdWallets;
        } catch (error) {
            console.error("Error creating initial wallets:", error);
            throw error;
        }
    },

    // Request new account opening
    requestAccountOpening: async (userId, requestData) => {
        try {
            await addDoc(collection(db, 'account_requests'), {
                userId,
                type: requestData.type,
                details: requestData.details || '',
                status: 'pending',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error submitting account request:", error);
            throw error;
        }
    },

    // Create a specific wallet (e.g., credit)
    createWallet: async (userId, type, amount = 0, currency = 'EUR') => {
        try {
            const walletData = {
                userId,
                type,
                currency,
                balance: amount,
                iban: generateIBAN(type, userId),
                bic: 'INVKFR2P',
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, WALLETS_COLLECTION), walletData);
            return { id: docRef.id, ...walletData };
        } catch (error) {
            console.error(`Error creating ${type} wallet:`, error);
            throw error;
        }
    }
};

// Helper to generate a realistic IBAN
const generateIBAN = (type, userId) => {
    const country = 'FR76';
    const bankCode = '12345';
    const branchCode = '67890';
    const suffix = type === 'main' ? '01' : (type === 'savings' ? '02' : (type === 'credit' ? '03' : '99'));
    const userPart = userId.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
    return `${country} ${bankCode} ${branchCode} ${userPart} ${suffix}`;
};
