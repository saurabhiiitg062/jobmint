import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Schemes - SelectionSure',
  description: 'Stay updated with latest central and state government social welfare schemes, pensions, farmer aids, and scholarships.',
};


export const revalidate = 300;

export default async function SchemesPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Government Scheme', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in schemes list, using mock fallbacks.');
  }

  const displayJobs = jobs.length > 0 ? jobs : mockJobs.filter(j => j.category === 'Government Scheme');

  return (
    <JobListView
      jobs={displayJobs}
      title="Government Schemes"
      description="Stay updated with latest central and state government social welfare schemes, pensions, farmer aids, and scholarships."
      categorySlug="government-schemes"
    />
  );
}
