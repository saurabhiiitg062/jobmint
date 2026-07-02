import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import AdminExamEditor from '@/components/AdminExamEditor';
import { FileEdit, Trash2, X } from 'lucide-react';
import { DynamicTable as DynamicTableType } from '@/types';

export default function ExamsTab() {
  const [exams, setExams] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    overview: '',
    importantDates: {
      examDate: '',
      admitCardRelease: '',
      resultDeclaration: ''
    },
    vacancyDetails: [] as DynamicTableType[],
    historicalCutoffs: [] as DynamicTableType[]
  });

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

  const handleEditorChange = (data: { overview: string; vacancyDetails: DynamicTableType[]; historicalCutoffs: DynamicTableType[] }) => {
    setFormData(prev => ({
      ...prev,
      overview: data.overview,
      vacancyDetails: data.vacancyDetails,
      historicalCutoffs: data.historicalCutoffs
    }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      importantDates: {
        ...prev.importantDates,
        [field]: value
      }
    }));
  };

  const onSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) {
      setErrorMsg('Title and Organization are required');
      return;
    }
    setErrorMsg(''); setSuccessMsg('');
    try {
      if (isEditing) {
        await api.updateExam(isEditing, formData);
        setSuccessMsg('Exam updated successfully');
      } else {
        await api.createExam(formData);
        setSuccessMsg('Exam created successfully');
      }
      resetForm();
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
    setFormData({
      title: exam.title || '',
      organization: exam.organization || '',
      overview: exam.overview || '',
      importantDates: {
        examDate: exam.importantDates?.examDate || '',
        admitCardRelease: exam.importantDates?.admitCardRelease || '',
        resultDeclaration: exam.importantDates?.resultDeclaration || ''
      },
      vacancyDetails: exam.vacancyDetails || [],
      historicalCutoffs: exam.historicalCutoffs || []
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      title: '',
      organization: '',
      overview: '',
      importantDates: { examDate: '', admitCardRelease: '', resultDeclaration: '' },
      vacancyDetails: [],
      historicalCutoffs: []
    });
  };

  return (
    <div className="space-y-6">
      {successMsg && <div className="bg-green-50 text-status-success text-xs font-semibold p-3 border border-green-200 rounded">{successMsg}</div>}
      {errorMsg && <div className="bg-red-50 text-status-danger text-xs font-semibold p-3 border border-red-200 rounded">{errorMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Form */}
        <div className="lg:col-span-2">
          <form onSubmit={onSaveExam} className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
                {isEditing ? 'Edit Exam Master' : 'Create New Exam'}
              </h3>
              {isEditing && (
                <button type="button" onClick={resetForm} className="text-xs text-status-danger font-bold hover:underline flex items-center">
                  <X className="w-3 h-3 mr-1" /> Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Exam Title *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. SSC CGL" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Organization *</label>
                <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. Staff Selection Commission" required />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Usual Exam Month</label>
                <input type="text" value={formData.importantDates.examDate} onChange={e => handleDateChange('examDate', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. September" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Result Declaration</label>
                <input type="text" value={formData.importantDates.resultDeclaration} onChange={e => handleDateChange('resultDeclaration', e.target.value)} className="w-full p-2 border rounded text-sm focus:ring-1" placeholder="e.g. December" />
              </div>
            </div>

            <AdminExamEditor 
              initialOverview={formData.overview}
              initialVacancyDetails={formData.vacancyDetails}
              initialHistoricalCutoffs={formData.historicalCutoffs}
              onChange={handleEditorChange}
            />

            <button type="submit" className="w-full bg-primary hover:bg-[#600000] text-white p-3 rounded font-bold text-sm tracking-wide transition-colors">
              {isEditing ? 'Save Changes' : 'Create Exam Master'}
            </button>
          </form>
        </div>

        {/* Exam List */}
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Active Exams Master Data</h3>
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
