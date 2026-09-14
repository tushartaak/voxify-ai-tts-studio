import { AppError } from './errorHandler.js';
import config from '../config/env.js';

const SUPPORTED_FORMATS = ['MP3', 'WAV', 'OGG', 'LINEAR16', 'OGG_OPUS'];
const BCP47_REGEX = /^[a-z]{2,3}(-[A-Za-z0-9]{2,4})?$/i;

/**
 * Validates TTS generation request body
 */
export const validateTTSRequest = (req, res, next) => {
  if (!req.is('application/json')) {
    return next(new AppError('Content-Type must be application/json', 400, 'INVALID_CONTENT_TYPE'));
  }

  const body = req.body || {};

  // 1. Validate text
  const rawText = body.text;
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return next(new AppError('Please enter some text before generating speech.', 400, 'INVALID_TEXT'));
  }

  const trimmedText = rawText.trim();
  if (trimmedText.length > config.maxCharacters) {
    return next(
      new AppError(
        `Text exceeds the maximum allowed limit of ${config.maxCharacters.toLocaleString()} characters. Current length: ${trimmedText.length.toLocaleString()}`,
        400,
        'TEXT_TOO_LONG'
      )
    );
  }

  // 2. Validate language (support both 'language' and 'languageCode')
  const rawLanguage = body.language || body.languageCode;
  if (!rawLanguage || typeof rawLanguage !== 'string' || !BCP47_REGEX.test(rawLanguage.trim())) {
    return next(new AppError('Please select a valid language code (e.g., en-US, hi-IN).', 400, 'INVALID_LANGUAGE'));
  }
  const cleanLanguage = rawLanguage.trim();

  // 3. Validate voice (support both 'voice' and 'voiceName')
  const rawVoice = body.voice || body.voiceName;
  if (!rawVoice || typeof rawVoice !== 'string' || rawVoice.trim().length === 0) {
    return next(new AppError('Please select a valid voice for generation.', 400, 'INVALID_VOICE'));
  }
  const cleanVoice = rawVoice.trim();

  // 4. Validate speed / speakingRate (optional, default 1.0)
  const rawSpeed = body.speed !== undefined ? body.speed : body.speakingRate;
  let cleanSpeed = 1.0;
  if (rawSpeed !== undefined) {
    const rate = Number(rawSpeed);
    if (isNaN(rate) || rate < 0.25 || rate > 4.0) {
      return next(new AppError('Speaking rate / speed must be a number between 0.25 and 4.0.', 400, 'INVALID_AUDIO_SETTINGS'));
    }
    cleanSpeed = rate;
  }

  // 5. Validate pitch (optional, default 0)
  let cleanPitch = 0.0;
  if (body.pitch !== undefined) {
    const p = Number(body.pitch);
    if (isNaN(p) || p < -20.0 || p > 20.0) {
      return next(new AppError('Pitch must be a number between -20.0 and 20.0.', 400, 'INVALID_AUDIO_SETTINGS'));
    }
    cleanPitch = p;
  }

  // 6. Validate volume / volumeGainDb (optional, default 1.0 or 0 dB)
  const rawVolume = body.volume !== undefined ? body.volume : body.volumeGainDb;
  let cleanVolume = 1.0;
  if (rawVolume !== undefined) {
    const vol = Number(rawVolume);
    if (isNaN(vol)) {
      return next(new AppError('Volume must be a valid number.', 400, 'INVALID_AUDIO_SETTINGS'));
    }
    cleanVolume = vol;
  }

  // 7. Validate audio format (support both 'format' and 'audioFormat', optional default MP3)
  const rawFormat = body.format || body.audioFormat || 'MP3';
  const normalizedFormat = String(rawFormat).toUpperCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    return next(
      new AppError(
        `Audio format '${rawFormat}' is unsupported. Supported formats: MP3, WAV, OGG`,
        400,
        'UNSUPPORTED_FORMAT'
      )
    );
  }

  // Attach sanitized, normalized payload to req.sanitizedBody
  req.sanitizedBody = {
    text: trimmedText,
    language: cleanLanguage,
    languageCode: cleanLanguage,
    voice: cleanVoice,
    voiceName: cleanVoice,
    speed: cleanSpeed,
    speakingRate: cleanSpeed,
    pitch: cleanPitch,
    volume: cleanVolume,
    volumeGainDb: cleanVolume,
    format: normalizedFormat === 'LINEAR16' ? 'WAV' : normalizedFormat === 'OGG_OPUS' ? 'OGG' : normalizedFormat,
    audioFormat: normalizedFormat === 'LINEAR16' ? 'WAV' : normalizedFormat === 'OGG_OPUS' ? 'OGG' : normalizedFormat
  };

  next();
};

/**
 * Validates audio ID parameter to prevent directory traversal and injection
 */
export const validateAudioId = (req, res, next) => {
  const { id } = req.params;
  const safeIdRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)?$/;

  if (!id || !safeIdRegex.test(id)) {
    return next(new AppError('Invalid audio file identifier.', 400, 'INVALID_AUDIO_ID'));
  }

  next();
};

export default {
  validateTTSRequest,
  validateAudioId
};
