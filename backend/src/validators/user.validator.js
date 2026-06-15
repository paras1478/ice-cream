const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

const updateUserRoleSchema = z.object({
  role: z.enum(['customer', 'admin']),
});

const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().optional(),
  role: z.enum(['customer', 'admin']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sort: z.string().optional().default('-createdAt'),
});

module.exports = { updateProfileSchema, changePasswordSchema, updateUserRoleSchema, userQuerySchema };
