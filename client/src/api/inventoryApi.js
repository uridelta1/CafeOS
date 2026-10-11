import { api } from '../shared/utils/api.js';
export const inventoryApi = { list: () => api.get('/products'), adjust: (id, stock) => api.patch(`/products/${id}`, { stock }) };
