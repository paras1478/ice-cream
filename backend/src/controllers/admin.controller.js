const analyticsService = require('../services/analytics.service');
const inventoryService = require('../services/inventory.service');
const ActivityLog = require('../models/ActivityLog');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { buildPaginationMeta } = require('../middleware/pagination');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  return ApiResponse.success(res, 'Dashboard stats', stats);
});

const getSalesReport = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  const data = await analyticsService.getSalesData(period);
  return ApiResponse.success(res, 'Sales report', { period, data });
});

const getRevenueReport = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRevenueByCategory();
  return ApiResponse.success(res, 'Revenue report', data);
});

const getTopProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const products = await analyticsService.getTopSellingProducts(limit);
  return ApiResponse.success(res, 'Top products', products);
});

const getCustomerStats = asyncHandler(async (req, res) => {
  const [stats, growth] = await Promise.all([
    analyticsService.getCustomerStats(),
    analyticsService.getCustomerGrowth(),
  ]);
  return ApiResponse.success(res, 'Customer stats', { ...stats, monthlyGrowth: growth });
});

const getInventoryReport = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { products, total } = await inventoryService.getAllInventory({ page, limit });
  return ApiResponse.paginated(res, 'Inventory report', products, buildPaginationMeta(total, Number(page), Number(limit)));
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;
  const products = await inventoryService.getLowStockProducts(threshold);
  return ApiResponse.success(res, 'Low stock products', { threshold, count: products.length, products });
});

const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, action, userId } = req.query;
  const filter = {};
  if (action) filter.action = action;
  if (userId) filter.user = userId;

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    ActivityLog.countDocuments(filter),
  ]);

  return ApiResponse.paginated(res, 'Activity logs', logs, buildPaginationMeta(total, Number(page), Number(limit)));
});

module.exports = { getDashboardStats, getSalesReport, getRevenueReport, getTopProducts, getCustomerStats, getInventoryReport, getLowStockProducts, getActivityLogs };
