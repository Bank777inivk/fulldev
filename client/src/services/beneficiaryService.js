import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export const beneficiaryService = {
    // Add a new beneficiary
    addBeneficiary: async (userId, beneficiaryData) => {
        try {
            const docRef = await addDoc(collection(db, "users", userId, "beneficiaries"), {
                ...beneficiaryData,
                createdAt: serverTimestamp()
            });
            return { id: docRef.id, ...beneficiaryData };
        } catch (error) {
            console.error("Error adding beneficiary:", error);
            throw error;
        }
    },

    // Get all beneficiaries for a user
    getBeneficiaries: async (userId) => {
        try {
            const q = query(collection(db, "users", userId, "beneficiaries"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching beneficiaries:", error);
            throw error;
        }
    },

    // Delete a beneficiary
    deleteBeneficiary: async (userId, beneficiaryId) => {
        try {
            await deleteDoc(doc(db, "users", userId, "beneficiaries", beneficiaryId));
        } catch (error) {
            console.error("Error deleting beneficiary:", error);
            throw error;
        }
    }
};
