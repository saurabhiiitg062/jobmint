'use client';

import React from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Calendar, Briefcase, ChevronRight } from 'lucide-react';
import PinButton from '@/components/widgets/PinButton';
import { usePinnedJobs } from '@/hooks/usePinnedJobs';
import { motion, AnimatePresence } from 'framer-motion';

interface JobListViewProps {
  jobs: Job[];
  title: string;
  description: string;
  categorySlug: 'jobs' | 'admit-cards' | 'results' | 'answer-keys' | 'syllabus' | 'government-schemes';
}

export default function JobListView({ jobs, title, description, categorySlug }: JobListViewProps) {
  const { isPinned, isHydrated } = usePinnedJobs();

  let displayJobs = jobs;

  if (isHydrated) {
    displayJobs = [...jobs].sort((a, b) => {
      const aPinned = isPinned(a._id);
      const bPinned = isPinned(b._id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border-custom rounded-lg p-5 shadow-sm space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-secondary">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">{description}</p>
      </div>

      <div className="bg-white border border-border-custom rounded-lg shadow-sm divide-y divide-gray-100">
        <AnimatePresence>
        {displayJobs.length > 0 ? (
          displayJobs.map((job) => (
            <motion.div
              key={job._id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors group relative bg-white z-10 rounded"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <Link
                  href={`/${categorySlug}/${job.slug}`}
                  className="font-bold text-sm sm:text-base text-primary hover:text-red-700 hover:underline block leading-snug"
                >
                  {job.title}
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-medium">
                  <span>Organisation: <strong>{job.organization}</strong></span>
                  {job.vacancy !== undefined && job.vacancy > 0 && <span>Vacancy: <strong>{job.vacancy} Positions</strong></span>}
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <PinButton job={job} />
                <Link
                  href={`/${categorySlug}/${job.slug}`}
                  className="bg-secondary hover:bg-primary text-white p-2 rounded-md transition-colors"
                  aria-label="View details"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">
            No updates found at the moment. Please check back later.
          </div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
