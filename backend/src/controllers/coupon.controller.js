const couponService = require('../services/coupon.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.create(req.body);
  return ApiResponse.created(res, 'Coupon created', coupon);
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive } = req.query;
  const { coupons, total } = await couponService.getAll({ page, limit, isActive });
  return ApiResponse.paginated(res, 'Coupons retrieved', coupons, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) });
});

const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await couponService.getByCode(req.params.code);
  return ApiResponse.success(res, 'Coupon retrieved', coupon);
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.query;
  const { coupon, discountAmount } = await couponService.validate(code, Number(subtotal), req.user._id);
  return ApiResponse.success(res, 'Coupon is valid', {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
    description: coupon.description,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponService.update(req.params.id, req.body);
  return ApiResponse.success(res, 'Coupon updated', coupon);
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await couponService.delete(req.params.id);
  return ApiResponse.success(res, 'Coupon deleted');
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const { coupon, discountAmount } = await couponService.validate(code, subtotal, req.user._id);
  return ApiResponse.success(res, 'Coupon applied', { discountAmount, couponCode: coupon.code });
});

module.exports = { createCoupon, getAllCoupons, getCouponByCode, validateCoupon, updateCoupon, deleteCoupon, applyCoupon };
