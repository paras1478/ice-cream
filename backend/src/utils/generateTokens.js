const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const RefreshToken = require('../models/RefreshToken');

/**
 * Generate JWT access token
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate and store refresh token
 */
const generateRefreshToken = async (userId, { ipAddress, userAgent } = {}) => {
  const token = uuidv4();
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  const expiresAt = new Date(Date.now() + parseDuration(expiresIn));

  await RefreshToken.create({ user: userId, token, expiresAt, ipAddress, userAgent });
  return token;
};

/**
 * Generate both tokens
 */
const generateTokenPair = async (user, reqMeta = {}) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, reqMeta);
  return { accessToken, refreshToken };
};

/**
 * Parse duration string to milliseconds
 */
const parseDuration = (duration) => {
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 86400000);
};

module.exports = { generateAccessToken, generateRefreshToken, generateTokenPair };
