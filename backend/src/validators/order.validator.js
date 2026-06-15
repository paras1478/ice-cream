const { z } = require('zod');

const addressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(3).max(20),
  country: z.string().min(2).max(60).default('US'),
});

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product ID'),
      quantity: z.number().int().positive().max(99),
    })
  ).min(1, 'Order must have at least one item'),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(['stripe', 'cod']).default('stripe'),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled']),
  note: z.string().max(500).optional(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

const cancelOrderSchema = z.object({
  reason: z.string().min(5).max(500).optional().default('Customer requested cancellation'),
});

module.exports = { createOrderSchema, updateOrderStatusSchema, cancelOrderSchema };
