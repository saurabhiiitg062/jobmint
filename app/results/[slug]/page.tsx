import type { Metadata } from 'next';
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
    const data = await api.getJobs({ category: 'Result', limit: 100 });
    return data.jobs.map((job: Job) => ({
      slug: job.slug,
    }));
  } catch (error) {
    console.warn('API error in generateStaticParams for results:', error);
    return mockJobs.filter(j => j.category === 'Result').map((job) => ({
      slug: job.slug,
    }));
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const job = await api.getJobBySlug(slug).catch(() => null) || mockJobs.find(j => j.slug === slug);
    if (!job) return {};
    
    return {
      title: job.seoTitle || `${job.title} - SelectionSure`,
      description: job.seoDescription || `Complete details about ${job.title} including eligibility, dates, and application process.`,
      keywords: job.focusKeyword || job.title,
    };
  } catch (e) {
    return {};
  }
}

export default async function ResultSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let job: Job | null = null;

  try {
    job = await api.getJobBySlug(slug);
  } catch (error) {
    console.warn('API error fetching result slug, using mock fallbacks.');
  }

  if (!job) {
    job = mockJobs.find(j => j.slug === slug) || null;
  }

  if (!job) {
    return notFound();
  }

  return <JobDetailView job={job} categorySlug="results" />;
}
