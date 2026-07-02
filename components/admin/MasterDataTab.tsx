import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { Trash2, Plus } from 'lucide-react';

export default function MasterDataTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newState, setNewState] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catData, stateData] = await Promise.all([
        api.getCategories(),
        api.getStates()
      ]);
      setCategories(catData || []);
      setStates(stateData || []);
    } catch (err: any) {
      setErrorMsg('Failed to load master data');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!newCategory.trim()) return;

    try {
      await api.createCategory({ name: newCategory });
      setSuccessMsg('Category added successfully');
      setNewCategory('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      setSuccessMsg('Category deleted successfully');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete category');
    }
  };

  const handleAddState = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!newState.trim()) return;

    try {
      await api.createState({ name: newState });
      setSuccessMsg('State added successfully');
      setNewState('');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add state');
    }
  };

  const handleDeleteState = async (id: string) => {
    if (!confirm('Are you sure you want to delete this state?')) return;
    try {
      await api.deleteState(id);
      setSuccessMsg('State deleted successfully');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete state');
    }
  };

  return (
    <div className="space-y-6">
      {successMsg && <div className="bg-green-50 text-status-success text-xs font-semibold p-3 border border-green-200 rounded">{successMsg}</div>}
      {errorMsg && <div className="bg-red-50 text-status-danger text-xs font-semibold p-3 border border-red-200 rounded">{errorMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Categories Section */}
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Job Categories</h3>
          
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input 
              type="text" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              placeholder="e.g. Bank Jobs, SSC" 
              className="flex-1 p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="bg-primary hover:bg-[#600000] text-white px-3 py-2 rounded text-xs font-bold flex items-center">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat._id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-100 rounded text-sm hover:border-gray-300">
                <span className="font-semibold text-gray-700">{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat._id)} 
                  className="text-status-danger hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No categories found.</p>}
          </div>
        </div>

        {/* States Section */}
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Indian States / Regions</h3>
          
          <form onSubmit={handleAddState} className="flex gap-2">
            <input 
              type="text" 
              value={newState} 
              onChange={(e) => setNewState(e.target.value)} 
              placeholder="e.g. Bihar, UP" 
              className="flex-1 p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="bg-primary hover:bg-[#600000] text-white px-3 py-2 rounded text-xs font-bold flex items-center">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </button>
          </form>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {states.map((state) => (
              <div key={state._id} className="flex justify-between items-center p-2.5 bg-gray-50 border border-gray-100 rounded text-sm hover:border-gray-300">
                <span className="font-semibold text-gray-700">{state.name}</span>
                <button 
                  onClick={() => handleDeleteState(state._id)} 
                  className="text-status-danger hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                  title="Delete State"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {states.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No states found.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
