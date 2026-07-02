import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';

import { Job } from '@/types';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sarkari Exam Syllabus - SelectionSure',
  description: 'Download complete exam syllabus, pattern structures, written test marking schemes, and reference guidelines.',
};


export const revalidate = 300;

export default async function SyllabusPage() {
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ category: 'Syllabus', limit: 50 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error in syllabus list, using mock fallbacks.');
  }

  const displayJobs = jobs;

  return (
    <JobListView
      jobs={displayJobs}
      title="Sarkari Exam Syllabus"
      description="Download complete exam syllabus, pattern structures, written test marking schemes, and reference guidelines."
      categorySlug="syllabus"
    />
  );
}
