'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileText, Search, User } from 'lucide-react';

export default function StickyMobileTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Results', href: '/results', icon: FileText },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Profile', href: '/admin', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-custom z-50 flex justify-around items-center h-14 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              isActive ? 'text-primary' : 'text-gray-500 hover:text-secondary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
