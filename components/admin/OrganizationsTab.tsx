"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-form';
import { Organization } from '@/types';
import TiptapEditor from '../TiptapEditor';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';

export default function OrganizationsTab() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<Partial<Organization>>({});
  
  // Basic state for form fields to keep it simple
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organizations');
      const data = await res.json();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentOrg({});
    setName('');
    setSlug('');
    setLogo('');
    setMetaTitle('');
    setMetaDescription('');
    setContent('');
    setIsEditing(true);
  };

  const handleEdit = (org: Organization) => {
    setCurrentOrg(org);
    setName(org.name);
    setSlug(org.slug);
    setLogo(org.logo || '');
    setMetaTitle(org.metaTitle || '');
    setMetaDescription(org.metaDescription || '');
    setContent(org.content);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) return;
    try {
      await fetch(`/api/organizations/${id}`, { method: 'DELETE' });
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleSave = async () => {
    if (!name || !slug) {
      alert('Name and slug are required');
      return;
    }

    const payload = {
      name,
      slug,
      logo,
      metaTitle,
      metaDescription,
      content,
    };

    try {
      const url = currentOrg._id 
        ? `/api/organizations/${currentOrg._id}` 
        : '/api/organizations';
      
      const method = currentOrg._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to save');
        return;
      }

      setIsEditing(false);
      fetchOrganizations();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  if (loading) return <div className="p-4">Loading organizations...</div>;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{currentOrg._id ? 'Edit' : 'Add'} Organization</h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. Staff Selection Commission (SSC)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g. ssc-exams"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input 
                type="text" 
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
              <input 
                type="text" 
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
              <textarea 
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pillar Page Content</label>
            <TiptapEditor value={content} onChange={setContent} />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
            >
              <Save className="w-4 h-4" /> Save Organization
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Organizations (Pillar Pages)</h2>
        <button 
          onClick={handleAddNew}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Organization
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No organizations found. Click "Add Organization" to create one.
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr key={org._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                  <td className="px-6 py-4">{org.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(org)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                    <button 
                      onClick={() => handleDelete(org._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
