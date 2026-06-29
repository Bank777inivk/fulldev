import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Function to load env variables from .env.local
const loadEnv = () => {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local not found. Cannot configure Admin SDK.");
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, "utf-8");
    const env = {};
    envContent.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] ? match[2].trim() : "";
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            env[match[1]] = value;
        }
    });
    return env;
};

const env = loadEnv();

// Initialize Firebase Admin
const privateKey = env.FIREBASE_PRIVATE_KEY ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (!privateKey || !env.FIREBASE_CLIENT_EMAIL || !env.VITE_FIREBASE_PROJECT_ID) {
    console.error("❌ Missing Admin SDK variables in .env.local");
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
    }),
});

const auth = admin.auth();
const db = admin.firestore();

async function setAdminUser() {
    const adminEmail = "sebastienaussant00@gmail.com";
    const adminPassword = "Lookmandat100@";

    try {
        console.log(`Setting up admin account for: ${adminEmail}...`);

        let userRecord;
        try {
            // Check if user already exists in Auth
            userRecord = await auth.getUserByEmail(adminEmail);
            console.log(`User already exists (UID: ${userRecord.uid}). Updating password...`);
            await auth.updateUser(userRecord.uid, {
                password: adminPassword,
            });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log("User not found in Auth. Creating new user...");
                userRecord = await auth.createUser({
                    email: adminEmail,
                    password: adminPassword,
                    emailVerified: true,
                });
            } else {
                throw error;
            }
        }

        // Now set/update document in Firestore
        console.log("Updating Firestore document role to 'admin'...");
        await db.collection("users").doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: adminEmail,
            firstName: "Sébastien",
            lastName: "Aussant",
            role: "admin",
            accountType: "admin",
            accountStatus: "active",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        console.log("✅ Admin account configured successfully!");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);
        console.log("UID:", userRecord.uid);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting admin account:", error);
        process.exit(1);
    }
}

setAdminUser();
