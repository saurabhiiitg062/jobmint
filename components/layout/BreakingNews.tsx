'use client';

import React from 'react';
import Link from 'next/link';

interface BreakingNewsProps {
  latestJobs?: any[];
}

export default function BreakingNews({ latestJobs = [] }: BreakingNewsProps) {
  const Marquee = 'marquee' as any;

  if (!latestJobs || latestJobs.length === 0) return null;

  return (
    <div className="bg-yellow-300 text-black border-y border-yellow-400 py-1.5 px-4 flex items-center text-xs sm:text-sm font-bold overflow-hidden">
      <div className="bg-primary text-white px-2 py-1 rounded text-[11px] uppercase mr-3 shrink-0">
        Breaking
      </div>

      <Marquee
        scrollamount={5}
        className="cursor-pointer flex-1"
      >
        {latestJobs.map((job) => {
          let href = '/jobs';
          if (job.category === 'Result' || job.category === 'Results') href = '/results';
          else if (job.category === 'Admit Card') href = '/admit-cards';
          else if (job.category === 'Answer Key') href = '/answer-keys';
          else if (job.category === 'Syllabus') href = '/syllabus';
          
          return (
            <Link key={job._id} href={`${href}/${job.slug}`} className="mr-8 hover:underline inline-flex items-center">
              🔥 {job.title}
            </Link>
          );
        })}
      </Marquee>
    </div>
  );
}
