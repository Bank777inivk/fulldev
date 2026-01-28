import { db } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export const settingsService = {
    async getGlobalSettings() {
        try {
            const docRef = doc(db, 'settings', 'global');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return { hideLanguageSelector: false };
        } catch (error) {
            console.error("Erreur chargement paramètres globaux:", error);
            return { hideLanguageSelector: false };
        }
    },

    subscribeToGlobalSettings(callback) {
        const docRef = doc(db, 'settings', 'global');
        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                callback({ hideLanguageSelector: false });
            }
        }, (error) => {
            console.error("Erreur écoute paramètres globaux:", error);
            callback({ hideLanguageSelector: false });
        });
    }
};
