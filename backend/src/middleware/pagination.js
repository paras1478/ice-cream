/**
 * Extract and validate pagination parameters from query string
 */
const pagination = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };
  next();
};

/**
 * Build pagination metadata object
 * @param {number} total - Total document count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 */
const buildPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});

module.exports = { pagination, buildPaginationMeta };
