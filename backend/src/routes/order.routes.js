const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus, getOrderStats,
} = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { pagination } = require('../middleware/pagination');
const { createOrderSchema, updateOrderStatusSchema, cancelOrderSchema } = require('../validators/order.validator');

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *                 enum: [stripe, cod]
 *               couponCode:
 *                 type: string
 */
router.post('/', authenticate, validate(createOrderSchema), createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get current user's orders
 */
router.get('/', authenticate, pagination, getMyOrders);

/**
 * @swagger
 * /orders/admin/stats:
 *   get:
 *     tags: [Orders]
 *     summary: Get order statistics (admin)
 */
router.get('/admin/stats', adminAuth, getOrderStats);

/**
 * @swagger
 * /orders/admin/all:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 */
router.get('/admin/all', adminAuth, pagination, getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 */
router.get('/:id', authenticate, getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   delete:
 *     tags: [Orders]
 *     summary: Cancel an order
 */
router.delete('/:id/cancel', authenticate, validate(cancelOrderSchema), cancelOrder);

/**
 * @swagger
 * /orders/admin/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (admin)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               note:
 *                 type: string
 *               trackingNumber:
 *                 type: string
 */
router.patch('/admin/:id/status', adminAuth, validate(updateOrderStatusSchema), updateOrderStatus);

module.exports = router;
