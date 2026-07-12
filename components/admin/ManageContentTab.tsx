"use client";

import { useState, useEffect } from 'react';
import { Job, Blog, Organization } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api/client';

export default function ManageContentTab({
  onEdit
}: {
  onEdit: (data: any, type: 'job' | 'blog' | 'organization') => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'jobs' | 'blogs' | 'organizations'>('jobs');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'jobs') {
        const res = await api.getJobs({ limit: 100 });
        setJobs(res.jobs || []);
      } else if (activeSubTab === 'blogs') {
        const res = await api.getBlogs({ limit: 100 });
        setBlogs(res.blogs || []);
      } else if (activeSubTab === 'organizations') {
        const res = await fetch('/api/organizations');
        const data = await res.json();
        setOrgs(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
    setLoading(false);
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(id);
        fetchData();
      } catch (e) { alert('Failed to delete job'); }
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.deleteBlog(id);
        fetchData();
      } catch (e) { alert('Failed to delete blog'); }
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await fetch(`/api/organizations/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) { alert('Failed to delete organization'); }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Manage Content</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'jobs' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveSubTab('blogs')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'blogs' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Blogs
          </button>
          <button
            onClick={() => setActiveSubTab('organizations')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeSubTab === 'organizations' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Pillar Pages
          </button>
        </div>
      </div>
      
      <div className="p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Title / Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSubTab === 'jobs' && jobs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center">No jobs found.</td></tr>
                )}
                {activeSubTab === 'jobs' && jobs.map((job) => (
                  <tr key={job._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{job.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onEdit(job, 'job')} className="text-blue-600 hover:text-blue-800 mr-4">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}

                {activeSubTab === 'blogs' && blogs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center">No blogs found.</td></tr>
                )}
                {activeSubTab === 'blogs' && blogs.map((blog) => (
                  <tr key={blog._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-50 text-purple-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                        Blog
                      </span>
                    </td>
                    <td className="px-6 py-4">{blog.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onEdit(blog, 'blog')} className="text-blue-600 hover:text-blue-800 mr-4">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}

                {activeSubTab === 'organizations' && orgs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center">No pillar pages found.</td></tr>
                )}
                {activeSubTab === 'organizations' && orgs.map((org) => (
                  <tr key={org._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                        Pillar Page
                      </span>
                    </td>
                    <td className="px-6 py-4">{org.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onEdit(org, 'organization')} className="text-blue-600 hover:text-blue-800 mr-4">
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleDeleteOrg(org._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
