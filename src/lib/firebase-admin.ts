import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

function initializeAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
    console.log("🔥 Firebase Admin Initialized Successfully");
  }
  return admin;
}

const adminApp = initializeAdmin();
export const adminAuth = adminApp.auth();
export const adminDb = adminApp.firestore();
export const adminMessaging = adminApp.messaging();

export default adminApp;
