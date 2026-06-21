import React from 'react';
import Link from 'next/link';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Sections',
      links: [
        { name: 'Home Page', href: '/' },
        { name: 'Latest Jobs Alert', href: '/jobs' },
        { name: 'Exam Admit Cards', href: '/admit-cards' },
        { name: 'Sarkari Results', href: '/results' },
        { name: 'Answer Keys', href: '/answer-keys' },
        { name: 'Exam Syllabus', href: '/syllabus' },
        { name: 'Government Schemes', href: '/government-schemes' },
        { name: 'Blogs & career advice', href: '/blog' },
      ]
    },
    {
      title: 'Jobs by Qualification',
      links: [
        { name: '10th Pass Jobs', href: '/qualification/10th-pass' },
        { name: '12th Pass Jobs', href: '/qualification/12th-pass' },
        { name: 'Diploma Jobs', href: '/qualification/diploma' },
        { name: 'Graduation Jobs', href: '/qualification/graduation' },
        { name: 'B.Tech Jobs', href: '/qualification/b.tech' },
      ]
    },
    {
      title: 'Jobs by State',
      links: [
        { name: 'Bihar Govt Jobs', href: '/state/bihar' },
        { name: 'Karnataka Govt Jobs', href: '/state/karnataka' },
        { name: 'UP Govt Jobs', href: '/state/up' },
        { name: 'Delhi Govt Jobs', href: '/state/delhi' },
      ]
    },
    {
      title: 'Jobs by Organisation',
      links: [
        { name: 'SSC Exams', href: '/organization/ssc' },
        { name: 'UPSC Recruitment', href: '/organization/upsc' },
        { name: 'Railway RRB Jobs', href: '/organization/rrb' },
        { name: 'ISRO Vacancies', href: '/organization/isro' },
        { name: 'DRDO Openings', href: '/organization/drdo' },
        { name: 'IBPS Banking Jobs', href: '/organization/ibps' },
        { name: 'NTA Exam Alerts', href: '/organization/nta' },
      ]
    }
  ];

  return (
    <div className="bg-white border border-border-custom rounded-lg p-6 md:p-8 shadow-sm space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-secondary border-b pb-2">Website HTML Sitemap</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="font-bold text-gray-800 border-b pb-1 text-sm uppercase">{sec.title}</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {sec.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="sarkari-link block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
