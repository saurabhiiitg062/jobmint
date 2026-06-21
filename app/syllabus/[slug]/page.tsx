import React from 'react';
import { notFound } from 'next/navigation';
import JobDetailView from '@/components/cards/JobDetailView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SyllabusSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let job: Job | null = null;

  try {
    job = await api.getJobBySlug(slug);
  } catch (error) {
    console.warn('API error fetching syllabus slug, using mock fallbacks.');
  }

  if (!job) {
    job = mockJobs.find(j => j.slug === slug) || null;
  }

  if (!job) {
    return notFound();
  }

  return <JobDetailView job={job} categorySlug="syllabus" />;
}
