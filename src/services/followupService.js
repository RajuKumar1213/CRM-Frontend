import api from "../utils/api.js";

export class FollowUpService {
  async getFollowUps() {
    try {
      const response = await api.get("/followup/get-all");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching follow-ups ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch follow-ups.";
    }
  }

  async getFollowUp(leadId) {
    try {
      const response = await api.get(`/followup/${leadId}/fetch`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching follow-up ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch follow-up.";
    }
  }

  async createFollowUp(leadId, followUpData) {
    try {
      const response = await api.post(`/followup/${leadId}/create`, followUpData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: creating follow-up ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to create follow-up.";
    }
  }

  async updateFollowUp(followUpId, followUpData) {
    try {
      const response = await api.patch(`/followup/${followUpId}/update`, followUpData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating follow-up ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to update follow-up.";
    }
  }

  async deleteFollowUp(followUpId) {
    try {
      const response = await api.delete(`/followup/${followUpId}/delete`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: deleting follow-up ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to delete follow-up.";
    }
  }

  async completeFollowUp(followUpId) {
    try {
      const response = await api.patch(`/followup/${followUpId}/complete`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: completing follow-up ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to complete follow-up.";
    }
  }

  async getTodayFollowUps() {
    try {
      const response = await api.get("/followup/fetch-today-followups");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching today's follow-ups ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch today's follow-ups.";
    }
  }

  async getOverdueFollowUps() {
    try {
      const response = await api.get("/followup/fetch-overdue-followups");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching overdue follow-ups ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch overdue follow-ups.";
    }
  }

  async getUpcomingFollowUps() {
    try {
      const response = await api.get("/followup/fetch-upcomming-followups");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching upcoming follow-ups ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch upcoming follow-ups.";
    }
  }

  async getLeadFollowUps(leadId) {
    try {
      const response = await api.get(`/followup/lead/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching lead follow-ups ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch lead follow-ups.";
    }
  }
}

const followUpService = new FollowUpService();
export default followUpService;