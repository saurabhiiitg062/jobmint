"use client";

import { useState, useEffect } from 'react';
import TiptapEditor from '../TiptapEditor';
import { Save, FileText, Briefcase, Building } from 'lucide-react';

interface UniversalEditorProps {
  editData?: any | null;
  editType?: 'job' | 'blog' | 'organization';
  onCancelEdit?: () => void;
  onSuccess?: () => void;
}

export default function UniversalEditorTab({ 
  editData = null, 
  editType = 'job',
  onCancelEdit,
  onSuccess
}: UniversalEditorProps) {
  const [postType, setPostType] = useState<'job' | 'blog' | 'organization'>(editType);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!slugEdited) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setSlugEdited(true);
  };
  const [content, setContent] = useState('');
  
  // Job Meta Fields
  const [jobCategory, setJobCategory] = useState('Latest Job');
  const [vacancy, setVacancy] = useState('');
  const [salary, setSalary] = useState('');
  const [postName, setPostName] = useState('');
  
  // Blog Meta Fields
  const [excerpt, setExcerpt] = useState('');

  // Org Meta Fields
  const [logo, setLogo] = useState('');
  const [parentOrgId, setParentOrgId] = useState('');
  const [availableOrgs, setAvailableOrgs] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch('/api/organizations');
        if (res.ok) {
          const data = await res.json();
          setAvailableOrgs(data);
        }
      } catch (err) {
        console.error('Failed to fetch organizations', err);
      }
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (editData) {
      setPostType(editType);
      setTitle(editData.title || editData.name || '');
      setSlug(editData.slug || '');
      setSlugEdited(true);
      setContent(editData.content || '');
      
      if (editType === 'job') {
        setJobCategory(editData.category || 'Latest Job');
        setVacancy(editData.vacancy || '');
        setSalary(editData.salary || '');
        setPostName(editData.postName || '');
      } else if (editType === 'blog') {
        setExcerpt(editData.excerpt || '');
      } else if (editType === 'organization') {
        setLogo(editData.logo || '');
        setParentOrgId(editData.parentOrganization || '');
      }
    }
  }, [editData, editType]);

  const handleSave = async () => {
    if (!title || !slug) {
      alert('Title and slug are required');
      return;
    }

    setLoading(true);
    try {
      let url = '';
      let payload: any = { title, slug, content };

      if (postType === 'job') {
        url = '/api/jobs';
        payload = {
          ...payload,
          postName: postName || title,
          category: jobCategory,
          vacancy: vacancy ? Number(vacancy) : 0,
          salary,
          status: 'published'
        };
      } else if (postType === 'blog') {
        url = '/api/blogs';
        payload = {
          ...payload,
          excerpt: excerpt || content.substring(0, 100),
          status: 'published'
        };
      } else if (postType === 'organization') {
        url = '/api/organizations';
        payload = {
          name: title,
          slug,
          content,
          logo,
          ...(parentOrgId ? { parentOrganization: parentOrgId } : {})
        };
      }

      let method = editData ? 'PUT' : 'POST';
      if (editData) {
        url = `${url}/${editData._id}`;
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to save');
      } else {
        alert(`${postType.toUpperCase()} ${editData ? 'updated' : 'saved'} successfully!`);
        if (onSuccess) {
          onSuccess();
        } else {
          // Reset form if not handling externally
          setTitle('');
          setSlug('');
          setSlugEdited(false);
          setContent('');
          setParentOrgId('');
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {editData ? 'Edit Content (Universal)' : 'Universal Content Editor'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editData ? 'Update your existing content.' : 'Publish any type of content to your portal from this unified interface.'}
          </p>
        </div>
        {editData && onCancelEdit && (
          <button 
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-8 pointer-events-auto">
        <button
          onClick={() => setPostType('job')}
          disabled={!!editData}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            postType === 'job' 
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          Job / Exam
        </button>
        <button
          onClick={() => setPostType('blog')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            postType === 'blog' 
              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-600 ring-offset-2' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          Blog Post
        </button>
        <button
          onClick={() => setPostType('organization')}
          disabled={!!editData}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            postType === 'organization' 
              ? 'bg-green-600 text-white shadow-md ring-2 ring-green-600 ring-offset-2' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building className="w-5 h-5" />
          Pillar Page
        </button>
      </div>

      <div className="space-y-6">
        {/* Core Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {postType === 'organization' ? 'Organization Name *' : 'Title *'}
            </label>
            <input 
              type="text" 
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="Enter title..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL) *</label>
            <input 
              type="text" 
              value={slug}
              onChange={handleSlugChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="e.g. ssc-cgl-2026"
            />
          </div>
        </div>

        {/* Dynamic Meta Fields Accordion style */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2">
            {postType} Meta Fields
          </h3>
          
          {postType === 'job' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select 
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm bg-white"
                >
                  <option value="Latest Job">Latest Job</option>
                  <option value="Admit Card">Admit Card</option>
                  <option value="Result">Result</option>
                  <option value="Answer Key">Answer Key</option>
                  <option value="Syllabus">Syllabus</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Post Name</label>
                <input type="text" value={postName} onChange={(e) => setPostName(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Vacancy</label>
                <input type="number" value={vacancy} onChange={(e) => setVacancy(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Salary</label>
                <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white" />
              </div>
            </div>
          )}

          {postType === 'blog' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Short Excerpt (Summary)</label>
              <textarea 
                value={excerpt} 
                onChange={(e) => setExcerpt(e.target.value)} 
                className="w-full p-2 border rounded-md text-sm bg-white" 
                rows={2} 
              />
            </div>
          )}

          {postType === 'organization' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL</label>
                <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Organization (Optional)</label>
                <select 
                  value={parentOrgId}
                  onChange={(e) => setParentOrgId(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm bg-white"
                >
                  <option value="">None (Top Level Pillar)</option>
                  {availableOrgs.map((org) => (
                    <option key={org._id} value={org._id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tiptap Editor */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Main Content</label>
          <TiptapEditor value={content} onChange={setContent} />
        </div>

        <div className="flex justify-end pt-6 border-t mt-8">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> 
            {loading ? 'Publishing...' : 'Publish Content'}
          </button>
        </div>
      </div>
    </div>
  );
}
