import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Job } from '../models/Job.js';
import { Blog } from '../models/Blog.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jobjanta-secret-key-12345';

// Admin Login
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await (admin as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Register first admin or normal admin registration
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin email already exists' });
    }

    const admin = new Admin({ name, email, password, role });
    await admin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // Sum of job and blog views as basic traffic indicator
    const jobViewsResult = await Job.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const blogViewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalJobViews = jobViewsResult[0]?.totalViews || 0;
    const totalBlogViews = blogViewsResult[0]?.totalViews || 0;
    const totalVisitors = totalJobViews + totalBlogViews + 1284; // mock organic offset

    const mostViewedJobs = await Job.find().sort({ views: -1 }).limit(5).select('title slug views category');
    const mostViewedBlogs = await Blog.find().sort({ views: -1 }).limit(5).select('title slug views');

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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
