import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Firebase config for backend (using process.env)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Nodemailer transporter (same as in send-email.js)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    // Vercel Cron Security Check
    // In production, Vercel adds a header CRON_SECRET or similar if configured
    // or we can check the Authorization header if we set a secret.
    // For now, we allow it to be triggered but we should mention it needs protection.

    console.log('Starting KYC reminder cron job...');

    try {
        // 1. Find all KYC documents with status 'pending'
        const kycRef = collection(db, 'kyc');
        const q = query(kycRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);

        console.log(`Found ${querySnapshot.size} users with pending KYC.`);

        const results = [];

        for (const kycDoc of querySnapshot.docs) {
            const kycData = kycDoc.data();
            const userId = kycData.userId;

            // 2. Get user details
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userEmail = userData.email;
                const userName = userData.firstName || userData.displayName || 'Client';

                // 3. Send reminder email
                const reminderHtml = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Rappel de vérification</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${userName},</h2>
                            <p>Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.</p>
                            
                            <p>Pour accéder à l'ensemble de vos services bancaires et activer votre IBAN, vous devez nous transmettre vos justificatifs d'identité.</p>

                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La vérification ne prend que quelques minutes.</p>
                            </div>

                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://invik-bank.vercel.app/dashboard/kyc" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</a>
                            </div>

                            <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `;

                try {
                    await transporter.sendMail({
                        from: `"INVIK BANK" <${process.env.SMTP_USER}>`,
                        to: userEmail,
                        subject: "Action requise : Vérifiez votre identité - INVIK BANK",
                        html: reminderHtml,
                    });
                    results.push({ userId, status: 'success' });
                } catch (emailError) {
                    console.error(`Failed to send reminder to ${userEmail}:`, emailError);
                    results.push({ userId, status: 'error', error: emailError.message });
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${querySnapshot.size} reminders.`,
            results
        });
    } catch (error) {
        console.error('Cron job error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
