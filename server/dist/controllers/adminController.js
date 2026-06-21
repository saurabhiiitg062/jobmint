"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.registerAdmin = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_js_1 = require("../models/Admin.js");
const Job_js_1 = require("../models/Job.js");
const Blog_js_1 = require("../models/Blog.js");
const JWT_SECRET = process.env.JWT_SECRET || 'jobjanta-secret-key-12345';
// Admin Login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin_js_1.Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginAdmin = loginAdmin;
// Register first admin or normal admin registration
const registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await Admin_js_1.Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Admin email already exists' });
        }
        const admin = new Admin_js_1.Admin({ name, email, password, role });
        await admin.save();
        res.status(201).json({
            message: 'Admin registered successfully',
            admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerAdmin = registerAdmin;
// Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job_js_1.Job.countDocuments();
        const totalBlogs = await Blog_js_1.Blog.countDocuments();
        // Sum of job and blog views as basic traffic indicator
        const jobViewsResult = await Job_js_1.Job.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const blogViewsResult = await Blog_js_1.Blog.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const totalJobViews = jobViewsResult[0]?.totalViews || 0;
        const totalBlogViews = blogViewsResult[0]?.totalViews || 0;
        const totalVisitors = totalJobViews + totalBlogViews + 1284; // mock organic offset
        const mostViewedJobs = await Job_js_1.Job.find().sort({ views: -1 }).limit(5).select('title slug views category');
        const mostViewedBlogs = await Blog_js_1.Blog.find().sort({ views: -1 }).limit(5).select('title slug views');
        // Generate a simple historical mock visitor list for traffic overview chart
        const trafficOverview = [
            { date: 'Mon', visitors: Math.floor(totalVisitors * 0.1) + 50 },
            { date: 'Tue', visitors: Math.floor(totalVisitors * 0.12) + 60 },
            { date: 'Wed', visitors: Math.floor(totalVisitors * 0.15) + 70 },
            { date: 'Thu', visitors: Math.floor(totalVisitors * 0.14) + 65 },
            { date: 'Fri', visitors: Math.floor(totalVisitors * 0.18) + 80 },
            { date: 'Sat', visitors: Math.floor(totalVisitors * 0.16) + 75 },
            { date: 'Sun', visitors: Math.floor(totalVisitors * 0.15) + 70 }
        ];
        res.json({
            totalJobs,
            totalBlogs,
            totalVisitors,
            mostViewedJobs,
            mostViewedBlogs,
            trafficOverview
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
