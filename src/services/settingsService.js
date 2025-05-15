import api from '../utils/api';

export const getCompanySettings = () => api.get('/setting');
export const getDefaultCompanySetting = () => api.get('/setting/default');
export const updateCompanySetting = (id, data) => api.put(`/setting/${id}`, data);
export const patchCompanySetting = (id, data) => api.patch(`/setting/${id}`, data);
export const addContactNumber = (id, number) => api.post(`/setting/${id}/contact`, { number });
export const removeContactNumber = (id, number) => api.delete(`/setting/${id}/contact/${encodeURIComponent(number)}`);
