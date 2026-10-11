import { api } from '../shared/utils/api.js';
export const ordersApi = { list: (params) => api.get('/orders', { params }), create: (payload) => api.post('/orders', payload), update: (id, payload) => api.patch(`/orders/${id}`, payload) };
