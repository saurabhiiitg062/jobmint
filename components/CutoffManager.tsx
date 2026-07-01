"use client";

import React, { useState, useEffect } from 'react';
import { Cutoff } from '@/types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface Props {
  jobId: string;
  cutoffs: Cutoff[];
  onChange: (cutoffs: Cutoff[]) => void;
}

export default function CutoffManager({ jobId, cutoffs, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCutoff, setNewCutoff] = useState<Partial<Cutoff>>({
    jobId,
    year: new Date().getFullYear().toString(),
    examType: 'Prelims',
    category: '',
    cutoff: 0,
    qualifyingMarks: 0,
    remarks: ''
  });

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  const examTypes = ['Prelims', 'Mains', 'Interview', 'Final', 'Other'] as const;
  const categories = ['General', 'OBC', 'EWS', 'SC', 'ST', 'PwD', 'Others'];

  const groupedCutoffs = cutoffs.reduce((acc, cutoff) => {
    if (!acc[cutoff.year]) {
      acc[cutoff.year] = [];
    }
    acc[cutoff.year].push(cutoff);
    return acc;
  }, {} as Record<string, Cutoff[]>);

  const handleAddCutoff = () => {
    if (!newCutoff.category || !newCutoff.year) {
      alert('Please fill required fields');
      return;
    }

    const cutoff: Cutoff = {
      _id: Date.now().toString(),
      jobId,
      year: newCutoff.year!,
      examType: newCutoff.examType || 'Prelims',
      category: newCutoff.category!,
      cutoff: newCutoff.cutoff || 0,
      qualifyingMarks: newCutoff.qualifyingMarks || 0,
      remarks: newCutoff.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onChange([...cutoffs, cutoff]);
    setNewCutoff({
      jobId,
      year: new Date().getFullYear().toString(),
      examType: 'Prelims',
      category: '',
      cutoff: 0,
      qualifyingMarks: 0,
      remarks: ''
    });
  };

  const handleUpdateCutoff = (id: string, field: keyof Cutoff, value: any) => {
    const updated = cutoffs.map(c => 
      c._id === id ? { ...c, [field]: value, updatedAt: new Date().toISOString() } : c
    );
    onChange(updated);
  };

  const handleDeleteCutoff = (id: string) => {
    if (confirm('Are you sure you want to delete this cutoff?')) {
      onChange(cutoffs.filter(c => c._id !== id));
    }
  };

  return (
    <div className="bg-white border border-border-custom rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-secondary mb-4">Cutoff Marks Management</h3>

      {/* Add New Cutoff Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-border-custom">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Add New Cutoff</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-500">Year *</label>
            <select
              value={newCutoff.year}
              onChange={(e) => setNewCutoff({ ...newCutoff, year: e.target.value })}
              className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Exam Type</label>
            <select
              value={newCutoff.examType}
              onChange={(e) => setNewCutoff({ ...newCutoff, examType: e.target.value as any })}
              className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
            >
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Category *</label>
            <select
              value={newCutoff.category}
              onChange={(e) => setNewCutoff({ ...newCutoff, category: e.target.value })}
              className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
            >
              <option value="">Select</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Cutoff Marks *</label>
            <input
              type="number"
              step="0.01"
              value={newCutoff.cutoff}
              onChange={(e) => setNewCutoff({ ...newCutoff, cutoff: parseFloat(e.target.value) || 0 })}
              className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Qualifying Marks</label>
            <input
              type="number"
              step="0.01"
              value={newCutoff.qualifyingMarks}
              onChange={(e) => setNewCutoff({ ...newCutoff, qualifyingMarks: parseFloat(e.target.value) || 0 })}
              className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddCutoff}
              className="w-full bg-primary hover:bg-[#600000] text-white p-2 rounded text-sm font-bold flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-bold text-gray-500">Remarks (Optional)</label>
          <input
            type="text"
            value={newCutoff.remarks}
            onChange={(e) => setNewCutoff({ ...newCutoff, remarks: e.target.value })}
            className="w-full mt-1 p-2 border border-border-custom rounded text-sm"
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      {/* Existing Cutoffs Grouped by Year */}
      {Object.keys(groupedCutoffs).length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No cutoff data added yet
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCutoffs)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, yearCutoffs]) => (
              <div key={year} className="border border-border-custom rounded-lg overflow-hidden">
                <div className="bg-secondary text-white px-4 py-2 font-bold text-sm">
                  {year}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Exam Type</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Cutoff</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Qualifying</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Remarks</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearCutoffs.map((cutoff) => (
                        <tr key={cutoff._id} className="border-t border-border-custom">
                          <td className="px-4 py-2 text-sm">
                            {editingId === cutoff._id ? (
                              <select
                                value={cutoff.examType}
                                onChange={(e) => handleUpdateCutoff(cutoff._id, 'examType', e.target.value)}
                                className="p-1 border border-border-custom rounded text-xs"
                              >
                                {examTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            ) : (
                              cutoff.examType
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {editingId === cutoff._id ? (
                              <select
                                value={cutoff.category}
                                onChange={(e) => handleUpdateCutoff(cutoff._id, 'category', e.target.value)}
                                className="p-1 border border-border-custom rounded text-xs"
                              >
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            ) : (
                              cutoff.category
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {editingId === cutoff._id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={cutoff.cutoff}
                                onChange={(e) => handleUpdateCutoff(cutoff._id, 'cutoff', parseFloat(e.target.value) || 0)}
                                className="w-20 p-1 border border-border-custom rounded text-xs"
                              />
                            ) : (
                              cutoff.cutoff.toFixed(2)
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {editingId === cutoff._id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={cutoff.qualifyingMarks}
                                onChange={(e) => handleUpdateCutoff(cutoff._id, 'qualifyingMarks', parseFloat(e.target.value) || 0)}
                                className="w-20 p-1 border border-border-custom rounded text-xs"
                              />
                            ) : (
                              cutoff.qualifyingMarks.toFixed(2)
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {editingId === cutoff._id ? (
                              <input
                                type="text"
                                value={cutoff.remarks || ''}
                                onChange={(e) => handleUpdateCutoff(cutoff._id, 'remarks', e.target.value)}
                                className="w-full p-1 border border-border-custom rounded text-xs"
                              />
                            ) : (
                              cutoff.remarks || '-'
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <div className="flex space-x-2">
                              {editingId === cutoff._id ? (
                                <>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-green-600 hover:text-green-700"
                                    title="Save"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-600 hover:text-gray-700"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingId(cutoff._id)}
                                    className="text-secondary hover:text-primary"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCutoff(cutoff._id)}
                                    className="text-status-danger hover:text-red-700"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
