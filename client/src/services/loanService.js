import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import emailService from './emailService';

const LOANS_COLLECTION = 'loans';
const USERS_COLLECTION = 'users';

export const loanService = {
    // Apply for a loan
    applyForLoan: async (userId, loanData, currentLang) => {
        try {
            const docRef = await addDoc(collection(db, LOANS_COLLECTION), {
                userId,
                ...loanData,
                status: 'pending', // pending, approved, rejected
                createdAt: serverTimestamp()
            });

            // Send Email Notifications
            try {
                const userSnapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    // User confirmation
                    await emailService.sendLoanRequestEmail(
                        userData.email,
                        `${userData.firstName} ${userData.lastName}`,
                        loanData,
                        currentLang || userData.language || 'fr'
                    );

                    // Admin notification
                    await emailService.sendAdminLoanRequestNotification(
                        { id: userId, ...userData },
                        loanData
                    );
                    console.log('Admin notification sent for loan request');
                }
            } catch (e) {
                console.warn("Loan request emails failed", e);
            }

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
    },

    // Create a lead from public credit request
    createLead: async (leadData) => {
        try {
            const docRef = await addDoc(collection(db, 'loan_leads'), {
                ...leadData,
                status: 'new',
                createdAt: serverTimestamp()
            });

            // Send Email Notifications
            try {
                // Prospect confirmation
                await emailService.sendPublicLeadConfirmationEmail(
                    leadData.email,
                    leadData.prenom || 'Client',
                    leadData
                );

                // Admin notification
                await emailService.sendAdminPublicLeadNotification(leadData);
                console.log('Lead notification emails sent');
            } catch (e) {
                console.warn("Lead notification emails failed", e);
            }

            return { id: docRef.id, success: true };
        } catch (error) {
            console.error("Create lead error:", error);
            throw error;
        }
    }
};
