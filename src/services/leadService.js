import api from "../utils/api.js";

export class LeadService {  async getLeads(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'All Statuses') queryParams.append('status', params.status);
      if (params.source && params.source !== 'All Sources') queryParams.append('source', params.source);
      if (params.priority && params.priority !== 'All Priorities') queryParams.append('priority', params.priority);
      
      const queryString = queryParams.toString();
      const url = `/lead/get-leads${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
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
  async getUserLeads(params = {}) {
    try {
      // Build query string from provided parameters
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'All Statuses') queryParams.append('status', params.status);
      if (params.source && params.source !== 'All Sources') queryParams.append('source', params.source);
      if (params.priority && params.priority !== 'All Priorities') queryParams.append('priority', params.priority);
      
      const queryString = queryParams.toString();
      const url = `/lead/get-user-leads${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching leads ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch leads.";
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

  async getActivities(page = 1, limit = 10) {
    try {
      const response = await api.get(`/lead/activities?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("ERROR :: fetching activities ::", error.response?.data || error.message);
      throw error.response?.data || "Failed to fetch activities.";
    }
  }

  async getFollowups(page = 1, limit = 10) {
    try {
      const response = await api.get(`/lead/followups?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("ERROR :: fetching followups ::", error.response?.data || error.message);
      throw error.response?.data || "Failed to fetch followups.";
    }
  }
}

const leadService = new LeadService();
export default leadService;