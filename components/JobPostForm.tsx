"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DynamicTable as DynamicTableType } from '@/types';
import TiptapEditor from './TiptapEditor';
import DynamicTableBuilder from './DynamicTableBuilder';

const jobFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization name is required'),
  postName: z.string().min(1, 'Post name is required'),
  vacancy: z.number().min(0).default(0),
  salary: z.string().optional(),
  qualification: z.string().min(1, 'Qualification is required'),
  ageLimit: z.string().optional(),
  applicationFee: z.string().optional(),
  selectionProcess: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  state: z.string().optional(),
  exam: z.string().optional(),
  applyOnline: z.string().optional(),
  downloadNotification: z.string().optional(),
  officialWebsite: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  applyStart: z.string().optional(),
  applyLastDate: z.string().optional()
});

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function JobPostForm({ initialData, onSubmit, isEditing = false, onCancel }: Props) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [tables, setTables] = useState<DynamicTableType[]>(initialData?.tables || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examsList, setExamsList] = useState<any[]>([]);

  React.useEffect(() => {
    import('@/lib/api/client').then(({ api }) => {
      api.getExams({ limit: 100 }).then(data => {
        setExamsList(Array.isArray(data) ? data : []);
      }).catch(console.error);
    });
  }, []);

  const flattenedInitialData = React.useMemo(() => {
    if (!initialData) return {};
    return {
      ...initialData,
      applyStart: initialData?.importantDates?.applyStart || '',
      applyLastDate: initialData?.importantDates?.applyLastDate || '',
      applyOnline: initialData?.importantLinks?.applyOnline || '',
      downloadNotification: initialData?.importantLinks?.downloadNotification || '',
      officialWebsite: initialData?.importantLinks?.officialWebsite || ''
    };
  }, [initialData]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: flattenedInitialData
  });

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const preparedData = {
        ...formData,
        description,
        tables,
        importantDates: {
          applyStart: formData.applyStart || 'Available Now',
          applyLastDate: formData.applyLastDate || 'Apply Soon'
        },
        importantLinks: {
          applyOnline: formData.applyOnline || '#',
          downloadNotification: formData.downloadNotification || '#',
          officialWebsite: formData.officialWebsite || '#'
        }
      };

      if (!preparedData.exam) {
        delete preparedData.exam; // Don't send empty string if no exam selected
      }

      await onSubmit(preparedData);
      
      if (!isEditing) {
        reset();
        setDescription('');
        setTables([]);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border-custom rounded-lg shadow-sm">
      <div className="border-b border-border-custom px-6 py-4">
        <h2 className="text-lg font-bold text-secondary">
          {isEditing ? 'Edit Job Notification' : 'Post New Job Notification'}
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
              <label className="text-xs font-bold text-gray-500">Job Title *</label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="SSC MTS Exam 2026 Online Form"
              />
              {errors.title && <span className="text-[10px] text-status-danger font-bold">{errors.title.message as string}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Organization *</label>
              <input
                type="text"
                {...register('organization')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="SSC"
              />
              {errors.organization && <span className="text-[10px] text-status-danger font-bold">{errors.organization.message as string}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Link to Exam Master</label>
              <select
                {...register('exam')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary bg-blue-50/50"
              >
                <option value="">No Exam Linked (Standalone Job)</option>
                {examsList.map(exam => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} ({exam.organization})
                  </option>
                ))}
              </select>
              <p className="text-[9px] text-gray-400 mt-0.5">Linking an exam will automatically show its Historical Cutoffs on this job.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Post Name *</label>
              <input
                type="text"
                {...register('postName')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="MTS"
              />
              {errors.postName && <span className="text-[10px] text-status-danger font-bold">{errors.postName.message as string}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Vacancy (Count)</label>
              <input
                type="number"
                {...register('vacancy', { valueAsNumber: true })}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="1000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Salary</label>
              <input
                type="text"
                {...register('salary')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="Rs. 18,000 - 22,000/-"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Required Qualification *</label>
              <input
                type="text"
                {...register('qualification')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="10th Pass / 12th Pass / Graduation"
              />
              {errors.qualification && <span className="text-[10px] text-status-danger font-bold">{errors.qualification.message as string}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Age Limit</label>
              <input
                type="text"
                {...register('ageLimit')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="18-25 years"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Application Fee</label>
              <input
                type="text"
                {...register('applicationFee')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="₹100 for General/OBC"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Selection Process</label>
              <textarea
                {...register('selectionProcess')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary h-20"
                placeholder="Written Exam, Document Verification, etc."
              />
            </div>
          </div>
        </div>

        {/* Category & Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Category & Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Category *</label>
              <select
                {...register('category')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="">Select Category</option>
                <option value="Latest Job">Latest Job</option>
                <option value="Admit Card">Admit Card</option>
                <option value="Result">Result</option>
                <option value="Answer Key">Answer Key</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Government Scheme">Government Scheme</option>
              </select>
              {errors.category && <span className="text-[10px] text-status-danger font-bold">{errors.category.message as string}</span>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">State Location</label>
              <input
                type="text"
                {...register('state')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="Central / Bihar / Delhi"
              />
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Important Dates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Apply Start Date</label>
              <input
                type="date"
                {...register('applyStart')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Last Date to Apply</label>
              <input
                type="date"
                {...register('applyLastDate')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>
        </div>

        {/* Important Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Important Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Apply Online Link</label>
              <input
                type="url"
                {...register('applyOnline')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Download Notification</label>
              <input
                type="url"
                {...register('downloadNotification')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-500">Official Website</label>
              <input
                type="url"
                {...register('officialWebsite')}
                className="w-full p-2.5 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Job Description
          </h3>
          <TiptapEditor
            value={description}
            onChange={setDescription}
          />
        </div>

        {/* Dynamic Tables */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Dynamic Tables (Vacancy, Fee, Age Limit, etc.)
          </h3>
          <DynamicTableBuilder tables={tables} onChange={setTables} />
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
                placeholder="SSC MTS 2026 Online Form - Apply Now"
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
              <span>{isEditing ? 'Update Job' : 'Publish Job'}</span>
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
