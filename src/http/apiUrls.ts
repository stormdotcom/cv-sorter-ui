import { API_URL_DEV } from '../constants';

export type ApiEndpoint = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiresAuth?: boolean;
};

export const API_URLS = {
  auth: {
    login: {
      url: `/auth/login`,
      method: 'POST',
      requiresAuth: false,
    },
    register: {
      url: `/auth/register`,
      method: 'POST',
      requiresAuth: false,
    },
    guest: {
      url: `/auth/guest`,
      method: 'POST',
      requiresAuth: false,
    },
  
    refresh: {
      url: `/api/auth/refresh`,
      method: 'POST',
      requiresAuth: false,
    },
  },
  user: {
    profile: {
      url: `/api/users/me`,
      method: 'GET',
      requiresAuth: true,
    },
    update: {
      url: `/api/users/profile`,
      method: 'PUT',
      requiresAuth: true,
    },
    delete: {
      url: `/api/users/delete`,
      method: 'DELETE',
      requiresAuth: true,
    },
  },
  file: {
    upload: {
      url: `file/upload`,
      method: 'POST',
      requiresAuth: true,
    },
    uploadMultiple: {
      url: `file/upload/bulk`,
      method: 'POST',
      requiresAuth: true,
    },
    resumes: {
      url: `file/resumes`,
      method: 'GET',
      requiresAuth: true,
    },
    search: {
      url: `file/search/resumes`,
      method: 'POST',
      requiresAuth: true,
    },
    get: (id: string): ApiEndpoint => ({
      url: `file/${id}`,
      method: 'GET',
      requiresAuth: true,
    }),
    delete: (id: string): ApiEndpoint => ({
      url: `file/resume/${id}`,
      method: 'DELETE',
      requiresAuth: true,
    }),
    archive: (id: string): ApiEndpoint => ({
      url: `file/${id}/archive`,
      method: 'POST',
      requiresAuth: true,
    }),
    unarchive: (id: string): ApiEndpoint => ({
      url: `file/${id}/unarchive`,
      method: 'POST',
      requiresAuth: true,
    }),
  },
  job: {
    create: {
      url: `job`,
      method: 'POST',
      requiresAuth: true,
    },
    list: {
      url: `job`,
      method: 'GET',
      requiresAuth: true,
    },
    refetchResumeList: (jobId: string): ApiEndpoint => ({
      url: `job/${jobId}/candidates/rank`,
      method: 'PUT',
      requiresAuth: true,
    }),
    listCandidateResumesByJobId: (jobId: string): ApiEndpoint => ({
      url: `job/${jobId}/candidates/rank`,
      method: 'GET',
      requiresAuth: true,
    }),
    get: (id: string): ApiEndpoint => ({  
      url: `job/${id}`,
      method: 'GET',
      requiresAuth: true,
    }),
    update: (id: string): ApiEndpoint => ({
      url: `job/${id}`,
      method: 'PUT',
      requiresAuth: true,
    }),
    archive: (id: string): ApiEndpoint => ({
      url: `job/${id}/archive`,
      method: 'PATCH',
      requiresAuth: true,
    }),
    unarchive: (id: string): ApiEndpoint => ({
      url: `job/${id}/unarchive`,
      method: 'PATCH',
      requiresAuth: true,
    }),
  },
  candidate: {
    list: {
      url: `candidate`,
      method: 'GET',
      requiresAuth: true,
    },
    get: (id: string): ApiEndpoint => ({
      url: `candidate/${id}`,
      method: 'GET',
      requiresAuth: true,
    }),
    update: (id: string): ApiEndpoint => ({
      url: `candidate/${id}`,
      method: 'PUT',
      requiresAuth: true,
    }),
   
  },
  dashboard: {
    stats: {
      url: `common/dashboard/stats`,
      method: 'GET',
      requiresAuth: true,
    },
  },
 
  admin: {
    dashboard: {
      url: `/api/admin/dashboard`,
      method: 'GET',
      requiresAuth: true,
    },
    users: {
      url: `/api/admin/users`,
      method: 'GET',
      requiresAuth: true,
    },
    userById: (id: string): ApiEndpoint => ({
      url: `/api/admin/users/${id}`,
      method: 'GET',
      requiresAuth: true,
    }),
    tokenUsage: {
      url: `/api/usage/token/:userId`,
      method: 'GET',
      requiresAuth: true,
    },
 
    logs: {
      url: `/api/admin/logs`,
      method: 'GET',
      requiresAuth: true,
    },
    blockedUser: {
      url: `/api/admin/users/unblock/:id`,
      method: 'GET',
      requiresAuth: true,
    },
    blockUser: {
      url: `/api/admin/users/block/:id`,
      method: 'GET',
      requiresAuth: true,
    },
  },
} as const;
