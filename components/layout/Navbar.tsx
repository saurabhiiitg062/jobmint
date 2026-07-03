'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Bell, Moon } from 'lucide-react';
import logo from '../../public/asset/branding.png';

export default function Navbar({ todayJobsCount = 0 }: { todayJobsCount?: number }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Latest Jobs', href: '/jobs' },
    { name: 'Admit Card', href: '/admit-cards' },
    { name: 'Results', href: '/results' },
    { name: 'Answer Key', href: '/answer-keys' },
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Age Calculator', href: '/age-calculator' },
    { name: 'Photo Resizer', href: '/image-resizer' },
    { name: 'Govt Schemes', href: '/government-schemes' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="w-full print:hidden">
      {/* Top Bar */}
      <div className="bg-primary px-4 py-2 text-xs font-medium text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center space-x-2 overflow-hidden">
          <Bell className="w-3.5 h-3.5 animate-pulse text-accent shrink-0" />
          <span className="truncate">
            Latest Update: SSC MTS 2026 Notification out now!
          </span>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            href="/about"
            className="hover:text-accent transition-colors"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="hover:text-accent transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/admin"
            className="hover:text-accent transition-colors"
          >
            Admin Portal
          </Link>
        </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-b border-border-custom bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex w-full min-w-0 items-center gap-3 text-left md:w-auto"
        >
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary p-2">
            <Image
              src={logo}
              alt="SelectionSure Logo"
              width={50}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-[clamp(1.9rem,5vw,2.2rem)] font-extrabold leading-none tracking-tight text-primary">
              SelectionSure
            </h1>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 sm:tracking-widest">
              Sarkari Jobs & Exam Updates
            </p>
          </div>
        </Link>

        {/* Search */}
        <div className="flex w-full max-w-md items-center gap-3 self-stretch md:w-auto md:self-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative min-w-0 flex-1"
          >
            <input
              type="text"
              placeholder="Search jobs, admit cards, exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-border-custom rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button 
            aria-label="Toggle Dark Mode"
            className="hidden sm:flex p-2 border border-border-custom rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="shrink-0 rounded-md border border-border-custom p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-secondary text-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center h-12 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-semibold whitespace-nowrap hover:bg-primary transition-colors flex items-center gap-1.5"
              >
                {link.name}
                {link.name === 'Latest Jobs' && todayJobsCount > 0 && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-accent px-2 text-[10px] font-bold text-primary shadow-sm animate-pulse">
                    {todayJobsCount} New
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1 border-t border-blue-900">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.name === 'Latest Jobs' && todayJobsCount > 0 && (
                    <span className="flex h-5 items-center justify-center rounded-full bg-accent px-2 text-[10px] font-bold text-primary shadow-sm animate-pulse">
                      {todayJobsCount} New
                    </span>
                  )}
                </Link>
              ))}

              <div className="border-t border-blue-900 pt-3 flex justify-around text-xs font-semibold text-gray-300">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
