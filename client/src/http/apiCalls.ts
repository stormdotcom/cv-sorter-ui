// apiMethods.ts

import { API_URLS } from './apiUrls'; // Importing the API constants

import { makeApiCall, makeFileUploadCall } from './axiosClient';
import { STORAGE_KEYS } from '../constants';
// Helper function to make API requests

// Auth-related API calls
export const loginApi = (data: any) => makeApiCall(API_URLS.auth.login, data);
export const registerApi = (data: any) => makeApiCall(API_URLS.auth.register, data);


export const fileUpload =  (formData: any) => makeFileUploadCall(API_URLS.file.upload, formData)
export const listFiles =  () => makeApiCall(API_URLS.file.list)
export const sortFiles =  (data: any) => makeApiCall(API_URLS.file.sort, data)

export const createJobApi = (data: any) => makeApiCall(API_URLS.job.create, data);
export const listJobsApi = () => makeApiCall(API_URLS.job.list);
export const getJobApi = (id: string) => makeApiCall(API_URLS.job.get(id));
export const updateJobApi = (id: string, data: any) => makeApiCall(API_URLS.job.update(id), data);
export const archiveJobApi = (id: string) => makeApiCall(API_URLS.job.archive(id));




