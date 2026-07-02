import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { Blog } from '@/types';

import { connectToDatabase } from '@/lib/server/db';
import { Blog as BlogModel } from '@/lib/server/models/Blog';

export const revalidate = 300;

export default async function BlogPage() {
  let blogs: Blog[] = [];

  try {
    await connectToDatabase();
    // Remove strict status filter to support legacy DB documents without a status field
    const fetchedBlogs = await BlogModel.find({})
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();
    blogs = JSON.parse(JSON.stringify(fetchedBlogs));
  } catch (error) {
    console.warn('Database error in blogs list, using mock fallbacks.', error);
  }

  const displayBlogs = blogs;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-secondary">Latest Career Guidance & Exam Tips</h2>
        <p className="text-xs sm:text-sm text-gray-500">Read prep strategies, exam day instructions, and career guidelines for major competitive exams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayBlogs.map((blog) => (
          <div key={blog._id} className="bg-white border border-border-custom rounded-lg p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-all">
            <div className="space-y-3">
              <Link href={`/blog/${blog.slug}`} className="text-lg font-bold text-primary hover:underline block leading-snug">
                {blog.title}
              </Link>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">
                {blog.excerpt}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-100 mt-6">
              <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
              <span>Views: {blog.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
