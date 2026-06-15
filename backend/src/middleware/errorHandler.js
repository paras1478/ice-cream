const mongoose = require('mongoose');
const { ApiError } = require('../utils/ApiError');
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    user: req.user?._id,
  });

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = new ApiError(400, 'Validation failed', messages);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(409, `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File size too large');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError(400, 'Too many files');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError(400, 'Unexpected file field');
  }

  // Default to ApiError or 500
  if (!(error instanceof ApiError)) {
    error = new ApiError(
      500,
      process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error'
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors?.length ? error.errors : undefined,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
