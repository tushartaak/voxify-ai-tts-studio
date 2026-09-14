import { config } from '../config/env.js';

export const getHealth = async (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Voxify API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    speechEngine: 'browser-native-web-speech-api',
    provider: {
      activeEngine: 'Web Speech API (Browser Native)',
      billingRequired: false,
      cloudCredentialsRequired: false,
      maxCharacters: config.maxCharacters
    }
  });
};

export default {
  getHealth
};
