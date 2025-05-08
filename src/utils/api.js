import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_HOST_URL}/api/v1`,
  withCredentials: true, // Ensure cookies are sent with requests
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
    // Handle errors in setting up the request
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling token refreshing
api.interceptors.response.use(
  (response) => response, // Return the response as is if no error
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401, meaning the token is expired
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refreshToken="))
        ?.split("=")[1];

      if (refreshToken) {
        try {
          // Request to refresh the token
          const refreshResponse = await axios.post(
            `${
              import.meta.env.VITE_BACKEND_HOST_URL
            }/api/v1/users/refresh-token`,
            { refreshToken },
            { withCredentials: true } // Ensure cookies are sent with the request
          );

          const newAccessToken = refreshResponse.data.accessToken;

          // Store the new access token in localStorage
          localStorage.setItem("accessToken", newAccessToken);

          // Update the Authorization header with the new access token
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          return api(originalRequest);
        } catch (err) {
          console.error("Failed to refresh token:", err);
          // Redirect to login or show an error message
          window.location.href = "/login";
          return Promise.reject(err);
        }
      } else {
        // No refresh token available, redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // Reject the error if token refresh fails or if it's not a 401 error
    return Promise.reject(error);
  }
);

export default api;
