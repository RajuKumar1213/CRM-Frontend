import api from "../utils/api.js";

export class LeadService {
  async getLeads() {
    try {
      const response = await api.get("/lead/get-leads");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching leads ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch leads.";
    }
  }

  async getLead(leadId) {
    try {
      const response = await api.get(`/lead/get-lead/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching lead ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch lead.";
    }
  }

  async getUserLeads() {
    try {
      const response = await api.get(`/lead/get-user-leads`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching lead ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch lead.";
    }
  }

  async createLead(leadData) {
    try {
      const response = await api.post("/lead/create", leadData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: creating lead ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to create lead.";
    }
  }

  async updateLead(leadId, leadData) {
    try {
      const response = await api.patch(`/lead/update/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating lead ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to update lead.";
    }
  }

  async deleteLead(leadId) {
    try {
      const response = await api.delete(`/lead/delete/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: deleting lead ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to delete lead.";
    }
  }

  async getLeadFromWhatsapp(webhookData) {
    try {
      const response = await api.post("/lead/webhook", webhookData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: processing WhatsApp webhook ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to process WhatsApp webhook.";
    }
  }

  async getActivities() {
    try {
      const response = await api.get("/lead/activities");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching activites. ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch activites..";
    }
  }
}

const leadService = new LeadService();
export default leadService;