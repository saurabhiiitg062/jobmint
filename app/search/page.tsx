import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { Job } from '@/types';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  let jobs: Job[] = [];

  try {
    const res = await api.getJobs({ search: q, limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error searching jobs, using fallback filtering.');
  }

  const allJobs = jobs;
  const filteredJobs = q 
    ? allJobs.filter(j => 
        j.title.toLowerCase().includes(q.toLowerCase()) ||
        j.organization.toLowerCase().includes(q.toLowerCase()) ||
        j.postName.toLowerCase().includes(q.toLowerCase()) ||
        (j.state && j.state.toLowerCase().includes(q.toLowerCase()))
      )
    : allJobs;

  return (
    <JobListView
      jobs={filteredJobs}
      title={`Search Results for: "${q}"`}
      description={`Displaying results matching search query "${q}" from our database.`}
      categorySlug="jobs"
    />
  );
}
