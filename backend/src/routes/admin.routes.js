const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getSalesReport, getRevenueReport,
  getTopProducts, getCustomerStats, getInventoryReport,
  getLowStockProducts, getActivityLogs,
} = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard statistics
 *     responses:
 *       200:
 *         description: Dashboard stats including revenue, orders, products, customers
 */
router.get('/stats', adminAuth, getDashboardStats);

/**
 * @swagger
 * /admin/sales-report:
 *   get:
 *     tags: [Admin]
 *     summary: Get daily sales report
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 1y]
 *           default: 30d
 */
router.get('/sales-report', adminAuth, getSalesReport);

/**
 * @swagger
 * /admin/revenue-report:
 *   get:
 *     tags: [Admin]
 *     summary: Get revenue breakdown by category
 */
router.get('/revenue-report', adminAuth, getRevenueReport);

/**
 * @swagger
 * /admin/top-products:
 *   get:
 *     tags: [Admin]
 *     summary: Get top selling products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/top-products', adminAuth, getTopProducts);

/**
 * @swagger
 * /admin/customer-stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get customer statistics and growth
 */
router.get('/customer-stats', adminAuth, getCustomerStats);

/**
 * @swagger
 * /admin/inventory:
 *   get:
 *     tags: [Admin]
 *     summary: Get full inventory report
 */
router.get('/inventory', adminAuth, getInventoryReport);

/**
 * @swagger
 * /admin/low-stock:
 *   get:
 *     tags: [Admin]
 *     summary: Get low stock products
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/low-stock', adminAuth, getLowStockProducts);

/**
 * @swagger
 * /admin/activity-logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get activity logs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 */
router.get('/activity-logs', adminAuth, getActivityLogs);

module.exports = router;
