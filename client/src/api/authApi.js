import { api } from '../shared/utils/api.js';
export const authApi = { login: (credentials) => api.post('/auth/login', credentials), register: (payload) => api.post('/auth/register', payload) };
