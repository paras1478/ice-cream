const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { lowStockAlertTemplate } = require('../utils/emailTemplates');
const logger = require('../config/logger');

class InventoryService {
  async getLowStockProducts(threshold = 10) {
    return Product.find({ stock: { $lte: threshold }, isActive: true })
      .populate('category', 'name')
      .sort({ stock: 1 })
      .select('name sku stock images price category');
  }

  async getAllInventory({ page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find({ isActive: true })
        .populate('category', 'name')
        .select('name sku stock price images category soldCount')
        .sort('stock')
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ isActive: true }),
    ]);
    return { products, total };
  }

  async sendLowStockAlert(threshold = 10) {
    const lowStock = await this.getLowStockProducts(threshold);
    if (lowStock.length === 0) return;

    const admins = await User.find({ role: 'admin', isActive: true }).select('email name');
    const tpl = lowStockAlertTemplate({ products: lowStock });

    for (const admin of admins) {
      await sendEmail({ to: admin.email, ...tpl });
    }

    logger.info(`Low stock alert sent to ${admins.length} admins for ${lowStock.length} products`);
  }
}

module.exports = new InventoryService();
