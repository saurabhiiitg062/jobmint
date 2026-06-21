import { Router } from 'express';
import { 
  createJob, 
  updateJob, 
  deleteJob, 
  getJobBySlug, 
  getJobs, 
  bulkImportJobs, 
  bulkDeleteJobs,
  getQuickStats 
} from '../controllers/jobController.js';
import { 
  createBlog, 
  updateBlog, 
  deleteBlog, 
  getBlogBySlug, 
  getBlogs 
} from '../controllers/blogController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Public Jobs API
router.get('/jobs', getJobs);
router.get('/jobs/stats', getQuickStats);
router.get('/jobs/slug/:slug', getJobBySlug);

// Admin Jobs API
router.post('/jobs/bulk-import', authenticateAdmin, bulkImportJobs);
router.post('/jobs/bulk-delete', authenticateAdmin, bulkDeleteJobs);
router.post('/jobs', authenticateAdmin, createJob);
router.put('/jobs/:id', authenticateAdmin, updateJob);
router.delete('/jobs/:id', authenticateAdmin, deleteJob);

// Public Blogs API
router.get('/blogs', getBlogs);
router.get('/blogs/slug/:slug', getBlogBySlug);

// Admin Blogs API
router.post('/blogs', authenticateAdmin, createBlog);
router.put('/blogs/:id', authenticateAdmin, updateBlog);
router.delete('/blogs/:id', authenticateAdmin, deleteBlog);

export default router;
