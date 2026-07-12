'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RootState } from '@/store/store';
import { setCredentials, logout } from '@/store/authSlice';
import { api } from '@/lib/api/client';
import { Job, Blog } from '@/types';
import { Lock, Mail, BarChart3, Plus, Settings, LogOut, FileText, Database, GraduationCap, ChevronRight, Building, Edit3 } from 'lucide-react';

import AnalyticsTab from '@/components/admin/AnalyticsTab';
import JobsTab from '@/components/admin/JobsTab';
import BlogsTab from '@/components/admin/BlogsTab';
import ExamsTab from '@/components/admin/ExamsTab';
import MasterDataTab from '@/components/admin/MasterDataTab';
import OrganizationsTab from '@/components/admin/OrganizationsTab';
import UniversalEditorTab from '@/components/admin/UniversalEditorTab';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  const dispatch = useDispatch();
  const { isAuthenticated, admin } = useSelector((state: RootState) => state.auth);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as any;

  // Tabs: analytics, universal, jobs, blogs, exams, master, organizations
  const [activeTab, setActiveTabState] = useState<'analytics' | 'universal' | 'jobs' | 'blogs' | 'exams' | 'master' | 'organizations'>(tabParam || 'analytics');
  
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab as any);
    router.replace(`?tab=${tab}`, { scroll: false });
  };
  
  // Data State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<any>({});
  
  // UI State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Editing State
  const [isEditingJob, setIsEditingJob] = useState<string | null>(null);
  const [isEditingBlog, setIsEditingBlog] = useState<string | null>(null);

  // Job Form Data references for when handleEditSetup is called
  const [jobEditData, setJobEditData] = useState<Job | null>(null);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadJobs();
      loadBlogs();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e: any) {
      setStats({
        totalJobs: 10, totalBlogs: 2, totalVisitors: 4500,
        mostViewedJobs: []
      });
    }
  };

  const loadJobs = async () => {
    try {
      const data = await api.getJobs({ limit: 100 });
      setJobs(data.jobs);
    } catch (e) { setJobs([]); }
  };

  const loadBlogs = async () => {
    try {
      const data = await api.getBlogs({ limit: 100 });
      setBlogs(data.blogs);
    } catch (e) { setBlogs([]); }
  };

  const onLogin = async (data: any) => {
    setErrorMsg('');
    try {
      const res = await api.login(data);
      dispatch(setCredentials({ token: res.token, admin: res.admin }));
      setSuccessMsg('Logged in successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  // JOB HANDLERS
  const onSaveJob = async (formData: any) => {
    setErrorMsg(''); setSuccessMsg('');
    try {
      if (isEditingJob) {
        await api.updateJob(isEditingJob, formData);
        setSuccessMsg('Job updated successfully');
      } else {
        await api.createJob(formData);
        setSuccessMsg('Job created successfully');
      }
      setIsEditingJob(null);
      setJobEditData(null);
      loadJobs(); loadStats();
    } catch (err: any) { setErrorMsg(err.message || 'Action failed.'); }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(id);
        setSuccessMsg('Job deleted successfully');
        loadJobs(); loadStats();
      } catch (err: any) { setErrorMsg(err.message || 'Failed to delete'); }
    }
  };

  const handleCloneJob = async (id: string) => {
    try {
      const clonedJob = await api.cloneJob(id);
      setSuccessMsg('Job cloned successfully! You can now edit it.');
      loadJobs();
      loadStats();
      handleEditJobSetup(clonedJob);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to clone job');
    }
  };

  const handleEditJobSetup = (job: Job) => {
    setIsEditingJob(job._id);
    setJobEditData(job);
    setActiveTab('jobs');
  };

  const resetJobEditState = () => {
    setIsEditingJob(null);
    setJobEditData(null);
  };

  // BLOG HANDLERS
  const onSaveBlog = async (formData: any) => {
    setErrorMsg(''); setSuccessMsg('');
    try {
      if (isEditingBlog) {
        await api.updateBlog(isEditingBlog, formData);
        setSuccessMsg('Blog updated successfully');
      } else {
        await api.createBlog(formData);
        setSuccessMsg('Blog created successfully');
      }
      setIsEditingBlog(null);
      loadBlogs(); loadStats();
    } catch (err: any) { setErrorMsg(err.message || 'Action failed.'); }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.deleteBlog(id);
        setSuccessMsg('Blog deleted successfully');
        loadBlogs(); loadStats();
      } catch (err: any) { setErrorMsg(err.message || 'Failed to delete blog'); }
    }
  };

  const handleEditBlogSetup = (blog: Blog) => {
    setIsEditingBlog(blog._id);
    setActiveTab('blogs');
  };

  const resetBlogEditState = () => {
    setIsEditingBlog(null);
  };

  if (!ready) return null;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-border-custom p-6 md:p-8 rounded-lg shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-primary text-white font-bold p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-xl">JJ</div>
          <h2 className="text-2xl font-bold text-secondary">Admin Login</h2>
          <p className="text-xs text-gray-400 font-medium">Jobmint Management Portal</p>
        </div>
        {errorMsg && <div className="bg-red-50 text-status-danger text-xs font-semibold p-3 border border-red-200 rounded">{errorMsg}</div>}
        <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center space-x-1"><Mail className="w-3.5 h-3.5" /><span>Email</span></label>
            <input type="email" {...registerLogin('email')} className="w-full p-2.5 border rounded focus:ring-1 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center space-x-1"><Lock className="w-3.5 h-3.5" /><span>Password</span></label>
            <input type="password" {...registerLogin('password')} className="w-full p-2.5 border rounded focus:ring-1 text-sm" />
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-[#600000] text-white p-3 rounded font-bold text-sm">Login</button>
        </form>
      </div>
    );
  }

  const navItems = [
    { id: 'analytics', label: 'Dashboard', icon: BarChart3 },
    { id: 'universal', label: 'Write Content (Universal)', icon: Edit3 },
    { id: 'jobs', label: 'Manage Jobs', icon: Plus },
    { id: 'exams', label: 'Exams & Results', icon: GraduationCap },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'master', label: 'Master Data', icon: Database },
    { id: 'organizations', label: 'Pillar Pages', icon: Building },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header bar */}
      <div className="bg-white border border-border-custom rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-secondary">Control Center</h2>
          <p className="text-xs text-gray-400">Welcome, {admin?.name || 'Administrator'} ({admin?.role})</p>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-status-success text-xs font-semibold p-3 border border-green-200 rounded">{successMsg}</div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-status-danger text-xs font-semibold p-3 border border-red-200 rounded">{errorMsg}</div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-border-custom rounded-lg p-3 shadow-sm flex flex-col space-y-1">
            <h3 className="text-[10px] font-extrabold uppercase text-gray-400 px-3 py-2">Menu</h3>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded transition-colors text-sm font-bold ${
                  activeTab === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col space-y-4">
          <div>
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'universal' && <UniversalEditorTab />}
          {activeTab === 'jobs' && (
            <JobsTab 
              jobs={jobs} 
              isEditing={isEditingJob} 
              onSaveJob={onSaveJob} 
              handleEditSetup={handleEditJobSetup} 
              handleDeleteJob={handleDeleteJob}
              handleCloneJob={handleCloneJob}
              resetEditState={resetJobEditState} 
            />
          )}
          {activeTab === 'blogs' && (
            <BlogsTab 
              blogs={blogs} 
              isEditingBlog={isEditingBlog} 
              onSaveBlog={onSaveBlog} 
              handleEditBlogSetup={handleEditBlogSetup} 
              handleDeleteBlog={handleDeleteBlog} 
              resetEditState={resetBlogEditState} 
            />
          )}
          {activeTab === 'exams' && <ExamsTab />}
          {activeTab === 'master' && <MasterDataTab />}
          {activeTab === 'organizations' && <OrganizationsTab />}
          {activeTab === 'settings' as any && (
            <div className="bg-white border border-border-custom rounded-lg p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Site Settings</h3>
              <p className="text-xs text-gray-500">Configure global SEO, social links, and site information.</p>
              <div className="text-center py-8 text-gray-400 text-xs">
                Settings module is under development. Coming soon!
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
