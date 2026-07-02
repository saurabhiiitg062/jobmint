"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import TiptapEditor from './TiptapEditor';

const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
});

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function BlogPostForm({ initialData, onSubmit, isEditing = false, onCancel }: Props) {
  const [content, setContent] = useState(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    ...initialData,
    tags: initialData?.tags?.join(', ') || ''
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: defaultValues || {}
  });

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const preparedData = {
        ...formData,
        content,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
      };

      await onSubmit(preparedData);
      
      if (!isEditing) {
        reset();
        setContent('');
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border-custom rounded-lg shadow-sm">
      <div className="border-b border-border-custom px-6 py-4">
        <h2 className="text-lg font-bold text-secondary">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Blog Title *</label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="How to Crack SSC CGL in 6 Months"
              />
              {errors.title && <span className="text-[10px] text-status-danger font-bold">{errors.title.message as string}</span>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Excerpt / Short Description *</label>
              <textarea
                {...register('excerpt')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary h-20"
                placeholder="A brief summary of what this blog post is about..."
              />
              {errors.excerpt && <span className="text-[10px] text-status-danger font-bold">{errors.excerpt.message as string}</span>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Tags (Comma separated)</label>
              <input
                type="text"
                {...register('tags')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="ssc, tips, strategy"
              />
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Blog Content (Tiptap Editor)
          </h3>
          <TiptapEditor
            value={content}
            onChange={setContent}
          />
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            SEO Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">SEO Meta Title</label>
              <input
                type="text"
                {...register('seoTitle')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="SSC CGL Strategy 2026 - Best Tips"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">SEO Meta Description</label>
              <textarea
                {...register('seoDescription')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary h-20"
                placeholder="Brief description for search engines..."
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Focus Keyword</label>
              <input
                type="text"
                {...register('focusKeyword')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="ssc cgl strategy"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center space-x-3 pt-4 border-t border-border-custom">
          <button
             type="submit"
             disabled={isSubmitting}
             className="bg-primary hover:bg-[#600000] text-white px-6 py-2.5 rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>{isEditing ? 'Updating...' : 'Publishing...'}</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Blog' : 'Publish Blog'}</span>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded text-sm font-bold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
