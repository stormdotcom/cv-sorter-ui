// apiFileClient.ts

import { STORAGE_KEYS } from "../constants";

const API_BASE_URL = 'http://localhost:8000/api/v1';  // Adjust to your server's URL

// Utility function to handle the API request for file uploads
async function apiFileRequest(
  url: string,
  method: string = 'POST',
  file: Blob,
  additionalData: Record<string, any> = {}
): Promise<Response> {
  try {
    const formData = new FormData();
    // Append the file to the form data (audio, image, etc.)
    formData.append('file', file);

    // Optionally, append any other data needed for the request
    for (const [key, value] of Object.entries(additionalData)) {
      formData.append(key, value);
    }

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);  // Get the token if available

    const headers: Record<string, string> = {
      // Authorization header if token exists
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const requestOptions: RequestInit = {
      method: method,
      headers: headers,
      body: formData,
    };

    // Making the fetch request to the server
    const res = await fetch(`${API_BASE_URL}${url}`, requestOptions);

    if (!res.ok) {
      // Handle errors by parsing response text
      const responseBody = await res.text();
      throw new Error(`${res.status}: ${responseBody}`);
    }

    return res;  // Return the response object
  } catch (error: any) {
    // Catching any network or unexpected errors
    console.error("File upload failed:", error);
    throw error;
  }
}

// Export the function so it can be used elsewhere in the app
export default apiFileRequest;
