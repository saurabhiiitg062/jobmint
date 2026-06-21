import React from 'react';
import Link from 'next/link';
import { Search, Briefcase, FileText, CheckCircle2, ChevronRight, Award, MapPin, Building2, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api/client';
import { mockJobs, mockBlogs } from '@/lib/mockData';
import { Job, Blog } from '@/types';

// Force SSG by default, revalidate every 300 seconds
export const revalidate = 300;

export default async function HomePage() {
  let dbJobs: Job[] = [];
  let dbBlogs: Blog[] = [];

  try {
    const jobsRes = await api.getJobs({ limit: 100 });
    dbJobs = jobsRes?.jobs || [];
    const blogsRes = await api.getBlogs({ limit: 6 });
    dbBlogs = blogsRes?.blogs || [];
  } catch (error) {
    console.warn('API connection failed. Falling back to local mock data.');
  }

  // Use mock data for demonstration
  const jobsList = mockJobs;
  const blogsList = mockBlogs;

  // Filter categories
  const latestJobs = jobsList.filter(j => j.category === 'Latest Job').slice(0, 12);
  const admitCards = jobsList.filter(j => j.category === 'Admit Card').slice(0, 12);
  const results = jobsList.filter(j => j.category === 'Result').slice(0, 12);
  
  const answerKeys = jobsList.filter(j => j.category === 'Answer Key').slice(0, 6);
  const syllabusList = jobsList.filter(j => j.category === 'Syllabus').slice(0, 6);
  const governmentSchemes = jobsList.filter(j => j.category === 'Government Scheme').slice(0, 6);

  const qualifications = ['10th Pass', '12th Pass', 'Diploma', 'Graduation', 'B.Tech'];
  const states = ['Bihar', 'Karnataka', 'UP', 'Delhi'];
  const organizations = ['SSC', 'UPSC', 'RRB', 'ISRO', 'DRDO', 'IBPS', 'NTA'];

  return (
    <div className="space-y-12">
      {/* Hero / Search Section */}
      <section className="bg-white border border-border-custom rounded-lg p-6 md:p-8 text-center space-y-6 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-secondary">
            Find Sarkari Jobs, Exam Admit Cards & Results
          </h2>
          <p className="text-sm text-gray-500">
            India&apos;s fastest government exam updates portal. Instant notification for all board & commission notifications.
          </p>
        </div>

        {/* Global Search Bar */}
        <form action="/search" method="GET" className="max-w-xl mx-auto flex items-center border border-border-custom rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary">
          <input
            type="text"
            name="q"
            placeholder="Type exam board, vacancy name, state (e.g. SSC, Bihar, Clerk)..."
            className="flex-grow px-4 py-3 text-sm focus:outline-none"
            required
          />
          <button type="submit" className="bg-primary hover:bg-[#600000] text-white px-6 py-3 flex items-center space-x-2 text-sm font-semibold transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Access Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/jobs" className="flex items-center space-x-2 bg-red-50 text-primary border border-red-200 px-4 py-2 rounded-md text-xs font-bold hover:bg-red-100 transition-colors">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Latest Jobs</span>
          </Link>
          <Link href="/admit-cards" className="flex items-center space-x-2 bg-blue-50 text-secondary border border-blue-200 px-4 py-2 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors">
            <FileText className="w-4 h-4 text-secondary" />
            <span>Admit Cards</span>
          </Link>
          <Link href="/results" className="flex items-center space-x-2 bg-green-50 text-success border border-green-200 px-4 py-2 rounded-md text-xs font-bold hover:bg-green-100 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Sarkari Results</span>
          </Link>
        </div>
      </section>

      {/* Main Jobs/Admit Cards/Results Grid - Traditional Sarkari layout style but premium */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Jobs Column */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm flex flex-col">
          <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-accent" />
              <span>Latest Jobs</span>
            </h3>
            <Link href="/jobs" className="text-xs text-white/90 hover:underline flex items-center">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 divide-y divide-gray-100 flex-grow">
            {latestJobs.length > 0 ? latestJobs.map((job) => (
              <Link 
                key={job._id} 
                href={`/jobs/${job.slug}`}
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors text-xs sm:text-sm text-primary hover:text-red-700 font-medium"
              >
                {job.title} {job.vacancy ? `(${job.vacancy} Post)` : ''}
              </Link>
            )) : (
              <p className="text-gray-400 text-center py-6 text-xs">No active jobs found.</p>
            )}
          </div>
        </div>

        {/* Admit Cards Column */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm flex flex-col">
          <div className="bg-secondary text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-accent" />
              <span>Admit Cards</span>
            </h3>
            <Link href="/admit-cards" className="text-xs text-white/90 hover:underline flex items-center">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 divide-y divide-gray-100 flex-grow">
            {admitCards.length > 0 ? admitCards.map((job) => (
              <Link 
                key={job._id} 
                href={`/admit-cards/${job.slug}`}
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors text-xs sm:text-sm text-secondary hover:text-blue-900 font-medium"
              >
                {job.title}
              </Link>
            )) : (
              <p className="text-gray-400 text-center py-6 text-xs">No active admit cards found.</p>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm flex flex-col">
          <div className="bg-success text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Results</span>
            </h3>
            <Link href="/results" className="text-xs text-white/90 hover:underline flex items-center">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-3 divide-y divide-gray-100 flex-grow">
            {results.length > 0 ? results.map((job) => (
              <Link 
                key={job._id} 
                href={`/results/${job.slug}`}
                className="block py-2.5 px-2 hover:bg-gray-50 rounded transition-colors text-xs sm:text-sm text-green-800 hover:text-green-950 font-medium"
              >
                {job.title}
              </Link>
            )) : (
              <p className="text-gray-400 text-center py-6 text-xs">No results declared recently.</p>
            )}
          </div>
        </div>
      </section>

      {/* Answer Keys, Syllabus, Schemes Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Answer Keys */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Answer Keys
          </div>
          <div className="p-3 divide-y divide-gray-100 text-xs sm:text-sm">
            {answerKeys.map((job) => (
              <Link key={job._id} href={`/answer-keys/${job.slug}`} className="block py-2 hover:text-primary">
                • {job.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Syllabus */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Syllabus
          </div>
          <div className="p-3 divide-y divide-gray-100 text-xs sm:text-sm">
            {syllabusList.map((job) => (
              <Link key={job._id} href={`/syllabus/${job.slug}`} className="block py-2 hover:text-primary">
                • {job.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Schemes */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Government Schemes
          </div>
          <div className="p-3 divide-y divide-gray-100 text-xs sm:text-sm">
            {governmentSchemes.map((job) => (
              <Link key={job._id} href={`/government-schemes/${job.slug}`} className="block py-2 hover:text-primary">
                • {job.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Programmatic SEO Grid: By Qualification, By State, By Organization */}
      <section className="bg-white border border-border-custom rounded-lg p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-secondary border-b border-border-custom pb-2 flex items-center space-x-2">
          <span>Programmatic Job Finder</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Qualifications */}
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 mb-3 flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Jobs by Qualification</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {qualifications.map((q) => (
                <Link
                  key={q}
                  href={`/qualification/${encodeURIComponent(q.toLowerCase().replace(' ', '-'))}`}
                  className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 transition-colors"
                >
                  {q} Jobs
                </Link>
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 mb-3 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Jobs by State</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {states.map((s) => (
                <Link
                  key={s}
                  href={`/state/${encodeURIComponent(s.toLowerCase())}`}
                  className="bg-gray-100 hover:bg-secondary hover:text-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 transition-colors"
                >
                  {s} Govt Jobs
                </Link>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 mb-3 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Jobs by Organisation</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {organizations.map((o) => (
                <Link
                  key={o}
                  href={`/organization/${encodeURIComponent(o.toLowerCase())}`}
                  className="bg-gray-100 hover:bg-gray-800 hover:text-white px-3 py-1.5 rounded text-xs font-semibold text-gray-700 transition-colors"
                >
                  {o} Recruitment
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blogs & Career Articles */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-secondary border-b border-border-custom pb-2">
          Latest Career & Exam Guide Blogs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogsList.map((blog) => (
            <div key={blog._id} className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <Link href={`/blog/${blog.slug}`} className="text-base font-bold text-primary hover:underline">
                  {blog.title}
                </Link>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-100 mt-4">
                <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
                <span>Views: {blog.views}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white border border-border-custom rounded-lg p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-secondary flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h3>
        <div className="space-y-4 text-xs sm:text-sm divide-y divide-gray-150">
          <div className="pt-3">
            <h4 className="font-bold text-gray-800">Q1. What is JobJanta?</h4>
            <p className="text-gray-600 mt-1">
              JobJanta is a trustable government job alert portal. We provide instant notifications, answer keys, syllabi, admit cards, and exam results for major central and state government competitive exams.
            </p>
          </div>
          <div className="pt-3">
            <h4 className="font-bold text-gray-800">Q2. Is JobJanta affiliated with the Government of India?</h4>
            <p className="text-gray-600 mt-1">
              No. JobJanta is an independent web portal publishing notifications sourced from official government websites (like ssc.gov.in, upsc.gov.in) for the benefit of candidates. We are not officially affiliated with any government department.
            </p>
          </div>
          <div className="pt-3">
            <h4 className="font-bold text-gray-800">Q3. How quickly do you update results?</h4>
            <p className="text-gray-600 mt-1">
              We strive to publish admit card download links, answer keys, and exam results within minutes of the official release.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
