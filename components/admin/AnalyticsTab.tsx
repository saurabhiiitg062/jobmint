import React from 'react';

interface Props {
  stats: any;
  setActiveTab: (tab: any) => void;
}

export default function AnalyticsTab({ stats, setActiveTab }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-2">
          <span className="text-xs uppercase text-gray-400 font-bold">Total Job Vacancies</span>
          <p className="text-3xl font-extrabold text-primary">{stats.totalJobs || 0}</p>
        </div>
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-2">
          <span className="text-xs uppercase text-gray-400 font-bold">Total Articles/Blogs</span>
          <p className="text-3xl font-extrabold text-secondary">{stats.totalBlogs || 0}</p>
        </div>
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-2">
          <span className="text-xs uppercase text-gray-400 font-bold">Total Visitors (Monthly)</span>
          <p className="text-3xl font-extrabold text-success">{stats.totalVisitors || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Most Viewed Jobs</h3>
          <div className="space-y-3">
            {stats.mostViewedJobs?.map((j: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b pb-2">
                <span className="font-semibold text-gray-700 truncate max-w-[200px]">{j.title}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-500">{j.views} views</span>
              </div>
            ))}
            {(!stats.mostViewedJobs || stats.mostViewedJobs.length === 0) && (
              <p className="text-xs text-gray-400 text-center py-4">No data available yet.</p>
            )}
          </div>
        </div>
        <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary border-b pb-2">Admin Actions</h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <button onClick={() => setActiveTab('jobs')} className="bg-primary hover:bg-[#600000] text-white p-3 rounded text-xs font-bold transition-colors">
              Add New Job
            </button>
            <button onClick={() => setActiveTab('blogs')} className="bg-secondary hover:bg-[#002244] text-white p-3 rounded text-xs font-bold transition-colors">
              Create Blog Post
            </button>
            <button onClick={() => setActiveTab('exams')} className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded text-xs font-bold transition-colors">
              Add Exam Update
            </button>
            <button onClick={() => setActiveTab('master')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded text-xs font-bold transition-colors border border-gray-200">
              Manage Master Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
