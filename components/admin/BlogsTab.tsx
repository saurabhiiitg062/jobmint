import React from 'react';
import BlogPostForm from "@/components/BlogPostForm";
import { Blog } from '@/types';
import { FileEdit, Trash2 } from 'lucide-react';

interface Props {
  blogs: Blog[];
  isEditingBlog: string | null;
  onSaveBlog: (data: any) => Promise<void>;
  handleEditBlogSetup: (blog: Blog) => void;
  handleDeleteBlog: (id: string) => void;
  resetEditState: () => void;
}

export default function BlogsTab({ 
  blogs, isEditingBlog, onSaveBlog, handleEditBlogSetup, handleDeleteBlog, resetEditState 
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Blog Form */}
      <div className="lg:col-span-2">
        <BlogPostForm
          initialData={isEditingBlog ? blogs.find(b => b._id === isEditingBlog) : undefined}
          onSubmit={onSaveBlog}
          isEditing={!!isEditingBlog}
          onCancel={resetEditState}
        />
      </div>

      {/* Blog List */}
      <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Active Blogs</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {blogs.map((blog) => (
            <div key={blog._id} className="border border-gray-100 p-3 rounded space-y-2 hover:border-gray-300">
              <h4 className="font-bold text-xs text-gray-700 leading-snug">{blog.title}</h4>
              <div className="flex space-x-2 pt-1 border-t border-gray-50">
                <button onClick={() => handleEditBlogSetup(blog)} className="text-[10px] text-secondary font-bold flex items-center space-x-0.5 hover:underline">
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDeleteBlog(blog._id)} className="text-[10px] text-status-danger font-bold flex items-center space-x-0.5 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
