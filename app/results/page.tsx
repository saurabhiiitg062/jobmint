import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;

export default async function ResultsPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Result', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in results list, using mock fallbacks.');
  }

  const displayJobs = jobs.length > 0 ? jobs : mockJobs.filter(j => j.category === 'Result');

  return (
    <JobListView
      jobs={displayJobs}
      title="Sarkari Exam Results"
      description="Check government recruitment exam results, cut-off marks, merit lists, and candidate selections online."
      categorySlug="results"
    />
  );
}
