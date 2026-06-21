"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const jobRoutes_js_1 = __importDefault(require("./routes/jobRoutes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobjanta';
// Middleware Security Setup
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false // Allow dynamic scripts/styles if next client embeds it
}));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Sanitize inputs to prevent MongoDB operator injection
app.use((0, express_mongo_sanitize_1.default)());
// Rate Limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);
// Routing
app.use('/api/admin', adminRoutes_js_1.default);
app.use('/api', jobRoutes_js_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
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
                email: 'admin@jobjanta.com',
                password: 'adminpassword123', // Will be pre-hashed in schema save hook
                role: 'superadmin'
            });
            await initialAdmin.save();
            console.log('seeded default admin: admin@jobjanta.com / adminpassword123');
        }
    }
    catch (err) {
        console.error('Seed Admin error:', err);
    }
};
// Database Connection and Server Startup
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected successfully');
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
