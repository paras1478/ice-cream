const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res, next, options) => {
      res.status(429).json({ success: false, message: options.message.message });
    },
  });

const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 min
  10,
  'Too many authentication attempts. Please try again in 15 minutes.'
);

const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP. Please try again later.'
);

const uploadLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  20,
  'Upload limit reached. Please try again in 1 hour.'
);

const strictLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many requests. Please try again later.'
);

const passwordResetLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  'Too many password reset requests. Please try again in 1 hour.'
);

module.exports = { authLimiter, apiLimiter, uploadLimiter, strictLimiter, passwordResetLimiter };
