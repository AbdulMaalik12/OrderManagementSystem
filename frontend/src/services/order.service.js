import api from './api';

/**
 * Order service methods.
 */
const orderService = {
  /**
   * Get paginated orders with optional filters.
   */
  getOrders: async (params = {}) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  /**
   * Get a single order by ID.
   */
  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  /**
   * Create a new order.
   */
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  /**
   * Update an existing order.
   */
  updateOrder: async (id, orderData) => {
    const { data } = await api.put(`/orders/${id}`, orderData);
    return data;
  },

  /**
   * Update only the status of an order.
   */
  updateOrderStatus: async (id, status) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  /**
   * Delete an order.
   */
  deleteOrder: async (id) => {
    const { data } = await api.delete(`/orders/${id}`);
    return data;
  },

  /**
   * Get dashboard statistics.
   */
  getDashboardStats: async () => {
    const { data } = await api.get('/orders/stats');
    return data;
  },
};

export default orderService;
