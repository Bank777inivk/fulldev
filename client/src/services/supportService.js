import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

const TICKETS_COLLECTION = 'support_tickets';

export const supportService = {
    // Create a support ticket
    createTicket: async (userId, ticketData) => {
        try {
            const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
                userId,
                ...ticketData,
                status: 'open',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
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
    }
};
