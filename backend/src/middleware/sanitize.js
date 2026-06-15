/**
 * Sanitize strings to prevent XSS - strip HTML tags
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)])
  );
};

/**
 * Sanitize request body, query, and params
 */
const sanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = sanitize;
