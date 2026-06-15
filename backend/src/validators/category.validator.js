const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };
