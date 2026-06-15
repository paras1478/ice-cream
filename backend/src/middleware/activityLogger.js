const ActivityLog = require('../models/ActivityLog');
const logger = require('../config/logger');

/**
 * Create activity log middleware factory
 * @param {string} action - Action enum value
 * @param {Function} [getResourceId] - Extract resource ID from req
 * @param {string} [resourceType]
 */
const logActivity = (action, resourceType = null, getResourceId = null) => async (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    // After response is sent, log the activity
    setImmediate(async () => {
      try {
        if (res.statusCode < 400) {
          const resourceId = getResourceId ? getResourceId(req, data) : null;
          await ActivityLog.create({
            user: req.user?._id,
            action,
            resourceType,
            resourceId,
            details: { method: req.method, url: req.url },
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.headers['user-agent'],
            status: 'success',
          });
        }
      } catch (err) {
        logger.error('Failed to log activity:', err.message);
      }
    });

    return originalJson(data);
  };

  next();
};

module.exports = logActivity;
