import { api } from '../shared/utils/api.js';
export const dashboardApi = { overview: () => api.get('/analytics/overview'), products: () => api.get('/products'), orders: () => api.get('/orders') };
