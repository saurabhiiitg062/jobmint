"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogs = exports.getBlogBySlug = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const Blog_js_1 = require("../models/Blog.js");
// Helper to generate slug
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};
// Create Blog
const createBlog = async (req, res) => {
    try {
        const blogData = { ...req.body };
        if (!blogData.slug) {
            blogData.slug = generateSlug(blogData.title);
        }
        const existing = await Blog_js_1.Blog.findOne({ slug: blogData.slug });
        if (existing) {
            blogData.slug = `${blogData.slug}-${Date.now()}`;
        }
        const blog = new Blog_js_1.Blog(blogData);
        await blog.save();
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBlog = createBlog;
// Update Blog
const updateBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blogData = { ...req.body };
        if (blogData.title && !blogData.slug) {
            blogData.slug = generateSlug(blogData.title);
        }
        const blog = await Blog_js_1.Blog.findByIdAndUpdate(id, blogData, { new: true });
        if (!blog)
            return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBlog = updateBlog;
// Delete Blog
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog_js_1.Blog.findByIdAndDelete(id);
        if (!blog)
            return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteBlog = deleteBlog;
// Get Blog By Slug
const getBlogBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const blog = await Blog_js_1.Blog.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true });
        if (!blog)
            return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBlogBySlug = getBlogBySlug;
// Get Blogs with pagination and search
const getBlogs = async (req, res) => {
    try {
        const { search, limit = '10', page = '1' } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        const lim = parseInt(limit, 10);
        const pg = parseInt(page, 10);
        const blogs = await Blog_js_1.Blog.find(filter)
            .sort({ publishedAt: -1 })
            .skip((pg - 1) * lim)
            .limit(lim);
        const total = await Blog_js_1.Blog.countDocuments(filter);
        res.json({
            blogs,
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
exports.getBlogs = getBlogs;
