/**
 * ISR Configuration Guide
 * Incremental Static Regeneration strategy for jobmint
 */

export const ISR_CONFIG = {
  // High-traffic pages - revalidate more frequently
  HIGHTRAFFIC: {
    revalidate: 300, // 5 minutes
    pages: ['/jobs', '/blog', '/results', '/answer-keys']
  },

  // Medium-traffic pages
  MEDIUMTRAFFIC: {
    revalidate: 600, // 10 minutes
    pages: ['/syllabus', '/admit-cards', '/government-schemes']
  },

  // Low-traffic pages
  LOWTRAFFIC: {
    revalidate: 1800, // 30 minutes
    pages: ['/category', '/state', '/organization', '/qualification']
  },

  // List pages
  LISTPAGES: {
    revalidate: 300, // 5 minutes for freshness
    pages: ['/jobs', '/blog', '/results', '/answer-keys', '/syllabus']
  },

  // Static pages (rarely change)
  STATIC: {
    revalidate: 86400, // 24 hours
    pages: ['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer']
  }
};

/**
 * REVALIDATION STRATEGY:
 * 
 * 1. BUILD TIME:
 *    - Only generate most popular 100 jobs/blogs
 *    - Uses generateStaticParams()
 *    - Builds faster, smaller bundle
 * 
 * 2. ON-DEMAND (dynamicParams: true):
 *    - New job posted → first visitor generates page
 *    - Page cached for 5 minutes
 *    - After 5 min → revalidate on next request
 * 
 * 3. REVALIDATE ENDPOINTS:
 *    - POST /api/revalidate → manually trigger revalidation
 *    - Called when admin creates/updates job
 * 
 * BENEFITS:
 * ✅ Lightning-fast page loads (static served from CDN)
 * ✅ Fresh content every 5-30 min (configurable)
 * ✅ Zero cold starts for popular pages
 * ✅ Scales infinitely without rebuilding
 */

export const REVALIDATION_TIPS = `
1. JOB POSTS:
   - New job created → webhook triggers revalidation
   - /api/jobs/[slug] regenerates after 5 min
   - Popular jobs pre-generated at build time

2. BLOG POSTS:
   - Similar to jobs
   - Revalidate interval: 5 min

3. DYNAMIC PAGES (Category, State, etc):
   - generateStaticParams() creates know routes
   - New route on-demand (first request slower)
   - Cached for 30 min

4. LIST PAGES:
   - Always revalidate every 5 min
   - Shows latest jobs/blogs
   - Lightweight API call

5. MONITORING:
   - Check build log for ISR cache hits
   - Monitor API response times
   - Track page generation times
`;
