import { db } from '../firebase/config';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    deleteDoc,
    addDoc
} from 'firebase/firestore';

export const adminService = {
    // Get all users
    getAllUsers: async () => {
        const snapshot = await getDocs(collection(db, 'users'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get single user
    getUser: async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    },

    // Get all transactions
    getAllTransactions: async () => {
        const snapshot = await getDocs(
            query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get all KYC verifications
    getAllKYC: async () => {
        const snapshot = await getDocs(
            query(collection(db, 'kyc'), orderBy('submittedAt', 'desc'))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get all card requests
    getAllCardRequests: async () => {
        const snapshot = await getDocs(collection(db, 'card_requests'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Update KYC status
    updateKYCStatus: async (kycId, status, reviewNotes = '') => {
        let verificationLevel = 0;
        // Use 'verified' instead of 'approved'
        if (status === 'verified') {
            verificationLevel = 2;
        } else if (status === 'submitted' || status === 'pending') {
            verificationLevel = 1;
        }

        await updateDoc(doc(db, 'kyc', kycId), {
            status, // 'verified', 'unverified', 'submitted', etc.
            verificationLevel,
            reviewNotes,
            reviewedAt: status === 'submitted' || status === 'pending' ? null : new Date(),
            updatedAt: new Date()
        });
    },

    // Update card request status
    updateCardRequestStatus: async (requestId, status, reviewNotes = '') => {
        await updateDoc(doc(db, 'card_requests', requestId), {
            status,
            reviewNotes,
            updatedAt: new Date()
        });
    },

    // Update transaction status
    updateTransactionStatus: async (transactionId, status) => {
        await updateDoc(doc(db, 'transactions', transactionId), {
            status,
            updatedAt: new Date()
        });
    },

    // Block/unblock user
    updateUserStatus: async (userId, accountStatus) => {
        await updateDoc(doc(db, 'users', userId), {
            accountStatus,
            updatedAt: new Date()
        });
    },

    // --- Active Cards Manipulation ---
    updateActiveCardStatus: async (cardId, status) => {
        await updateDoc(doc(db, 'cards', cardId), {
            status,
            updatedAt: new Date()
        });
    },

    updateActiveCardDetails: async (cardId, data) => {
        await updateDoc(doc(db, 'cards', cardId), {
            ...data,
            updatedAt: new Date()
        });
    },

    deleteCardRequest: async (requestId) => {
        await deleteDoc(doc(db, 'card_requests', requestId));
    },

    deleteActiveCard: async (cardId) => {
        await deleteDoc(doc(db, 'cards', cardId));
    },

    createCard: async (cardData) => {
        const docRef = await addDoc(collection(db, 'cards'), {
            ...cardData,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
    },

    // Update user details
    updateUser: async (userId, data) => {
        await updateDoc(doc(db, 'users', userId), {
            ...data,
            updatedAt: new Date()
        });
    },

    // Get user's wallets
    getUserWallets: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'wallets'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's transactions
    getUserTransactions: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'transactions'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's KYC data
    getUserKYC: async (userId) => {
        try {
            // First try to get by document ID (standard pattern)
            const docRef = doc(db, 'kyc', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log('Found KYC by ID:', docSnap.data());
                return { id: docSnap.id, ...docSnap.data() };
            }

            // If not found, try querying by userId field (fallback)
            const q = query(collection(db, 'kyc'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                console.log('Found KYC by query:', querySnapshot.docs[0].data());
                return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            }

            console.log('No KYC data found for user:', userId);
            return null;
        } catch (error) {
            console.error('Error fetching KYC data:', error);
            return null;
        }
    },

    // Real-time listener for specific user transactions
    subscribeToUserTransactions: (userId, callback) => {
        const q = query(
            collection(db, 'transactions'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(transactions);
        });
    },

    // Real-time listeners
    subscribeToUsers: (callback) => {
        return onSnapshot(collection(db, 'users'), (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(users);
        });
    },

    subscribeToTransactions: (callback) => {
        return onSnapshot(
            query(collection(db, 'transactions'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(transactions);
            }
        );
    },

    subscribeToKYC: (callback) => {
        return onSnapshot(
            query(collection(db, 'kyc'), orderBy('submittedAt', 'desc')),
            (snapshot) => {
                const kycs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(kycs);
            }
        );
    },

    subscribeToCardRequests: (callback) => {
        return onSnapshot(
            collection(db, 'card_requests'),
            (snapshot) => {
                const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(requests);
            }
        );
    },

    subscribeToCards: (callback) => {
        return onSnapshot(
            collection(db, 'cards'),
            (snapshot) => {
                const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(cards);
            }
        );
    },

    // --- Wallet Management ---
    updateWalletBalance: async (walletId, newBalance) => {
        await updateDoc(doc(db, 'wallets', walletId), {
            balance: Number(newBalance),
            updatedAt: new Date()
        });
    },

    updateWalletDetails: async (walletId, data) => {
        await updateDoc(doc(db, 'wallets', walletId), {
            ...data,
            updatedAt: new Date()
        });
    },

    subscribeToAllWallets: (callback) => {
        return onSnapshot(collection(db, 'wallets'), (snapshot) => {
            const wallets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(wallets);
        });
    },

    // --- Loan Management ---
    subscribeToLoans: (callback) => {
        return onSnapshot(
            query(collection(db, 'loans'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(loans);
            }
        );
    },

    updateLoanStatus: async (loanId, status, reviewNotes = '') => {
        await updateDoc(doc(db, 'loans', loanId), {
            status,
            reviewNotes,
            reviewedAt: new Date(),
            updatedAt: new Date()
        });
    },

    deleteLoan: async (loanId) => {
        await deleteDoc(doc(db, 'loans', loanId));
    }
};
