'use client';

import React from 'react';
import Link from 'next/link';
import { usePinnedJobs } from '@/hooks/usePinnedJobs';

export default function PinnedJobsWidget() {
  const { pinnedJobs, isHydrated } = usePinnedJobs();

  if (!isHydrated || pinnedJobs.length === 0) return null;

  return (
    <div className="bg-white border-2 border-primary rounded-xl overflow-hidden shadow-sm mb-6">
      <div className="bg-primary px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm flex items-center space-x-2">
          <span>📌</span>
          <span>My Pinned Jobs</span>
        </h3>
        <span className="bg-white text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
          {pinnedJobs.length}
        </span>
      </div>
      <div className="p-3 divide-y divide-gray-100">
        {pinnedJobs.map((job) => (
          <Link
            key={job._id}
            href={`/jobs/${job.slug}`}
            className="block py-2 text-xs hover:text-primary transition-colors"
          >
            <div className="font-medium">{job.title}</div>
            <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
              <span>{job.organization}</span>
              <span className="text-secondary font-semibold">{job.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
