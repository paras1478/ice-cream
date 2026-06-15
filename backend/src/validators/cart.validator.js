const { z } = require('zod');

const addToCartSchema = z.object({
  productId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid product ID'),
  quantity: z.number().int().positive().max(99).default(1),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(99),
});

module.exports = { addToCartSchema, updateCartItemSchema };
