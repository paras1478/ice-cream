const orderService = require('../services/order.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  return ApiResponse.created(res, 'Order placed successfully', order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.pagination || { page: 1, limit: 10 };
  const { orders, pagination } = await orderService.getMyOrders(req.user._id, { page, limit });
  return ApiResponse.paginated(res, 'Orders retrieved', orders, pagination);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role === 'admin');
  return ApiResponse.success(res, 'Order retrieved', order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await orderService.cancelOrder(req.params.id, req.user._id, reason, req.user.role === 'admin');
  return ApiResponse.success(res, 'Order cancelled', order);
});

// Admin controllers
const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.pagination || { page: 1, limit: 20 };
  const { orders, pagination } = await orderService.getAllOrders({ ...req.query, page, limit });
  return ApiResponse.paginated(res, 'All orders', orders, pagination);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status, {
    note: req.body.note,
    trackingNumber: req.body.trackingNumber,
    estimatedDelivery: req.body.estimatedDelivery,
    updatedBy: req.user._id,
  });
  return ApiResponse.success(res, 'Order status updated', order);
});

const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats();
  return ApiResponse.success(res, 'Order statistics', stats);
});

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, getOrderStats };
