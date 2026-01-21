import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const kycService = {
    /**
     * Get KYC status for a user
     */
    async getKycStatus(userId) {
        const kycDoc = await getDoc(doc(db, 'kyc', userId));
        if (kycDoc.exists()) {
            return kycDoc.data();
        }
        return null;
    },

    /**
     * Submit KYC documents for verification
     */
    async submitKycDocuments(userId, documents) {
        const kycRef = doc(db, 'kyc', userId);
        await setDoc(kycRef, {
            documents,
            status: 'submitted',
            submittedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Send Email Notifications
        try {
            const userSnapshot = await getDoc(doc(db, 'users', userId));
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const { emailService } = await import('./emailService');

                // User confirmation
                await emailService.sendVerificationInProgressEmail(
                    userData.email,
                    userData.firstName || userData.displayName || 'Client'
                );

                // Admin notification
                await emailService.sendAdminKycSubmittedNotification({
                    uid: userId,
                    ...userData
                });
                console.log('KYC submission emails sent (User & Admin)');
            }
        } catch (error) {
            console.warn("KYC submission notification failed:", error);
        }
    },

    /**
     * Update KYC status (Admin function)
     */
    async updateKycStatus(userId, status, verificationLevel = 0) {
        const kycRef = doc(db, 'kyc', userId);
        await updateDoc(kycRef, {
            status,
            verificationLevel,
            reviewedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Initialize KYC document for new user
     */
    async initializeKyc(userId) {
        await setDoc(doc(db, 'kyc', userId), {
            userId,
            status: 'pending',
            submittedAt: null,
            reviewedAt: null,
            documents: {},
            verificationLevel: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }
};
