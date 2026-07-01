import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware Security Setup
app.use(helmet({
  contentSecurityPolicy: false // Allow dynamic scripts/styles if next client embeds it
}));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jobmint-ivory.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize inputs to prevent MongoDB operator injection
app.use(mongoSanitize());

// Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
// });
// app.use('/api/', limiter);

console.log("Current Dir:", process.cwd());
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Routing
app.use('/api/admin', adminRoutes);
app.use('/api', jobRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Seed Initial Admin if none exists
const seedInitialAdmin = async () => {
  try {
    const { Admin } = await import('./models/Admin.js');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const initialAdmin = new Admin({
        name: 'Super Admin',
        email: 'admin@SelectionSure.com',
        password: 'adminpassword123', // Will be pre-hashed in schema save hook
        role: 'superadmin'
      });
      await initialAdmin.save();
      console.log('seeded default admin: admin@SelectionSure.com / adminpassword123');
    }
  } catch (err) {
    console.error('Seed Admin error:', err);
  }
};

// Database Connection and Server Startup
mongoose.connect(MONGODB_URI!)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log("Connected DB:", mongoose.connection.name);

    seedInitialAdmin();
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Starting server in fallback mode without active DB...');
    app.listen(PORT, () => {
      console.log(`Backend server running in FAILSAFE fallback mode on port ${PORT}`);
    });
  });
