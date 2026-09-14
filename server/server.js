import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logStartupStatus, config } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

// CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General API Rate Limiting
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api/health', healthRoutes);

// Informational Notice on legacy TTS endpoints if queried directly
app.all(['/api/tts*', '/api/voices'], (req, res) => {
  res.status(200).json({
    success: true,
    speechEngine: 'browser-native-web-speech-api',
    message: 'Voxify operates 100% locally via browser Web Speech API (window.speechSynthesis). Cloud synthesis endpoints are disabled to ensure zero billing and complete privacy.'
  });
});

// 404 Handler for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Resource ${req.originalUrl} not found on this server.`, 404, 'NOT_FOUND'));
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if not running in test mode
let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    logStartupStatus();
  });
}

export { app, server };
export default app;
