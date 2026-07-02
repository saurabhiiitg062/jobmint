import { MetadataRoute } from 'next';
import { api } from '@/lib/api/client';


import { Job, Blog } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://selectionsure.app';
  let jobsList: Job[] = [];
  let blogsList: Blog[] = [];

  try {
    const jobsRes = await api.getJobs({ limit: 100 });
    jobsList = jobsRes?.jobs || [];
    const blogsRes = await api.getBlogs({ limit: 50 });
    blogsList = blogsRes?.blogs || [];
  } catch (e) {
    
    
  }

  // Core Pages
  const routes = [
    '',
    '/jobs',
    '/admit-cards',
    '/results',
    '/answer-keys',
    '/syllabus',
    '/government-schemes',
    '/blog',
    '/about',
    '/contact',
    '/age-calculator',
    '/image-resizer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const,
    priority: 1.0,
  }));

  // Job dynamic pages
  const jobUrls = jobsList.map((job) => {
    let categorySlug = 'jobs';
    if (job.category === 'Admit Card') categorySlug = 'admit-cards';
    if (job.category === 'Result') categorySlug = 'results';
    if (job.category === 'Answer Key') categorySlug = 'answer-keys';
    if (job.category === 'Syllabus') categorySlug = 'syllabus';
    if (job.category === 'Government Scheme') categorySlug = 'government-schemes';

    return {
      url: `${baseUrl}/${categorySlug}/${job.slug}`,
      lastModified: new Date(job.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  // Blog dynamic pages
  const blogUrls = blogsList.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...jobUrls, ...blogUrls];
}
