import axios from 'axios';

// Base API configuration
const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const baseURL = apiBase
  ? `${apiBase.replace(/\/$/, '')}/api`
  : '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 35000 // 35 seconds
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please try again.';
    let errorCode = 'UNKNOWN_ERROR';
    let errorDetails = null;

    if (error.response) {
      // Backend returned structured error response
      const data = error.response.data;
      if (data && data.error) {
        if (typeof data.error === 'string') {
          friendlyMessage = data.error;
        } else {
          friendlyMessage = data.error.message || friendlyMessage;
          errorCode = data.error.code || errorCode;
          errorDetails = data.error;
        }
      } else if (error.response.status === 429) {
        friendlyMessage = 'Rate limit exceeded. Please wait a moment before generating more audio.';
        errorCode = 'RATE_LIMIT_EXCEEDED';
      } else if (error.response.status === 503) {
        friendlyMessage = 'Speech service is temporarily unavailable.';
        errorCode = 'SERVICE_UNAVAILABLE';
      }
    } else if (error.request) {
      // Request made but no response received
      friendlyMessage = 'Cannot connect to Voxify server. Speech synthesis remains fully available via your browser.';
      errorCode = 'NETWORK_ERROR';
    } else {
      friendlyMessage = error.message;
    }

    const customError = new Error(friendlyMessage);
    customError.code = errorCode;
    customError.status = error.response ? error.response.status : null;
    customError.details = errorDetails;
    return Promise.reject(customError);
  }
);

/**
 * Health check endpoint
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

/**
 * Fetch available voices
 */
export const fetchVoices = async (languageCode) => {
  const params = languageCode ? { languageCode } : {};
  const response = await apiClient.get('/voices', { params });
  return response.data;
};

/**
 * Convert text to speech
 */
export const generateSpeech = async (payload) => {
  const response = await apiClient.post('/tts', payload);
  return response.data;
};

/**
 * Build absolute download URL for an audio file
 */
export const getAudioDownloadUrl = (audioUrl) => {
  if (!audioUrl) return '';
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
    return audioUrl;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (apiBase) {
    const origin = apiBase.replace(/\/$/, '');
    return `${origin}${audioUrl}`;
  }
  return audioUrl;
};

export default {
  checkHealth,
  fetchVoices,
  generateSpeech,
  getAudioDownloadUrl
};
