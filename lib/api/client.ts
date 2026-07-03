function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const apiPath = process.env.NEXT_PUBLIC_API_URL || "/api";

  if (apiPath.startsWith("http://") || apiPath.startsWith("https://")) {
    return apiPath;
  }

  return `${siteUrl}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
}

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Public Jobs
  getJobs: (params: { category?: string; state?: string; qualification?: string; organization?: string; search?: string; limit?: number; page?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return fetcher(`/jobs?${query.toString()}`, { next: { revalidate: 300, tags: ['jobs'] } });
  },

  getJobBySlug: (slug: string) => {
    return fetcher(`/jobs/slug/${slug}`, { next: { revalidate: 300, tags: ['jobs', `job-${slug}`] } });
  },

  getQuickStats: () => {
    return fetcher('/jobs/stats', { next: { revalidate: 300, tags: ['jobs'] } });
  },

  // Public Blogs
  getBlogs: (params: { search?: string; limit?: number; page?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return fetcher(`/blogs?${query.toString()}`, { next: { revalidate: 300, tags: ['blogs'] } });
  },

  getBlogBySlug: (slug: string) => {
    return fetcher(`/blogs/slug/${slug}`, { next: { revalidate: 300, tags: ['blogs', `blog-${slug}`] } });
  },

  // Admin auth
  login: (credentials: unknown) => {
    return fetcher('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getDashboardStats: () => {
    return fetcher('/admin/stats', { cache: 'no-store' });
  },

  // Admin Job Operations
  createJob: (jobData: unknown) => {
    return fetcher('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },
  updateJob: (id: string, jobData: unknown) => {
    return fetcher(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });
  },

  deleteJob: (id: string) => {
    return fetcher(`/jobs/${id}`, {
      method: 'DELETE'
    });
  },

  cloneJob: (id: string) => {
    return fetcher(`/jobs/${id}/clone`, {
      method: 'POST'
    });
  },

  bulkImportJobs: (jobs: any[]) => {
    return fetcher('/jobs/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ jobs })
    });
  },

  bulkDeleteJobs: (ids: string[]) => {
    return fetcher('/jobs/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  },

  // Admin Blog Operations
  createBlog: (blogData: unknown) => {
    return fetcher('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  },

  updateBlog: (id: string, blogData: unknown) => {
    return fetcher(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  },

  deleteBlog: (id: string) => {
    return fetcher(`/blogs/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Master Data - Categories
  getCategories: () => {
    return fetcher('/categories');
  },

  createCategory: (data: unknown) => {
    return fetcher('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteCategory: (id: string) => {
    return fetcher(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Master Data - States
  getStates: () => {
    return fetcher('/states');
  },

  createState: (data: unknown) => {
    return fetcher('/states', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteState: (id: string) => {
    return fetcher(`/states/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Exams
  getExams: (params: { search?: string; limit?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return fetcher(`/exams?${query.toString()}`);
  },

  createExam: (data: unknown) => {
    return fetcher('/exams', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateExam: (id: string, data: unknown) => {
    return fetcher(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteExam: (id: string) => {
    return fetcher(`/exams/${id}`, {
      method: 'DELETE'
    });
  }
};
