/**
 * Order status constants and their display properties.
 */
export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    color: 'bg-warning-50 text-warning-600 border-warning-500',
    dotColor: 'bg-warning-500',
  },
  Confirmed: {
    label: 'Confirmed',
    color: 'bg-primary-50 text-primary-600 border-primary-500',
    dotColor: 'bg-primary-500',
  },
  Shipped: {
    label: 'Shipped',
    color: 'bg-purple-50 text-purple-600 border-purple-500',
    dotColor: 'bg-purple-500',
  },
  Delivered: {
    label: 'Delivered',
    color: 'bg-success-50 text-success-600 border-success-500',
    dotColor: 'bg-success-500',
  },
  Cancelled: {
    label: 'Cancelled',
    color: 'bg-danger-50 text-danger-600 border-danger-500',
    dotColor: 'bg-danger-500',
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
