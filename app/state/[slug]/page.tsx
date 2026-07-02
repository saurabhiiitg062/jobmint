import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { Job } from '@/types';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error fetching state jobs, using fallback mock data.');
  }

  const allJobs = jobs;
  const filteredJobs = allJobs.filter(j => j.state?.toLowerCase() === slug.toLowerCase());

  const stateName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <JobListView
      jobs={filteredJobs}
      title={`${stateName} Government Jobs 2026`}
      description={`Find latest recruitments, police bharti, teacher jobs, clerk vacancies, and state government alerts in ${stateName} State.`}
      categorySlug="jobs"
    />
  );
}
