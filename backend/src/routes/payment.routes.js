const express = require('express');
const router = express.Router();
const {
  createPaymentIntent, confirmPayment, stripeWebhook, refundPayment, getPaymentHistory,
} = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

/**
 * @swagger
 * /payments/create-intent:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Stripe payment intent for an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId]
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns clientSecret for Stripe
 */
router.post('/create-intent', authenticate, createPaymentIntent);

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     tags: [Payments]
 *     summary: Confirm payment after client-side completion
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 */
router.post('/confirm', authenticate, confirmPayment);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Stripe webhook endpoint (raw body required)
 *     security: []
 */
router.post('/webhook', stripeWebhook); // Raw body middleware set in server.js

/**
 * @swagger
 * /payments/{orderId}/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Refund a payment (admin)
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/:orderId/refund', adminAuth, refundPayment);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment history for current user
 */
router.get('/history', authenticate, getPaymentHistory);

module.exports = router;
