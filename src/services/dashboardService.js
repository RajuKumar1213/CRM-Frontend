import api from '../utils/api';

/**
 * Service for admin dashboard related API calls
 */

/**
 * Get admin dashboard statistics
 * @param {string} timePeriod Optional time period for statistics (default: 'month')
 * @returns {Promise} Promise with dashboard statistics data
 */
export const getDashboardStats = async (timePeriod = 'month') => {
  try {
    const response = await api.get('/setting/admin/dashboard-stats', { 
      params: { timePeriod } 
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get user performance statistics
 * @param {Object} params Optional params like timePeriod, startDate and endDate
 * @returns {Promise} Promise with user performance data
 */
export const getUserPerformance = async (params = {}) => {
  try {
    const response = await api.get('/setting/admin/user-performance', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user performance:', error);
    throw error;
  }
};

/**
 * Get company health metrics
 * @returns {Promise} Promise with company health data
 */
export const getCompanyHealth = async () => {
  try {
    const response = await api.get('/setting/admin/company-health');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching company health:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getUserPerformance,
  getCompanyHealth
};
