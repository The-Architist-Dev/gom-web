import apiClient from '../../lib/apiClient';

export const adminApi = {
  // Dashboard
  dashboard: () => apiClient.get('/admin/dashboard'),

  // Users
  users: () => apiClient.get('/admin/users'),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),

  // Ceramic lines
  ceramics: () => apiClient.get('/admin/ceramic-lines'),
  createCeramic: (data) => apiClient.post('/admin/ceramic-lines', data),
  updateCeramic: (id, data) => apiClient.put(`/admin/ceramic-lines/${id}`, data),
  deleteCeramic: (id) => apiClient.delete(`/admin/ceramic-lines/${id}`),

  // Payments
  payments: () => apiClient.get('/admin/payments'),

  // Predictions
  predictions: () => apiClient.get('/admin/predictions'),
};

