require('dotenv').config();
const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const ImageKit = require('imagekit');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Import our secure Admin SDK config
const { admin, db, rtdb, auth } = require('./config/firebase');

// Initialize ImageKit
let imagekit;
try {
  if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    console.log("ImageKit initialized.");
  } else {
    console.warn("ImageKit keys missing from .env.");
  }
} catch (error) {
  console.warn("ImageKit is not fully configured yet. Check .env variables.");
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ---------------------------------------------------------
// Route: Health Check (Root)
// ---------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({ status: "online", message: "RagEngine Backend API is running!" });
});

// Multer setup (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Rate Limiting for Uploads (50 requests per 15 minutes)
const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: { error: 'Too many upload requests from this IP, please try again after 15 minutes.' }
});

// ---------------------------------------------------------
// Middleware: Verify Token
// ---------------------------------------------------------
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ---------------------------------------------------------
// Default RTDB Dashboard Schema
// ---------------------------------------------------------
const defaultDashboardData = {
  dashboardStats: [
    { title: "Storage Used", value: "0 MB", sub: "Out of 5 MB" },
    { title: "Files Uploaded", value: "0", sub: "Total files" },
    { title: "API Calls / Day", value: "0", sub: "Out of 100" },
    { title: "API Calls / Min", value: "0", sub: "Out of 5" }
  ],
  apiChartData: [
    { name: "Mon", calls: 0 }, { name: "Tue", calls: 0 }, { name: "Wed", calls: 0 },
    { name: "Thu", calls: 0 }, { name: "Fri", calls: 0 }, { name: "Sat", calls: 0 }, { name: "Sun", calls: 0 }
  ],
  storageChartData: [
    { name: "0 Files", storage: 0, files: 0 }
  ],
  // Raw metrics for easy calculation updates
  rawMetrics: {
    totalBytes: 0,
    totalFiles: 0
  }
};

// ---------------------------------------------------------
// Route: Register User
// ---------------------------------------------------------
app.post('/api/auth/register', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const uid = req.user.uid;

    // 1. Create/Update user in Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        name: name || req.user.name || "Anonymous",
        email: email || req.user.email,
        uid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        plan: "free",
        apiKeys: []
      });

      // 2. Initialize RTDB Dashboard for this specific user
      await rtdb.ref(`users/${uid}/dashboard`).set(defaultDashboardData);
    }

    return res.status(200).json({ message: "User registered and initialized successfully." });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
});

// ---------------------------------------------------------
// Route: Delete Account
// ---------------------------------------------------------
app.delete('/api/auth/account', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Fetch and delete all uploaded documents from ImageKit and Firestore
    const docsSnapshot = await db.collection('uploaded_docs').where('userId', '==', uid).get();
    
    const batch = db.batch();
    
    for (const doc of docsSnapshot.docs) {
      const docData = doc.data();
      // Delete from ImageKit if exists
      if (docData.fileId && imagekit) {
        try {
          await imagekit.deleteFile(docData.fileId);
        } catch (err) {
          console.error(`Failed to delete ImageKit file ${docData.fileId}:`, err);
        }
      }
      // Add to Firestore batch delete
      batch.delete(doc.ref);
    }

    // Execute batch delete for docs
    if (!docsSnapshot.empty) {
      await batch.commit();
    }

    // 2. Delete user's RTDB dashboard
    await rtdb.ref(`users/${uid}`).remove();

    // 3. Delete user from Firestore 'users' collection
    await db.collection('users').doc(uid).delete();

    // 4. Delete user from Firebase Auth
    await admin.auth().deleteUser(uid);

    return res.status(200).json({ message: "Account completely deleted successfully." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({ error: "Failed to delete account." });
  }
});

// ---------------------------------------------------------
// Route: Generate API Key
// ---------------------------------------------------------
app.post('/api/keys', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name } = req.body;
    const newKey = "nt_" + crypto.randomBytes(24).toString('hex');
    
    const keyData = {
      name: name || "Default Key",
      value: newKey,
      createdAt: new Date().toISOString()
    };

    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      apiKeys: admin.firestore.FieldValue.arrayUnion(keyData)
    });

    return res.status(200).json(keyData);
  } catch (error) {
    console.error("Generate Key Error:", error);
    return res.status(500).json({ error: "Failed to generate API Key." });
  }
});

// ---------------------------------------------------------
// Route: Delete API Key
// ---------------------------------------------------------
app.delete('/api/keys/:keyValue', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { keyValue } = req.params;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    const keyToRemove = (userData.apiKeys || []).find(k => k.value === keyValue);

    if (!keyToRemove) {
      return res.status(404).json({ error: "API Key not found" });
    }

    await userRef.update({
      apiKeys: admin.firestore.FieldValue.arrayRemove(keyToRemove)
    });

    return res.status(200).json({ message: "API Key deleted successfully" });
  } catch (error) {
    console.error("Delete Key Error:", error);
    return res.status(500).json({ error: "Failed to delete API Key." });
  }
});

