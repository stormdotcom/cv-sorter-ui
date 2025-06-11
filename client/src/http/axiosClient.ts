import { STORAGE_KEYS } from "../constants";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { AxiosError, AxiosRequestConfig, Method } from "axios";
import { navigate } from "wouter/use-browser-location";
import _ from "lodash";
import queryString from 'query-string';

type Endpoint = {
  method: Method;
  url: string;
  headers?: Record<string, string>;
};

export const makeApiCall = async (
  endpoint: {
    url: string;
    method: string;
  },
  data?: Record<string, any>
) => {
  let url = endpoint.url;
  const method = endpoint.method.toLowerCase();

  // for GET requests, turn `data` into a query-string
  const config: any = { method };

  if (method === 'get' && data) {
    // use query-string to drop nulls and build the ?foo=bar&baz=qux
    const qs = queryString.stringify(data, { skipNull: true });
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  } else if (data) {
    // for POST/PUT/etc, keep sending in the body
    config.data = data;
  }

  try {
    const response = await api(url, config);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast({
        title: "Bad Request",
        description: error.response?.data?.message ?? "An unexpected error occurred",
        variant: "destructive",
      });
    } else if (error instanceof AxiosError && error.response?.status === 401) {
      navigate("/login");
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      if (error.response?.data?.code === 4444) {
        toast({
          title: "Session",
          description: "Updating user session",
          variant: "default",
        });
      } else {
        toast({
          title: "Unauthorized",
          description: error.response?.data?.message ?? "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } else if (error instanceof AxiosError && error.response?.status === 429) {
      toast({
        title: "Too Many Requests",
        description: error.response?.data?.message ?? "You have made too many requests. Please try again later.",
        variant: "destructive",
      });
    } else if (error instanceof AxiosError && error.response?.status === 403) {
      toast({
        title: "Forbidden",
        description: error.response?.data?.message ?? "You do not have permission to access this resource.",
        variant: "destructive",
      });
    } else if (error instanceof Error) {
      const axiosError = error as AxiosError;
      toast({
        title: "API Error",
        description: _.get(axiosError, "response.data.message") || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("API error:", error);
      throw error;
    } else {
      console.error("API error:", error);
      throw new Error("An unexpected error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const makeFileUploadCall = async (endpoint: any, formData: FormData) => {
  try {
    const response = await api(endpoint.url,  {
      method: endpoint.method,
      data: formData,  // Sending FormData as the request body
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    // Handle file upload specific errors and API errors
    if (error instanceof AxiosError && error.response?.status === 400) {
      toast({
        title: "Bad Request",
        description: error.response?.data?.message ?? 'Bad Request. Please check the data you uploaded.',
        variant: "destructive"
      });
    } else if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_ID);

      toast({
        title: "Unauthorized",
        description: error.response?.data?.message ?? 'You need to be authenticated to upload files.',
        variant: "destructive"
      });
    } else if (error instanceof AxiosError && error.response?.status === 403) {
      toast({
        title: "Forbidden",
        description: error.response?.data?.message ?? 'You do not have permission to upload files.',
        variant: "destructive"
      });
    } else if (error instanceof AxiosError && error.response?.status === 404) {
      toast({
        title: "Not Found",
        description: 'The file upload endpoint was not found.',
        variant: "destructive"
      });
    } else if (error instanceof AxiosError && error.response?.status === 500) {
      toast({
        title: "Server Error",
        description: 'There was an issue on the server. Please try again later.',
        variant: "destructive"
      });
    } else if (error instanceof Error) {
      // General error handling
      toast({
        title: "File Upload Error",
        description: error.message ?? 'An unexpected error occurred while uploading the file.',
        variant: "destructive"
      });
      console.error('File upload error:', error);
      throw error; // Rethrow error for further handling
    } else {
      // Fallback error handling
      console.error('File upload error:', error);
      throw new Error('An unexpected error occurred during file upload');
    }
  }
};
