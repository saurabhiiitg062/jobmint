import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Exam Results - SelectionSure',
  description: 'Check government recruitment exam results, cut-off marks, merit lists, and candidate selections online.',
};


export const revalidate = 300;

export default async function ResultsPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Result', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in results list, using mock fallbacks.');
  }

  const displayJobs = jobs;

  return (
    <JobListView
      jobs={displayJobs}
      title="Sarkari Exam Results"
      description="Check government recruitment exam results, cut-off marks, merit lists, and candidate selections online."
      categorySlug="results"
    />
  );
}
