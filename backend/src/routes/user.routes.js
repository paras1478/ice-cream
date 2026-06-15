const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, changePassword, deleteAccount,
  getAllUsers, getUserById, updateUserRole, deactivateUser,
} = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { validate } = require('../middleware/validate');
const { pagination } = require('../middleware/pagination');
const { updateProfileSchema, changePasswordSchema, updateUserRoleSchema } = require('../validators/user.validator');

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: User profile with wishlist
 */
router.get('/profile', authenticate, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 */
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
 */
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     tags: [Users]
 *     summary: Deactivate user account
 */
router.delete('/account', authenticate, deleteAccount);

// Admin routes
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 */
router.get('/', adminAuth, pagination, getAllUsers);
router.get('/:id', adminAuth, getUserById);
router.put('/:id/role', adminAuth, validate(updateUserRoleSchema), updateUserRole);
router.put('/:id/deactivate', adminAuth, deactivateUser);

module.exports = router;
