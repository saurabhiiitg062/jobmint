import React from 'react';
import Link from 'next/link';
import { Search, Briefcase, FileText, CheckCircle2, ChevronRight, Award, MapPin, Building2, HelpCircle, Clock, Flame, CheckCircle, Calendar } from 'lucide-react';
import ExamCalendar from '@/components/ExamCalendar';
import PinnedJobsWidget from '@/components/widgets/PinnedJobsWidget';
import HomeJobList from '@/components/widgets/HomeJobList';

import { api } from '@/lib/api/client';

import { Job, Blog } from '@/types';
import StructuredData from '@/components/seo/StructuredData';

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

  // Use real data from the database
  const jobsList = dbJobs;
  const blogsList = dbBlogs;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  type CalendarEvent = { job: Job; date: Date; type: string };
  const calendarEvents: CalendarEvent[] = [];
  jobsList.forEach(job => {
    if (job.importantDates?.applyLastDate) {
      const d = new Date(job.importantDates.applyLastDate);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() >= today.getTime()) {
        calendarEvents.push({ job, date: d, type: 'Last Date' });
      }
    }
    if (job.importantDates?.examDate) {
      const d = new Date(job.importantDates.examDate);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() >= today.getTime()) {
        calendarEvents.push({ job, date: d, type: 'Exam Date' });
      }
    }
  });

  calendarEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  const upcomingEvents = calendarEvents.slice(0, 5);

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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SelectionSure',
    url: 'https://selectionsure.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://selectionsure.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SelectionSure',
    url: 'https://selectionsure.app',
    logo: 'https://selectionsure.app/asset/branding.png',
    sameAs: [
      'https://t.me/SelectionSure'
    ]
  };

  return (
    <div className="space-y-12">
      <StructuredData data={websiteSchema} />
      <StructuredData data={orgSchema} />
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e8f4fd 60%, #f0f9ff 100%)' }} className="rounded-xl shadow-sm overflow-hidden border border-blue-100">
        {/* Yellow top bar accent */}
        <div className="h-1 w-full bg-yellow-400"></div>

        <div className="px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — Headline */}
          <div className="space-y-6">
            {/* Welcome pill */}
            <div className="inline-flex items-center space-x-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
              <span className="text-primary">⊕</span>
              <span>Welcome to SelectionSure</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              <span className="text-secondary">India&apos;s Trusted</span><br />
              <span className="text-primary">Government Jobs &amp;</span><br />
              <span className="text-primary">Exam Updates Portal</span>
            </h1>

            <p className="text-sm text-gray-600 max-w-md">
              Get instant updates on Sarkari Jobs, Admit Cards, Results, Answer Keys, Syllabus and more.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-700 pt-1">
              <span className="flex items-center gap-1.5">⚡ <span>Fast Updates</span></span>
              <span className="flex items-center gap-1.5">🎖️ <span>100% Free</span></span>
              <span className="flex items-center gap-1.5">👥 <span>Trusted by Millions</span></span>
            </div>
          </div>

          {/* Right — Search Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-secondary">Find Jobs, Admit Cards &amp; Results</h2>
              <p className="text-xs text-gray-500 mt-0.5">Search any exam, board, vacancy or state</p>
            </div>

            <form action="/search" method="GET" className="flex items-center rounded-lg border border-gray-200 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary">
              <input
                id="hero-search"
                type="text"
                name="q"
                placeholder="Type exam name, board, vacancy, state..."
                className="flex-grow px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-white"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-[#600000] text-white px-5 py-3 flex items-center space-x-1.5 text-sm font-semibold transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Popular searches */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {['SSC', 'UPPSC', 'IBPS', 'RRB', 'UPSC', 'Bihar Police'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="border border-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded-md hover:border-primary hover:text-primary transition-colors font-medium"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom quick-nav cards */}
        <div className="border-t border-blue-100 bg-white/60 px-6 md:px-10 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '💼', label: 'Latest Jobs', desc: 'All latest government job notifications', href: '/jobs', cta: 'View All' },
              { icon: '🪪', label: 'Admit Cards', desc: 'Download hall tickets instantly', href: '/admit-cards', cta: 'View All' },
              { icon: '🏆', label: 'Results', desc: 'Check results and scorecards', href: '/results', cta: 'View All' },
              { icon: '📅', label: 'Exam Calendar', desc: 'Never miss any exam important dates', href: '/jobs', cta: 'View Calendar' },
              { icon: '🔑', label: 'Answer Key', desc: 'Official answer keys and responses', href: '/answer-keys', cta: 'View All' },
              { icon: '📗', label: 'Syllabus', desc: 'Detailed syllabus and exam pattern', href: '/syllabus', cta: 'View All' },
            ].map(({ icon, label, desc, href, cta }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="text-sm font-bold text-secondary mb-1">{label}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-snug">{desc}</p>
                <Link href={href} className="text-xs text-primary font-semibold hover:underline group-hover:text-red-700 transition-colors">
                  {cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <aside className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-border-custom rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-secondary">
                <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
                Exam Calendar
              </h3>
              <Link href="/jobs" className="text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1">
                View Calendar →
              </Link>
            </div>

            {/* Event list */}
            <ul className="divide-y divide-gray-100">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => {
                const { job, date: d, type: eventType } = event;
                const mon = d.toLocaleString('en-IN', { month: 'short' }).toUpperCase();
                const day = d.getDate().toString().padStart(2, '0');
                const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86400000);
                const isUrgent = daysLeft >= 0 && daysLeft <= 7;
                return (
                  <li key={`${job._id}-${idx}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    {/* Date pill */}
                    <div className={`shrink-0 w-14 rounded-lg text-center py-1.5 ${
                      isUrgent ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-100'
                    }`}>
                      <div className={`text-[10px] font-bold tracking-wide ${
                        isUrgent ? 'text-red-500' : 'text-blue-400'
                      }`}>{mon}</div>
                      <div className={`text-xl font-extrabold leading-tight ${
                        isUrgent ? 'text-red-600' : 'text-secondary'
                      }`}>{day}</div>
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="block text-sm font-bold text-secondary hover:text-primary leading-snug truncate"
                      >
                        {job.title}
                      </Link>
                      <span className="text-xs text-gray-500">{eventType} {daysLeft === 0 ? '(Today)' : daysLeft === 1 ? '(Tomorrow)' : `(in ${daysLeft} days)`}</span>
                    </div>
                  </li>
                );
              }) : (
                <li className="px-5 py-8 text-center text-xs text-gray-400 font-medium">No upcoming exams or dates.</li>
              )}
            </ul>

            {/* Telegram CTA */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-100 mt-1">
              <div>
                <p className="text-sm font-bold text-secondary">Get Instant Updates</p>
                <p className="text-xs text-gray-500">Join our Telegram Channel</p>
                <a
                  href="https://t.me/SelectionSure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 bg-secondary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-blue-900 transition-colors"
                >
                  Join Now
                </a>
              </div>
              <a
                href="https://t.me/SelectionSure"
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0"
              >
                <div className="w-14 h-14 bg-[#2CA5E0] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">1</span>
              </a>
            </div>
          </div>
          
          <PinnedJobsWidget />
        </aside>

        <section className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <HomeJobList
            jobs={latestJobs}
            type="latest"
            listClassName="p-3 divide-y divide-gray-100"
          />
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
            <HomeJobList
            jobs={admitCards}
            type="admit-card"
            listClassName="p-3 divide-y divide-gray-100"
          />
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
          <HomeJobList
            jobs={results}
            type="result"
            listClassName="p-3 divide-y divide-gray-100"
          />
        </div>
        </section>
      </div>

      {/* Answer Keys, Syllabus, Schemes Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Answer Keys */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Answer Keys
          </div>
          <HomeJobList
            jobs={answerKeys}
            type="simple"
            categorySlug="answer-keys"
            listClassName="p-3 divide-y divide-gray-100 text-xs sm:text-sm"
          />
        </div>

        {/* Syllabus */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Syllabus
          </div>
          <HomeJobList
            jobs={syllabusList}
            type="simple"
            categorySlug="syllabus"
            listClassName="p-3 divide-y divide-gray-100 text-xs sm:text-sm"
          />
        </div>

        {/* Schemes */}
        <div className="bg-white border border-border-custom rounded-lg shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-2.5 rounded-t-lg font-bold text-xs uppercase tracking-wider">
            Government Schemes
          </div>
          <HomeJobList
            jobs={governmentSchemes}
            type="simple"
            categorySlug="government-schemes"
            listClassName="p-3 divide-y divide-gray-100 text-xs sm:text-sm"
          />

          
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

      {/* Email Subscribe CTA Banner */}
      <section className="rounded-xl overflow-hidden shadow-md bg-secondary">
        <div className="px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center gap-6">

          {/* Left — icon + copy */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Envelope icon */}
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-blue-300" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-extrabold text-base leading-tight">Never Miss an Update!</p>
              <p className="text-blue-200 text-xs mt-0.5 max-w-xs">
                Subscribe to get instant notifications about latest jobs, admit cards, results
              </p>
            </div>
          </div>

          {/* Middle — email form */}
          <form className="flex items-center flex-1 max-w-md rounded-lg overflow-hidden border border-white/20 shadow-sm">
            <input
              id="subscribe-email"
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-[#600000] text-white px-5 py-3 text-sm font-bold shrink-0 transition-colors"
            >
              Subscribe
            </button>
          </form>

          {/* Right — trust badges */}
          <div className="flex flex-col gap-2 text-xs text-blue-100 shrink-0 hidden sm:flex">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No Spam
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Unsubscribe Anytime
            </span>
          </div>

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
            <h4 className="font-bold text-gray-800">Q1. What is SelectionSure?</h4>
            <p className="text-gray-600 mt-1">
              SelectionSure is a trustable government job alert portal. We provide instant notifications, answer keys, syllabi, admit cards, and exam results for major central and state government competitive exams.
            </p>
          </div>
          <div className="pt-3">
            <h4 className="font-bold text-gray-800">Q2. Is SelectionSure affiliated with the Government of India?</h4>
            <p className="text-gray-600 mt-1">
              No. SelectionSure is an independent web portal publishing notifications sourced from official government websites (like ssc.gov.in, upsc.gov.in) for the benefit of candidates. We are not officially affiliated with any government department.
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
