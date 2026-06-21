"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_js_1 = require("../controllers/jobController.js");
const blogController_js_1 = require("../controllers/blogController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Public Jobs API
router.get('/jobs', jobController_js_1.getJobs);
router.get('/jobs/stats', jobController_js_1.getQuickStats);
router.get('/jobs/slug/:slug', jobController_js_1.getJobBySlug);
// Admin Jobs API
router.post('/jobs/bulk-import', auth_js_1.authenticateAdmin, jobController_js_1.bulkImportJobs);
router.post('/jobs/bulk-delete', auth_js_1.authenticateAdmin, jobController_js_1.bulkDeleteJobs);
router.post('/jobs', auth_js_1.authenticateAdmin, jobController_js_1.createJob);
router.put('/jobs/:id', auth_js_1.authenticateAdmin, jobController_js_1.updateJob);
router.delete('/jobs/:id', auth_js_1.authenticateAdmin, jobController_js_1.deleteJob);
// Public Blogs API
router.get('/blogs', blogController_js_1.getBlogs);
router.get('/blogs/slug/:slug', blogController_js_1.getBlogBySlug);
// Admin Blogs API
router.post('/blogs', auth_js_1.authenticateAdmin, blogController_js_1.createBlog);
router.put('/blogs/:id', auth_js_1.authenticateAdmin, blogController_js_1.updateBlog);
router.delete('/blogs/:id', auth_js_1.authenticateAdmin, blogController_js_1.deleteBlog);
exports.default = router;
