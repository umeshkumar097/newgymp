const admin = require("firebase-admin");
require("dotenv").config();

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

async function testFirebase() {
  console.log("🚀 Testing Firebase Connection...");
  console.log("Project ID:", firebaseAdminConfig.projectId);
  
  if (!firebaseAdminConfig.privateKey) {
    console.error("❌ ERROR: Private Key missing in .env");
    return;
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
      });
    }
    const auth = admin.auth();
    const result = await auth.listUsers(1);
    console.log("✅ SUCCESS! Firebase Admin connected.");
    console.log("Project:", firebaseAdminConfig.projectId);
  } catch (error) {
    console.error("❌ FAILED!");
    console.error("Error Detail:", error.message);
  }
}

testFirebase();
