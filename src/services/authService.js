import api from "../utils/api.js";

export class AuthService {
  constructor() {
    // Setup token refresh interceptor
    this.setupTokenRefresh();
  }

  // Set up interceptor to handle token refresh
  setupTokenRefresh() {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is due to expired token (status 401) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              
              if (response && response.data) {
                // Store new tokens
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                
                // Update the Authorization header
                this.setAuthHeader(response.data.accessToken);
                
                // Retry the original request
                return api(originalRequest);
              }
            }
          } catch (refreshError) {
            // If refresh fails, log out the user
            console.error("Token refresh failed:", refreshError);
            this.clearAuthData();
            window.location.href = "/login"; // Force redirect to login
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Set Authorization header for API requests
  setAuthHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // Clear all authentication data
  clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    this.setAuthHeader(null);
  }

  async refreshToken(refreshToken) {
    try {
      const response = await api.post("/user/refresh-token", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("ERROR :: refreshing token ::", error);
      throw error;
    }
  }

  async registerUser(userData) {
    try {
      const response = await api.post("/user/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: registering user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to register user." };
    }
  }

  async loginUser(credentials) {
    try {
      const response = await api.post("/user/login", credentials);
      
      // Set authorization header for future requests
      if (response.data.data.accessToken) {
        this.setAuthHeader(response.data.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: logging in user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to login user." };
    }
  }

  async logoutUser() {
    try {
      const response = await api.post("/user/logout");
      
      // Clear auth data regardless of API response
      this.clearAuthData();
      
      return response.data;
    } catch (error) {
      // Even if API fails, clear local auth data
      this.clearAuthData();
      
      console.error(
        "ERROR :: logging out user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to logout user." };
    }
  }

  async getUser() {
    try {
      // Set token from localStorage if not already in headers
      const token = localStorage.getItem("accessToken");
      if (token && !api.defaults.headers.common['Authorization']) {
        this.setAuthHeader(token);
      }
      
      const response = await api.get("/user/get-user");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching user details ::",
        error.response?.data || error.message
      );
      
      // If unauthorized, clear token to prevent further failed attempts
      if (error.response?.status === 401) {
        this.setAuthHeader(null);
      }
      
      throw error.response?.data || { message: "Failed to fetch user details." };
    }
  }

  async updateAccountDetails(details) {
    try {
      const response = await api.patch("/user/update-account-details", details);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating account details ::",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to update account details." };
    }
  }

  async updatePassword(passwordData) {
    try {
      const response = await api.patch("/user/update-password", passwordData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating password ::",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: "Failed to update password." };
    }
  }

  // Check if the user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  }
}

const authService = new AuthService();
export default authService;

