import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { emailService } from './emailService';

const CARDS_COLLECTION = 'cards';
const USERS_COLLECTION = 'users';

export const cardService = {
    // Create an initial virtual card for the user
    createInitialCard: async (userId, mainWalletId) => {
        try {
            const cardNumber = generateCardNumber();
            const expiryDate = generateExpiryDate();
            const cvv = generateCVV();

            const cardData = {
                userId,
                walletId: mainWalletId, // Linked to main wallet
                type: 'virtual',
                cardNumber, // In a real app, this should be hashed or tokenized
                expiryDate,
                cvv,
                status: 'active',
                limit: 2000,
                currency: 'EUR',
                orderDate: serverTimestamp(),
                activationDate: serverTimestamp()
            };

            await addDoc(collection(db, CARDS_COLLECTION), cardData);
            return cardData;
        } catch (error) {
            console.error("Error creating initial card:", error);
            throw error;
        }
    },

    getUserCards: async (userId) => {
        try {
            const q = query(collection(db, CARDS_COLLECTION), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const cards = [];
            querySnapshot.forEach((doc) => {
                cards.push({ id: doc.id, ...doc.data() });
            });
            return cards;
        } catch (error) {
            console.error("Error fetching cards:", error);
            throw error;
        }
    },

    requestPhysicalCard: async (userId, cardData) => {
        try {
            const requestData = {
                userId,
                status: 'pending',
                type: 'physical_premium',
                requestedAt: serverTimestamp(),
                ...cardData
            };
            const docRef = await addDoc(collection(db, 'card_requests'), requestData);

            // Send Email Notification
            console.log('Initiating card order email for user:', userId);
            try {
                const userSnapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    // User confirmation
                    await emailService.sendCardOrderEmail(
                        userData.email,
                        `${userData.firstName} ${userData.lastName}`,
                        cardData.cardType || 'Black Edition',
                        cardData.deliveryAddress || 'Adresse enregistrée'
                    );

                    // Admin notification
                    await emailService.sendAdminCardOrderNotification(
                        { id: userId, ...userData },
                        cardData
                    );
                    console.log('Admin notification sent for card order');
                } else {
                    console.warn('User document not found for card order email');
                }
            } catch (e) {
                console.error("Card order email failed fundamentally:", e);
            }

            return { id: docRef.id, ...requestData };
        } catch (error) {
            console.error("Error requesting physical card:", error);
            throw error;
        }
    },

    getPhysicalCardRequest: async (userId) => {
        try {
            const q = query(
                collection(db, 'card_requests'),
                where("userId", "==", userId),
                where("status", "in", ["pending", "approved", "shipped"])
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error("Error fetching card request:", error);
            throw error;
        }
    },

    toggleCardStatus: async (cardId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            const cardRef = doc(db, CARDS_COLLECTION, cardId);
            await updateDoc(cardRef, {
                status: newStatus,
                lastModified: serverTimestamp()
            });
            return newStatus;
        } catch (error) {
            console.error("Error toggling card status:", error);
            throw error;
        }
    },

    updateCard: async (cardId, updates) => {
        try {
            const cardRef = doc(db, CARDS_COLLECTION, cardId);
            await updateDoc(cardRef, {
                ...updates,
                lastModified: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error updating card:", error);
            throw error;
        }
    },

    deleteCard: async (cardId) => {
        try {
            const cardRef = doc(db, CARDS_COLLECTION, cardId);
            await deleteDoc(cardRef);
            return true;
        } catch (error) {
            console.error("Error deleting card:", error);
            throw error;
        }
    },

    deleteCardRequest: async (requestId) => {
        try {
            const requestRef = doc(db, 'card_requests', requestId);
            await deleteDoc(requestRef);
            return true;
        } catch (error) {
            console.error("Error deleting card request:", error);
            throw error;
        }
    }
};

// Utils for generating fake card info
const generateCardNumber = () => {
    // Starts with 4 for Visa, 16 digits
    let num = '4532';
    for (let i = 0; i < 3; i++) {
        num += ' ' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }
    return num;
};

const generateExpiryDate = () => {
    const today = new Date();
    const year = today.getFullYear() + 3; // Valid for 3 years
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${month}/${year.toString().slice(-2)}`;
};

const generateCVV = () => {
    return Math.floor(Math.random() * 900 + 100).toString();
};
