import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Exam Admit Cards - SelectionSure',
  description: 'Download call letters, hall tickets, exam schedules, and admit cards for government recruitments (SSC, Railway, Banking, UPSC, and State Boards).',
};


export const revalidate = 300;

export default async function AdmitCardsPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Admit Card', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in admit cards list, using mock fallbacks.');
  }

  const displayJobs = jobs.length > 0 ? jobs : mockJobs.filter(j => j.category === 'Admit Card');

  return (
    <JobListView
      jobs={displayJobs}
      title="Latest Exam Admit Cards"
      description="Download call letters, hall tickets, exam schedules, and admit cards for government recruitments (SSC, Railway, Banking, UPSC, and State Boards)."
      categorySlug="admit-cards"
    />
  );
}
