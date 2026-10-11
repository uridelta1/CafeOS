import { api } from '../shared/utils/api.js';
export const productsApi = { list: (params) => api.get('/products', { params }), create: (payload) => api.post('/products', payload), update: (id, payload) => api.patch(`/products/${id}`, payload), remove: (id) => api.delete(`/products/${id}`) };
