import { Request, Response } from 'express';
import { Job } from '../models/Job.js';
import { Category } from '../models/Category.js';
import { State } from '../models/State.js';
import { Exam } from '../models/Exam.js';

// Helper to generate slug
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// Validate tables structure
const validateTables = (tables: any[]) => {
  if (!tables || !Array.isArray(tables)) return true; // Tables are optional
  
  for (const table of tables) {
    if (!table.title || typeof table.title !== 'string') {
      return false;
    }
    if (!table.columns || !Array.isArray(table.columns) || table.columns.length === 0) {
      return false;
    }
    if (!table.rows || !Array.isArray(table.rows) || table.rows.length === 0) {
      return false;
    }
    // Ensure each row has the same number of columns
    for (const row of table.rows) {
      if (!Array.isArray(row) || row.length !== table.columns.length) {
        return false;
      }
    }
  }
  return true;
};

// Helper to trigger ISR revalidation
const triggerRevalidation = async (slug: string, type: string = 'job') => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const revalidateUrl = `${apiUrl}/api/revalidate`;
    const revalidateToken = process.env.REVALIDATE_TOKEN || '';
    
    const headers: any = { 'Content-Type': 'application/json' };
    if (revalidateToken) {
      headers['Authorization'] = `Bearer ${revalidateToken}`;
    }
    
    await fetch(revalidateUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ slug, type })
    }).catch(err => {
      // Silently fail - don't block job creation if revalidation fails
      console.warn('ISR revalidation failed:', err.message);
    });
  } catch (error) {
    console.warn('Could not trigger revalidation:', error);
  }
};

// Create Job
export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData = { ...req.body };
    
    // Validate tables if provided
    if (jobData.tables && !validateTables(jobData.tables)) {
      return res.status(400).json({ message: 'Invalid tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    
    // Filter out empty tables
    if (jobData.tables) {
      jobData.tables = jobData.tables.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }

    // Validate and filter cutoff tables if provided
    if (jobData.cutoff && !validateTables(jobData.cutoff)) {
      return res.status(400).json({ message: 'Invalid cutoff tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    if (jobData.cutoff) {
      jobData.cutoff = jobData.cutoff.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }

    // Validate and filter syllabus tables if provided
    if (jobData.syllabus && !validateTables(jobData.syllabus)) {
      return res.status(400).json({ message: 'Invalid syllabus tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    if (jobData.syllabus) {
      jobData.syllabus = jobData.syllabus.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }
    
    if (!jobData.slug) {
      jobData.slug = generateSlug(jobData.title);
    }
    
    // Check slug uniqueness
    const existing = await Job.findOne({ slug: jobData.slug });
    if (existing) {
      jobData.slug = `${jobData.slug}-${Date.now()}`;
    }

    const job = new Job(jobData);
    await job.save();

    // Auto-create category / state references if needed
    if (jobData.state) {
      const stateSlug = generateSlug(jobData.state);
      await State.findOneAndUpdate(
        { name: jobData.state },
        { name: jobData.state, slug: stateSlug },
        { upsert: true }
      );
    }

    // Trigger ISR revalidation for the new job (non-blocking)
    triggerRevalidation(job.slug, 'job');

    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update Job
export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const jobData = { ...req.body };
    
    // Validate tables if provided
    if (jobData.tables && !validateTables(jobData.tables)) {
      return res.status(400).json({ message: 'Invalid tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    
    // Filter out empty tables
    if (jobData.tables) {
      jobData.tables = jobData.tables.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }

    // Validate and filter cutoff tables if provided
    if (jobData.cutoff && !validateTables(jobData.cutoff)) {
      return res.status(400).json({ message: 'Invalid cutoff tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    if (jobData.cutoff) {
      jobData.cutoff = jobData.cutoff.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }

    // Validate and filter syllabus tables if provided
    if (jobData.syllabus && !validateTables(jobData.syllabus)) {
      return res.status(400).json({ message: 'Invalid syllabus tables structure. Each table must have a title, at least one column, and at least one row with matching column count.' });
    }
    if (jobData.syllabus) {
      jobData.syllabus = jobData.syllabus.filter((table: any) => 
        table.title && table.columns && table.columns.length > 0 && table.rows && table.rows.length > 0
      );
    }
    
    if (jobData.title && !jobData.slug) {
      jobData.slug = generateSlug(jobData.title);
    }

    const job = await Job.findByIdAndUpdate(id, jobData, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Trigger ISR revalidation for the updated job (non-blocking)
    triggerRevalidation(job.slug, 'job');
    
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Job
export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Job By Slug (increments view count)
export const getJobBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const job = await Job.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('exam');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Jobs with dynamic filter options and pagination
export const getJobs = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      state, 
      qualification, 
      organization, 
      search, 
      status, 
      limit = '20', 
      page = '1' 
    } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (state) filter.state = new RegExp(`^${state}$`, 'i');
    if (qualification) filter.qualification = new RegExp(`^${qualification}$`, 'i');
    if (organization) filter.organization = new RegExp(`^${organization}$`, 'i');
    if (status) filter.status = status;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { postName: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ];
    }

    const lim = parseInt(limit as string, 10);
    const pg = parseInt(page as string, 10);

    const jobs = await Job.find(filter)
      .sort({ publishedAt: -1 })
      .skip((pg - 1) * lim)
      .limit(lim);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        total,
        page: pg,
        limit: lim,
        pages: Math.ceil(total / lim)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk Import
export const bulkImportJobs = async (req: Request, res: Response) => {
  const { jobs } = req.body; // array of jobs
  if (!Array.isArray(jobs)) {
    return res.status(400).json({ message: 'Jobs payload must be an array' });
  }
  try {
    const preparedJobs = jobs.map(j => ({
      ...j,
      slug: j.slug || generateSlug(j.title) + '-' + Math.floor(Math.random() * 1000)
    }));
    const result = await Job.insertMany(preparedJobs);
    res.status(201).json({ message: `Successfully imported ${result.length} jobs` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk Delete
export const bulkDeleteJobs = async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: 'IDs must be an array' });
  }
  try {
    const result = await Job.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Successfully deleted ${result.deletedCount} jobs` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Dynamic Programmatic metadata / listings
export const getQuickStats = async (req: Request, res: Response) => {
  try {
    const states = await Job.distinct('state');
    const qualifications = await Job.distinct('qualification');
    const organizations = await Job.distinct('organization');
    const categories = await Job.distinct('category');
    res.json({ states, qualifications, organizations, categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
