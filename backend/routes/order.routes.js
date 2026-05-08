const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createOrder,
  getOrders,
  getDashboardStats,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/order.controller');
const {
  createOrderSchema,
  updateOrderSchema,
  updateStatusSchema,
  querySchema,
} = require('../validators/order.validator');

// All order routes require authentication
router.use(auth);

// Dashboard stats — must come before /:id to avoid route conflict
router.get('/stats', getDashboardStats);

// CRUD operations
router.get('/', validate(querySchema, 'query'), getOrders);
router.post('/', validate(createOrderSchema), createOrder);
router.get('/:id', getOrderById);
router.put('/:id', validate(updateOrderSchema), updateOrder);
router.patch('/:id/status', validate(updateStatusSchema), updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
