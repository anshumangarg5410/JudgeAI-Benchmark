/**
 * ModelProbe — Centralized API Service Layer
 * All HTTP calls go through here. Points at JSON Server (port 3001).
 */
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Response helper ──
const handleResponse = (res) => res.data;

const handleError = (error) => {
  const message =
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
    const users = await client
      .get('/users', { params: { email: email.toLowerCase() } })
      .then(handleResponse)
      .catch(handleError);
    const user = users[0];
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    // Don't return the password to the frontend
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async register(userData) {
    const existing = await client
      .get('/users', { params: { email: userData.email.toLowerCase() } })
      .then(handleResponse);
    if (existing.length > 0) {
      throw new Error('An account with this email already exists');
    }
    const res = await client
      .post('/users', {
        ...userData,
        email: userData.email.toLowerCase(),
        role: 'viewer',
      })
      .then(handleResponse)
      .catch(handleError);
    const { password: _, ...safeUser } = res;
    return safeUser;
  },
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
    return client.put('/settings/1', { id: 1, ...data }).then(handleResponse).catch(handleError);
  },
};

export default client;
