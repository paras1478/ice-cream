/**
 * Wraps async route handlers to catch errors and pass them to next()
 * @param {Function} fn - Async route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