// ---------------------------------------------------------
// Route: Upload File
// ---------------------------------------------------------
app.post('/api/upload', verifyToken, uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    const uid = req.user.uid;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!imagekit) return res.status(500).json({ error: 'ImageKit is not configured.' });

    // 1. Check User Plan & Storage Limits
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    
    const userData = userDoc.data();
    if (userData.plan === 'free') {
      const userRtdbSnap = await rtdb.ref(`users/${uid}/dashboard/rawMetrics/totalBytes`).once('value');
      const currentStorageBytes = userRtdbSnap.val() || 0;
      
      const MAX_FREE_STORAGE = 5 * 1024 * 1024; // 5 MB
      if (currentStorageBytes + req.file.size > MAX_FREE_STORAGE) {
        return res.status(403).json({ 
          error: 'Storage limit exceeded. Free plan allows up to 5MB. Please upgrade your plan.' 
        });
      }
    }

    // 2. Upload to RAG Backend
    if (process.env.RAG_BACKEND_URL) {
      try {
        const baseUrl = process.env.RAG_BACKEND_URL.replace(/\/$/, '');
        const backendUrl = new URL(`${baseUrl}/v2/document/uploads`);
        backendUrl.searchParams.set('user_id', uid);
        
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('file', blob, req.file.originalname);

        const ragResponse = await fetch(backendUrl.toString(), {
          method: 'POST',
          body: formData
        });

        if (!ragResponse.ok) {
          const errorText = await ragResponse.text();
          console.error("RAG Backend error:", errorText);
          return res.status(500).json({ error: 'Failed to upload document to RAG backend.' });
        }
      } catch (err) {
        console.error("Error communicating with RAG Backend:", err);
        return res.status(500).json({ error: 'Failed to communicate with RAG backend.' });
      }
    }

    // 3. Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      useUniqueFileName: true
    });

    // 3. Save metadata to Firestore
    const docData = {
      userId: uid,
      filename: uploadResponse.name,
      originalName: req.file.originalname,
      sizeBytes: uploadResponse.size,
      type: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      status: "processed"
    };

    const docRef = await db.collection('uploaded_docs').add(docData);

    // 4. Update RTDB Metrics
    const userDbRef = rtdb.ref(`users/${uid}/dashboard`);
    userDbRef.transaction((currentData) => {
      if (currentData === null) return defaultDashboardData; // Fallback if no data
      
      // Update raw metrics
      if(!currentData.rawMetrics) currentData.rawMetrics = { totalBytes: 0, totalFiles: 0 };
      currentData.rawMetrics.totalBytes += uploadResponse.size;
      currentData.rawMetrics.totalFiles += 1;

      // Update UI stats
      const totalMB = (currentData.rawMetrics.totalBytes / (1024 * 1024)).toFixed(2);
      
      currentData.dashboardStats[0].value = `${totalMB} MB`; // Storage
      currentData.dashboardStats[1].value = `${currentData.rawMetrics.totalFiles}`; // Files Count

      // Update storageChartData history
      if (currentData.storageChartData) {
        currentData.storageChartData.push({ 
          name: `${totalMB} MB`, 
          storage: parseFloat(totalMB), 
          files: currentData.rawMetrics.totalFiles 
        });
        if (currentData.storageChartData.length > 6) currentData.storageChartData.shift();
      }

      return currentData;
    });

    return res.status(200).json({
      message: 'Upload successful',
      docId: docRef.id,
      data: docData
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to process upload' });
  }
});

// ---------------------------------------------------------
// Route: Delete File
// ---------------------------------------------------------
app.delete('/api/upload/:docId', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const docId = req.params.docId;

    // 1. Get doc from Firestore to ensure ownership and get ImageKit fileId
    const docRef = db.collection('uploaded_docs').doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const docData = docSnap.data();
    if (docData.userId !== uid) {
      return res.status(403).json({ error: "Unauthorized to delete this file" });
    }

    // 2. Delete from ImageKit
    if (docData.fileId && imagekit) {
      try {
        await imagekit.deleteFile(docData.fileId);
      } catch (ikError) {
        console.error("ImageKit Delete Error (proceeding anyway):", ikError);
      }
    }

    // 3. Delete from Firestore
    await docRef.delete();

    // 4. Update RTDB Metrics
    const userDbRef = rtdb.ref(`users/${uid}/dashboard`);
    userDbRef.transaction((currentData) => {
      if (currentData === null || !currentData.rawMetrics) return currentData;
      
      currentData.rawMetrics.totalBytes = Math.max(0, currentData.rawMetrics.totalBytes - docData.sizeBytes);
      currentData.rawMetrics.totalFiles = Math.max(0, currentData.rawMetrics.totalFiles - 1);

      const totalMB = (currentData.rawMetrics.totalBytes / (1024 * 1024)).toFixed(2);
      currentData.dashboardStats[0].value = `${totalMB} MB`;
      currentData.dashboardStats[1].value = `${currentData.rawMetrics.totalFiles}`;

      // Update storageChartData history
      if (currentData.storageChartData) {
        currentData.storageChartData.push({ 
          name: `${totalMB} MB`, 
          storage: parseFloat(totalMB), 
          files: currentData.rawMetrics.totalFiles 
        });
        if (currentData.storageChartData.length > 6) currentData.storageChartData.shift();
      }

      return currentData;
    });

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: "Failed to delete file" });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});