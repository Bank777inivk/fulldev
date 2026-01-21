import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut as firebaseSignOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db } from '../firebase/config';
import { adminEmailService } from './adminEmailService';
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
    addDoc,
    runTransaction,
    serverTimestamp
} from 'firebase/firestore';

export const adminService = {
    // Get all users (with optional filtering for non-super admins)
    getAllUsers: async (currentUserIsSuperAdmin = false) => {
        const snapshot = await getDocs(collection(db, 'users'));
        let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter out admin accounts if current user is not super admin
        if (!currentUserIsSuperAdmin) {
            users = users.filter(user => user.role !== 'admin');
        }

        return users;
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
    updateKYCStatus: async (userId, status, reviewNotes = '') => {
        let verificationLevel = 0;
        if (status === 'verified') {
            verificationLevel = 2;
        } else if (status === 'submitted' || status === 'pending') {
            verificationLevel = 1;
        }

        await updateDoc(doc(db, 'kyc', userId), {
            status,
            verificationLevel,
            reviewNotes,
            reviewedAt: status === 'submitted' || status === 'pending' ? null : new Date(),
            updatedAt: new Date()
        });

        // Trigger Email Notification
        if (status === 'verified' || status === 'unverified') {
            try {
                const userSnap = await getDoc(doc(db, 'users', userId));
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const name = userData.firstName || 'Client';
                    if (status === 'verified') {
                        await adminEmailService.sendKYCSuccessEmail(userData.email, name);
                    } else {
                        await adminEmailService.sendKYCRejectionEmail(userData.email, name, reviewNotes);
                    }
                }
            } catch (err) {
                console.warn("Failed to send KYC status email:", err);
            }
        }
    },

    // Update card request status
    updateCardRequestStatus: async (requestId, status, reviewNotes = '') => {
        await updateDoc(doc(db, 'card_requests', requestId), {
            status,
            reviewNotes,
            updatedAt: new Date()
        });

        // Trigger Email Notification
        if (status === 'approved' || status === 'delivered') {
            try {
                const reqSnap = await getDoc(doc(db, 'card_requests', requestId));
                if (reqSnap.exists()) {
                    const reqData = reqSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', reqData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        if (status === 'approved') {
                            await adminEmailService.sendCardShippedEmail(userData.email, name, reqData.cardType || 'Black Edition');
                        }
                        // 'delivered' is often followed by manual activation in this UI, 
                        // so we can wait for activation or send a delivery confirmation.
                    }
                }
            } catch (err) {
                console.warn("Failed to send card status email:", err);
            }
        }
    },

    // Update transaction status (with automatic wallet balance update and UNDO support)
    updateTransactionStatus: async (transactionId, status) => {
        try {
            await runTransaction(db, async (transaction) => {
                const txRef = doc(db, 'transactions', transactionId);
                const txSnap = await transaction.get(txRef);

                if (!txSnap.exists()) throw new Error("Transaction non trouvée");

                const txData = txSnap.data();
                const userId = txData.userId;
                const oldStatus = txData.status;

                // Only proceed if status is actually changing
                if (oldStatus === status) return;
                if (oldStatus === 'completed') throw new Error("Cette transaction est déjà finalisée.");

                // --- 1. COLLECT ALL READS FIRST ---
                let walletSnap = null;
                let userSnap = null;
                let walletRef = null;
                let userRef = null;

                // Identify relevant wallet
                let walletId = txData.fromWalletId || txData.toWalletId || txData.walletId;
                if (!walletId && userId && status === 'completed') {
                    const walletsQuery = query(collection(db, 'wallets'), where('userId', '==', userId), where('type', '==', 'main'));
                    const walletsSnap = await getDocs(walletsQuery);
                    if (!walletsSnap.empty) walletId = walletsSnap.docs[0].id;
                }

                if (walletId && status === 'completed') {
                    walletRef = doc(db, 'wallets', walletId);
                    walletSnap = await transaction.get(walletRef);
                }

                if (userId && status === 'completed') {
                    userRef = doc(db, 'users', userId);
                    userSnap = await transaction.get(userRef);
                }

                // --- 2. LOGIC FOR BALANCE ADJUSTMENT ---
                const amount = parseFloat(txData.amount) || 0;
                const isDebit = /transfer|debit|withdraw/i.test(txData.type);
                const isCredit = /deposit|credit|receive/i.test(txData.type);

                let balanceDelta = 0;

                // Transaction becomes COMPLETED (Impact balance normally)
                if (status === 'completed') {
                    if (isDebit) balanceDelta = -amount;
                    else if (isCredit) balanceDelta = +amount;
                }

                // --- 3. PERFORM ALL WRITES ---

                // Update Transaction Status
                transaction.update(txRef, {
                    status,
                    updatedAt: serverTimestamp()
                });

                // Update Wallet Balance if delta exists
                if (balanceDelta !== 0 && walletSnap && walletSnap.exists()) {
                    const currentBalance = walletSnap.data().balance || 0;
                    transaction.update(walletRef, {
                        balance: currentBalance + balanceDelta,
                        updatedAt: serverTimestamp()
                    });

                    // Update User Global Balance
                    if (userSnap && userSnap.exists()) {
                        const currentGlobal = userSnap.data().balance || 0;
                        transaction.update(userRef, {
                            balance: currentGlobal + balanceDelta,
                            updatedAt: serverTimestamp()
                        });
                    }

                    // Notification for state change
                    const notifTitle = status === 'completed' ? '✅ Opération validée' :
                        status === 'in_review' ? '🔍 Virement en examen' : '⚠️ Statut mis à jour';

                    const notifMessage = status === 'completed'
                        ? `Votre opération de ${amount.toFixed(2)}€ a été finalisée.`
                        : status === 'in_review'
                            ? `Votre virement de ${amount.toFixed(2)}€ est actuellement en examen pour contrôle de sécurité. Vous serez notifié dès la levée des restrictions par nos services.`
                            : `Le statut de votre opération de ${amount.toFixed(2)}€ a été modifiée par un administrateur (${status}). Votre solde a été ajusté en conséquence.`;

                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, {
                        userId,
                        title: notifTitle,
                        message: notifMessage,
                        type: status === 'in_review' ? 'security' : 'info',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                } else if (status === 'in_review') {
                    // Even if no balance delta, we still want to notify for in_review
                    const amount = parseFloat(txData.amount) || 0;
                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, {
                        userId,
                        title: '🔍 Virement en examen',
                        message: `Votre virement de ${amount.toFixed(2)}€ est actuellement en examen pour contrôle de sécurité. Vous serez notifié dès la levée des restrictions par nos services.`,
                        type: 'security',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }

                // --- 4. ASYNC EMAIL TRIGGER (Post-Transaction) ---
                // (Note: We do this after the transaction if possible, or using a flag)
                // Since this is a client-side service calling Firestore, we can't easily wait for transaction commit here,
                // but we can trigger it after the await runTransaction returns.
            });

            // Trigger Email Notification after successful transaction
            try {
                const txSnap = await getDoc(doc(db, 'transactions', transactionId));
                if (txSnap.exists()) {
                    const txData = txSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', txData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        const amount = txData.amount;
                        const currency = txData.currency || '€';
                        const desc = txData.description || 'Virement';

                        if (status === 'completed') {
                            await adminEmailService.sendTransactionValidatedEmail(userData.email, name, amount, currency, desc);
                        } else if (status === 'in_review') {
                            await adminEmailService.sendTransactionInReviewEmail(userData.email, name, amount, currency, desc);
                        } else if (status === 'rejected') {
                            await adminEmailService.sendTransactionRejectedEmail(userData.email, name, amount, currency, 'Alerte de sécurité.');
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to send transaction status email:", err);
            }

            return { success: true };
        } catch (error) {
            console.error('Error in updateTransactionStatus:', error);
            throw error;
        }
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

    // Get user's cards
    getUserCards: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, 'cards'), where('userId', '==', userId))
        );
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get user's beneficiaries
    getUserBeneficiaries: async (userId) => {
        const snapshot = await getDocs(
            query(collection(db, "users", userId, "beneficiaries"), orderBy("createdAt", "desc"))
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

    // Create a deposit with transaction logging and client notification
    createAdminDeposit: async (userId, walletId, amount, newBalance) => {
        try {
            await runTransaction(db, async (transaction) => {
                const walletRef = doc(db, 'wallets', walletId);
                const userRef = doc(db, 'users', userId);

                // 1. Update Wallet Balance
                transaction.update(walletRef, {
                    balance: Number(newBalance),
                    updatedAt: serverTimestamp()
                });

                // 2. Update User Global Balance (source of truth for some views)
                transaction.update(userRef, {
                    balance: Number(newBalance),
                    updatedAt: serverTimestamp()
                });

                // 3. Create Transaction Record
                const txRef = doc(collection(db, 'transactions'));
                transaction.set(txRef, {
                    userId,
                    walletId,
                    type: amount >= 0 ? 'credit' : 'debit',
                    amount: Math.abs(amount),
                    status: 'completed',
                    description: amount >= 0 ? 'Dépôt INVIK BANK' : 'Ajustement de solde Admin',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });

                // 4. Create Notification for the client
                if (amount > 0) {
                    const notifRef = doc(collection(db, 'notifications'));
                    transaction.set(notifRef, {
                        userId,
                        title: '💰 Nouveau dépôt reçu',
                        message: `Votre compte INVIK BANK a été crédité d'un montant de ${amount}€. Cette opération a été effectuée avec succès. Nous vous remercions de votre confiance.\n\nNouveau solde : ${Number(newBalance).toFixed(2)}€`,
                        type: 'deposit',
                        read: false,
                        createdAt: serverTimestamp()
                    });
                }
            });
            return { success: true };
        } catch (error) {
            console.error('Error in createAdminDeposit:', error);
            throw error;
        }
    },

    updateWalletDetails: async (walletId, data) => {
        try {
            console.log(`[RIB-SYNC] Tentative de mise à jour pour le portefeuille: ${walletId}`);

            // 1. Update the Main Wallet document
            await updateDoc(doc(db, 'wallets', walletId), {
                ...data,
                updatedAt: new Date()
            });

            // 2. Synchronize RIB collection if relevant data changed
            if (data.iban || data.bic || data.holderName) {
                const ribsQuery = query(collection(db, 'ribs'), where('walletId', '==', walletId));
                const ribSnapshot = await getDocs(ribsQuery);

                if (ribSnapshot.empty) {
                    console.warn(`[RIB-SYNC] Aucun document RIB trouvé pour le portefeuille ${walletId}.`);
                } else {
                    console.log(`[RIB-SYNC] ${ribSnapshot.size} document(s) RIB trouvé(s) à synchroniser.`);
                }

                const ribPromises = ribSnapshot.docs.map(ribDoc => {
                    const updateData = { ...data };

                    // Decompose IBAN if present
                    if (data.iban) {
                        const ibanClean = data.iban.replace(/\s+/g, '');
                        updateData.bankCode = ibanClean.substring(4, 9) || '12345';
                        updateData.branchCode = ibanClean.substring(9, 14) || '67890';
                        updateData.accountNumber = ibanClean.substring(14, ibanClean.length - 2) || '00000000';
                        updateData.ribKey = ibanClean.substring(ibanClean.length - 2) || '00';
                    }

                    updateData.updatedAt = serverTimestamp();

                    console.log(`[RIB-SYNC] Mise à jour du RIB ${ribDoc.id} avec succès.`);
                    return updateDoc(doc(db, 'ribs', ribDoc.id), updateData);
                });

                await Promise.all(ribPromises);
            }
        } catch (error) {
            console.error("[RIB-SYNC] Erreur critique lors de la mise à jour:", error);
            throw error;
        }
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

    subscribeToLeads: (callback) => {
        return onSnapshot(
            query(collection(db, 'loan_leads'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(leads);
            }
        );
    },

    subscribeToContactMessages: (callback) => {
        return onSnapshot(
            query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(messages);
            }
        );
    },

    subscribeToSupportTickets: (callback) => {
        return onSnapshot(
            query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(tickets);
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

        // Trigger Email Notification
        if (status === 'approved' || status === 'rejected') {
            try {
                const loanSnap = await getDoc(doc(db, 'loans', loanId));
                if (loanSnap.exists()) {
                    const loanData = loanSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', loanData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        const name = userData.firstName || 'Client';
                        if (status === 'approved') {
                            await adminEmailService.sendLoanApprovedEmail(userData.email, name, loanData.amount, loanData.currency || '€');
                        } else {
                            await adminEmailService.sendLoanRejectedEmail(userData.email, name, reviewNotes);
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to send loan status email:", err);
            }
        }
    },

    deleteLoan: async (loanId) => {
        await deleteDoc(doc(db, 'loans', loanId));
    },

    // --- Account Requests ---
    getAllAccountRequests: async () => {
        const snapshot = await getDocs(collection(db, 'account_requests'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    subscribeToAccountRequests: (callback) => {
        const q = query(collection(db, 'account_requests'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(requests);
        });
    },

    approveAccountRequest: async (requestId, userId, type, currency = 'EUR') => {
        try {
            await runTransaction(db, async (transaction) => {
                const requestRef = doc(db, 'account_requests', requestId);
                const requestSnap = await transaction.get(requestRef);
                if (!requestSnap.exists()) throw new Error("Demande introuvable");

                const newWalletRef = doc(collection(db, 'wallets'));
                const walletData = {
                    userId,
                    type,
                    currency,
                    balance: 0,
                    iban: generateAdminIBAN(type, userId),
                    bic: 'INVKFR2P',
                    createdAt: serverTimestamp(),
                    status: 'active'
                };
                transaction.set(newWalletRef, walletData);

                transaction.update(requestRef, {
                    status: 'approved',
                    approvedAt: serverTimestamp(),
                    createdWalletId: newWalletRef.id
                });
            });
        } catch (error) {
            console.error("Error approving account request:", error);
            throw error;
        }
    },

    rejectAccountRequest: async (requestId, reviewNotes = '') => {
        await updateDoc(doc(db, 'account_requests', requestId), {
            status: 'rejected',
            reviewNotes,
            rejectedAt: serverTimestamp()
        });
    },

    deleteAccountRequest: async (requestId) => {
        await deleteDoc(doc(db, 'account_requests', requestId));
    },

    // --- Lead Management ---
    updateLeadStatus: async (leadId, status) => {
        await updateDoc(doc(db, 'loan_leads', leadId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    // --- Contact Message Management ---
    updateContactMessageStatus: async (messageId, status) => {
        await updateDoc(doc(db, 'contact_messages', messageId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    // --- Support Ticket Management ---
    updateSupportTicketStatus: async (ticketId, status) => {
        await updateDoc(doc(db, 'support_tickets', ticketId), {
            status,
            updatedAt: serverTimestamp()
        });
    },

    addSupportMessage: async (ticketId, messageData) => {
        const ticketRef = doc(db, 'support_tickets', ticketId);
        const messagesRef = collection(ticketRef, 'messages');
        await addDoc(messagesRef, {
            ...messageData,
            createdAt: serverTimestamp()
        });

        // Update ticket's updatedAt and flag for client
        await updateDoc(ticketRef, {
            updatedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            clientHasUnread: true,
            adminHasUnread: false // Admin just sent a message, they've seen current context
        });

        // Trigger Email Notification if message is from admin
        if (messageData.sender === 'admin') {
            try {
                const ticketSnap = await getDoc(ticketRef);
                if (ticketSnap.exists()) {
                    const ticketData = ticketSnap.data();
                    const userSnap = await getDoc(doc(db, 'users', ticketData.userId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        await adminEmailService.sendSupportResponseEmail(
                            userData.email,
                            userData.firstName || 'Client',
                            ticketData.subject || 'Support'
                        );
                    }
                }
            } catch (err) {
                console.warn("Failed to send support response email:", err);
            }
        }
    },

    subscribeToTicketMessages: (ticketId, callback) => {
        const q = query(
            collection(db, 'support_tickets', ticketId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        });
    },

    // --- Admin Management Features (Super Admin only) ---
    getAllAdmins: async () => {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    createAdminAccount: async (email, password, adminData) => {
        // Initialize or get the secondary app to prevent current user logout
        let secondaryApp;
        const appName = "AdminCreator";

        if (getApps().find(app => app.name === appName)) {
            secondaryApp = getApp(appName);
        } else {
            // Re-use config from window or import.meta.env
            const secondaryConfig = {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID
            };
            secondaryApp = initializeApp(secondaryConfig, appName);
        }

        const secondaryAuth = getAuth(secondaryApp);

        try {
            // 1. Create the Auth account
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const user = userCredential.user;

            // 2. Create the Firestore record
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, 'users', user.uid);
                transaction.set(userRef, {
                    email,
                    firstName: adminData.firstName || 'Admin',
                    lastName: adminData.lastName || '',
                    role: 'admin',
                    isSuperAdmin: adminData.isSuperAdmin || false,
                    accountStatus: 'active',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });

            // 3. Immediately sign out the secondary instance to be clean
            await firebaseSignOut(secondaryAuth);

            return { success: true, uid: user.uid };
        } catch (error) {
            console.error("Error creating secondary admin account:", error);
            throw error;
        }
    },

    toggleSuperAdminStatus: async (adminId, isSuper) => {
        await updateDoc(doc(db, 'users', adminId), {
            isSuperAdmin: isSuper,
            updatedAt: serverTimestamp()
        });
    },

    deleteAdminAccount: async (adminId) => {
        await deleteDoc(doc(db, 'users', adminId));
    },

    // Change admin password (requires current password for security)
    changeAdminPassword: async (currentPassword, newPassword) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) {
                throw new Error('Aucun utilisateur connecté');
            }

            // Reauthenticate user with current password
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            return { success: true, message: 'Mot de passe modifié avec succès' };
        } catch (error) {
            console.error('Error changing password:', error);

            // Provide user-friendly error messages
            if (error.code === 'auth/wrong-password') {
                throw new Error('Mot de passe actuel incorrect');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Le nouveau mot de passe est trop faible (minimum 6 caractères)');
            } else if (error.code === 'auth/requires-recent-login') {
                throw new Error('Veuillez vous reconnecter avant de changer votre mot de passe');
            } else {
                throw new Error('Erreur lors du changement de mot de passe: ' + error.message);
            }
        }
    }
};

// Helper to generate IBAN (Duplicated from client for independence)
const generateAdminIBAN = (type, userId) => {
    const country = 'FR76';
    const bankCode = '12345';
    const branchCode = '67890';
    const suffix = type === 'main' ? '01' : (type === 'savings' ? '02' : (type === 'credit' ? '03' : '99'));
    const userPart = userId ? userId.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X') : '00000000';
    return `${country} ${bankCode} ${branchCode} ${userPart} ${suffix}`;
};
