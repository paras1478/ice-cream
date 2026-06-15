const { z } = require('zod');

const nutritionSchema = z.object({
  calories: z.number().min(0).optional(),
  // Accept both frontend keys (fat/carbs/sugar) and model keys (totalFat/totalCarbohydrates/sugars)
  fat: z.number().min(0).optional(),
  totalFat: z.number().min(0).optional(),
  saturatedFat: z.number().min(0).optional(),
  transFat: z.number().min(0).optional(),
  cholesterol: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  totalCarbohydrates: z.number().min(0).optional(),
  dietaryFiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sugars: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
}).optional();

const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional().nullable(),
  category: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid category ID'),
  flavor: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  nutritionFacts: nutritionSchema,
  images: z.array(z.string()).optional(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  // Accept weight as string (e.g. "500g") or number
  weight: z.union([z.number().positive(), z.string()]).optional().nullable(),
  servingSize: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

const updateProductSchema = createProductSchema.partial();

const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  flavor: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  sort: z.enum(['price', '-price', 'rating', '-rating', 'createdAt', '-createdAt', 'soldCount', '-soldCount']).optional().default('-createdAt'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
  inStock: z.enum(['true', 'false']).optional(),
});

const updateStockSchema = z.object({
  stock: z.number().int().min(0),
  operation: z.enum(['set', 'increment', 'decrement']).optional().default('set'),
});

module.exports = { createProductSchema, updateProductSchema, productQuerySchema, updateStockSchema };
