import { api } from '@/lib/api/client';
import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import JobDetailView from '@/components/cards/JobDetailView';
import { connectToDatabase } from '@/lib/server/db';
import { Job as JobModel } from '@/lib/server/models/Job';
import { mockJobs } from '@/lib/mockData';
import { Job } from '@/types';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const data = await api.getJobs({ limit: 100 });
    return data.jobs.map((job: Job) => ({
      slug: job.slug,
    }));
  } catch (error) {
    console.warn('API error in generateStaticParams for jobs:', error);
    return mockJobs.filter(j => j.category === 'Latest Job').map((job) => ({
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
    let jobData = null;
    try {
      await connectToDatabase();
      const doc = await JobModel.findOne({ slug }).lean();
      if (doc) jobData = JSON.parse(JSON.stringify(doc));
    } catch(e) {
      console.warn("DB error in generateMetadata:", e);
    }
    
    const job = jobData || mockJobs.find(j => j.slug === slug);
    if (!job) return {};
    
    return {
      title: job.seoTitle || `${job.title} - SelectionSure`,
      description: job.seoDescription || `Complete details about ${job.title} including eligibility, dates, and application process.`,
      keywords: job.focusKeyword || job.title,
      alternates: {
        canonical: `/jobs/${slug}`,
      },
      openGraph: {
        title: job.seoTitle || `${job.title} - SelectionSure`,
        description: job.seoDescription || `Complete details about ${job.title} including eligibility, dates, and application process.`,
        url: `https://SelectionSure.com/jobs/${slug}`,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: job.seoTitle || `${job.title} - SelectionSure`,
        description: job.seoDescription || `Complete details about ${job.title} including eligibility, dates, and application process.`,
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function JobSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let job: Job | null = null;

  try {
    await connectToDatabase();
    const doc = await JobModel.findOne({ slug }).populate('exam').lean();
    if (doc) {
      job = JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.warn('DB error fetching job slug, using mock fallbacks.');
  }

  if (!job) {
    job = mockJobs.find(j => j.slug === slug) as unknown as Job || null;
  }

  if (!job) {
    return notFound();
  }

  return <JobDetailView job={job} categorySlug="jobs" />;
}
