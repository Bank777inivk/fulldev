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

const LOANS_COLLECTION = 'loans';

export const loanService = {
    // Apply for a loan
    applyForLoan: async (userId, loanData) => {
        try {
            const docRef = await addDoc(collection(db, LOANS_COLLECTION), {
                userId,
                ...loanData,
                status: 'pending', // pending, approved, rejected
                createdAt: serverTimestamp()
            });
            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("Loan application error:", error);
            throw error;
        }
    },

    // Get user loans
    getUserLoans: async (userId) => {
        try {
            const q = query(
                collection(db, LOANS_COLLECTION),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Fetch loans error:", error);
            throw error;
        }
    }
};
