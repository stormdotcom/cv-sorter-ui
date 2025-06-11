import axios, { AxiosError } from "axios";

// Set up Axios instance with baseURL
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<any> {
  try {
    const response = await api.request({
      method,
      url,
      data,
      headers: data instanceof FormData ? {} : { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
}
