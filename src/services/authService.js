import api from "../utils/api.js";

export class AuthService {
  async registerUser(userData) {
    try {
      const response = await api.post("/user/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: registering user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to register user.";
    }
  }

  async loginUser(credentials) {
    try {
      const response = await api.post("/user/login", credentials);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: logging in user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to login user.";
    }
  }

  async logoutUser() {
    try {
      const response = await api.post("/user/logout");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: logging out user ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to logout user.";
    }
  }

  async getUser() {
    try {
      const response = await api.get("/user/get-user");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching user details ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch user details.";
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
      throw error.response?.data || "Failed to update account details.";
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
      throw error.response?.data || "Failed to update password.";
    }
  }
}

const authService = new AuthService();
export default authService;