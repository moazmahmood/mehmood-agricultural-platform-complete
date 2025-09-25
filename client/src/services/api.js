import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
};

// Farms API
export const farmsAPI = {
  getFarms: () => api.get('/farms'),
  getFarmById: (id) => api.get(`/farms/${id}`),
  createFarm: (farmData) => api.post('/farms', farmData),
  updateFarm: (id, farmData) => api.put(`/farms/${id}`, farmData),
  deleteFarm: (id) => api.delete(`/farms/${id}`),
};

// Crops API
export const cropsAPI = {
  getCrops: (params) => api.get('/crops', { params }),
  getCropById: (id) => api.get(`/crops/${id}`),
  createCrop: (cropData) => api.post('/crops', cropData),
  updateCrop: (id, cropData) => api.put(`/crops/${id}`, cropData),
  deleteCrop: (id) => api.delete(`/crops/${id}`),
  addMonitoring: (id, monitoringData) => api.post(`/crops/${id}/monitoring`, monitoringData),
  addFertilizer: (id, fertilizerData) => api.post(`/crops/${id}/fertilizer`, fertilizerData),
  addPesticide: (id, pesticideData) => api.post(`/crops/${id}/pesticide`, pesticideData),
  addExpense: (id, expenseData) => api.post(`/crops/${id}/expense`, expenseData),
};

// Weather API
export const weatherAPI = {
  getCurrentWeather: (params) => api.get('/weather/current', { params }),
  getWeatherForecast: (params) => api.get('/weather/forecast', { params }),
  getWeatherAlerts: (params) => api.get('/weather/alerts', { params }),
  getHistoricalWeather: (params) => api.get('/weather/historical', { params }),
};

// Analytics API
export const analyticsAPI = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard'),
  getCropAnalytics: (params) => api.get('/analytics/crops', { params }),
  getFinancialAnalytics: (params) => api.get('/analytics/financial', { params }),
  getYieldAnalytics: (params) => api.get('/analytics/yield', { params }),
};

// Inventory API
export const inventoryAPI = {
  getInventoryItems: (params) => api.get('/inventory', { params }),
  getInventoryItemById: (id) => api.get(`/inventory/${id}`),
  createInventoryItem: (itemData) => api.post('/inventory', itemData),
  updateInventoryItem: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  deleteInventoryItem: (id) => api.delete(`/inventory/${id}`),
  recordUsage: (id, usageData) => api.post(`/inventory/${id}/usage`, usageData),
};

export default api;