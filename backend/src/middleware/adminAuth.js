const { authenticate, authorize } = require('./auth');

/**
 * Admin-only middleware: authenticate + authorize as admin
 */
const adminAuth = [authenticate, authorize('admin')];

module.exports = adminAuth;
