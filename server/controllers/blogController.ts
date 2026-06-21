import { Request, Response } from 'express';
import { Blog } from '../models/Blog.js';

// Helper to generate slug
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-'); 
};

// Create Blog
export const createBlog = async (req: Request, res: Response) => {
  try {
    const blogData = { ...req.body };
    if (!blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }

    const existing = await Blog.findOne({ slug: blogData.slug });
    if (existing) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }

    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blogData = { ...req.body };
    if (blogData.title && !blogData.slug) {
      blogData.slug = generateSlug(blogData.title);
    }

    const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blog By Slug
export const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blogs with pagination and search
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { search, limit = '10', page = '1' } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const lim = parseInt(limit as string, 10);
    const pg = parseInt(page as string, 10);

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip((pg - 1) * lim)
      .limit(lim);

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
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
