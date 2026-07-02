import { useState, useEffect } from 'react';
import { Job } from '@/types';

const STORAGE_KEY = 'pinned_jobs';

export function usePinnedJobs() {
  const [pinnedJobs, setPinnedJobs] = useState<Job[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPinnedJobs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse pinned jobs', e);
      }
    }
  }, []);

  const togglePin = (job: Job) => {
    setPinnedJobs((prev) => {
      const isPinned = prev.some((p) => p._id === job._id);
      let updated;
      if (isPinned) {
        updated = prev.filter((p) => p._id !== job._id);
      } else {
        updated = [...prev, job];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isPinned = (jobId: string) => {
    return pinnedJobs.some((p) => p._id === jobId);
  };

  return { pinnedJobs, togglePin, isPinned, isHydrated };
}
