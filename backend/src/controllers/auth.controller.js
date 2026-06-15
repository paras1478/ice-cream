const authService = require('../services/auth.service');
const { generateTokenPair } = require('../utils/generateTokens');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getReqMeta = (req) => ({
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});

/**
 * @route POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body, getReqMeta(req));
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return ApiResponse.created(res, 'Account created successfully', {
    user,
    accessToken: tokens.accessToken,
  });
});

/**
 * @route POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password, getReqMeta(req));
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return ApiResponse.success(res, 'Login successful', {
    user,
    accessToken: tokens.accessToken,
  });
});

/**
 * @route GET /api/v1/auth/google/callback
 */
const googleCallback = asyncHandler(async (req, res) => {
  const tokens = await generateTokenPair(req.user, getReqMeta(req));
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;
  res.redirect(redirectUrl);
});

/**
 * @route POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  return ApiResponse.success(res, 'Logged out successfully');
});

/**
 * @route POST /api/v1/auth/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }
  const result = await authService.refreshToken(token, getReqMeta(req));
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return ApiResponse.success(res, 'Token refreshed', {
    accessToken: result.accessToken,
    user: result.user,
  });
});

/**
 * @route POST /api/v1/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return ApiResponse.success(res, 'If an account exists with this email, a password reset link has been sent.');
});

/**
 * @route POST /api/v1/auth/reset-password/:token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const user = await authService.resetPassword(req.params.token, req.body.password);
  return ApiResponse.success(res, 'Password reset successfully');
});

/**
 * @route GET /api/v1/auth/verify-email/:token
 */
const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);
  return ApiResponse.success(res, 'Email verified successfully');
});

/**
 * @route GET /api/v1/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'User profile', req.user);
});

module.exports = { register, login, googleCallback, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, getMe };
