const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

class AnalyticsService {
  /**
   * Get daily sales data for a period
   * @param {string} period - '7d', '30d', '90d', '1y'
   */
  async getSalesData(period = '30d') {
    const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return data.map((d) => ({
      date: d._id,
      revenue: Math.round(d.revenue * 100) / 100,
      orders: d.orders,
      avgOrderValue: Math.round(d.avgOrderValue * 100) / 100,
    }));
  }

  /**
   * Get revenue breakdown by category
   */
  async getRevenueByCategory() {
    return Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productData',
        },
      },
      { $unwind: { path: '$productData', preserveNullAndEmpty: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'productData.category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: '$categoryData._id',
          category: { $first: '$categoryData.name' },
          revenue: { $sum: '$items.total' },
          itemsSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(limit = 10) {
    return Product.find({ isActive: true })
      .populate('category', 'name')
      .sort({ soldCount: -1 })
      .limit(limit)
      .select('name images price soldCount rating reviewCount stock category');
  }

  /**
   * Get customer growth by month
   */
  async getCustomerGrowth() {
    return User.aggregate([
      { $match: { role: 'customer' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          newCustomers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);
  }

  /**
   * Get order status breakdown
   */
  async getOrderStatusBreakdown() {
    return Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayRevenueResult,
      totalRevenueResult,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      totalCoupons,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      require('../models/Product').countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      require('../models/Coupon').countDocuments({ isActive: true }),
    ]);

    return {
      todayRevenue: todayRevenueResult[0]?.total || 0,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalCustomers,
      totalCoupons,
    };
  }

  /**
   * Get customer statistics
   */
  async getCustomerStats() {
    const [total, verified, active, withOrders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', isEmailVerified: true }),
      User.countDocuments({ role: 'customer', isActive: true }),
      Order.distinct('user').then((ids) => ids.length),
    ]);

    return { total, verified, active, withOrders, conversionRate: total ? (withOrders / total * 100).toFixed(1) : 0 };
  }
}

module.exports = new AnalyticsService();
