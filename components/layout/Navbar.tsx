'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Bell, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const Marquee = 'marquee' as any;
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
    { name: 'Govt Schemes', href: '/government-schemes' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 flex justify-between items-center font-medium">
        <div className="flex items-center space-x-2">
          <Bell className="w-3.5 h-3.5 animate-pulse text-accent" />
          <span>Latest Update: SSC MTS 2026 Notification out now!</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/about" className="hover:text-accent transition-colors">About Us</a>
          <a href="/contact" className="hover:text-accent transition-colors">Contact</a>
          <a href="/admin" className="hover:text-accent transition-colors">Admin Portal</a>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-border-custom py-4 px-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Logo / Portal Name */}
        <Link href="/" className="flex items-center space-x-3 text-center md:text-left">
          <div className="bg-primary text-white font-bold p-2.5 rounded-lg text-2xl tracking-wider">
            JJ
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight leading-none">JobJanta</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Sarkari Jobs & Exam Updates</p>
          </div>
        </Link>

        {/* Search & Dark Mode */}
        <div className="flex items-center space-x-3 w-full md:w-auto max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search jobs, admit cards, exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-border-custom rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
            />
            <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-secondary">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <button className="p-2 border border-border-custom rounded-md text-gray-600 hover:bg-gray-100 hidden sm:block">
            <Moon className="w-4 h-4" />
          </button>
          <button 
            className="p-2 border border-border-custom rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation (Navy Blue Background) */}
      <nav className="bg-secondary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center h-12 overflow-x-auto scrollbar-none">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3.5 text-sm font-semibold hover:bg-primary transition-all duration-150 whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 space-y-1 border-t border-blue-900">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm font-semibold hover:bg-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-blue-900 pt-2 pb-1 flex justify-around text-xs font-bold text-gray-300">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Portal</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Breaking News Marquee */}
      <div className="bg-[#FFEB3B] text-black border-y border-yellow-400 py-1.5 px-4 overflow-hidden flex items-center text-xs sm:text-sm font-bold">
        <div className="bg-primary text-white px-2 py-0.5 rounded text-[11px] uppercase mr-3 shrink-0">
          Breaking
        </div>
        <Marquee className="cursor-pointer" scrollamount="5">
          <Link href="/jobs" className="hover:underline mr-8">🔥 Navy SSR/MR 02/2026 Batch Online Form Extended till July 2026</Link>
          <Link href="/results" className="hover:underline mr-8">⚡ UPSC Civil Services (IAS) Mains Result 2025 Declared</Link>
          <Link href="/admit-cards" className="hover:underline">⭐ Bihar Police Constable Admit Card Release Date Announced</Link>
        </Marquee>
      </div>
    </header>
  );
}
