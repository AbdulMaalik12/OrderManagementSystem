const Order = require('../models/Order');
const { success, error } = require('../utils/apiResponse');
const generateOrderNumber = require('../utils/generateOrderNumber');

/**
 * POST /api/orders
 * Create a new order for the authenticated user.
 */
const createOrder = async (req, res, next) => {
  try {
    const orderNumber = await generateOrderNumber(req.user._id);

    const order = await Order.create({
      ...req.body,
      userId: req.user._id,
      orderNumber,
    });

    return success(res, { order }, 201, 'Order created successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders
 * Get paginated, filterable, searchable orders for the authenticated user.
 */
const getOrders = async (req, res, next) => {
  try {
    const { page, limit, status, search, sortBy, sortOrder } = req.query;

    // Build query — always scoped to the authenticated user
    const query = { userId: req.user._id };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by customer name, phone, or order number
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query with pagination
    const [orders, total] = await Promise.all([
      Order.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success(res, {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/stats
 * Get dashboard statistics for the authenticated user.
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [stats] = await Order.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Shipped'] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] },
          },
          deliveredRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Delivered'] },
                { $multiply: ['$price', '$quantity'] },
                0,
              ],
            },
          },
        },
      },
    ]);

    // Return zeros if no orders exist yet
    const defaultStats = {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      deliveredRevenue: 0,
    };

    // Get recent orders for the dashboard
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return success(res, {
      stats: stats || defaultStats,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:id
 * Get a single order by ID (scoped to authenticated user).
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    return success(res, { order });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/orders/:id
 * Update an order (scoped to authenticated user).
 */
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    return success(res, { order }, 200, 'Order updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/orders/:id/status
 * Quick status update for an order.
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    return success(res, { order }, 200, `Order status updated to ${req.body.status}`);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/orders/:id
 * Delete an order (scoped to authenticated user).
 */
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    return success(res, null, 200, 'Order deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getDashboardStats,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
