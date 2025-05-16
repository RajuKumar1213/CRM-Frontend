import api from "../utils/api.js";

export class WhatsappService {
  async createWhatsappTemplate(templateData) {
    try {
      const response = await api.post("/watsapp/templates", templateData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: creating WhatsApp template ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to create WhatsApp template.";
    }
  }

  async getWhatsappTemplates() {
    try {
      const response = await api.get("/watsapp/templates");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching WhatsApp templates ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch WhatsApp templates.";
    }
  }

  async getWhatsappTemplate(templateId) {
    try {
      const response = await api.get(`/watsapp/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching WhatsApp template ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch WhatsApp template.";
    }
  }

  async updateWhatsappTemplate(id, templateData) {
    try {
      const response = await api.patch(`/watsapp/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating WhatsApp template ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to update WhatsApp template.";
    }
  }

  async deleteWhatsappTemplate(id) {
    try {
      const response = await api.delete(`/watsapp/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: deleting WhatsApp template ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to delete WhatsApp template.";
    }
  }

  async sendWhatsappMessage(templateId, leadId) {
    try {
      const response = await api.post(`/watsapp/messages/${leadId}`, {templateId}
      );
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: sending WhatsApp message ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to send WhatsApp message.";
    }
  }

  async getMessageHistory(leadId) {
    try {
      const response = await api.get(`/watsapp/messages/history/${leadId}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching WhatsApp message history ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch WhatsApp message history.";
    }
  }

  async addPhoneNumber(phoneData) {
    try {
      const response = await api.post("/watsapp/numbers", phoneData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: adding phone number ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to add phone number.";
    }
  }

  async getPhoneNumbers() {
    try {
      const response = await api.get("/watsapp/numbers");
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching phone numbers ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch phone numbers.";
    }
  }

  async updatePhoneNumber(id, phoneData) {
    try {
      const response = await api.patch(`/watsapp/numbers/${id}`, phoneData);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: updating phone number ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to update phone number.";
    }
  }

  async deletePhoneNumber(id) {
    try {
      const response = await api.delete(`/watsapp/numbers/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: deleting phone number ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to delete phone number.";
    }
  }  async getWhatsappStats(days) {
    try {
      const response = await api.get(`/watsapp/stats${days ? `?days=${days}` : ''}`);
      return response.data;
    } catch (error) {
      console.error(
        "ERROR :: fetching WhatsApp stats ::",
        error.response?.data || error.message
      );
      throw error.response?.data || "Failed to fetch WhatsApp stats.";
    }
  }
}

const whatsappService = new WhatsappService();
export default whatsappService;