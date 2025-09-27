import axios from 'axios';

// Check environment and set API URL
// In development, use direct connection to backend
// In production, use full API URL
const API_BASE_URL = 'https://global-backend-1-kvjo.onrender.com';
  
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for slow connections
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API so'rov: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('API_BASE_URL:', API_BASE_URL);
    return config;
  },
  (error) => {
    console.error('❌ API so\'rov xatosi:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API javob: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API javob xatosi:', error.response?.data || error.message);
    console.error('Full error:', error);
    
    // Timeout xatolari uchun maxsus xabar
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('API timeout xatosi - server javob bermadi');
      error.message = 'Server bilan aloqa vaqti tugadi. Iltimos qayta urinib ko\'ring.';
    }
    
    // Network xatolari uchun
    if (error.message === 'Network Error') {
      console.error('Network xatosi - server ishlamayotgan bo\'lishi mumkin');
      error.message = 'Server bilan aloqa yo\'q. Server ishga tushganligini tekshiring.';
    }
    
    return Promise.reject(error);
  }
);

// Subjects API
export const subjectsApi = {
  getAll: () => api.get('/api/subjects'),
  getById: (id) => api.get(`/api/subjects/${id}`),
  create: (data) => api.post('/api/subjects', data),
  update: (id, data) => api.put(`/api/subjects/${id}`, data),
  delete: (id) => api.delete(`/api/subjects/${id}`),
};

// Groups API
export const groupsApi = {
  getAll: (subjectId = null) => api.get('/api/groups', { params: { subjectId } }),
  getById: (id) => api.get(`/api/groups/${id}`),
  create: (data) => api.post('/api/groups', data),
  update: (id, data) => api.put(`/api/groups/${id}`, data),
  delete: (id) => api.delete(`/api/groups/${id}`),
};

// Students API
export const studentsApi = {
  getAll: (groupId = null, page = 1, limit = 10) => {
    const params = { page, limit };
    if (groupId) params.groupId = groupId;
    return api.get('/api/students', { params });
  },
  getById: (id) => api.get(`/api/students/${id}`),
  create: (formData) => api.post('/api/students', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/students/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/api/students/${id}`),
  permanentDelete: (id) => api.delete(`/api/students/${id}/permanent`),
};

// Test Results API
export const testResultsApi = {
  getAll: (filters = {}, page = 1, limit = 10) => {
    const params = { ...filters, page, limit };
    return api.get('/api/test-results', { params });
  },
  getById: (id) => api.get(`/api/test-results/${id}`),
  create: (data) => api.post('/api/test-results', data),
  update: (id, data) => api.put(`/api/test-results/${id}`, data),
  togglePublish: (id) => api.patch(`/api/test-results/${id}/publish`),
  delete: (id) => api.delete(`/api/test-results/${id}`),
};

// Achievements API
export const achievementsApi = {
  getAll: (filters = {}, page = 1, limit = 10) => {
    const params = { ...filters, page, limit };
    return api.get('/api/achievements', { params });
  },
  getById: (id) => api.get(`/api/achievements/${id}`),
  create: (formData) => api.post('/api/achievements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/achievements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  togglePublish: (id) => api.patch(`/api/achievements/${id}/publish`),
  delete: (id) => api.delete(`/api/achievements/${id}`),
};

// Graduates API
export const graduatesApi = {
  getAll: (filters = {}, page = 1, limit = 10) => {
    const params = { ...filters, page, limit };
    return api.get('/api/graduates', { params });
  },
  getById: (id) => api.get(`/api/graduates/${id}`),
  create: (formData) => api.post('/api/graduates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/api/graduates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  togglePublish: (id) => api.patch(`/api/graduates/${id}/publish`),
  delete: (id) => api.delete(`/api/graduates/${id}`),
};

export default api;