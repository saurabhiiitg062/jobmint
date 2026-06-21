const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    return fetcher(`/jobs?${query.toString()}`, { next: { revalidate: 300 } });
  },

  getJobBySlug: (slug: string) => {
    return fetcher(`/jobs/slug/${slug}`, { next: { revalidate: 300 } });
  },

  getQuickStats: () => {
    return fetcher('/jobs/stats', { next: { revalidate: 300 } });
  },

  // Public Blogs
  getBlogs: (params: { search?: string; limit?: number; page?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return fetcher(`/blogs?${query.toString()}`, { next: { revalidate: 300 } });
  },

  getBlogBySlug: (slug: string) => {
    return fetcher(`/blogs/slug/${slug}`, { next: { revalidate: 300 } });
  },

  // Admin auth
  login: (credentials: any) => {
    return fetcher('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getDashboardStats: () => {
    return fetcher('/admin/stats', { cache: 'no-store' });
  },

  // Admin Job Operations
  createJob: (jobData: any) => {
    return fetcher('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  updateJob: (id: string, jobData: any) => {
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
  createBlog: (blogData: any) => {
    return fetcher('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  },

  updateBlog: (id: string, blogData: any) => {
    return fetcher(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  },

  deleteBlog: (id: string) => {
    return fetcher(`/blogs/${id}`, {
      method: 'DELETE'
    });
  }
};
