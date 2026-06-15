class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = true;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation failed', errors = []) {
    super(400, message, errors);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

class RateLimitError extends ApiError {
  constructor(message = 'Too many requests') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  ApiError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
