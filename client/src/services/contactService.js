import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

const CONTACT_COLLECTION = 'contact_messages';

export const contactService = {
    // Submit a public contact message
    submitContactForm: async (formData) => {
        try {
            const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
                ...formData,
                status: 'new',
                createdAt: serverTimestamp()
            });
            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("Contact form submission error:", error);
            throw error;
        }
    }
};
