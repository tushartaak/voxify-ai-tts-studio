import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(serverRoot, '..');

// 1. Ensure dotenv is loaded
const serverEnvPath = path.resolve(serverRoot, '.env');
const projectEnvPath = path.resolve(projectRoot, '.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
if (fs.existsSync(projectEnvPath)) {
  dotenv.config({ path: projectEnvPath });
}
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT, 10) || 5050,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
  maxCharacters: parseInt(process.env.MAX_TEXT_LENGTH || '5000', 10) || 5000,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10) || 30
  },
  paths: {
    serverRoot,
    projectRoot
  }
};

/**
 * Startup logging for Voxify backend
 */
export function logStartupStatus() {
  console.log('=========================================');
  console.log(' Voxify AI TTS Studio - Server Startup');
  console.log(` Environment:   ${config.nodeEnv}`);
  console.log(` Listening Port: ${config.port}`);
  console.log(` Client Origin: ${config.clientUrl}`);
  console.log(' Speech Engine:  Browser-Native Web Speech API (Client-side, 100% Free)');
  console.log(' Cloud Billing:  None (Zero Cloud Credentials / No API Keys Needed)');
  console.log('=========================================');
}

export default config;
