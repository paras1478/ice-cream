const TAX_RATE = 0.08; // 8%
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5.99;

/**
 * Calculate all order totals
 * @param {Array} items - [{price, quantity}]
 * @param {number} discountAmount - Coupon discount
 * @returns {Object} {subtotal, discountAmount, taxAmount, shippingFee, total}
 */
const calculateOrderTotal = (items, discountAmount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const shippingFee = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.round((discountedSubtotal + taxAmount + shippingFee) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount,
    shippingFee,
    total,
  };
};

module.exports = calculateOrderTotal;
