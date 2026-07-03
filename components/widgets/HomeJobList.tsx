'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { Job } from '@/types';
import PinButton from './PinButton';
import { usePinnedJobs } from '@/hooks/usePinnedJobs';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeJobListProps {
  jobs: Job[];
  type: 'latest' | 'admit-card' | 'result' | 'simple';
  listClassName?: string;
  categorySlug?: string;
}

export default function HomeJobList({ jobs, type, listClassName = '', categorySlug }: HomeJobListProps) {
  const { isPinned, isHydrated } = usePinnedJobs();

  let displayJobs = jobs;

  if (isHydrated) {
    displayJobs = [...jobs].sort((a, b) => {
      const aPinned = isPinned(a._id);
      const bPinned = isPinned(b._id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={listClassName}>
      <AnimatePresence>
      {displayJobs.map((job) => {
        let content = null;

        if (type === 'latest') {
          const applyLastDate = job.importantDates?.applyLastDate ? new Date(job.importantDates.applyLastDate) : null;
          if (applyLastDate) applyLastDate.setHours(0, 0, 0, 0);
          const daysRemaining = applyLastDate ? Math.max(0, Math.ceil((applyLastDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null;
          
          content = (
            <div className="flex items-center justify-between py-2.5 px-2">
              <Link href={`/jobs/${job.slug}`} className="text-xs sm:text-sm text-primary hover:text-red-700 font-medium">
                {job.title} {job.vacancy ? `(${job.vacancy} Post)` : ''}
              </Link>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" aria-label="Days left" />
                <span className="text-xs text-gray-600">{daysRemaining !== null ? `${daysRemaining}d` : '-'}</span>
              </div>
            </div>
          );
        } else if (type === 'admit-card') {
          content = (
            <div className="py-2.5 px-2">
              <div className="flex items-start justify-between">
                <Link
                  href={`/admit-cards/${job.slug}`}
                  className="block text-xs sm:text-sm text-secondary hover:text-blue-900 font-medium"
                >
                  {job.title}
                </Link>
              </div>
              {job.importantDates?.examDate && (
                <div className="text-[10px] text-gray-500 mt-1 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Exam: {new Date(job.importantDates.examDate).toLocaleDateString('en-GB')}</span>
                </div>
              )}
            </div>
          );
        } else if (type === 'result') {
          content = (
            <div className="py-2.5 px-2">
              <Link
                href={`/results/${job.slug}`}
                className="block text-xs sm:text-sm text-green-800 hover:text-green-950 font-medium"
              >
                {job.title}
              </Link>
              <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
                <span>{job.organization}</span>
                <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">Declared</span>
              </div>
            </div>
          );
        } else if (type === 'simple') {
          content = (
            <Link href={`/${categorySlug}/${job.slug}`} className="block py-2 hover:text-primary pl-2">
              • {job.title}
            </Link>
          );
        }

        return (
          <motion.div
            key={job._id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative flex items-center w-full bg-white z-10 rounded"
          >
            <div className="flex-1 overflow-hidden">
              {content}
            </div>
            <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 bg-white pl-2">
              <PinButton job={job} />
            </div>
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
