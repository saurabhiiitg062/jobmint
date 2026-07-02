'use client';

import { useEffect, useRef, useState, type TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarDays,
  CircleDollarSign,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  Link2,
  LucideIcon,
  MapPin,
  ScrollText,
  Send,
  Share2,
  Users,
  Printer
} from 'lucide-react';
import { Job } from '@/types';
import StructuredData from '@/components/seo/StructuredData';
import DynamicTable from '@/components/DynamicTable';
import { useRouter } from 'next/navigation';

interface JobDetailViewProps {
  job: Job;
  categorySlug: 'jobs' | 'admit-cards' | 'results' | 'answer-keys' | 'syllabus' | 'government-schemes';
}

type DetailItem = {
  label: string;
  value: string;
};

type LinkItem = {
  href: string;
  label: string;
  action: string;
  icon: LucideIcon;
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(value?: string) {
  if (!value) return null;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return dateFormatter.format(parsed);
  }

  return value;
}

function getOverviewTitle(title: string) {
  if (/overview/i.test(title)) {
    return title;
  }

  return `${title} Overview`;
}

function getCategorySummary(category: string) {
  if (category === 'Latest Job') {
    return 'Government Jobs';
  }

  return category;
}

function buildOverview(job: Job) {
  const title = job.title.replace(/\s+/g, ' ').trim();
  const org = job.organization || 'the concerned department';
  const applyStart = formatDate(job.importantDates?.applyStart || job.applicationStartDate);
  const applyEnd = formatDate(job.importantDates?.applyLastDate || job.applicationLastDate);

  if (applyStart && applyEnd) {
    return `${org} has released the official notification for ${title}. Eligible candidates can apply online from ${applyStart} to ${applyEnd} through the official portal.`;
  }

  return `${org} has released the official notification for ${title}. Candidates should review the official notice, check eligibility, and use the important links below for the latest updates.`;
}

function shareJob(title: string, slug: string, categorySlug: JobDetailViewProps['categorySlug']) {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return;
  }

  navigator.share({
    title,
    text: `Check details for ${title}`,
    url: `/${categorySlug}/${slug}`,
  }).catch(() => {
    // Ignore cancelled shares.
  });
}

