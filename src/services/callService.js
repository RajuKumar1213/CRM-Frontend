import api from "../utils/api";


const logCall = async (data) => {
  try {
    const response = await api.post('/api/v1/calls/log', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getCallHistory = async (leadId) => {
  try {    const response = await api.get(`/api/v1/calls/history/${leadId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getCallStats = async (userId) => {
  try {
    const response = await api.get(`/api/v1/calls/stats${userId ? `?userId=${userId}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default {
  logCall,
  getCallHistory,
  getCallStats,
};
