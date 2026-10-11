import { api } from '../shared/utils/api.js';
export const salesApi = { overview: () => api.get('/analytics/overview'), orders: () => api.get('/orders') };
