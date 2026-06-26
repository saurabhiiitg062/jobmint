'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Bell, Moon } from 'lucide-react';
import logo from '../../public/asset/branding.png';

export default function Navbar() {
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
    { name: 'Govt Schemes', href: '/government-schemes' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 flex justify-between items-center font-medium">
        <div className="flex items-center space-x-2 overflow-hidden">
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

      {/* Main Header */}
      <div className="bg-white border-b border-border-custom py-4 px-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-center md:text-left"
        >
          <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
            <Image
              src={logo}
              alt="SelectionSure Logo"
              width={50}
              height={50}
              priority
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight leading-none">
              SelectionSure
            </h1>

            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              Sarkari Jobs & Exam Updates
            </p>
          </div>
        </Link>

        {/* Search */}
        <div className="flex items-center gap-3 w-full md:w-auto max-w-md">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button className="hidden sm:flex p-2 border border-border-custom rounded-md text-gray-600 hover:bg-gray-100 transition">
            <Moon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 border border-border-custom rounded-md text-gray-600 hover:bg-gray-100 transition"
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
      <nav className="bg-secondary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center h-12 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 text-sm font-semibold whitespace-nowrap hover:bg-primary transition-colors"
              >
                {link.name}
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
                  className="block px-4 py-2.5 text-sm font-semibold hover:bg-primary transition-colors"
                >
                  {link.name}
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
