import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Exam Cutoffs - SelectionSure',
  description: 'Check government recruitment exam historical and latest cut-off marks online.',
};


export const revalidate = 300;

export default async function CutoffsPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Cutoff', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in cutoffs list, using mock fallbacks.');
  }

  const displayJobs = jobs;

  return (
    <JobListView
      jobs={displayJobs}
      title="Sarkari Exam Cutoffs"
      description="Check government recruitment exam historical and latest cut-off marks online."
      categorySlug="cutoffs"
    />
  );
}
