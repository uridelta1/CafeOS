import { api } from '../shared/utils/api.js';
export const settingsApi = { get: () => api.get('/settings'), update: (payload) => api.put('/settings', payload) };
