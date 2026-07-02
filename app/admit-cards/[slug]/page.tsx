import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import JobDetailView from '@/components/cards/JobDetailView';
import { api } from '@/lib/api/client';
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
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const job = await api.getJobBySlug(slug).catch(() => null);
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

export default async function AdmitCardSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let job: Job | null = null;

  try {
    job = await api.getJobBySlug(slug);
  } catch (error) {
    console.warn('API error fetching admit card slug, using mock fallbacks.');
  }

  if (!job) {
    
  }

  if (!job) {
    return notFound();
  }

  return <JobDetailView job={job} categorySlug="admit-cards" />;
}
