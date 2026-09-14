import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

export const ttsRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many audio generation requests from this IP. Please try again in ${Math.ceil(config.rateLimit.windowMs / 1000)} seconds.`
      }
    });
  }
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'API_RATE_LIMIT_EXCEEDED',
        message: 'Too many API requests. Please slow down.'
      }
    });
  }
});

export default {
  ttsRateLimiter,
  apiRateLimiter
};
