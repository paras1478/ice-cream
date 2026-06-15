const Order = require('../models/Order');

/**
 * Generate unique order number in format ICE-YYYY-XXXXXX
 */
const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  const padded = String(count + 1).padStart(6, '0');
  return `ICE-${year}-${padded}`;
};

module.exports = generateOrderNumber;
