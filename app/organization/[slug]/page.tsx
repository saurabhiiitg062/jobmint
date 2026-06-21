import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrganizationPage({ params }: PageProps) {
  const { slug } = await params;
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error fetching organization jobs, using mock fallbacks.');
  }

  const allJobs = jobs.length > 0 ? jobs : mockJobs;
  const filteredJobs = allJobs.filter(j => j.organization.toLowerCase() === slug.toLowerCase());

  const orgName = slug.toUpperCase();

  return (
    <JobListView
      jobs={filteredJobs}
      title={`${orgName} Recruitment Updates 2026`}
      description={`Find latest job notifications, exam patterns, call letter dates, and final merit lists for ${orgName}.`}
      categorySlug="jobs"
    />
  );
}
