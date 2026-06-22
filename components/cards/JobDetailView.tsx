'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Calendar, Link2, FileText, Share2, Award, Users, CreditCard } from 'lucide-react';
import { Job } from '@/types';
import StructuredData from '@/components/seo/StructuredData';

interface JobDetailViewProps {
  job: Job;
  categorySlug: 'jobs' | 'admit-cards' | 'results' | 'answer-keys' | 'syllabus' | 'government-schemes';
}

export default function JobDetailView({ job, categorySlug }: JobDetailViewProps) {
  // Breadcrumb structure
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobjanta.com' },
      { '@type': 'ListItem', position: 2, name: job.category, item: `https://jobjanta.com/${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: job.title, item: `https://jobjanta.com/${categorySlug}/${job.slug}` }
    ]
  };

  // JobPosting schema if it is Latest Job
  let jobPostingSchema: any = null;
  if (job.category === 'Latest Job') {
    jobPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.seoDescription || job.title,
      datePosted: job.publishedAt || job.createdAt,
      validThrough: job.applicationLastDate || undefined,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.organization,
        sameAs: job.importantLinks?.officialWebsite || 'https://jobjanta.com'
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.state || 'Central',
          addressRegion: job.state || 'India',
          addressCountry: 'IN'
        }
      },
      baseSalary: job.salary ? {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary,
          unitText: 'MONTH'
        }
      } : undefined,
      educationRequirements: job.qualification,
      employmentType: 'FULL_TIME'
    };
  }

    // Eligibility & Deadline Section
  const today = new Date();
  const applyLastDateStr = job.importantDates?.applyLastDate;
  const applyLastDate = applyLastDateStr ? new Date(applyLastDateStr) : null;
  const daysLeft = applyLastDate ? Math.ceil((applyLastDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const [showEligibility, setShowEligibility] = useState(false);

// Inside the JSX, after the important dates table (e.g., after line 224)
{applyLastDate && (
  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded">
    <p className="font-semibold text-indigo-800">
      Last day to apply: {applyLastDate.toLocaleDateString()} ({daysLeft !== null && daysLeft >= 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'deadline passed'})
    </p>
    <button
      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      onClick={() => setShowEligibility(!showEligibility)}
    >
      {showEligibility ? 'Hide Eligibility' : 'Check Your Eligibility'}
    </button>
    {showEligibility && (
      <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
        <p className="font-medium mb-2">Eligibility criteria:</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>Qualification: {job.qualification}</li>
          {job.ageLimit && <li>Age Limit: {job.ageLimit}</li>}
          {job.applicationFee && <li>Application Fee: {job.applicationFee}</li>}
        </ul>
      </div>
    )}
  </div>
)}
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the last date to apply for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: job.importantDates?.applyLastDate 
            ? `The last date to apply is ${job.importantDates.applyLastDate}.` 
            : `Please check the official notification for the last date of application.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the qualification required for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The qualification required is ${job.qualification}.`
        }
      },
      {
        '@type': 'Question',
        name: `How to check/download details for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Candidates can download the notification or apply from the important links section on JobJanta.`
        }
      }
    ]
  };

  return (
    <article className="space-y-8 bg-white border border-border-custom rounded-lg p-5 md:p-8 shadow-sm">
      <StructuredData data={breadcrumbSchema} />
      {jobPostingSchema && <StructuredData data={jobPostingSchema} />}
      <StructuredData data={faqSchema} />

      {/* Header Info */}
      <div className="space-y-4 border-b border-gray-150 pb-6">
        <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          {job.category}
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-secondary leading-snug">
          {job.title}
        </h2>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span>Organisation: <strong>{job.organization}</strong></span>
          </div>
          {job.vacancy !== undefined && job.vacancy > 0 && (
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-gray-400" />
              <span>Vacancy: <strong>{job.vacancy} Positions</strong></span>
            </div>
          )}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Updated: {new Date(job.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="overflow-x-auto">
        <table className="sarkari-table">
          <thead>
            <tr>
              <th colSpan={2} className="text-center font-bold text-base uppercase tracking-wider bg-primary">
                Job Overview & Important Highlights
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold w-1/3 text-gray-700">Post Name</td>
              <td className="text-gray-900 font-semibold">{job.postName}</td>
            </tr>
            {job.vacancy !== undefined && job.vacancy > 0 && (
              <tr>
                <td className="font-bold text-gray-700">Total Vacancy</td>
                <td className="text-green-800 font-bold">{job.vacancy}</td>
              </tr>
            )}
            {job.salary && (
              <tr>
                <td className="font-bold text-gray-700">Salary / Pay Scale</td>
                <td className="text-gray-900">{job.salary}</td>
              </tr>
            )}
            <tr>
              <td className="font-bold text-gray-700">Qualification Required</td>
              <td className="text-gray-900 font-bold">{job.qualification}</td>
            </tr>
{job.fee && (
  <tr>
    <td className="font-bold text-gray-700">Fee</td>
    <td className="text-gray-900">{job.fee}</td>
  </tr>
)}
            {job.ageLimit && (
              <tr>
                <td className="font-bold text-gray-700">Age Limit</td>
                <td className="text-gray-900">{job.ageLimit}</td>
              </tr>
            )}
            {job.applicationFee && (
              <tr>
                <td className="font-bold text-gray-700">Application Fee</td>
                <td className="text-gray-900">{job.applicationFee}</td>
              </tr>
            )}
            {job.selectionProcess && (
              <tr>
                <td className="font-bold text-gray-700">Selection Process</td>
                <td className="text-gray-900">{job.selectionProcess}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dates & Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Important Dates Table */}
        <div className="overflow-x-auto">
          <table className="sarkari-table">
            <thead>
              <tr>
                <th colSpan={2} className="bg-secondary text-center uppercase text-xs tracking-wider">
                  Important Dates
                </th>
              </tr>
            </thead>
            <tbody>
              {job.importantDates?.applyStart && (
                <tr>
                  <td className="font-bold text-gray-700">Application Start</td>
                  <td className="text-gray-900">{job.importantDates.applyStart}</td>
                </tr>
              )}
              {job.importantDates?.applyLastDate && (
                <tr>
                  <td className="font-bold text-red-600">Last Date to Apply</td>
                  <td className="text-red-600 font-bold">{job.importantDates.applyLastDate}</td>
                </tr>
              )}
              {job.importantDates?.examDate && (
                <tr>
                  <td className="font-bold text-gray-700">Exam Date</td>
                  <td className="text-gray-900 font-semibold">{job.importantDates.examDate}</td>
                </tr>
              )}
              {job.importantDates?.admitCardRelease && (
                <tr>
                  <td className="font-bold text-gray-700">Admit Card Date</td>
                  <td className="text-gray-900">{job.importantDates.admitCardRelease}</td>
                </tr>
              )}
              {job.importantDates?.resultDeclaration && (
                <tr>
                  <td className="font-bold text-gray-700">Result Declare Date</td>
                  <td className="text-success font-semibold">{job.importantDates.resultDeclaration}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Important Links Table */}
        <div className="overflow-x-auto">
          <table className="sarkari-table">
            <thead>
              <tr>
                <th colSpan={2} className="bg-success text-center uppercase text-xs tracking-wider">
                  Useful Official Links
                </th>
              </tr>
            </thead>
            <tbody>
              {job.importantLinks?.applyOnline && (
                <tr>
                  <td className="font-bold text-gray-700">Apply Online Link</td>
                  <td>
                    <a href={job.importantLinks.applyOnline} target="_blank" rel="noopener noreferrer" className="sarkari-link flex items-center space-x-1">
                      <span>Click Here</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
              {job.importantLinks?.downloadNotification && (
                <tr>
                  <td className="font-bold text-gray-700">Download Notification</td>
                  <td>
                    <a href={job.importantLinks.downloadNotification} className="sarkari-link flex items-center space-x-1">
                      <span>Download PDF</span>
                      <FileText className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
              {job.importantLinks?.officialWebsite && (
                <tr>
                  <td className="font-bold text-gray-700">Official Website</td>
                  <td>
                    <a href={job.importantLinks.officialWebsite} target="_blank" rel="noopener noreferrer" className="sarkari-link flex items-center space-x-1">
                      <span>Visit Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
              {job.importantLinks?.downloadAdmitCard && (
                <tr>
                  <td className="font-bold text-gray-700">Download Admit Card</td>
                  <td>
                    <a href={job.importantLinks.downloadAdmitCard} className="sarkari-link font-bold text-blue-700 flex items-center space-x-1">
                      <span>Admit Card Link</span>
                      <Link2 className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
              {job.importantLinks?.downloadResult && (
                <tr>
                  <td className="font-bold text-gray-700">Download Result</td>
                  <td>
                    <a href={job.importantLinks.downloadResult} className="sarkari-link font-bold text-green-700 flex items-center space-x-1">
                      <span>Result Link</span>
                      <Link2 className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
              {job.importantLinks?.downloadAnswerKey && (
                <tr>
                  <td className="font-bold text-gray-700">Download Answer Key</td>
                  <td>
                    <a href={job.importantLinks.downloadAnswerKey} className="sarkari-link font-bold text-yellow-700 flex items-center space-x-1">
                      <span>Answer Key Link</span>
                      <Link2 className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Steps to Apply or Scheme Details */}
      <section className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-bold text-secondary">
          How to Apply Online / Get Started:
        </h3>
        <ul className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-600">
          <li>Read the official notification pdf linked above before filling the form.</li>
          <li>Ensure you have all standard documents ready: Identity Proof, Address Details, and basic credentials.</li>
          <li>Scan and resize files for online upload: Photograph, Signature, and Left Thumb Impression if applicable.</li>
          <li>Submit the application fee online using Debit Card, Credit Card, or Net Banking options.</li>
          <li>Review the application preview carefully before clicking submit.</li>
          <li>Take a printout of the final submitted application form for future reference.</li>
        </ul>
      </section>

      {/* Internal Linking Related section */}
      <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center text-xs">
        <span className="font-bold text-gray-700">Related tags:</span>
        {job.tags?.map(t => (
          <Link key={t} href={`/search?q=${t}`} className="bg-gray-100 hover:bg-primary hover:text-white px-2.5 py-1 rounded text-gray-600 font-semibold transition-colors">
            #{t}
          </Link>
        ))}
      </div>
    </article>
  );
}
