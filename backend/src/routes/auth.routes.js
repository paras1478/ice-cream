const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  register, login, googleCallback, logout, refreshToken,
  forgotPassword, resetPassword, verifyEmail, getMe,
} = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,
} = require('../validators/auth.validator');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password123
 *     responses:
 *       201:
 *         description: Account created successfully
 *       409:
 *         description: Email already exists
 */
router.post('/register', authLimiter, validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns access token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, validate(loginSchema), login);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Initiate Google OAuth login
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback
 *     security: []
 *     responses:
 *       302:
 *         description: Redirect to frontend with tokens
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  googleCallback
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and invalidate refresh token
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset email
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 */
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password using token
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     tags: [Auth]
 *     summary: Verify email address
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get('/me', authenticate, getMe);

module.exports = router;
