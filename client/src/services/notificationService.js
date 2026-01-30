import { db } from '../firebase/config';
import {
    collection,
    addDoc, // Added
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    getDocs // Added
} from 'firebase/firestore';

export const notificationService = {
    // Check if a notification exists with specific metadata
    checkNotificationExists: async (userId, key, value) => {
        try {
            const q = query(
                collection(db, 'notifications'),
                where('userId', '==', userId),
                where(`metadata.${key}`, '==', value)
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error("Error checking notification:", error);
            return false;
        }
    },

    // send a notification
    // send a notification
    addNotification: async (userId, title, message, type = 'info', metadata = {}, titleKey = null, messageKey = null, messageParams = {}) => {
        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                title,
                message,
                titleKey,
                messageKey,
                messageParams,
                type,
                read: false,
                createdAt: serverTimestamp(),
                metadata
            });
        } catch (error) {
            console.error("Error adding notification:", error);
            throw error;
        }
    },
    // Subscribe to user notifications in real-time
    subscribeToNotifications: (userId, callback) => {
        if (!userId) return () => { };

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(notifications);
        }, (error) => {
            console.error("Notification subscription error:", error);
        });
    },

    // Mark a single notification as read
    markAsRead: async (notificationId) => {
        try {
            const notifRef = doc(db, 'notifications', notificationId);
            await updateDoc(notifRef, {
                read: true,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    },

    // Mark all notifications as read for a user
    markAllAsRead: async (notifications) => {
        try {
            const unread = notifications.filter(n => !n.read);
            const promises = unread.map(n => {
                const notifRef = doc(db, 'notifications', n.id);
                return updateDoc(notifRef, {
                    read: true,
                    updatedAt: serverTimestamp()
                });
            });
            await Promise.all(promises);
        } catch (error) {
            console.error("Error marking all as read:", error);
            throw error;
        }
    }
};
