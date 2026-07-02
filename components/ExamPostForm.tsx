import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing: boolean;
  onCancel: () => void;
}

export default function ExamPostForm({ initialData, onSubmit, isEditing, onCancel }: Props) {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
      if (initialData.importantDates) {
        Object.keys(initialData.importantDates).forEach((key) => {
          setValue(`importantDates.${key}`, initialData.importantDates[key]);
        });
      }
      if (initialData.eligibility) {
        Object.keys(initialData.eligibility).forEach((key) => {
          setValue(`eligibility.${key}`, initialData.eligibility[key]);
        });
      }
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
          {isEditing ? 'Edit Exam / Admit Card' : 'Post New Exam'}
        </h3>
        {isEditing && (
          <button type="button" onClick={onCancel} className="text-xs text-status-danger font-bold hover:underline">
            Cancel Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Exam Title *</label>
          <input type="text" {...register('title', { required: true })} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. SSC CGL 2026 Tier 1" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Organization *</label>
          <input type="text" {...register('organization', { required: true })} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. Staff Selection Commission" />
        </div>
        
        <div className="md:col-span-2 space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Overview</label>
          <textarea {...register('overview')} rows={3} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="Brief description of the exam"></textarea>
        </div>

        {/* Important Dates */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Exam Date</label>
          <input type="text" {...register('importantDates.examDate')} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. 15-20 October 2026" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Admit Card Release Date</label>
          <input type="text" {...register('importantDates.admitCardRelease')} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. 1st Week of October" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Result Declaration</label>
          <input type="text" {...register('importantDates.resultDeclaration')} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. December 2026" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-gray-500">Application Fee info</label>
          <input type="text" {...register('applicationFee')} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. General: 100/-, SC/ST: Nil" />
        </div>
      </div>

      <button type="submit" className="w-full bg-primary hover:bg-[#600000] text-white p-3 rounded font-bold text-sm tracking-wide transition-colors">
        {isEditing ? 'Save Changes' : 'Publish Exam'}
      </button>
    </form>
  );
}
