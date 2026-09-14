/**
 * Format seconds into mm:ss display
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Generate formatted filename: voxify-speech-YYYY-MM-DD-HH-mm.ext
 */
export const generateAudioFilename = (format = 'MP3') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ext = (format || 'mp3').toLowerCase();

  return `voxify-speech-${year}-${month}-${day}-${hours}-${minutes}.${ext}`;
};

/**
 * Downloads audio file safely via blob or server URL
 */
export const downloadAudio = async (audioUrl, dataUrl, format = 'MP3') => {
  const filename = generateAudioFilename(format);

  try {
    let blobUrl = audioUrl;

    // If audioUrl is an API route or remote URL, fetch as blob for clean download trigger
    if (audioUrl && !audioUrl.startsWith('data:')) {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Failed to fetch audio file for download');
      const blob = await response.blob();
      blobUrl = window.URL.createObjectURL(blob);
    } else if (dataUrl) {
      blobUrl = dataUrl;
    }

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up temporary object URL if created
    if (blobUrl && blobUrl.startsWith('blob:')) {
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    }
    return true;
  } catch (err) {
    console.error('[Audio Download Error]', err);
    throw err;
  }
};

/**
 * Browser Web Speech API Controller for clearly-labeled development fallback
 */
export class WebSpeechFallback {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.currentUtterance = null;
  }

  isSupported() {
    return Boolean(this.synth);
  }

  getBrowserVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  speak({ text, languageCode = 'en-US', rate = 1.0, pitch = 1.0, onStart, onEnd, onError }) {
    if (!this.synth) {
      if (onError) onError(new Error('Browser Web Speech API is not supported in this environment.'));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = Math.max(0.5, Math.min(2.0, rate)); // Browser speech supports 0.1 to 10
    // Normalize pitch (-20 to 20 into 0 to 2)
    const normalizedPitch = Math.max(0, Math.min(2, 1.0 + (pitch / 20)));
    utterance.pitch = normalizedPitch;

    // Attempt to match language voice
    const voices = this.getBrowserVoices();
    const match = voices.find(v => v.lang.toLowerCase() === languageCode.toLowerCase()) ||
                  voices.find(v => v.lang.toLowerCase().startsWith(languageCode.split('-')[0].toLowerCase()));
    if (match) utterance.voice = match;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.currentUtterance = null;
      if (onError) onError(new Error(`Browser speech synthesis error: ${event.error}`));
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const webSpeechController = new WebSpeechFallback();

export default {
  formatTime,
  generateAudioFilename,
  downloadAudio,
  webSpeechController
};
