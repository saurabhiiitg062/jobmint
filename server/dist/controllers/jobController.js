"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuickStats = exports.bulkDeleteJobs = exports.bulkImportJobs = exports.getJobs = exports.getJobBySlug = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const Job_js_1 = require("../models/Job.js");
const State_js_1 = require("../models/State.js");
// Helper to generate slug
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
// Create Job
const createJob = async (req, res) => {
    try {
        const jobData = { ...req.body };
        if (!jobData.slug) {
            jobData.slug = generateSlug(jobData.title);
        }
        // Check slug uniqueness
        const existing = await Job_js_1.Job.findOne({ slug: jobData.slug });
        if (existing) {
            jobData.slug = `${jobData.slug}-${Date.now()}`;
        }
        const job = new Job_js_1.Job(jobData);
        await job.save();
        // Auto-create category / state references if needed
        if (jobData.state) {
            const stateSlug = generateSlug(jobData.state);
            await State_js_1.State.findOneAndUpdate({ name: jobData.state }, { name: jobData.state, slug: stateSlug }, { upsert: true });
        }
        res.status(201).json(job);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createJob = createJob;
// Update Job
const updateJob = async (req, res) => {
    const { id } = req.params;
    try {
        const jobData = { ...req.body };
        if (jobData.title && !jobData.slug) {
            jobData.slug = generateSlug(jobData.title);
        }
        const job = await Job_js_1.Job.findByIdAndUpdate(id, jobData, { new: true });
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateJob = updateJob;
// Delete Job
const deleteJob = async (req, res) => {
    const { id } = req.params;
    try {
        const job = await Job_js_1.Job.findByIdAndDelete(id);
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteJob = deleteJob;
// Get Job By Slug (increments view count)
const getJobBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const job = await Job_js_1.Job.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getJobBySlug = getJobBySlug;
// Get Jobs with dynamic filter options and pagination
const getJobs = async (req, res) => {
    try {
        const { category, state, qualification, organization, search, status, limit = '20', page = '1' } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (state)
            filter.state = new RegExp(`^${state}$`, 'i');
        if (qualification)
            filter.qualification = new RegExp(`^${qualification}$`, 'i');
        if (organization)
            filter.organization = new RegExp(`^${organization}$`, 'i');
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { postName: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } }
            ];
        }
        const lim = parseInt(limit, 10);
        const pg = parseInt(page, 10);
        const jobs = await Job_js_1.Job.find(filter)
            .sort({ publishedAt: -1 })
            .skip((pg - 1) * lim)
            .limit(lim);
        const total = await Job_js_1.Job.countDocuments(filter);
        res.json({
            jobs,
            pagination: {
                total,
                page: pg,
                limit: lim,
                pages: Math.ceil(total / lim)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getJobs = getJobs;
// Bulk Import
const bulkImportJobs = async (req, res) => {
    const { jobs } = req.body; // array of jobs
    if (!Array.isArray(jobs)) {
        return res.status(400).json({ message: 'Jobs payload must be an array' });
    }
    try {
        const preparedJobs = jobs.map(j => ({
            ...j,
            slug: j.slug || generateSlug(j.title) + '-' + Math.floor(Math.random() * 1000)
        }));
        const result = await Job_js_1.Job.insertMany(preparedJobs);
        res.status(201).json({ message: `Successfully imported ${result.length} jobs` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.bulkImportJobs = bulkImportJobs;
// Bulk Delete
const bulkDeleteJobs = async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'IDs must be an array' });
    }
    try {
        const result = await Job_js_1.Job.deleteMany({ _id: { $in: ids } });
        res.json({ message: `Successfully deleted ${result.deletedCount} jobs` });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.bulkDeleteJobs = bulkDeleteJobs;
// Dynamic Programmatic metadata / listings
const getQuickStats = async (req, res) => {
    try {
        const states = await Job_js_1.Job.distinct('state');
        const qualifications = await Job_js_1.Job.distinct('qualification');
        const organizations = await Job_js_1.Job.distinct('organization');
        const categories = await Job_js_1.Job.distinct('category');
        res.json({ states, qualifications, organizations, categories });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuickStats = getQuickStats;
