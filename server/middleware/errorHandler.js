/**
 * Centralized Application Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Default values
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  
  // Safe user-facing message (never leak stack traces or internal secrets)
  let message = err.message || 'An unexpected error occurred. Please try again.';

  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error. Please try again later.';
  }

  // Safe logging in non-production
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] [${new Date().toISOString()}] ${statusCode} - ${code}: ${err.message}`);
    if (statusCode === 500 && err.stack) {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

export default errorHandler;
