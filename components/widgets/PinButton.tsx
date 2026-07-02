'use client';

import React from 'react';
import { usePinnedJobs } from '@/hooks/usePinnedJobs';
import { Job } from '@/types';

export default function PinButton({ job }: { job: Job }) {
  const { isPinned, togglePin, isHydrated } = usePinnedJobs();

  if (!isHydrated) return null; // Prevent hydration mismatch

  const pinned = isPinned(job._id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // prevent navigation if inside a Link
        e.stopPropagation();
        togglePin(job);
      }}
      className={`transition-colors flex items-center justify-center p-1 rounded hover:bg-gray-100 ${
        pinned ? 'text-primary' : 'text-gray-300'
      }`}
      title={pinned ? 'Unpin Job' : 'Pin Job'}
      aria-label={pinned ? 'Unpin Job' : 'Pin Job'}
    >
      📌
    </button>
  );
}
