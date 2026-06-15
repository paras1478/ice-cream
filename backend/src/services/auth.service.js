const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateTokenPair, generateAccessToken } = require('../utils/generateTokens');
const { AuthenticationError, ConflictError, NotFoundError, ApiError } = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const { welcomeTemplate, passwordResetTemplate } = require('../utils/emailTemplates');
const logger = require('../config/logger');

class AuthService {
  async register(data, reqMeta = {}) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new ConflictError('An account with this email already exists');

    const user = await User.create(data);

    // Send welcome email
    const verifyToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
    const tpl = welcomeTemplate({ name: user.name, verifyUrl });
    await sendEmail({ to: user.email, ...tpl });

    const tokens = await generateTokenPair(user, reqMeta);
    return { user, tokens };
  }

  async login(email, password, reqMeta = {}) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AuthenticationError('Invalid email or password');
    }
    if (!user.isActive) throw new AuthenticationError('Account has been deactivated');

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const tokens = await generateTokenPair(user, reqMeta);
    return { user, tokens };
  }

  async refreshToken(tokenStr, reqMeta = {}) {
    const stored = await RefreshToken.findOne({ token: tokenStr });
    if (!stored || !stored.isActive()) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Rotate token
    stored.isRevoked = true;
    stored.replacedBy = 'rotated';
    await stored.save();

    const user = await User.findById(stored.user);
    if (!user || !user.isActive) throw new AuthenticationError('User not found or inactive');

    const accessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = await require('../utils/generateTokens').generateRefreshToken(user._id, reqMeta);

    return { accessToken, refreshToken: newRefreshToken, user };
  }

  async logout(tokenStr) {
    if (tokenStr) {
      await RefreshToken.updateOne({ token: tokenStr }, { isRevoked: true });
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists
      return true;
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const tpl = passwordResetTemplate({ name: user.name, resetUrl });

    const sent = await sendEmail({ to: user.email, ...tpl });
    if (!sent) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiry = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(500, 'Failed to send password reset email');
    }

    return true;
  }

  async resetPassword(tokenStr, newPassword) {
    const hashed = crypto.createHash('sha256').update(tokenStr).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, 'Password reset token is invalid or expired');

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    // Revoke all refresh tokens
    await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });

    return user;
  }

  async verifyEmail(tokenStr) {
    const hashed = crypto.createHash('sha256').update(tokenStr).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, 'Email verification token is invalid or expired');

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return user;
  }
}

module.exports = new AuthService();
