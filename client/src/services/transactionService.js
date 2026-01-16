import { db } from '../firebase/config';
import {
    collection,
    doc,
    runTransaction,
    addDoc,
    serverTimestamp,
    getDoc,
    query,
    where,
    orderBy,
    getDocs
} from 'firebase/firestore';

const WALLETS_COLLECTION = 'wallets';
const TRANSACTIONS_COLLECTION = 'transactions';

export const transactionService = {
    // Perform an internal transfer between user's own wallets (Atomic)
    performInternalTransfer: async (userId, fromWalletId, toWalletId, amount) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");
            if (fromWalletId === toWalletId) throw new Error("Impossible de virer vers le même compte");

            await runTransaction(db, async (transaction) => {
                const fromWalletRef = doc(db, WALLETS_COLLECTION, fromWalletId);
                const toWalletRef = doc(db, WALLETS_COLLECTION, toWalletId);

                const fromWalletDoc = await transaction.get(fromWalletRef);
                const toWalletDoc = await transaction.get(toWalletRef);

                if (!fromWalletDoc.exists() || !toWalletDoc.exists()) {
                    throw new Error("Compte introuvable");
                }

                const fromData = fromWalletDoc.data();
                const toData = toWalletDoc.data();

                if (fromData.userId !== userId || toData.userId !== userId) {
                    throw new Error("Non autorisé");
                }

                if (fromData.balance < amount) {
                    throw new Error("Solde insuffisant");
                }

                const newFromBalance = fromData.balance - amount;
                const newToBalance = toData.balance + amount;

                // Update balances
                transaction.update(fromWalletRef, { balance: newFromBalance });
                transaction.update(toWalletRef, { balance: newToBalance });

                // Create transaction records
                const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION));
                transaction.set(transactionRef, {
                    userId,
                    type: 'transfer_internal',
                    amount,
                    currency: fromData.currency,
                    fromWalletId,
                    toWalletId,
                    status: 'completed',
                    createdAt: serverTimestamp(),
                    description: `Virement vers ${toData.type === 'savings' ? 'Épargne' : 'Compte principal'}`
                });
            });

            return { success: true };
        } catch (error) {
            console.error("Internal transfer error:", error);
            throw error;
        }
    },

    // Request an external transfer (Pending verification, no immediate debit)
    requestExternalTransfer: async (userId, fromWalletId, beneficiaryName, iban, amount) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");

            const fromWalletRef = doc(db, WALLETS_COLLECTION, fromWalletId);
            const fromWalletDoc = await getDoc(fromWalletRef);

            if (!fromWalletDoc.exists()) throw new Error("Compte introuvable");

            const fromData = fromWalletDoc.data();
            if (fromData.userId !== userId) throw new Error("Non autorisé");
            if (fromData.balance < amount) throw new Error("Solde insuffisant");

            // Create transaction record (Pending)
            const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
                userId,
                type: 'transfer_external',
                amount,
                currency: fromData.currency,
                fromWalletId,
                beneficiaryName,
                beneficiaryIban: iban,
                status: 'pending',
                createdAt: serverTimestamp(),
                description: `Virement pour ${beneficiaryName} (Contrôle INVIK)`
            });

            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("External transfer request error:", error);
            throw error;
        }
    },

    // Deposit funds (Top-up) - Simulates receiving money
    depositFunds: async (userId, toWalletId, amount, method) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");

            await runTransaction(db, async (transaction) => {
                const toWalletRef = doc(db, WALLETS_COLLECTION, toWalletId);
                const toWalletDoc = await transaction.get(toWalletRef);

                if (!toWalletDoc.exists()) throw new Error("Compte introuvable");
                const toData = toWalletDoc.data();
                if (toData.userId !== userId) throw new Error("Non autorisé");

                const newBalance = toData.balance + amount;
                transaction.update(toWalletRef, { balance: newBalance });

                // Create transaction record
                const transactionRef = doc(collection(db, TRANSACTIONS_COLLECTION));
                transaction.set(transactionRef, {
                    userId,
                    type: 'deposit',
                    amount,
                    currency: toData.currency,
                    toWalletId,
                    method, // 'card' or 'bank_transfer'
                    status: 'completed',
                    createdAt: serverTimestamp(),
                    description: `Rechargement par ${method === 'card' ? 'Carte Bancaire' : 'Virement'}`
                });
            });

            return { success: true };
        } catch (error) {
            console.error("Deposit error:", error);
            throw error;
        }
    },

    // Request deposit (Pending validation)
    requestDeposit: async (userId, toWalletId, amount, method, currency = 'EUR') => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");

            const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
                userId,
                type: 'deposit',
                amount,
                currency,
                toWalletId,
                method, // 'card' or 'bank_transfer'
                status: 'pending',
                createdAt: serverTimestamp(),
                description: `Dépôt par ${method === 'card' ? 'Carte Bancaire' : 'Virement'} (Traitement en cours)`
            });

            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("Deposit request error:", error);
            throw error;
        }
    },

    // Fetch user transactions
    getUserTransactions: async (userId) => {
        try {
            const q = query(
                collection(db, TRANSACTIONS_COLLECTION),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Fetch transactions error:", error);
            throw error;
        }
    }
};
