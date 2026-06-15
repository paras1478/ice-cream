const { ZodError } = require('zod');
const { ValidationError } = require('../utils/ApiError');

/**
 * Zod validation middleware factory
 * @param {ZodSchema} schema - Zod schema
 * @param {'body'|'query'|'params'} source - Where to validate
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
      }));
      return next(new ValidationError('Validation failed', errors));
    }
    next(err);
  }
};

/**
 * Validate multiple sources
 */
const validateMultiple = (schemas) => (req, res, next) => {
  const errors = [];

  for (const [source, schema] of Object.entries(schemas)) {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) =>
          errors.push({ field: `${source}.${e.path.join('.')}`, message: e.message })
        );
      }
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }
  next();
};

module.exports = { validate, validateMultiple };
