const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_-]{3,20}$/, 'Coupon code must be 3-20 alphanumeric characters'],
    },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      },
    ],
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: [true, 'Expiry date is required'] },
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
);

// code has unique:true already
couponSchema.index({ isActive: 1, expiresAt: 1 });

couponSchema.methods.isValid = function () {
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (this.expiresAt < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (subtotal) {
  if (subtotal < this.minOrderAmount) return 0;
  let discount = this.type === 'percentage' ? (subtotal * this.value) / 100 : this.value;
  if (this.maxDiscount && discount > this.maxDiscount) discount = this.maxDiscount;
  return Math.min(discount, subtotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
