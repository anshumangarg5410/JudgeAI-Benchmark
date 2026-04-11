/**
 * ModelProbe — Centralized API Service Layer
 * All HTTP calls go through here. Points to Node Express backend.
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 300000, 
});

// ── Auth Interceptor ──
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('judgeai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response helper ──
const handleResponse = (res) => res.data;

const handleError = (error) => {
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred';
  console.error('[API Error]', message);
  throw new Error(message);
};

// ════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════
export const authApi = {
  async login(email, password) {
    const res = await client.post('/users/login', { email, password }).then(handleResponse).catch(handleError);
    return res; // returns { _id, name, email, role, token }
  },

  async register(userData) {
    const res = await client.post('/users/register', userData).then(handleResponse).catch(handleError);
    return res;
  },

  async getMe() {
    return client.get('/users/me').then(handleResponse).catch(handleError);
  }
};

// ════════════════════════════════════════════════════════════════
// MODELS
// ════════════════════════════════════════════════════════════════
export const modelsApi = {
  getAll() {
    return client.get('/models').then(handleResponse).catch(handleError);
  },

  getById(id) {
    return client.get(`/models/${id}`).then(handleResponse).catch(handleError);
  },

  create(model) {
    return client.post('/models', model).then(handleResponse).catch(handleError);
  },

  update(id, data) {
    return client.put(`/models/${id}`, data).then(handleResponse).catch(handleError);
  },

  delete(id) {
    return client.delete(`/models/${id}`).then(handleResponse).catch(handleError);
  },
};

// ════════════════════════════════════════════════════════════════
// TESTCASES
// ════════════════════════════════════════════════════════════════
export const testApi = {
  getTestcases: () => client.get('/testcases').then(handleResponse).catch(handleError),
  createTestcase: (data) => client.post('/testcases', data).then(handleResponse).catch(handleError),
  updateTestcase: (id, data) => client.put(`/testcases/${id}`, data).then(handleResponse).catch(handleError),
  deleteTestcase: (id) => client.delete(`/testcases/${id}`).then(handleResponse).catch(handleError),
  generateTestcases: (category, count) => client.post('/testcases/generate', { category, count }).then(handleResponse).catch(handleError),
};

// ════════════════════════════════════════════════════════════════
// RUNS
// ════════════════════════════════════════════════════════════════
export const runsApi = {
  getAll() {
    return client.get('/runs').then(handleResponse).catch(handleError);
  },

  getById(id) {
    return client.get(`/runs/${id}`).then(handleResponse).catch(handleError);
  },

  create(run) {
    return client.post('/runs', run).then(handleResponse).catch(handleError);
  },

  delete(id) {
    return client.delete(`/runs/${id}`).then(handleResponse).catch(handleError);
  },
};

// ════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════
export const settingsApi = {
  get() {
    return client.get('/settings/1').then(handleResponse).catch(handleError);
  },

  update(data) {
    return client.put('/settings/1', data).then(handleResponse).catch(handleError);
  },
};

// ════════════════════════════════════════════════════════════════
// EVALUATE
// ════════════════════════════════════════════════════════════════
export const evaluateApi = {
  run(payload) {
    return client.post('/evaluate', payload).then(handleResponse).catch(handleError);
  }
};

export default client;
