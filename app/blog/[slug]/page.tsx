import { api } from '@/lib/api/client';
import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/server/db';
import { Blog as BlogModel } from '@/lib/server/models/Blog';
import { Blog } from '@/types';
import StructuredData from '@/components/seo/StructuredData';


export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const data = await api.getBlogs({ limit: 100 });
    return data.blogs.map((blog: Blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.warn('API error in generateStaticParams for blogs:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    let blogData = null;
    try {
      await connectToDatabase();
      const doc = await BlogModel.findOne({ slug }).lean();
      if (doc) blogData = JSON.parse(JSON.stringify(doc));
    } catch(e) {
      console.warn("DB error in generateMetadata:", e);
    }
    
    const blog = blogData;
    if (!blog) return {};
    
    return {
      title: blog.seoTitle || `${blog.title} - SelectionSure Blog`,
      description: blog.seoDescription || blog.excerpt || `Read ${blog.title} on SelectionSure Blog.`,
      keywords: blog.focusKeyword || blog.tags?.join(', ') || blog.title,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: blog.seoTitle || `${blog.title} - SelectionSure Blog`,
        description: blog.seoDescription || blog.excerpt || `Read ${blog.title} on SelectionSure Blog.`,
        url: `https://SelectionSure.app/blog/${slug}`,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.seoTitle || `${blog.title} - SelectionSure Blog`,
        description: blog.seoDescription || blog.excerpt || `Read ${blog.title} on SelectionSure Blog.`,
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let blog: Blog | null = null;

  try {
    await connectToDatabase();
    const doc = await BlogModel.findOne({ slug }).lean();
    if (doc) {
      blog = JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.warn('DB error fetching blog slug, using mock fallbacks.');
  }

  if (!blog) {
    
  }

  if (!blog) {
    return notFound();
  }

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'JobJanta Team',
      url: 'https://jobjanta.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'JobJanta',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jobjanta.com/logo.png'
      }
    }
  };

  return (
    <article className="max-w-3xl mx-auto bg-white border border-border-custom rounded-lg p-5 md:p-8 shadow-sm space-y-6">
      <StructuredData data={articleSchema} />


      <Link href="/blog" className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-primary font-bold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blogs</span>
      </Link>

      <div className="space-y-4 pb-4 border-b border-gray-100">
        <h2 className="text-xl md:text-3xl font-extrabold text-secondary leading-snug">
          {blog.title}
        </h2>
        <div className="flex items-center space-x-4 text-xs text-gray-400 font-semibold">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4.5 h-4.5" />
            <span>Published: {new Date(blog.publishedAt).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Eye className="w-4.5 h-4.5" />
            <span>Views: {blog.views}</span>
          </span>
        </div>
      </div>

      <div 
        className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 tiptap-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-2 items-center text-xs">
        <span className="font-bold text-gray-600">Tags:</span>
        {blog.tags?.map(t => (
          <span key={t} className="bg-gray-100 text-gray-500 font-semibold px-2.5 py-1 rounded">
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
}
