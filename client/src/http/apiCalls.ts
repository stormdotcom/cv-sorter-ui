// apiMethods.ts

import { API_URLS } from '@/http/apiUrls';

import { STORAGE_KEYS } from '@/constants';
import { makeApiCall, makeFileUploadCall } from './axiosClient';
// Helper function to make API requests

// Auth-related API calls
export const loginApi = (data: any) => makeApiCall(API_URLS.auth.login, data);
export const registerApi = (data: any) => makeApiCall(API_URLS.auth.register, data);


export const fileUpload =  (formData: any) => makeFileUploadCall(API_URLS.file.upload, formData)
export const listResumes =  (data: any) => makeApiCall(API_URLS.file.resumes, data);
export const listCandidateResumesByJobId =  (jobId: string) => makeApiCall(API_URLS.job.listCandidateResumesByJobId(jobId));
export const searchResumes =  (data: any) => makeApiCall(API_URLS.file.search, data)
export const sortFiles =  (data: any) => makeApiCall(API_URLS.file.search, data)
export const getFileApi = (id: string) => makeApiCall(API_URLS.file.get(id));
export const deleteFileApi = (id: string) => makeApiCall(API_URLS.file.delete(id));
export const archiveFileApi = (id: string) => makeApiCall(API_URLS.file.archive(id));
export const unarchiveFileApi = (id: string) => makeApiCall(API_URLS.file.unarchive(id));

export const createJobApi = (data: any) => makeApiCall(API_URLS.job.create, data);
export const listJobsApi = (data: any) => makeApiCall(API_URLS.job.list, data);
export const getJobApi = (id: string) => makeApiCall(API_URLS.job.get(id));
export const updateJobApi = (id: string, data: any) => makeApiCall(API_URLS.job.update(id), data);
export const archiveJobApi = (id: string) => makeApiCall(API_URLS.job.archive(id));
export const unarchiveJobApi = (id: string) => makeApiCall(API_URLS.job.unarchive(id));
export const refetchResumeListApi = (jobId: string) => makeApiCall(API_URLS.job.refetchResumeList(jobId));

export const getDashboardStatsApi = () => makeApiCall(API_URLS.dashboard.stats);

export const listCandidatesApi = (params: { limit?: number } = {}) => makeApiCall(API_URLS.candidate.list, params);
export const getCandidateApi = (id: string) => makeApiCall(API_URLS.candidate.get(id));
export const updateCandidateApi = (id: string, data: any) => makeApiCall(API_URLS.candidate.update(id), data);





