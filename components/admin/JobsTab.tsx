import React from 'react';
import JobPostForm from "@/components/JobPostForm";
import { Job } from '@/types';
import { FileEdit, Trash2 } from 'lucide-react';

interface Props {
  jobs: Job[];
  isEditing: string | null;
  onSaveJob: (data: any) => Promise<void>;
  handleEditSetup: (job: Job) => void;
  handleDeleteJob: (id: string) => void;
  resetEditState: () => void;
}

export default function JobsTab({ 
  jobs, isEditing, onSaveJob, handleEditSetup, handleDeleteJob, resetEditState 
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job Form */}
      <div className="lg:col-span-2">
        <JobPostForm
          initialData={isEditing ? jobs.find(j => j._id === isEditing) : undefined}
          onSubmit={onSaveJob}
          isEditing={!!isEditing}
          onCancel={resetEditState}
        />
      </div>

      {/* Job List */}
      <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Active Listings</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {jobs.map((job) => (
            <div key={job._id} className="border border-gray-100 p-3 rounded space-y-2 hover:border-gray-300">
              <span className="text-[9px] uppercase font-extrabold text-primary bg-red-50 px-1.5 py-0.5 rounded">{job.category}</span>
              <h4 className="font-bold text-xs text-gray-700 leading-snug">{job.title}</h4>
              <div className="flex space-x-2 pt-1 border-t border-gray-50">
                <button onClick={() => handleEditSetup(job)} className="text-[10px] text-secondary font-bold flex items-center space-x-0.5 hover:underline">
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button onClick={() => handleDeleteJob(job._id)} className="text-[10px] text-status-danger font-bold flex items-center space-x-0.5 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
