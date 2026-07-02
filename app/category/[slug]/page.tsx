import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { Job } from '@/types';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  let jobs: Job[] = [];

  // Map slugs to category names
  const categoryMap: { [key: string]: string } = {
    'ssc': 'SSC',
    'railway': 'RRB',
    'bank': 'IBPS',
    'upsc': 'UPSC',
    'defence': 'Defence'
  };

  const categoryQuery = categoryMap[slug] || slug;

  try {
    const res = await api.getJobs({ limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error fetching category, using fallback mock data.');
  }

  const allJobs = jobs;
  const filteredJobs = allJobs.filter(j => 
    j.organization.toLowerCase() === categoryQuery.toLowerCase() ||
    j.category.toLowerCase().includes(categoryQuery.toLowerCase()) ||
    (j.tags && j.tags.some(t => t.toLowerCase() === slug.toLowerCase()))
  );

  const capitalizedCategoryName = categoryQuery.toUpperCase();

  return (
    <JobListView
      jobs={filteredJobs}
      title={`${capitalizedCategoryName} Government Jobs 2026`}
      description={`Get real-time updates and notification details for ${capitalizedCategoryName} recruitments, vacancy details, physical standards, and selection processes.`}
      categorySlug="jobs"
    />
  );
}
