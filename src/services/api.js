// API Service - automatically switches between real API and mock API
import axios from 'axios';
import { mockApi, isMockMode } from './mockApi';

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api";

// Create axios instance for real API
const apiClient = axios.create({
  baseURL: API_BASE
});

// API wrapper that switches between real and mock
export const api = {
  // Auth
  login: async (credentials) => {
    if (isMockMode()) return mockApi.login(credentials);
    return axios.post(API_BASE + "/login", credentials);
  },

  register: async (data) => {
    if (isMockMode()) return mockApi.register(data);
    return axios.post(API_BASE + "/register", data);
  },

  loginSocial: async (provider, token) => {
    if (isMockMode()) return mockApi.loginSocial(provider, token);
    return axios.post(API_BASE + "/login/social", { provider, token });
  },

  forgotPassword: async (email) => {
    if (isMockMode()) return mockApi.forgotPassword(email);
    return axios.post(API_BASE + "/forgot-password", { email });
  },

  resetPassword: async (data) => {
    if (isMockMode()) return mockApi.resetPassword(data);
    return axios.post(API_BASE + "/reset-password", data);
  },

  // User
  getUser: async (token) => {
    if (isMockMode()) return mockApi.getUser();
    return axios.get(API_BASE + "/user", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  updateProfile: async (formData, token) => {
    if (isMockMode()) return mockApi.updateProfile(formData);
    return axios.post(API_BASE + "/profile/update", formData, {
      headers: {
        Authorization: "Bearer " + token,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updatePassword: async (data, token) => {
    if (isMockMode()) return mockApi.updatePassword(data);
    return axios.post(API_BASE + "/profile/password", data, {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // Ceramic Lines
  getCeramicLines: async (params = {}) => {
    if (isMockMode()) return mockApi.getCeramicLines(params);
    const query = new URLSearchParams(params).toString();
    return axios.get(API_BASE + "/ceramic-lines" + (query ? "?" + query : ""));
  },

  // Prediction
  predict: async (formData, token) => {
    if (isMockMode()) return mockApi.predict(formData);
    return axios.post(API_BASE + "/predict", formData, {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // History
  getHistory: async (token) => {
    if (isMockMode()) return mockApi.getHistory();
    return axios.get(API_BASE + "/history", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // Transactions
  getTransactions: async (token) => {
    if (isMockMode()) return mockApi.getTransactions();
    return axios.get(API_BASE + "/transactions", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // AI Chat
  chat: async (question, token) => {
    if (isMockMode()) return mockApi.chat(question);
    return axios.post(API_BASE + "/ai/chat", { question }, {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // Payment
  createPayment: async (data, token) => {
    if (isMockMode()) return mockApi.createPayment(data);
    return axios.post(API_BASE + "/payments/create", data, {
      headers: { Authorization: "Bearer " + token }
    });
  },

  // Admin
  getAdminStats: async (token) => {
    if (isMockMode()) return mockApi.getAdminStats();
    return axios.get(API_BASE + "/admin/stats", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  getAdminUsers: async (token) => {
    if (isMockMode()) return mockApi.getAdminUsers();
    return axios.get(API_BASE + "/admin/users", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  getAdminCeramics: async (token) => {
    if (isMockMode()) return mockApi.getAdminCeramics();
    return axios.get(API_BASE + "/admin/ceramics", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  getAdminPayments: async (token) => {
    if (isMockMode()) return mockApi.getAdminPayments();
    return axios.get(API_BASE + "/admin/payments", {
      headers: { Authorization: "Bearer " + token }
    });
  },

  getAdminPredictions: async (token) => {
    if (isMockMode()) return mockApi.getAdminPredictions();
    return axios.get(API_BASE + "/admin/predictions", {
      headers: { Authorization: "Bearer " + token }
    });
  }
};

// Export API_BASE for backward compatibility
export { API_BASE };

// Export mock mode checker
export { isMockMode };
