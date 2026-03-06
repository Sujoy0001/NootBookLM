const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const User = require('./models/User');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for memory storage (best for serverless like Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 3 }, // limits to 3 files as requested
  fileFilter: (req, file, cb) => {
    // Only allow pdf, md, txt, and docx
    const allowedExtensions = /\.(pdf|md|txt|docx?)$/i;
    const allowedMimeTypes = [
      'application/pdf',
      'text/markdown',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(allowedExtensions)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, MD, and TXT are allowed.'));
    }
  }
});

// Connect to MongoDB
require('dotenv').config();

mongoose.set('strictQuery', true);

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ----------------------------------------------------
// RAG & DOCUMENT ROUTES
// ----------------------------------------------------

// Upload & Ingest Documents
app.post('/api/documents/upload', auth, (req, res, next) => {
  upload.array('docs', 3)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const userId = req.user.id;
    const RAG_SERVER_URL = 'https://nootbooklm.onrender.com';

    // Step 1: Upload documents to RAG server using Form Data
    const formData = new FormData();
    req.files.forEach(file => {
      formData.append('files', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    // Hit the /api/v1/document/uploads endpoint
    console.log(`Sending docs to RAG server for users: ${userId}`);
    const uploadResponse = await axios.post(`${RAG_SERVER_URL}/api/v1/document/uploads?user_id=${userId}`, formData, {
      headers: { ...formData.getHeaders() }
    });

    // Step 2: Trigger ingestion for the uploaded docs
    console.log(`Triggering ingestion for user: ${userId}`);
    const ingestResponse = await axios.post(`${RAG_SERVER_URL}/api/v1/rag/ingest?user_id=${userId}`);

    res.json({
      message: 'Documents successfully uploaded and ingested into RAG server.',
      uploadDetails: uploadResponse.data,
      ingestDetails: ingestResponse.data
    });
  } catch (error) {
    console.error('Error proxying to RAG server:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      message: 'Error communicating with RAG server',
      error: error?.response?.data || error.message
    });
  }
});

// Query / Chat with RAG
app.post('/api/rag/query', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    const RAG_SERVER_URL = 'https://nootbooklm.onrender.com';

    // Hit the /api/v1/rag/query endpoint
    const queryResponse = await axios.post(`${RAG_SERVER_URL}/api/v1/rag/query`, {
      user_id: userId,
      query: query
    });

    // Return the response directly to the frontend
    res.json(queryResponse.data);
  } catch (error) {
    console.error('Error querying RAG server:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      message: 'Error querying RAG server',
      error: error?.response?.data || error.message
    });
  }
});

// Health check root
app.get('/', (req, res) => {
  res.send('NotebookLM clone backend API is running!');
});

// For local running
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
