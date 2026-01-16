import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from 'firebase/firestore';

const RIBS_COLLECTION = 'ribs';

export const ribService = {
    // Create a RIB document for a specific wallet
    createRib: async (userId, wallet) => {
        try {
            // Check if RIB already exists for this iban to avoid duplicates (optional logic)
            // For now, we trust the flow

            const ribData = {
                userId,
                walletId: wallet.id,
                walletType: wallet.type,
                accountName: `Compte ${wallet.type === 'main' ? 'Courant' : (wallet.type === 'savings' ? 'Épargne' : 'Crédit')}`,
                iban: wallet.iban,
                bic: wallet.bic,
                bankName: 'INVIK BANK',
                bankAddress: '12 Avenue de la Finance, 75008 Paris',
                status: 'active',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, RIBS_COLLECTION), ribData);
            return { id: docRef.id, ...ribData };
        } catch (error) {
            console.error("Error creating RIB:", error);
            throw error;
        }
    },

    // Create RIBs for all provided wallets
    createInitialRibs: async (userId, wallets) => {
        try {
            const promises = wallets.map(wallet => {
                // We create RIBs for Main and Savings. Credit might not have a standard RIB for deposit usually, but let's include all.
                return ribService.createRib(userId, wallet);
            });
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error creating initial RIBs:", error);
            throw error;
        }
    },

    getUserRibs: async (userId) => {
        try {
            const q = query(collection(db, RIBS_COLLECTION), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const ribs = [];
            querySnapshot.forEach((doc) => {
                ribs.push({ id: doc.id, ...doc.data() });
            });
            return ribs;
        } catch (error) {
            console.error("Error fetching RIBs:", error);
            throw error;
        }
    }
};
