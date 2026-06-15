const { getStripe } = require('../config/stripe');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { NotFoundError, ApiError } = require('../utils/ApiError');
const logger = require('../config/logger');

class PaymentService {
  async createPaymentIntent(orderId, userId) {
    const stripe = getStripe();
    if (!stripe) throw new ApiError(503, 'Payment service unavailable');

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new NotFoundError('Order');
    if (order.paymentStatus === 'paid') throw new ApiError(400, 'Order already paid');

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { orderId: orderId.toString(), userId: userId.toString(), orderNumber: order.orderNumber },
      description: `Ice Cream Store Order ${order.orderNumber}`,
    });

    order.stripePaymentIntentId = intent.id;
    await order.save();

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id, amount: order.total };
  }

  async confirmPayment(paymentIntentId) {
    const stripe = getStripe();
    if (!stripe) throw new ApiError(503, 'Payment service unavailable');

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') {
      throw new ApiError(400, `Payment not completed. Status: ${intent.status}`);
    }

    return this.handlePaymentSuccess(intent);
  }

  async handlePaymentSuccess(paymentIntent) {
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!order) {
      logger.error(`Order not found for PaymentIntent ${paymentIntent.id}`);
      return null;
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received', timestamp: new Date() });

    const chargeId = paymentIntent.latest_charge;
    if (chargeId) order.stripeChargeId = chargeId;

    await order.save();

    // Create payment record
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        user: order.user,
        order: order._id,
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: chargeId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        paymentMethod: paymentIntent.payment_method,
      },
      { upsert: true, new: true }
    );

    return order;
  }

  async handlePaymentFailed(paymentIntent) {
    const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (!order) return null;

    order.paymentStatus = 'failed';
    order.statusHistory.push({ status: order.orderStatus, note: 'Payment failed', timestamp: new Date() });
    await order.save();

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'failed', user: order.user, order: order._id, stripePaymentIntentId: paymentIntent.id, amount: paymentIntent.amount / 100 },
      { upsert: true }
    );

    return order;
  }

  async refundPayment(orderId, reason = 'requested_by_customer') {
    const stripe = getStripe();
    if (!stripe) throw new ApiError(503, 'Payment service unavailable');

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    if (order.paymentStatus !== 'paid') throw new ApiError(400, 'Order is not paid');
    if (!order.stripeChargeId && !order.stripePaymentIntentId) throw new ApiError(400, 'No charge to refund');

    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      reason,
    });

    order.paymentStatus = 'refunded';
    order.statusHistory.push({ status: order.orderStatus, note: `Refunded: ${refund.id}` });
    await order.save();

    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: order.stripePaymentIntentId },
      { status: 'refunded', stripeRefundId: refund.id, refundedAmount: refund.amount / 100 }
    );

    return { refundId: refund.id, amount: refund.amount / 100, status: refund.status };
  }

  async getPaymentHistory(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    return Payment.find({ user: userId }).populate('order', 'orderNumber total').sort('-createdAt').skip(skip).limit(limit);
  }

  async processWebhook(rawBody, signature) {
    const stripe = getStripe();
    if (!stripe) throw new ApiError(503, 'Payment service unavailable');

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new ApiError(400, `Webhook signature verification failed: ${err.message}`);
    }

    logger.info(`Stripe webhook received: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        logger.info(`Charge refunded: ${event.data.object.id}`);
        break;
      default:
        logger.info(`Unhandled webhook event: ${event.type}`);
    }

    return event;
  }
}

module.exports = new PaymentService();
