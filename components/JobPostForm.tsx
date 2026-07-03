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
  const [description, setDescription] = useState(initialData?.rawData?.description || initialData?.description || '');
  const [customSections, setCustomSections] = useState<{title: string, content: string}[]>(initialData?.rawData?.customSections || []);
  const [tables, setTables] = useState<DynamicTableType[]>(initialData?.tables || []);
  const [customDates, setCustomDates] = useState<{label: string, date: string}[]>(initialData?.rawData?.customDates || []);
  const [customLinks, setCustomLinks] = useState<{label: string, url: string}[]>(initialData?.rawData?.customLinks || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatePublishDate, setUpdatePublishDate] = useState(false);
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

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: flattenedInitialData
  });

  // Load Draft
  React.useEffect(() => {
    if (isEditing) return;
    const savedDraft = localStorage.getItem('jobmint_job_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData && Object.keys(parsed.formData).length > 0) {
          reset(parsed.formData);
        }
        if (parsed.description) setDescription(parsed.description);
        if (parsed.customSections) setCustomSections(parsed.customSections);
        if (parsed.tables) setTables(parsed.tables);
        if (parsed.customDates) setCustomDates(parsed.customDates);
        if (parsed.customLinks) setCustomLinks(parsed.customLinks);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [isEditing, reset]);

  // Save Draft Periodically
  React.useEffect(() => {
    if (isEditing) return;
    const interval = setInterval(() => {
      const draft = {
        formData: getValues(),
        description,
        customSections,
        tables,
        customDates,
        customLinks
      };
      localStorage.setItem('jobmint_job_draft', JSON.stringify(draft));
    }, 2000);
    return () => clearInterval(interval);
  }, [isEditing, description, customSections, tables, customDates, customLinks, getValues]);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const preparedData = {
        ...formData,
        status: 'published',
        updatePublishDate,
        tables,
        rawData: {
          description,
          customSections,
          customDates,
          customLinks
        },
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
        localStorage.removeItem('jobmint_job_draft');
        reset();
        setDescription('');
        setCustomSections([]);
        setTables([]);
        setCustomDates([]);
        setCustomLinks([]);
      }
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border-custom rounded-lg shadow-sm">
      <div className="border-b border-border-custom px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-secondary">
          {isEditing ? 'Edit Job Notification' : 'Post New Job Notification'}
        </h2>
        {!isEditing && (
          <button 
            type="button" 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your saved draft? This cannot be undone.')) {
                localStorage.removeItem('jobmint_job_draft');
                window.location.reload();
              }
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded"
          >
            Clear Draft
          </button>
        )}
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
                <option value="Cutoff">Cutoff</option>
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

          <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-600 uppercase">Custom Dates</label>
              <button 
                type="button" 
                onClick={() => setCustomDates([...customDates, { label: '', date: '' }])}
                className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-primary hover:bg-gray-100 font-bold"
              >
                + Add Date
              </button>
            </div>
            
            <div className="space-y-2">
              {customDates.map((cd, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={cd.label}
                    onChange={(e) => {
                      const newDates = [...customDates];
                      newDates[index].label = e.target.value;
                      setCustomDates(newDates);
                    }}
                    placeholder="e.g. Interview Date"
                    className="flex-1 p-2 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <input
                    type="date"
                    value={cd.date}
                    onChange={(e) => {
                      const newDates = [...customDates];
                      newDates[index].date = e.target.value;
                      setCustomDates(newDates);
                    }}
                    className="w-40 p-2 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <button 
                    type="button" 
                    onClick={() => setCustomDates(customDates.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    🗑
                  </button>
                </div>
              ))}
              {customDates.length === 0 && (
                <p className="text-xs text-gray-400 italic">No custom dates added. Click + Add Date if needed.</p>
              )}
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

          <div className="mt-4 border border-gray-100 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-600 uppercase">Custom Links</label>
              <button 
                type="button" 
                onClick={() => setCustomLinks([...customLinks, { label: '', url: '' }])}
                className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-primary hover:bg-gray-100 font-bold"
              >
                + Add Link
              </button>
            </div>
            
            <div className="space-y-2">
              {customLinks.map((cl, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={cl.label}
                    onChange={(e) => {
                      const newLinks = [...customLinks];
                      newLinks[index].label = e.target.value;
                      setCustomLinks(newLinks);
                    }}
                    placeholder="e.g. Download Syllabus"
                    className="flex-1 p-2 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <input
                    type="url"
                    value={cl.url}
                    onChange={(e) => {
                      const newLinks = [...customLinks];
                      newLinks[index].url = e.target.value;
                      setCustomLinks(newLinks);
                    }}
                    placeholder="https://..."
                    className="flex-1 p-2 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                  <button 
                    type="button" 
                    onClick={() => setCustomLinks(customLinks.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    🗑
                  </button>
                </div>
              ))}
              {customLinks.length === 0 && (
                <p className="text-xs text-gray-400 italic">No custom links added. Click + Add Link if needed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">
            Job Details / Overview
          </h3>
          <TiptapEditor
            value={description}
            onChange={setDescription}
          />
        </div>

        {/* Custom Rich Text Sections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
              Custom Sections (Rich Text)
            </h3>
            <button 
              type="button" 
              onClick={() => setCustomSections([...customSections, { title: '', content: '' }])}
              className="text-xs bg-white border border-gray-200 px-3 py-1 rounded text-primary hover:bg-gray-100 font-bold shadow-sm"
            >
              + Add Section
            </button>
          </div>
          
          <div className="space-y-6">
            {customSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button 
                  type="button" 
                  onClick={() => setCustomSections(customSections.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1.5 rounded"
                  title="Remove Section"
                >
                  🗑
                </button>
                <div className="space-y-3 pr-8">
                  <div>
                    <label className="text-xs font-bold text-gray-500">Section Title (e.g. Selection Process, How to Apply)</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...customSections];
                        newSections[index].title = e.target.value;
                        setCustomSections(newSections);
                      }}
                      className="w-full p-2 mt-1 border border-border-custom rounded text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                      placeholder="Enter tab title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Content</label>
                    <TiptapEditor
                      value={section.content}
                      onChange={(val) => {
                        const newSections = [...customSections];
                        newSections[index].content = val;
                        setCustomSections(newSections);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {customSections.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">No custom sections added. Click "+ Add Section" to add more tabs like How to Apply, Syllabus, etc.</p>
            )}
          </div>
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

        {/* SEO Bump to top */}
        {isEditing && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start space-x-3">
            <input 
              type="checkbox" 
              id="updatePublishDate"
              checked={updatePublishDate}
              onChange={(e) => setUpdatePublishDate(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary rounded border-red-300 focus:ring-primary"
            />
            <div>
              <label htmlFor="updatePublishDate" className="text-sm font-bold text-secondary block">
                Bump to Top (Update Publish Date to Today)
              </label>
              <p className="text-xs text-gray-600 mt-0.5">
                Check this if you extended the date or made a major update. This will push the post to the top of the homepage and signal freshness to Google for SEO.
              </p>
            </div>
          </div>
        )}

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
