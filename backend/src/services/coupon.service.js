const Coupon = require('../models/Coupon');
const { NotFoundError, ConflictError, ApiError } = require('../utils/ApiError');

class CouponService {
  async getAll({ page = 1, limit = 20, isActive } = {}) {
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      Coupon.find(filter).populate('applicableCategories', 'name').skip(skip).limit(limit).sort('-createdAt'),
      Coupon.countDocuments(filter),
    ]);
    return { coupons, total };
  }

  async getByCode(code) {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).populate('applicableCategories', 'name');
    if (!coupon) throw new NotFoundError('Coupon');
    return coupon;
  }

  async validate(code, subtotal, userId) {
    const coupon = await this.getByCode(code);
    const validity = coupon.isValid();
    if (!validity.valid) throw new ApiError(400, validity.message);

    if (subtotal < coupon.minOrderAmount) {
      throw new ApiError(400, `Minimum order amount is $${coupon.minOrderAmount.toFixed(2)}`);
    }

    // Check if user already used coupon
    const usedByUser = coupon.usedBy.some((u) => u.user.toString() === userId.toString());
    if (usedByUser) throw new ApiError(400, 'You have already used this coupon');

    const discountAmount = coupon.calculateDiscount(subtotal);
    return { coupon, discountAmount };
  }

  async create(data) {
    const exists = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (exists) throw new ConflictError('Coupon code already exists');
    return Coupon.create(data);
  }

  async update(id, data) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!coupon) throw new NotFoundError('Coupon');
    return coupon;
  }

  async delete(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new NotFoundError('Coupon');
  }

  async recordUsage(code, userId, orderId) {
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      {
        $inc: { usedCount: 1 },
        $push: { usedBy: { user: userId, usedAt: new Date(), orderId } },
      }
    );
  }
}

module.exports = new CouponService();
