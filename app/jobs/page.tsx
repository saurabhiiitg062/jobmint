import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Government Jobs 2026 - SelectionSure',
  description: 'Find latest online application forms, notification alerts, job vacancies, and dates for UPSC, SSC, Railway, Banking, Army, Navy, and State PSC jobs.',
};


import { connectToDatabase } from '@/lib/server/db';
import { Job as JobModel } from '@/lib/server/models/Job';

export const revalidate = 300;

export default async function JobsPage() {
  let jobs: Job[] = [];

  try {
    await connectToDatabase();
    // Remove strict status filter to support legacy DB documents without a status field
    const fetchedJobs = await JobModel.find({ category: 'Latest Job' })
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();
    jobs = JSON.parse(JSON.stringify(fetchedJobs));
  } catch (error) {
    console.warn('Database error in jobs list, using mock fallbacks.', error);
  }

  const displayJobs = jobs;

  return (
    <JobListView
      jobs={displayJobs}
      title="Latest Government Jobs 2026"
      description="Find latest online application forms, notification alerts, job vacancies, and dates for UPSC, SSC, Railway, Banking, Army, Navy, and State PSC jobs."
      categorySlug="jobs"
    />
  );
}
