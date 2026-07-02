import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import ExamPostForm from "@/components/ExamPostForm";
import { FileEdit, Trash2 } from 'lucide-react';

export default function ExamsTab() {
  const [exams, setExams] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await api.getExams({ limit: 100 });
      setExams(Array.isArray(data) ? data : []);
    } catch (e) {
      setExams([]);
    }
  };

  const onSaveExam = async (formData: any) => {
    setErrorMsg(''); setSuccessMsg('');
    try {
      if (isEditing) {
        await api.updateExam(isEditing, formData);
        setSuccessMsg('Exam updated successfully');
      } else {
        await api.createExam(formData);
        setSuccessMsg('Exam created successfully');
      }
      setIsEditing(null);
      loadExams();
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed.');
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.deleteExam(id);
        setSuccessMsg('Exam deleted successfully');
        loadExams();
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to delete exam');
      }
    }
  };

  const handleEditSetup = (exam: any) => {
    setIsEditing(exam._id);
  };

  return (
    <div className="space-y-6">
      {successMsg && <div className="bg-green-50 text-status-success text-xs font-semibold p-3 border border-green-200 rounded">{successMsg}</div>}
      {errorMsg && <div className="bg-red-50 text-status-danger text-xs font-semibold p-3 border border-red-200 rounded">{errorMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Form */}
        <div className="lg:col-span-2">
          <ExamPostForm
            initialData={isEditing ? exams.find(e => e._id === isEditing) : undefined}
            onSubmit={onSaveExam}
            isEditing={!!isEditing}
            onCancel={() => setIsEditing(null)}
          />
        </div>

        {/* Exam List */}
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Active Exams</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {exams.map((exam) => (
              <div key={exam._id} className="border border-gray-100 p-3 rounded space-y-2 hover:border-gray-300">
                <span className="text-[9px] uppercase font-extrabold text-primary bg-red-50 px-1.5 py-0.5 rounded">{exam.organization}</span>
                <h4 className="font-bold text-xs text-gray-700 leading-snug">{exam.title}</h4>
                <div className="flex space-x-2 pt-1 border-t border-gray-50">
                  <button onClick={() => handleEditSetup(exam)} className="text-[10px] text-secondary font-bold flex items-center space-x-0.5 hover:underline">
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button onClick={() => handleDeleteExam(exam._id)} className="text-[10px] text-status-danger font-bold flex items-center space-x-0.5 hover:underline">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
            {exams.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No exams found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
