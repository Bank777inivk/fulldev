import { db } from '../firebase/config';
import {
    doc,
    collection,
    query,
    where,
    getDocs,
    writeBatch,
    deleteDoc
} from 'firebase/firestore';

export const userService = {
    /**
     * Purges ALL user data from ALL Firestore collections.
     * This is an irreversible operation.
     */
    purgeFullUserData: async (userId) => {
        try {
            const batch = writeBatch(db);
            const collectionsToPurge = [
                'wallets',
                'transactions',
                'cards',
                'beneficiaries',
                'ribs',
                'loans',
                'support_tickets'
            ];

            // 1. Delete the main User document
            const userRef = doc(db, 'users', userId);
            batch.delete(userRef);

            // 2. Query and delete from all other collections
            for (const collName of collectionsToPurge) {
                const q = query(collection(db, collName), where('userId', '==', userId));
                const snapshot = await getDocs(q);
                snapshot.forEach((d) => {
                    batch.delete(d.ref);
                });
            }

            // Commit the batch deletion
            await batch.commit();
            return { success: true };
        } catch (error) {
            console.error("Purge user data error:", error);
            throw error;
        }
    }
};
