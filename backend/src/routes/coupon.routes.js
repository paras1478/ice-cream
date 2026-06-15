const express = require('express');
const router = express.Router();
const {
  createCoupon, getAllCoupons, getCouponByCode, validateCoupon,
  updateCoupon, deleteCoupon, applyCoupon,
} = require('../controllers/coupon.controller');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { createCouponSchema, updateCouponSchema, applyCouponSchema } = require('../validators/coupon.validator');

/**
 * @swagger
 * /coupons/validate:
 *   get:
 *     tags: [Coupons]
 *     summary: Validate a coupon code
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: subtotal
 *         required: true
 *         schema:
 *           type: number
 */
router.get('/validate', authenticate, validateCoupon);

/**
 * @swagger
 * /coupons/apply:
 *   post:
 *     tags: [Coupons]
 *     summary: Apply a coupon to get discount amount
 */
router.post('/apply', authenticate, validate(applyCouponSchema), applyCoupon);

/**
 * @swagger
 * /coupons/{code}:
 *   get:
 *     tags: [Coupons]
 *     summary: Get coupon by code (admin)
 */
router.get('/:code', adminAuth, getCouponByCode);

/**
 * @swagger
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: Get all coupons (admin)
 */
router.get('/', adminAuth, getAllCoupons);

/**
 * @swagger
 * /coupons:
 *   post:
 *     tags: [Coupons]
 *     summary: Create a coupon (admin)
 */
router.post('/', adminAuth, validate(createCouponSchema), createCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     tags: [Coupons]
 *     summary: Update coupon (admin)
 */
router.put('/:id', adminAuth, validate(updateCouponSchema), updateCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     tags: [Coupons]
 *     summary: Delete coupon (admin)
 */
router.delete('/:id', adminAuth, deleteCoupon);

module.exports = router;
