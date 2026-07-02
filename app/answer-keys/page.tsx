import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Exam Answer Keys - SelectionSure',
  description: 'Download official exam answer keys, solution sheets, and submit answer sheet objections for online exams.',
};


export const revalidate = 300;

export default async function AnswerKeysPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Answer Key', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in answer keys list, using mock fallbacks.');
  }

  const displayJobs = jobs;

  return (
    <JobListView
      jobs={displayJobs}
      title="Sarkari Exam Answer Keys"
      description="Download official exam answer keys, solution sheets, and submit answer sheet objections for online exams."
      categorySlug="answer-keys"
    />
  );
}
