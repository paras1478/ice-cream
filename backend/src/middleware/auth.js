const passport = require('passport');
const { AuthenticationError, ForbiddenError } = require('../utils/ApiError');

/**
 * Authenticate JWT token - required
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      const message = info?.message || 'Authentication required';
      return next(new AuthenticationError(message));
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Authenticate JWT token - optional (doesn't fail if no token)
 */
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    req.user = user || null;
    next();
  })(req, res, next);
};

/**
 * Role-based access control
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AuthenticationError());
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError(`Role '${req.user.role}' is not authorized to access this route`));
  }
  next();
};

/**
 * Require email verification
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user?.isEmailVerified) {
    return next(new ForbiddenError('Please verify your email address to continue'));
  }
  next();
};

module.exports = { authenticate, optionalAuth, authorize, requireEmailVerified };
