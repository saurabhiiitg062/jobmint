import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Government Jobs 2026 - SelectionSure',
  description: 'Find latest online application forms, notification alerts, job vacancies, and dates for UPSC, SSC, Railway, Banking, Army, Navy, and State PSC jobs.',
};


export const revalidate = 300;

export default async function JobsPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Latest Job', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in jobs list, using mock fallbacks.');
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
