'use client';

import React from 'react';
import Link from 'next/link';

export default function BreakingNews() {
  const Marquee = 'marquee' as any;

  return (
    <div className="bg-yellow-300 text-black border-y border-yellow-400 py-1.5 px-4 flex items-center text-xs sm:text-sm font-bold overflow-hidden">
      <div className="bg-primary text-white px-2 py-1 rounded text-[11px] uppercase mr-3 shrink-0">
        Breaking
      </div>

      <Marquee
        scrollamount={5}
        className="cursor-pointer flex-1"
      >
        <Link href="/jobs" className="mr-8 hover:underline">
          🔥 Navy SSR/MR 02/2026 Batch Online Form Extended till July 2026
        </Link>

        <Link href="/results" className="mr-8 hover:underline">
          ⚡ UPSC Civil Services (IAS) Mains Result 2025 Declared
        </Link>

        <Link href="/admit-cards" className="hover:underline">
          ⭐ Bihar Police Constable Admit Card Release Date Announced
        </Link>
      </Marquee>
    </div>
  );
}
