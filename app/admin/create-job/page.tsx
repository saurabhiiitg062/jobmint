'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminJobEditor from '@/components/AdminJobEditor';
import { api } from '@/lib/api/client';
import { DynamicTable as DynamicTableType } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    postName: '',
    organization: '',
    qualification: '',
    category: '',
    state: '',
    salary: '',
    ageLimit: '',
    applicationFee: '',
    selectionProcess: '',
    description: '',
    tables: [] as DynamicTableType[] // ✅ Flexible tables
  });

  // Admin editor ka data
  const handleEditorChange = (data: { description: string; tables: DynamicTableType[] }) => {
    setFormData(prev => ({
      ...prev,
      description: data.description,
      tables: data.tables
    }));
  };

  // Submit karna
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.postName) {
      setError('Title and Post Name required');
      return;
    }

    if (!formData.tables || formData.tables.length === 0) {
      setError('Add at least one table');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        status: 'published',
        rawData: {} // MongoDB ke liye
      };

      console.log('Sending payload:', payload);
      
      const response = await api.createJob(payload);
      alert('✅ Job posted successfully!');
      router.push(`/jobs/${response.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">Admin Job Posting</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Fast job posting with guided tables</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Fill the basic job details, add only the tables you need, and publish. Vacancy, fee, age, cutoff, exam pattern, salary and custom tables are ready to use.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[360px]">
              {[
                { label: 'Step 1', value: 'Basic info' },
                { label: 'Step 2', value: 'Add tables' },
                { label: 'Step 3', value: 'Post job' },
              ].map((step) => (
                <div key={step.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{step.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{step.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                  <p className="mt-1 text-sm text-slate-600">Keep it simple: title, post name, and the fields that matter for this job.</p>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Required fields: 2</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., SSC CGL 2024"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Post Name *</label>
                  <input
                    type="text"
                    value={formData.postName}
                    onChange={(e) => setFormData(prev => ({ ...prev, postName: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., Multi Tasking Staff"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., SSC, UPSC"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., 12th Pass"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Salary</label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., 25,000 - 40,000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Age Limit</label>
                  <input
                    type="text"
                    value={formData.ageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageLimit: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., 18-35 years"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Application Fee</label>
                  <input
                    type="text"
                    value={formData.applicationFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationFee: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., Rs. 500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                  >
                    <option value="">Select Category</option>
                    <option value="Latest Job">Latest Job</option>
                    <option value="Admit Card">Admit Card</option>
                    <option value="Result">Result</option>
                    <option value="Answer Key">Answer Key</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., All India, Bihar"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Selection Process</label>
                  <input
                    type="text"
                    value={formData.selectionProcess}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectionProcess: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                    placeholder="e.g., Written Test, Interview"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Job Details Tables</h2>
                  <p className="mt-1 text-sm text-slate-600">Add only the tables this posting needs. No schema change required.</p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  Add table → fill data → publish
                </div>
              </div>

              <AdminJobEditor
                initialTables={formData.tables}
                onChange={handleEditorChange}
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">How this works</h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>1. Fill only the required fields.</li>
                  <li>2. Choose a table template or add a custom table.</li>
                  <li>3. Edit rows and publish the job.</li>
                </ol>
              </div>

              {formData.tables.length > 0 && (
                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                  <h3 className="font-bold text-blue-900">Tables Added</h3>
                  <ul className="mt-3 space-y-2">
                    {formData.tables.map((table, idx) => (
                      <li key={idx} className="text-sm text-blue-900/90">
                        <strong>{table.title}</strong>{' '}
                        <span className="text-blue-700">({table.columns.length} cols, {table.rows.length} rows)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <p className="text-sm font-bold text-emerald-900">Ready to publish</p>
                <p className="mt-1 text-sm text-emerald-800">After the fields and at least one table are added, posting will save the job and refresh the public pages.</p>
                {error && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? 'Posting job...' : 'Post Job Now'}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
