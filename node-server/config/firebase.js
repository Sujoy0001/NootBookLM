require('dotenv').config();
const admin = require('firebase-admin');

let serviceAccount;
try {
  // Option 1: Using the json file path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://notebooklm-b1315-default-rtdb.firebaseio.com"
    });
    console.log("Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS");
  } else {
    // Option 2: Using the explicit env variables
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://notebooklm-b1315-default-rtdb.firebaseio.com"
    });
    console.log("Firebase Admin initialized via manual Env Variables.");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error.message);
}

const db = admin.firestore();
const rtdb = admin.database();
const auth = admin.auth();

module.exports = { admin, db, rtdb, auth };
