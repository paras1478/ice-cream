const { z } = require('zod');

const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().regex(/^[A-Z0-9_-]+$/, 'Code must be alphanumeric'),
  description: z.string().max(200).optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minOrderAmount: z.number().min(0).optional().default(0),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  expiresAt: z.string().datetime(),
  applicableCategories: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).optional(),
});

const updateCouponSchema = createCouponSchema.partial();

const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  subtotal: z.number().positive('Subtotal must be positive'),
});

module.exports = { createCouponSchema, updateCouponSchema, applyCouponSchema };
