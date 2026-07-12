import React from 'react';
import JobListView from '@/components/cards/JobListView';
import { api } from '@/lib/api/client';
import { Job, Organization as IOrganization } from '@/types';
import { connectToDatabase } from '@/lib/server/db';
import { Organization } from '@/lib/server/models/Organization';
import Link from 'next/link';
import JoinTelegramWidget from '@/components/widgets/JoinTelegramWidget';

export const revalidate = 300;
export const dynamicParams = true;

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function processContent(html: string): { processedHtml: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let matchCount = 0;
  
  // Match h2 and h3 tags
  const regex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;
  
  const processedHtml = html.replace(regex, (match, tag, attrs, content) => {
    // If it already has an ID, extract it, otherwise generate one
    let id = `section-${matchCount++}`;
    const idMatch = attrs.match(/id="([^"]+)"/);
    if (idMatch) {
      id = idMatch[1];
    } else {
      attrs = ` id="${id}" ${attrs}`;
    }

    const text = content.replace(/<[^>]+>/g, '').trim(); // Remove nested tags for TOC text
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;
    
    if (text) {
      toc.push({ id, text, level });
    }
    
    return `<${tag}${attrs}>${content}</${tag}>`;
  });

  return { processedHtml, toc };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OrganizationPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Check if we have a detailed Pillar Page for this organization
  let orgData: IOrganization | null = null;
  let childOrgs: IOrganization[] = [];
  try {
    await connectToDatabase();
    const orgDoc = await Organization.findOne({ slug: slug.toLowerCase() }).lean() as any;
    if (orgDoc) {
      orgData = JSON.parse(JSON.stringify(orgDoc));
      const children = await Organization.find({ parentOrganization: orgDoc._id }).lean();
      childOrgs = JSON.parse(JSON.stringify(children));
    }
  } catch (error) {
    console.error('Error fetching organization pillar page:', error);
  }

  // 2. Fetch jobs for this organization
  let jobs: Job[] = [];
  try {
    const res = await api.getJobs({ limit: 100 });
    jobs = res?.jobs || [];
  } catch (error) {
    console.warn('API error fetching organization jobs, using mock fallbacks.');
  }

  const filteredJobs = jobs.filter(j => j.organization.toLowerCase() === slug.toLowerCase());

  // IF IT'S A PILLAR PAGE
  if (orgData) {
    const { processedHtml, toc } = processContent(orgData.content);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (70%) */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8">
              <div className="flex items-center gap-4 mb-6">
                {orgData.logo && (
                  <img src={orgData.logo} alt={orgData.name} className="w-16 h-16 object-contain" />
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{orgData.name}</h1>
                  {orgData.updatedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Last Updated: {new Date(orgData.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Tiptap HTML Content with Prose styling */}
              <div 
                className="overflow-x-auto prose prose-blue max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-a:text-blue-600 prose-img:rounded-xl prose-table:w-full prose-table:border-collapse prose-table:my-6 prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:px-2 md:prose-th:px-4 prose-th:py-1 md:prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-gray-300 prose-td:px-2 md:prose-td:px-4 prose-td:py-1 md:prose-td:py-2"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </div>

            {/* Child Organizations / Sub-Categories */}
            {childOrgs.length > 0 && (
              <div className="mb-8" id="sub-categories">
                <h2 className="text-2xl font-bold mb-6">Exams under {orgData.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {childOrgs.map(child => (
                    <Link key={child._id as string} href={`/organization/${child.slug}`} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                      {child.logo ? (
                        <img src={child.logo} alt={child.name} className="w-10 h-10 object-contain rounded-md" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {child.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{child.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Embedded Jobs Feed */}
            {filteredJobs.length > 0 && (
              <div className="mt-12" id="latest-jobs">
                <h2 className="text-2xl font-bold mb-6">Latest Updates from {orgData.name}</h2>
                <div className="grid gap-4">
                  {filteredJobs.map(job => (
                    <Link key={job._id} href={`/jobs/${job.slug}`} className="block bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors shadow-sm">
                      <h3 className="font-semibold text-lg text-blue-700">{job.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Post: {job.postName}</span>
                        {job.vacancy && <span>Vacancies: {job.vacancy}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar (30%) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-inner">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-800">Table of Contents</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm hover:text-blue-600 transition-colors ${
                      item.level === 3 ? 'ml-4 text-gray-500' : 'font-medium text-gray-700'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
                {childOrgs.length > 0 && (
                  <a href="#sub-categories" className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors pt-2 border-t mt-2">
                    Exams under {orgData.name}
                  </a>
                )}
                {filteredJobs.length > 0 && (
                  <a href="#latest-jobs" className={`block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors ${childOrgs.length === 0 ? 'pt-2 border-t mt-2' : ''}`}>
                    Latest Jobs & Updates
                  </a>
                )}
              </nav>

              <div className="mt-8">
                <JoinTelegramWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FALLBACK (No Pillar page defined, just list jobs)
  const orgName = slug.toUpperCase();
  return (
    <JobListView
      jobs={filteredJobs}
      title={`${orgName} Recruitment Updates 2026`}
      description={`Find latest job notifications, exam patterns, call letter dates, and final merit lists for ${orgName}.`}
      categorySlug="jobs"
    />
  );
}
