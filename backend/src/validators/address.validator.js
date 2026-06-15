const { z } = require('zod');

const createAddressSchema = z.object({
  label: z.enum(['home', 'work', 'other']).optional().default('home'),
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(3).max(20),
  country: z.string().min(2).max(60).default('US'),
  isDefault: z.boolean().optional().default(false),
});

const updateAddressSchema = createAddressSchema.partial();

module.exports = { createAddressSchema, updateAddressSchema };
