'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


const SEGMENT_LABELS: Record<string, string> = {
  about: 'About',
  'age-calculator': 'Age Calculator',
  'admit-cards': 'Admit Cards',
  admin: 'Admin',
  'answer-keys': 'Answer Keys',
  blog: 'Blog',
  category: 'Category',
  contact: 'Contact',
  disclaimer: 'Disclaimer',
  'government-schemes': 'Government Schemes',
  jobs: 'Latest Jobs',
  organization: 'Organization',
  'privacy-policy': 'Privacy Policy',
  qualification: 'Qualification',
  results: 'Results',
  search: 'Search',
  sitemap: 'Sitemap',
  state: 'State',
  syllabus: 'Syllabus',
  terms: 'Terms',
};


function toTitleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getSegmentLabel(segment: string) {
  const decoded = decodeURIComponent(segment);

  if (SEGMENT_LABELS[decoded]) {
    return SEGMENT_LABELS[decoded];
  }

  return toTitleCase(decoded.replace(/[-_]+/g, ' '));
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [
    { href: '/', label: 'Home' },
    ...segments.map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join('/')}`,
      label: getSegmentLabel(segment),
    })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className=" border border-[#e8e6e1] bg-white px-4 py-3 text-sm text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.04)]"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-400">{'>'}</span>}
            {index === crumbs.length - 1 ? (
              <span className="font-semibold text-slate-900">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition hover:text-[#8b1111]">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
        {((pathname.split('/').length >= 3 && pathname !== '/search') || pathname === '/admin') && (
          <Suspense fallback={null}>
            <TabCrumb />
          </Suspense>
        )}
      </ol>
    </nav>
  );
}

function TabCrumb() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  
  if (!tab || tab === 'analytics' || tab === 'overview') return null;

  return (
    <li className="flex items-center gap-2">
      <span className="text-slate-400">{'>'}</span>
      <span className="font-semibold text-slate-900">{getSegmentLabel(tab)}</span>
    </li>
  );
}
