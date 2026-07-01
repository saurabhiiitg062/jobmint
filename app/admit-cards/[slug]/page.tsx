import React from 'react';
import { notFound } from 'next/navigation';
import JobDetailView from '@/components/cards/JobDetailView';
import { api } from '@/lib/api/client';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const data = await api.getJobs({ category: 'Admit Card', limit: 100 });
    return data.jobs.map((job: Job) => ({
      slug: job.slug,
    }));
  } catch (error) {
    console.warn('API error in generateStaticParams for admit cards:', error);
    return mockJobs.filter(j => j.category === 'Admit Card').map((job) => ({
      slug: job.slug,
    }));
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdmitCardSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let job: Job | null = null;

  try {
    job = await api.getJobBySlug(slug);
  } catch (error) {
    console.warn('API error fetching admit card slug, using mock fallbacks.');
  }

  if (!job) {
    job = mockJobs.find(j => j.slug === slug) || null;
  }

  if (!job) {
    return notFound();
  }

  return <JobDetailView job={job} categorySlug="admit-cards" />;
}
