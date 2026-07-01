/**
 * On-Demand Revalidation API
 * Manually trigger page revalidation when content changes
 * Secured with REVALIDATE_TOKEN environment variable
 * 
 * Usage:
 * POST /api/revalidate
 * Headers: Authorization: Bearer YOUR_REVALIDATE_TOKEN
 * Body: { "slug": "ssc-cgl-2024", "type": "job" }
 * 
 * Call this when admin creates/updates a job or blog
 */

import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    // Verify authorization token
    const authHeader = req.headers.get('authorization');
    const revalidateToken = process.env.REVALIDATE_TOKEN;

    if (!revalidateToken) {
      console.warn('⚠️ REVALIDATE_TOKEN not set in environment variables');
      // In development, allow without token; in production, require it
      if (process.env.NODE_ENV === 'production') {
        return Response.json(
          { error: 'Revalidation not configured' },
          { status: 500 }
        );
      }
    }

    // Check token if configured
    if (revalidateToken) {
      const token = authHeader?.replace('Bearer ', '');
      if (token !== revalidateToken) {
        return Response.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        );
      }
    }

    const { slug, type, path } = await req.json();

    if (!slug && !path) {
      return Response.json(
        { error: 'Either slug or path is required' },
        { status: 400 }
      );
    }

    // Revalidate specific paths
    if (path) {
      revalidatePath(path);
      console.log(`✅ Revalidated: ${path}`);
    } else if (slug && type) {
      // Revalidate by type and slug
      const paths = getPathsByType(type, slug);
      paths.forEach(p => {
        revalidatePath(p);
        console.log(`✅ Revalidated: ${p}`);
      });
    }

    return Response.json({
      revalidated: true,
      message: `Successfully revalidated paths for ${slug || path}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 }
    );
  }
}

function getPathsByType(type: string, slug: string): string[] {
  const paths: string[] = [];

  switch (type) {
    case 'job':
      // Revalidate all job-related paths
      paths.push(`/jobs/${slug}`);
      paths.push(`/results/${slug}`);
      paths.push(`/answer-keys/${slug}`);
      paths.push(`/syllabus/${slug}`);
      paths.push(`/admit-cards/${slug}`);
      paths.push(`/jobs`); // List page
      break;

    case 'blog':
      paths.push(`/blog/${slug}`);
      paths.push(`/blog`); // List page
      break;

    case 'exam':
      paths.push(`/results/${slug}`);
      paths.push(`/answer-keys/${slug}`);
      paths.push(`/syllabus/${slug}`);
      paths.push(`/results`); // List pages
      paths.push(`/answer-keys`);
      paths.push(`/syllabus`);
      break;

    case 'all':
      // Revalidate all dynamic routes (useful for bulk updates)
      paths.push('/');
      paths.push('/jobs');
      paths.push('/blog');
      paths.push('/results');
      paths.push('/answer-keys');
      paths.push('/syllabus');
      paths.push('/admit-cards');
      break;

    default:
      paths.push(`/${type}/${slug}`);
  }

  return paths;
}
