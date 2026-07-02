import React from 'react';
import Link from 'next/link';
import logo from '../../public/asset/branding.png'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = {
    quickLinks: [
      { name: 'Latest Jobs', href: '/jobs' },
      { name: 'Admit Cards', href: '/admit-cards' },
      { name: 'Exam Results', href: '/results' },
      { name: 'Answer Keys', href: '/answer-keys' },
      { name: 'Syllabus', href: '/syllabus' },
    ],
    programmaticPages: [
      { name: 'SSC Jobs', href: '/category/ssc' },
      { name: 'Railway Jobs', href: '/category/railway' },
      { name: 'UPSC Jobs', href: '/category/upsc' },
      { name: 'Defence Jobs', href: '/category/defence' },
      { name: 'Bank Jobs', href: '/category/bank' },
    ],
    infoPages: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Sitemap Page', href: '/sitemap' },
    ]
  };

  return (
    <footer className="bg-secondary text-gray-300 border-t-4 border-primary mt-12 pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="space-y-3">
          {/* <h2 className="text-xl font-bold text-white tracking-tight">SelectionSure</h2> */}
          <img src={logo.src} width={200} height={30} alt="logo" />
          <p className="text-xs leading-relaxed text-gray-400">
            SelectionSure is India&apos;s leading government job update portal. We provide fast, reliable, and real-time alerts for Sarkari Results, Admit Cards, Syllabi, Answer Keys, and Scheme updates.
          </p>
          <div className="pt-2 text-xs">
            <span className="font-bold text-white">Email:</span> support@selectionsure.app
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            {sections.quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hot Categories */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2 mb-3">Popular Alerts</h3>
          <ul className="space-y-2 text-xs">
            {sections.programmaticPages.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Pages */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2 mb-3">Information</h3>
          <ul className="space-y-2 text-xs">
            {sections.infoPages.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-blue-900 text-center text-[10px] text-gray-500">
        <p className="leading-relaxed">
          Disclaimer: SelectionSure is not affiliated with any government organisation. All information published here is sourced from official press notifications and official websites. Job aspirants must verify details independently before applying.
        </p>
        <p className="mt-2 text-gray-400">
          &copy; {currentYear} selectionsure.app. All Rights Reserved. Designed for fast and lightweight mobile-first SEO performance.
        </p>
      </div>
    </footer>
  );
}
