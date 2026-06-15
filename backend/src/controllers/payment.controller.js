const paymentService = require('../services/payment.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const result = await paymentService.createPaymentIntent(orderId, req.user._id);
  return ApiResponse.success(res, 'Payment intent created', result);
});

const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  const order = await paymentService.confirmPayment(paymentIntentId);
  return ApiResponse.success(res, 'Payment confirmed', order);
});

const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  await paymentService.processWebhook(req.body, signature);
  return res.json({ received: true });
});

const refundPayment = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const result = await paymentService.refundPayment(req.params.orderId, reason);
  return ApiResponse.success(res, 'Refund processed', result);
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const payments = await paymentService.getPaymentHistory(req.user._id, { page, limit });
  return ApiResponse.success(res, 'Payment history', payments);
});

module.exports = { createPaymentIntent, confirmPayment, stripeWebhook, refundPayment, getPaymentHistory };
