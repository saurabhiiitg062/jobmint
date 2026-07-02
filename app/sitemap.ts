import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/server/db';
import { Job as JobModel } from '@/lib/server/models/Job';
import { Blog as BlogModel } from '@/lib/server/models/Blog';
import { Job, Blog } from '@/types';

export const revalidate = 300; // Cache for 5 minutes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://selectionsure.app';
  let jobsList: Job[] = [];
  let blogsList: Blog[] = [];

  try {
    await connectToDatabase();
    const fetchedJobs = await JobModel.find({})
      .sort({ publishedAt: -1 })
      .limit(1000)
      .lean();
    jobsList = JSON.parse(JSON.stringify(fetchedJobs));

    const fetchedBlogs = await BlogModel.find({})
      .sort({ publishedAt: -1 })
      .limit(500)
      .lean();
    blogsList = JSON.parse(JSON.stringify(fetchedBlogs));
  } catch (e) {
    console.error('Error fetching data for sitemap:', e);
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
