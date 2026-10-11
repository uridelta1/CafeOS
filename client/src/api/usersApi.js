import { api } from '../shared/utils/api.js';
export const usersApi = { list: () => api.get('/users'), create: (payload) => api.post('/users', payload) };
