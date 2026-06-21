import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function QualificationPage({ params }: PageProps) {
  const { slug } = await params;
  let jobs: Job[] = [];

  // Map slug e.g. "10th-pass" to target qualification "10th pass"
  const targetQualification = slug.replace('-', ' ').toLowerCase();

  try {
    const res = await api.getJobs({ limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error fetching qualification jobs, using mock fallbacks.');
  }

  const allJobs = jobs.length > 0 ? jobs : mockJobs;
  const filteredJobs = allJobs.filter(j => j.qualification.toLowerCase().includes(targetQualification));

  const qualName = targetQualification.toUpperCase();

  return (
    <JobListView
      jobs={filteredJobs}
      title={`${qualName} Government Jobs 2026`}
      description={`Find latest recruitments and exam alerts specifically matching eligibility for ${qualName} candidates.`}
      categorySlug="jobs"
    />
  );
}
