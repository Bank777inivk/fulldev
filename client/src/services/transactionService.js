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
const USERS_COLLECTION = 'users';

const DAILY_LIMIT = 50000;
const INVIK_BANK_CODE = '12345';

export const transactionService = {
    // Utility to detect if an IBAN belongs to INVIK Bank
    isInvikIban: (iban) => {
        if (!iban) return false;
        const cleanIban = iban.replace(/\s/g, '');
        // Based on our IBAN generation: FR76 12345 ...
        return cleanIban.includes(INVIK_BANK_CODE);
    },

    // Check if user has exceeded their daily transfer limit
    checkDailyLimit: async (userId, newAmount) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Simple query that only requires a single-field index (default)
            const q = query(
                collection(db, TRANSACTIONS_COLLECTION),
                where('userId', '==', userId)
            );

            const querySnapshot = await getDocs(q);
            let totalToday = 0;

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const txDate = data.createdAt?.toDate();

                // Filter in-memory: Today + Valid Status + Transfer Type
                if (txDate >= today &&
                    ['completed', 'pending', 'in_review'].includes(data.status) &&
                    data.type.startsWith('transfer_')) {
                    totalToday += parseFloat(data.amount) || 0;
                }
            });

            if (totalToday + parseFloat(newAmount) > DAILY_LIMIT) {
                throw new Error(`Limite quotidienne de ${DAILY_LIMIT.toLocaleString('fr-FR')}€ dépassée. (Déjà utilisé aujourd'hui : ${totalToday.toLocaleString('fr-FR')}€)`);
            }
            return true;
        } catch (error) {
            console.error("Error checking daily limit:", error);
            throw error;
        }
    },

    // Perform an internal transfer between user's own wallets (Atomic)
    performInternalTransfer: async (userId, fromWalletId, toWalletId, amount) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");
            if (fromWalletId === toWalletId) throw new Error("Impossible de virer vers le même compte");

            // Check Daily Limit
            await transactionService.checkDailyLimit(userId, amount);

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

    // Instant Transfer between two different INVIK Bank users
    performInstantTransfer: async (userId, fromWalletId, targetIban, beneficiaryName, amount) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");

            // Check Daily Limit
            await transactionService.checkDailyLimit(userId, amount);

            // 1. Find the target wallet by IBAN
            const q = query(collection(db, WALLETS_COLLECTION), where("iban", "==", targetIban));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // If not found, fall back to external transfer request
                return await transactionService.requestExternalTransfer(userId, fromWalletId, beneficiaryName, targetIban, amount);
            }

            const targetWalletDoc = querySnapshot.docs[0];
            const targetWalletId = targetWalletDoc.id;
            // 2. Fetch sender's name for audit
            let senderDisplayName = "Client INVIK BANK";
            try {
                const userSnapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    senderDisplayName = `${userData.firstName} ${userData.lastName}`;
                }
            } catch (e) { console.warn("Could not fetch sender name"); }

            await runTransaction(db, async (transaction) => {
                const fromWalletRef = doc(db, WALLETS_COLLECTION, fromWalletId);
                const toWalletRef = doc(db, WALLETS_COLLECTION, targetWalletId);

                const fromSnapshot = await transaction.get(fromWalletRef);
                const toSnapshot = await transaction.get(toWalletRef);

                if (!fromSnapshot.exists() || !toSnapshot.exists()) {
                    throw new Error("Compte introuvable");
                }

                const fromData = fromSnapshot.data();
                const toData = toSnapshot.data();

                if (fromData.userId !== userId) throw new Error("Non autorisé");
                if (fromData.balance < amount) throw new Error("Solde insuffisant");

                // Update balances
                transaction.update(fromWalletRef, { balance: fromData.balance - amount });
                transaction.update(toWalletRef, { balance: toData.balance + amount });

                // Create transaction record for SENDER
                const senderTxRef = doc(collection(db, TRANSACTIONS_COLLECTION));
                transaction.set(senderTxRef, {
                    userId,
                    type: 'transfer_instant',
                    amount,
                    currency: fromData.currency,
                    fromWalletId,
                    toWalletId: targetWalletId,
                    beneficiaryName,
                    beneficiaryIban: targetIban,
                    status: 'completed',
                    createdAt: serverTimestamp(),
                    description: `Virement instantané vers ${beneficiaryName}`
                });

                // Create transaction record for RECEIVER
                const receiverTxRef = doc(collection(db, TRANSACTIONS_COLLECTION));
                transaction.set(receiverTxRef, {
                    userId: toData.userId,
                    type: 'receive_instant',
                    amount,
                    currency: toData.currency,
                    fromWalletId,
                    toWalletId: targetWalletId,
                    senderName: senderDisplayName,
                    status: 'completed',
                    createdAt: serverTimestamp(),
                    description: `Transfert instantané reçu de ${senderDisplayName}`
                });
            });

            return { success: true, instant: true };
        } catch (error) {
            console.error("Instant transfer error:", error);
            throw error;
        }
    },

    // Request an external transfer (Pending verification, no immediate debit)
    requestExternalTransfer: async (userId, fromWalletId, beneficiaryName, iban, amount) => {
        try {
            amount = parseFloat(amount);
            if (isNaN(amount) || amount <= 0) throw new Error("Montant invalide");

            // Check Daily Limit
            await transactionService.checkDailyLimit(userId, amount);

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
