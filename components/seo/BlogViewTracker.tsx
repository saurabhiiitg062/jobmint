'use client';

import { useEffect } from 'react';

export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blogs/slug/${slug}/view`, { method: 'POST' }).catch(() => {});
  }, [slug]);

  return null;
}
