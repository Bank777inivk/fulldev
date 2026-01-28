import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    getDoc,
    doc
} from 'firebase/firestore';

const RIBS_COLLECTION = 'ribs';

export const ribService = {
    // Create a RIB document for a specific wallet
    createRib: async (userId, wallet) => {
        try {
            // Extract components from IBAN if possible (assuming FR standard)
            // FR76 12345 67890 AYTUQ19E 01
            const ibanClean = (wallet.iban || '').replace(/\s+/g, '');
            const bankCode = ibanClean.substring(4, 9) || '12345';
            const branchCode = ibanClean.substring(9, 14) || '67890';
            const accountNumber = ibanClean.substring(14, ibanClean.length - 2) || '00000000';
            const ribKey = ibanClean.substring(ibanClean.length - 2) || '00';

            const ribData = {
                userId,
                walletId: wallet.id,
                walletType: wallet.type,
                accountName: wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1),
                holderName: wallet.holderName || 'Non défini',
                iban: wallet.iban,
                bic: wallet.bic || 'INVKFR2P',
                bankCode,
                branchCode,
                accountNumber,
                ribKey,
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
            // Fetch user data for the holder name
            const userDoc = await getDoc(doc(db, 'users', userId));
            const userData = userDoc.exists() ? userDoc.data() : {};
            const holderName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Titulaire Inconnu';

            const promises = wallets.map(wallet => {
                return ribService.createRib(userId, { ...wallet, holderName });
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
