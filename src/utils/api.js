import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1`,
  withCredentials: true, // Ensure cookies are sent with requests
  timeout: 10000, // Set a timeout for requests (10 seconds)
});

// Add a request interceptor to automatically include the Authorization header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Note: Response interceptor for token refresh is now handled in authService.js
// This allows better centralization of auth logic

// Add a response interceptor for general error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors for debugging
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config.url,
        method: error.config.method
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", {
        request: error.request,
        endpoint: error.config.url,
        method: error.config.method
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Request Error:", error.message);
    }

    // Handle specific error statuses (except 401 which is handled in authService)
    if (error.response) {
      const status = error.response.status;
      
      if (status === 403) {
        console.error("Permission denied. You do not have access to this resource.");
      } else if (status === 404) {
        console.error(`Resource not found: ${error.config.url}`);
      } else if (status === 500) {
        console.error("Server error. Please try again later.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
