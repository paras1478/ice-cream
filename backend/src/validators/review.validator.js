const { z } = require('zod');

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

const updateReviewSchema = createReviewSchema.partial();

module.exports = { createReviewSchema, updateReviewSchema };
