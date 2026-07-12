"use client";

import { useState } from 'react';
import TiptapEditor from '../TiptapEditor';
import { Save, FileText, Briefcase, Building } from 'lucide-react';

export default function UniversalEditorTab() {
  const [postType, setPostType] = useState<'job' | 'blog' | 'organization'>('job');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
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

  const [loading, setLoading] = useState(false);

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
          logo
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to save');
      } else {
        alert(`${postType.toUpperCase()} saved successfully!`);
        // Reset form
        setTitle('');
        setSlug('');
        setContent('');
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
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Universal Content Editor</h2>
        <p className="text-sm text-gray-500 mt-1">Publish any type of content to your portal from this unified interface.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setPostType('job')}
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
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder="Enter title..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL) *</label>
            <input 
              type="text" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL</label>
              <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} className="w-full p-2 border rounded-md text-sm bg-white" />
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
