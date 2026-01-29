import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    onSnapshot,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

const TICKETS_COLLECTION = 'support_tickets';

export const supportService = {
    // Create a support ticket
    createTicket: async (userId, ticketData) => {
        try {
            const ticketDoc = {
                userId,
                ...ticketData,
                status: 'open',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                clientHasUnread: false,
                adminHasUnread: true
            };
            const docRef = await addDoc(collection(db, TICKETS_COLLECTION), ticketDoc);

            // Admin Notification
            try {
                const userSnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
                let userData = { id: userId, uid: userId };
                if (!userSnapshot.empty) {
                    userData = { ...userData, ...userSnapshot.docs[0].data() };
                } else {
                    // try by doc id
                    const userDoc = await (await import('firebase/firestore')).getDoc((await import('firebase/firestore')).doc(db, 'users', userId));
                    if (userDoc.exists()) {
                        userData = { ...userData, ...userDoc.data() };
                    }
                }

                const { default: emailService } = await import('./emailService');
                await emailService.sendAdminSupportTicketNotification(userData, ticketData);
            } catch (e) {
                console.warn("Admin support notification failed", e);
            }

            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("Support ticket creation error:", error);
            throw error;
        }
    },

    // Get user tickets
    getUserTickets: async (userId) => {
        try {
            const q = query(
                collection(db, TICKETS_COLLECTION),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Fetch support tickets error:", error);
            throw error;
        }
    },

    // Real-time listener for user's tickets
    subscribeToUserTickets: (userId, callback) => {
        const q = query(
            collection(db, TICKETS_COLLECTION),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(tickets);
        }, (error) => {
            console.warn("Tickets subscription error:", error);
        });
    },

    // Real-time listener for ticket messages
    subscribeToTicketMessages: (ticketId, callback) => {
        const q = query(
            collection(db, TICKETS_COLLECTION, ticketId, 'messages'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        }, (error) => {
            console.warn("Messages subscription error:", error);
        });
    },

    // Add a message to a ticket
    addMessage: async (ticketId, messageData) => {
        try {
            const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
            const messagesRef = collection(ticketRef, 'messages');

            await addDoc(messagesRef, {
                ...messageData,
                createdAt: serverTimestamp()
            });

            // Update ticket's updatedAt and flag for admin
            await updateDoc(ticketRef, {
                updatedAt: serverTimestamp(),
                lastMessageAt: serverTimestamp(),
                adminHasUnread: true,
                clientHasUnread: false // User just sent a message, they've seen the chat
            });

            return { success: true };
        } catch (error) {
            console.error("Add message error:", error);
            throw error;
        }
    },

    // Mark ticket as seen by client
    markAsSeen: async (ticketId) => {
        try {
            const ticketRef = doc(db, TICKETS_COLLECTION, ticketId);
            await updateDoc(ticketRef, {
                clientHasUnread: false
            });
        } catch (error) {
            console.error("Mark as seen error:", error);
        }
    },

    // Subscribe to total unread count for client
    subscribeToUnreadCount: (userId, callback) => {
        const q = query(
            collection(db, TICKETS_COLLECTION),
            where('userId', '==', userId),
            where('clientHasUnread', '==', true)
        );
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.size);
        }, (error) => {
            console.warn("Unread count subscription error:", error);
        });
    }
};
