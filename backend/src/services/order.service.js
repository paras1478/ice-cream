const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const couponService = require('./coupon.service');
const calculateOrderTotal = require('../utils/calculateOrderTotal');
const { NotFoundError, ApiError, ForbiddenError } = require('../utils/ApiError');
const { buildPaginationMeta } = require('../middleware/pagination');
const sendEmail = require('../utils/sendEmail');
const { orderConfirmationTemplate, orderStatusUpdateTemplate } = require('../utils/emailTemplates');

class OrderService {
  async createOrder(userId, data) {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode, notes } = data;

    // Validate and price items
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findOne({ _id: item.product, isActive: true });
      if (!product) throw new NotFoundError(`Product ${item.product}`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for "${product.name}". Available: ${product.stock}`);
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      });
    }

    // Handle coupon
    let discountAmount = 0;
    let appliedCouponCode = null;
    const subtotalForCoupon = orderItems.reduce((s, i) => s + i.total, 0);

    if (couponCode) {
      const { coupon, discountAmount: discount } = await couponService.validate(couponCode, subtotalForCoupon, userId);
      discountAmount = discount;
      appliedCouponCode = coupon.code;
    }

    const totals = calculateOrderTotal(orderItems, discountAmount);

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      couponCode: appliedCouponCode,
      notes,
      ...totals,
    });

    // Reserve stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Record coupon usage
    if (appliedCouponCode) {
      await couponService.recordUsage(appliedCouponCode, userId, order._id);
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [], couponCode: null, discountAmount: 0 });

    // Send confirmation email
    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    if (populatedOrder?.user) {
      const tpl = orderConfirmationTemplate({ name: populatedOrder.user.name, order: populatedOrder });
      await sendEmail({ to: populatedOrder.user.email, ...tpl });
    }

    return order;
  }

  async getMyOrders(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const filter = { user: userId };
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    return { orders, pagination: buildPaginationMeta(total, Number(page), Number(limit)) };
  }

  async getOrderById(orderId, userId, isAdmin = false) {
    const query = { _id: orderId };
    if (!isAdmin) query.user = userId;

    const order = await Order.findOne(query).populate('user', 'name email').populate('items.product', 'name slug images');
    if (!order) throw new NotFoundError('Order');
    return order;
  }

  async cancelOrder(orderId, userId, reason, isAdmin = false) {
    const query = { _id: orderId };
    if (!isAdmin) query.user = userId;

    const order = await Order.findOne(query);
    if (!order) throw new NotFoundError('Order');

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      throw new ApiError(400, `Cannot cancel an order that is ${order.orderStatus}`);
    }

    if (!isAdmin && order.orderStatus === 'out_for_delivery') {
      throw new ApiError(400, 'Cannot cancel an order that is out for delivery');
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus;
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    order.statusHistory.push({ status: 'cancelled', note: reason });
    await order.save();

    return order;
  }

  async getAllOrders({ page = 1, limit = 20, status, paymentStatus, search } = {}) {
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.orderNumber = new RegExp(search, 'i');

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(filter),
    ]);
    return { orders, pagination: buildPaginationMeta(total, Number(page), Number(limit)) };
  }

  async updateOrderStatus(orderId, status, { note, trackingNumber, estimatedDelivery, updatedBy } = {}) {
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) throw new NotFoundError('Order');

    order.orderStatus = status;
    order.statusHistory.push({ status, note, updatedBy, timestamp: new Date() });
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      // Increment soldCount
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { soldCount: item.quantity } });
      }
    }

    await order.save();

    // Email notification
    if (order.user) {
      const tpl = orderStatusUpdateTemplate({ name: order.user.name, order, newStatus: status });
      await sendEmail({ to: order.user.email, ...tpl });
    }

    return order;
  }

  async getOrderStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stats] = await Order.aggregate([
      {
        $facet: {
          todayRevenue: [
            { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ],
          totalRevenue: [
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ],
          totalOrders: [{ $count: 'count' }],
          pendingOrders: [{ $match: { orderStatus: 'pending' } }, { $count: 'count' }],
          statusBreakdown: [{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }],
        },
      },
    ]);

    return {
      todayRevenue: stats.todayRevenue[0]?.total || 0,
      totalRevenue: stats.totalRevenue[0]?.total || 0,
      totalOrders: stats.totalOrders[0]?.count || 0,
      pendingOrders: stats.pendingOrders[0]?.count || 0,
      statusBreakdown: stats.statusBreakdown,
    };
  }
}

module.exports = new OrderService();
