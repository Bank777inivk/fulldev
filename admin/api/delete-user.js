
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };

        if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            console.warn('Firebase Admin not initialized: Missing environment variables');
        }
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production security if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'Missing UID' });
    }

    // Check if Admin SDK is ready
    if (!admin.apps.length) {
        return res.status(503).json({
            error: 'Server Misconfigured',
            details: 'Firebase Admin SDK not initialized server-side. Missing environment variables.'
        });
    }

    try {
        console.log(`Attempting to delete user ${uid} from Auth...`);
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user ${uid}`);
        return res.status(200).json({ success: true, message: 'User deleted from Authentication' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            error: 'Failed to delete user',
            details: error.message,
            code: error.code
        });
    }
}