export default function JobDetailView({ job, categorySlug }: JobDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewCount, setViewCount] = useState(job.views || 0);
  const [tabTransition, setTabTransition] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const [transitionDirection, setTransitionDirection] = useState<-1 | 1>(1);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://selectionsure.app' },
      { '@type': 'ListItem', position: 2, name: job.category, item: `https://selectionsure.app/${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: job.title, item: `https://selectionsure.app/${categorySlug}/${job.slug}` },
    ],
  };

  const jobPostingSchema =
    job.category === 'Latest Job'
      ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.seoDescription || job.title,
        datePosted: job.publishedAt || job.createdAt,
        validThrough: job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate || job.applicationLastDate || undefined,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.organization,
          sameAs: job.importantLinks?.officialWebsite || 'https://selectionsure.app',
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.state || 'Central',
            addressRegion: job.state || 'India',
            addressCountry: 'IN',
          },
        },
        baseSalary: job.salary
          ? {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: {
              '@type': 'QuantitativeValue',
              value: job.salary,
              unitText: 'MONTH',
            },
          }
          : undefined,
        educationRequirements: job.exam?.eligibility?.qualification || job.qualification,
        employmentType: 'FULL_TIME',
      }
      : null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the last date to apply for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: (job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate)
            ? `The last date to apply is ${job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate}.`
            : 'Please check the official notification for the closing date.',
        },
      },
      {
        '@type': 'Question',
        name: `What is the qualification required for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The qualification required is ${job.exam?.eligibility?.qualification || job.qualification}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I get the official links for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use the important links section to open the official website, notification, and application links.',
        },
      },
    ],
  };

  const topStats = [
    {
      label: 'Total Posts',
      value: job.vacancy ? String(job.vacancy) : 'As per notice',
      icon: Users,
    },
    {
      label: 'Apply Start',
      value: formatDate(job.exam?.importantDates?.applyStart || job.importantDates?.applyStart || job.applicationStartDate) || 'Check notice',
      icon: CalendarDays,
    },
    {
      label: 'Last Date',
      value: formatDate(job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate || job.applicationLastDate) || 'Check notice',
      icon: CalendarDays,
    },
    {
      label: 'Exam Date',
      value: formatDate(job.exam?.importantDates?.examDate || job.importantDates?.examDate || job.examDate) || 'As scheduled',
      icon: ScrollText,
    },
    {
      label: 'Job Location',
      value: job.state === 'Central' || !job.state ? 'All India' : job.state,
      icon: MapPin,
    },
  ];

  const overviewDetails: DetailItem[] = [
    { label: 'Organization', value: job.organization },
    { label: 'Post Name', value: job.postName },
    { label: 'Total Posts', value: job.vacancy ? String(job.vacancy) : 'As per notification' },
    { label: 'Job Location', value: job.state === 'Central' || !job.state ? 'All India' : job.state },
    { label: 'Apply Mode', value: 'Online' },
    { label: 'Official Website', value: job.importantLinks?.officialWebsite || 'Check below' },
    { label: 'Notification No.', value: job.slug.toUpperCase().replace(/-/g, ' ') },
    { label: 'Apply Start Date', value: formatDate(job.exam?.importantDates?.applyStart || job.importantDates?.applyStart || job.applicationStartDate) || 'Check notice' },
    { label: 'Last Date to Apply', value: formatDate(job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate || job.applicationLastDate) || 'Check notice' },
    { label: 'Exam Date', value: formatDate(job.exam?.importantDates?.examDate || job.importantDates?.examDate || job.examDate) || 'As scheduled' },
    { label: 'Category', value: getCategorySummary(job.category) },
    { label: 'Qualification', value: job.exam?.eligibility?.qualification || job.qualification },
  ];

  const summaryDetails: DetailItem[] = [
    { label: 'Exam Name', value: job.title },
    { label: 'Conducting Body', value: job.organization },
    { label: 'Post Name', value: job.postName },
    { label: 'Total Posts', value: job.vacancy ? String(job.vacancy) : 'As per notice' },
    { label: 'Job Location', value: job.state === 'Central' || !job.state ? 'All India' : job.state },
    { label: 'Category', value: getCategorySummary(job.category) },
  ];

  const importantLinks = [
    job.importantLinks?.applyOnline
      ? { href: job.importantLinks.applyOnline, label: 'Apply Online', action: 'Click Here', icon: ExternalLink }
      : null,
    job.notificationPdf || job.importantLinks?.downloadNotification
      ? {
        href: job.notificationPdf || job.importantLinks?.downloadNotification || '#',
        label: 'Official Notification',
        action: 'Download',
        icon: FileText,
      }
      : null,
    job.notificationPdf || job.importantLinks?.downloadNotification
      ? {
        href: job.notificationPdf || job.importantLinks?.downloadNotification || '#',
        label: 'Detailed Advertisement',
        action: 'Download',
        icon: FileText,
      }
      : null,

    job.notificationPdf || job.importantLinks?.downloadNotification
      ? {
        href: job.officialWebsite || job.officialWebsite || '#',
        label: 'Official Website',
        action: 'Click Here',
        icon: Globe,
      }
      : null,
    job.importantLinks?.downloadAdmitCard
      ? {
        href: job.importantLinks.downloadAdmitCard,
        label: 'Admit Card',
        action: 'Download',
        icon: Link2,
      }
      : null,
    job.importantLinks?.downloadResult
      ? {
        href: job.importantLinks.downloadResult,
        label: 'Result',
        action: 'View Now',
        icon: Link2,
      }
      : null,
    job.importantLinks?.downloadAnswerKey
      ? {
        href: job.importantLinks.downloadAnswerKey,
        label: 'Answer Key',
        action: 'Download',
        icon: Link2,
      }
      : null,
    job.importantLinks?.officialWebsite
      ? {
        href: job.importantLinks.officialWebsite,
        label: 'Check Official Website',
        action: 'Visit Now',
        icon: Globe,
      }
      : null,
  ].filter((item): item is LinkItem => Boolean(item));

  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'important-dates', label: 'Important Dates' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'application-fee', label: 'Application Fee' },
    { id: 'selection-process', label: 'Selection Process' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'vacancy-details', label: 'Vacancy Details' },
    { id: 'cutoff', label: 'Cutoff' },
  ];

  const tabOrder = tabItems.map((tab) => tab.id);

  const startTabTransition = (nextTab: string, direction: -1 | 1) => {
    if (nextTab === activeTab) return;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    setTransitionDirection(direction);
    setSwipeOffset(0);
    setTabTransition('leaving');

    transitionTimeoutRef.current = setTimeout(() => {
      setActiveTab(nextTab);
      router.replace(`?tab=${nextTab}`, { scroll: false });
      setTabTransition('entering');

      transitionTimeoutRef.current = setTimeout(() => {
        setTabTransition('idle');
      }, 180);
    }, 180);
  };

  const moveTab = (direction: -1 | 1) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= tabOrder.length) return;

    startTabTransition(tabOrder[nextIndex], direction);
  };

  const handleSwipeStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
    setSwipeOffset(0);
  };

  const handleSwipeMove = (event: TouchEvent<HTMLElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    setSwipeOffset(Math.max(-72, Math.min(72, deltaX)));
  };

  const handleSwipeEnd = (event: TouchEvent<HTMLElement>) => {
    const start = swipeStartRef.current;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    swipeStartRef.current = null;

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) {
      setSwipeOffset(0);
      return;
    }

    moveTab(deltaX < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
    }

    let isMounted = true;

    // Increment view count
    fetch(`/api/jobs/slug/${job.slug}/view`, { method: 'POST' })
      .then((res) => {
        if (res.ok && isMounted) {
          setViewCount((prev) => prev + 1);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, [job.slug]);

  useEffect(() => {
    tabButtonRefs.current[activeTab]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const tabPanelClassName =
    tabTransition === 'leaving'
      ? transitionDirection === 1
        ? '-translate-x-8 opacity-0'
        : 'translate-x-8 opacity-0'
      : tabTransition === 'entering'
        ? transitionDirection === 1
          ? 'translate-x-8 opacity-0'
          : '-translate-x-8 opacity-0'
        : 'translate-x-0 opacity-100';

  const tabPanelStyle =
    tabTransition === 'idle' && swipeOffset !== 0
      ? {
        transform: `translateX(${swipeOffset}px)`,
      }
      : undefined;

  return (
    <article className="space-y-5 overflow-x-hidden print:space-y-0">
      <StructuredData data={breadcrumbSchema} />
      {jobPostingSchema && <StructuredData data={jobPostingSchema} />}
      <StructuredData data={faqSchema} />

      <div className="hidden print:block font-sans text-black bg-white w-full">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          {/* <div>
               <h1 className="text-xl font-black uppercase text-black">selectionsure.app</h1>
               <p className="text-xs font-bold mt-0.5 text-gray-700">Fastest Updates for Govt Jobss</p>
            </div> */}
          <div className="flex items-center gap-3 text-right justify-end max-w-[50%]">
            <div>
              <h2 className="text-lg font-bold">{job.title}</h2>
              <p className="text-sm text-gray-700">{job.organization}</p>
            </div>
            <div className="shrink-0">
              <img
                src="/asset/branding.png"
                alt="Logo"
                className="h-50 w-50 object-contain grayscale"
              />
            </div>
          </div>
        </div>
        <table className="w-full text-left border-collapse border border-black text-sm mb-6">
          <tbody>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100 w-1/3">Post Name</td>
              <td className="border border-black p-3">{job.postName || job.title}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Job Location</td>
              <td className="border border-black p-3">{job.state || 'All India'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Total Vacancy</td>
              <td className="border border-black p-3">{job.vacancy || 'Check Notification'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Application Fee</td>
              <td className="border border-black p-3">{job.exam?.applicationFee || job.applicationFee || job.fee || 'Check Notification'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Apply Start Date</td>
              <td className="border border-black p-3">{formatDate(job.exam?.importantDates?.applyStart || job.importantDates?.applyStart || job.applicationStartDate) || 'Check Notification'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Last Date to Apply</td>
              <td className="border border-black p-3 font-bold">{formatDate(job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate || job.applicationLastDate) || 'Check Notification'}</td>
            </tr>
            <tr>
              <td className="border border-black p-3 font-bold bg-gray-100">Exam Date</td>
              <td className="border border-black p-3">{formatDate(job.exam?.importantDates?.examDate || job.importantDates?.examDate || job.examDate) || 'To be notified'}</td>
            </tr>
            {(job.exam?.importantDates?.extendedDate || job.importantDates?.extendedDate) && (
              <tr>
                <td className="border border-black p-3 font-bold bg-gray-100 text-red-600">Extended Date</td>
                <td className="border border-black p-3 font-bold text-red-600">{formatDate(job.exam?.importantDates?.extendedDate || job.importantDates?.extendedDate)}</td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="mt-8 text-center text-xs text-gray-600 font-bold border-t border-black pt-2">Printed from selectionsure.app - Please verify all details from the official notification.</p>
      </div>

      <div className="print:hidden">
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 self-start space-y-5">
            <div className="overflow-hidden rounded-lg border border-border-custom bg-white shadow-sm">
              <div className="border-b border-border-custom px-5 py-5 md:px-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-lg border border-border-custom bg-primary/5 sm:h-24 sm:w-24">
                      <Image
                        src="/asset/branding.png"
                        alt={job.organization}
                        width={72}
                        height={72}
                        className="h-[60px] w-[60px] object-contain sm:h-[72px] sm:w-[72px]"
                      />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <div className="space-y-1">
                        <h1 className="break-words text-2xl font-extrabold leading-tight text-secondary md:text-3xl">
                          {job.title}
                        </h1>
                        <p className="break-words text-sm font-semibold text-gray-600 md:text-base">
                          {job.organization === 'SSC' ? 'Staff Selection Commission (SSC)' : `${job.organization}${job.organization !== job.postName ? ` (${job.postName})` : ''}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-bold leading-none text-white uppercase">
                          New
                        </span>
                        <span className="rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-success">
                          Official Notification
                        </span>
                        <span className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          <Eye className="h-4 w-4" />
                          {viewCount} Views
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => typeof window !== 'undefined' && window.print()}
                      className="print:hidden inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-custom bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-primary sm:w-auto"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </button>
                    <button
                      type="button"
                      onClick={() => shareJob(job.title, job.slug, categorySlug)}
                      className="print:hidden inline-flex w-full items-center justify-center gap-2 rounded-md border border-border-custom bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-primary sm:w-auto"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 px-5 py-4 sm:grid-cols-2 md:px-6 lg:grid-cols-5">
                {topStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border-custom bg-white px-4 py-3">
                      <div className="mt-0.5 rounded-full bg-red-50 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">{item.label}</p>
                        <p className="text-sm font-bold leading-5 text-secondary">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border-custom bg-white px-4 py-4 shadow-sm md:px-6">
              <nav
                className="overflow-x-auto border-b border-border-custom"
              >
                <div className="flex min-w-max gap-4 whitespace-nowrap text-xs font-bold text-gray-600 sm:gap-6 sm:text-sm">
                  {tabItems.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        const currentIndex = tabOrder.indexOf(activeTab);
                        const nextIndex = tabOrder.indexOf(tab.id);
                        const direction = nextIndex > currentIndex ? 1 : -1;

                        startTabTransition(tab.id, direction);
                      }}
                      ref={(node) => {
                        tabButtonRefs.current[tab.id] = node;
                      }}
                      className={
                        activeTab === tab.id
                          ? 'border-b-2 border-primary pb-3 text-primary'
                          : 'pb-3 text-gray-600 transition hover:text-primary'
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </nav>

              <div
                className={`pt-6 transition-all duration-200 ease-out will-change-transform ${tabPanelClassName}`}
                style={tabPanelStyle}
                onTouchStart={handleSwipeStart}
                onTouchMove={handleSwipeMove}
                onTouchEnd={handleSwipeEnd}
              >
                <section id="overview" className={activeTab === 'overview' ? 'block' : 'hidden print:block'}>
                  <h2 className="text-xl md:text-2xl font-bold text-secondary">
                    {getOverviewTitle(job.title)}
                  </h2>
                  <p className="mt-3 max-w-[78ch] text-sm leading-7 text-gray-600">
                    {job.exam?.overview || buildOverview(job)}
                  </p>

                  <div className="mt-6 grid gap-x-10 gap-y-0 md:grid-cols-2">
                    {overviewDetails.map((detail, index) => {
                      const isWebsite = detail.label === 'Official Website' && detail.value.startsWith('http');
                      const isLeftColumnEnd = index === 5;

                      return (
                        <div
                          key={detail.label}
                          className={`grid grid-cols-1 gap-2 py-2 text-sm sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3 ${isLeftColumnEnd ? 'md:border-b-0' : 'border-b border-gray-100'
                            } ${index >= 6 ? 'md:border-b md:border-l md:border-gray-100 md:pl-8' : ''}`}
                        >
                          <span className="font-semibold text-gray-600 sm:pt-0.5">{detail.label}</span>
                          {isWebsite ? (
                            <a
                              href={detail.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words font-bold text-primary hover:underline"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <span className="break-words font-bold text-gray-800">{detail.value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {job.importantLinks?.applyOnline && (
                      <a
                        href={job.importantLinks.applyOnline}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-4 text-sm font-bold text-white transition hover:bg-red-900"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Apply Online
                      </a>
                    )}

                    {(job.notificationPdf || job.importantLinks?.downloadNotification) && (
                      <a
                        href={job.notificationPdf || job.importantLinks?.downloadNotification || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-border-custom bg-white px-5 py-4 text-sm font-bold text-secondary transition hover:bg-gray-50"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        Download Official Notification (PDF)
                      </a>
                    )}
                  </div>
                </section>

                <section id="important-dates" className={activeTab === 'important-dates' ? 'block' : 'hidden print:block'}>
                  <h3 className="text-lg font-bold text-secondary">Important Dates</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: 'Apply Start Date', value: job.exam?.importantDates?.applyStart || job.importantDates?.applyStart || job.applicationStartDate },
                      { label: 'Last Date to Apply', value: job.exam?.importantDates?.applyLastDate || job.importantDates?.applyLastDate || job.applicationLastDate },
                      { label: 'Fee Payment Last Date', value: job.exam?.importantDates?.feePaymentLastDate || job.importantDates?.feePaymentLastDate },
                      { label: 'Exam Date', value: job.exam?.importantDates?.examDate || job.importantDates?.examDate || job.examDate },
                      { label: 'Admit Card Release', value: job.exam?.importantDates?.admitCardRelease || job.importantDates?.admitCardRelease },
                      { label: 'Result Declaration', value: job.exam?.importantDates?.resultDeclaration || job.importantDates?.resultDeclaration }
                    ].filter(item => Boolean(item.value)).map((item) => (
                      <div key={item.label} className="rounded-lg border border-border-custom bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                        <p className="mt-2 text-base font-bold text-secondary">{formatDate(item.value) || 'Check notice'}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="eligibility" className={activeTab === 'eligibility' ? 'block' : 'hidden print:block'}>
                  <h3 className="text-lg font-bold text-secondary">Eligibility</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border-custom bg-white p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <GraduationCap className="h-5 w-5" />
                        <p className="font-bold">Qualification</p>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-700">{job.exam?.eligibility?.qualification || job.qualification}</p>
                    </div>

                    <div className="rounded-lg border border-border-custom bg-white p-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        <p className="font-bold">Age Limit</p>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-700">{job.exam?.eligibility?.ageLimit || job.ageLimit || 'Refer to official notification'}</p>
                    </div>
                  </div>
                </section>

                <section id="application-fee" className={activeTab === 'application-fee' ? 'block' : 'hidden print:block'}>
                  <h3 className="text-lg font-bold text-secondary">Application Fee</h3>
                  <div className="mt-4 rounded-lg border border-border-custom bg-white p-4">
                    <div className="flex items-center gap-2 text-primary">
                      <CircleDollarSign className="h-5 w-5" />
                      <p className="font-bold">Fee Details</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      {job.exam?.applicationFee || job.applicationFee || job.fee || 'Please refer to the official notification for category-wise fee details.'}
                    </p>
                  </div>
                </section>

                <section id="selection-process" className={activeTab === 'selection-process' ? 'block' : 'hidden'}>
                  <h3 className="text-lg font-bold text-secondary">Selection Process</h3>
                  <div className="mt-4 rounded-lg border border-border-custom bg-white p-4 text-sm font-semibold text-gray-700">
                    {job.selectionProcess || 'Written examination, document verification, and other stages as mentioned in the official notice.'}
                  </div>
                </section>

                <section id="syllabus" className={activeTab === 'syllabus' ? 'block' : 'hidden print:hidden'}>
                  <h3 className="text-lg font-bold text-secondary">Syllabus</h3>
                  {job.syllabus && Array.isArray(job.syllabus) && job.syllabus.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.syllabus.map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : job.syllabus && typeof job.syllabus === 'string' ? (
                    <div className="mt-4 rounded-lg border border-border-custom bg-white p-4 text-sm leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: job.syllabus }} />
                  ) : job.tables && job.tables.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.tables.filter(table => table.title.toLowerCase().includes('syllabus') || table.title.toLowerCase().includes('pattern')).map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-border-custom bg-white p-4 text-sm font-semibold text-gray-700">
                      Check the official notification for subject-wise syllabus, exam pattern, and marking scheme.
                    </div>
                  )}
                </section>

                <section id="vacancy-details" className={activeTab === 'vacancy-details' ? 'block' : 'hidden print:block'}>
                  <h3 className="text-lg font-bold text-secondary">Vacancy Details</h3>
                  {job.exam?.vacancyDetails && job.exam.vacancyDetails.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.exam.vacancyDetails.map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : job.tables && job.tables.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.tables.filter(table => table.title.toLowerCase().includes('vacancy')).map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg border border-border-custom bg-white p-4 text-sm font-semibold text-gray-700">
                      No vacancy details available. Please check the official notification.
                    </div>
                  )}
                </section>

                <section id="cutoff" className={activeTab === 'cutoff' ? 'block' : 'hidden print:hidden'}>
                  <h3 className="text-lg font-bold text-secondary">Cutoff Marks</h3>

                  {job.exam?.historicalCutoffs && job.exam.historicalCutoffs.length > 0 && (
                    <div className="mt-4 mb-8 space-y-4">
                      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-lg mb-4 font-semibold">
                        Historical Cutoffs for {job.exam.title}
                      </div>
                      {job.exam.historicalCutoffs.map((table, index) => (
                        <DynamicTable key={`hist-${index}`} table={table} />
                      ))}
                    </div>
                  )}

                  {job.cutoff && job.cutoff.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.cutoff.map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : job.tables && job.tables.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {job.tables.filter(table => table.title.toLowerCase().includes('cutoff')).map((table, index) => (
                        <DynamicTable key={index} table={table} />
                      ))}
                    </div>
                  ) : (!job.exam?.historicalCutoffs || job.exam.historicalCutoffs.length === 0) ? (
                    <div className="mt-4 rounded-lg border border-border-custom bg-white p-4 text-sm font-semibold text-gray-700">
                      No cutoff details available. Please check the official notification.
                    </div>
                  ) : null}
                </section>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="mt-8 border-t border-border-custom pt-6">
                  <p className="text-sm font-bold text-secondary">Related tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${tag}`}
                        className="rounded-md border border-border-custom bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0 self-start space-y-5 print:hidden">
            <section className="rounded-lg border border-border-custom bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-secondary">Important Links</h2>
              <div className="mt-4 space-y-3">
                {importantLinks.map((linkItem) => {
                  const Icon = linkItem.icon;

                  return (
                    <a
                      key={linkItem.label}
                      href={linkItem.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center justify-between gap-3 rounded-md px-0 py-1 transition hover:text-primary"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-700">
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{linkItem.label}</span>
                      </span>
                      <span className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-[11px] font-bold text-white">
                        {linkItem.action}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-border-custom bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-secondary">Job Summary</h2>
              <div className="mt-4 space-y-3">
                {summaryDetails.map((detail) => (
                  <div key={detail.label} className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-3">
                    <span className="font-semibold text-gray-600">{detail.label}</span>
                    <span className="break-words font-bold text-gray-800">{detail.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border-custom bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-secondary">Stay Updated</h2>
              <p className="mt-2 text-sm text-gray-600">
                Join our Telegram channel and get instant updates for new forms, admit cards, and results.
              </p>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary"
                >
                  <Send className="h-4 w-4" />
                  Join Telegram
                </a>
                <div className="flex h-20 w-20 items-center justify-center self-end rounded-lg bg-gray-50 sm:self-auto">
                  <Send className="h-8 w-8 text-secondary" />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
      <div className="hidden print:block">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="mt-2 text-gray-600">Printed on {new Date().toLocaleDateString()}</p>
      </div>

    </article>
  );
}
