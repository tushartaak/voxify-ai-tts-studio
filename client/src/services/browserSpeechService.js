import { normalizeVoice, normalizeLocale } from './voiceService';

/**
 * Browser-Native Web Speech API Service for Voxify
 * Completely free, local, private, and runs without any cloud or third-party APIs.
 */

class BrowserSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.keepAliveInterval = null;
    this.voiceListeners = new Set();
    this._debounceTimer = null;

    if (this.synth) {
      const handleVoicesChanged = () => {
        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          this.notifyVoiceListeners();
        }, 50);
      };

      // Listen for voices changed event using addEventListener if available
      if (typeof this.synth.addEventListener === 'function') {
        this.synth.addEventListener('voiceschanged', handleVoicesChanged);
      }
      // Also attach to onvoiceschanged for older browser implementations
      this.synth.onvoiceschanged = handleVoicesChanged;
    }
  }

  /**
   * Check if Web Speech API is supported in the current environment
   */
  isSupported() {
    return Boolean(this.synth && typeof window.SpeechSynthesisUtterance !== 'undefined');
  }

  /**
   * Get all currently available raw speech synthesis voices from browser
   */
  getVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices() || [];
  }

  /**
   * Get all available voices normalized with structured metadata
   */
  getAvailableVoices() {
    const rawVoices = this.getVoices();
    return rawVoices.map((v, i) => normalizeVoice(v, i));
  }

  /**
   * Register a callback to be invoked when available browser voices change
   */
  onVoicesChanged(callback) {
    if (typeof callback !== 'function') return () => {};
    this.voiceListeners.add(callback);

    // If voices are already populated, trigger immediately
    const initialVoices = this.getAvailableVoices();
    if (initialVoices.length > 0) {
      try {
        callback(initialVoices);
      } catch (err) {
        console.warn('[BrowserSpeechService] Error in initial voices callback:', err);
      }
    }

    return () => {
      this.voiceListeners.delete(callback);
    };
  }

  notifyVoiceListeners() {
    const voices = this.getAvailableVoices();
    this.voiceListeners.forEach((cb) => {
      try {
        cb(voices);
      } catch (err) {
        console.warn('[BrowserSpeechService] Error in voice listener:', err);
      }
    });
  }

  /**
   * Speak the given text with configured parameters
   */
  speak({
    text,
    voice = null,
    voiceName = null,
    lang = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    onStart = null,
    onPause = null,
    onResume = null,
    onEnd = null,
    onError = null,
    onBoundary = null
  }) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Browser Web Speech API is not supported in this browser.'));
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    const trimmed = (text || '').trim();
    if (!trimmed) {
      if (onError) onError(new Error('Please enter some text before speaking.'));
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(trimmed);

    // 1. Voice Resolution
    const allNativeVoices = this.getVoices();
    let nativeVoice = null;

    if (voice) {
      // If voice is a normalized voice object, extract native voice reference
      if (voice.voice && typeof voice.voice === 'object') {
        nativeVoice = voice.voice;
      } else if (typeof voice === 'object' && voice.name) {
        nativeVoice = allNativeVoices.find((v) => v.name === voice.name) || voice;
      }
    }

    if (!nativeVoice && voiceName) {
      nativeVoice = allNativeVoices.find((v) => v.name === voiceName);
    }

    if (!nativeVoice && lang) {
      const cleanLang = normalizeLocale(lang).toLowerCase();
      nativeVoice =
        allNativeVoices.find((v) => normalizeLocale(v.lang).toLowerCase() === cleanLang) ||
        allNativeVoices.find((v) => normalizeLocale(v.lang).toLowerCase().startsWith(cleanLang.split('-')[0]));
    }

    if (nativeVoice) {
      utterance.voice = nativeVoice;
      utterance.lang = nativeVoice.lang || lang;
    } else {
      utterance.lang = normalizeLocale(lang) || lang;
    }

    // 2. Audio Parameters (Rate: 0.1 to 10.0, Pitch: 0 to 2.0, Volume: 0 to 1.0)
    utterance.rate = Math.max(0.5, Math.min(2.0, Number(rate) || 1.0));
    // Convert pitch: standard pitch 1.0 is default. If pitch input is -10 to +10, map to 0.5 to 1.5
    const safePitch = Number(pitch) || 0.0;
    const normalizedPitch = Math.max(0.1, Math.min(2.0, 1.0 + safePitch / 10.0));
    utterance.pitch = normalizedPitch;
    utterance.volume = Math.max(0.0, Math.min(1.0, Number(volume) || 1.0));

    // 3. Event Listeners
    utterance.onstart = () => {
      this.startKeepAlive();
      if (onStart) onStart();
    };

    utterance.onpause = () => {
      if (onPause) onPause();
    };

    utterance.onresume = () => {
      if (onResume) onResume();
    };

    utterance.onend = () => {
      this.stopKeepAlive();
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.stopKeepAlive();
      this.currentUtterance = null;
      // 'canceled' or 'interrupted' is expected when user manually cancels or stops speech
      if (event.error === 'canceled' || event.error === 'interrupted') {
        if (onEnd) onEnd();
        return;
      }
      if (onError) onError(new Error(`Speech synthesis error: ${event.error || 'Unknown error'}`));
    };

    utterance.onboundary = (event) => {
      if (onBoundary) {
        onBoundary({
          charIndex: event.charIndex,
          charLength: event.charLength || 0,
          name: event.name,
          elapsedTime: event.elapsedTime
        });
      }
    };

    // Retain utterance in instance to avoid premature garbage collection in Chromium browsers
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Pause ongoing speech
   */
  pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Cancel/stop active speech
   */
  cancel() {
    this.stopKeepAlive();
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  stop() {
    this.cancel();
  }

  isSpeaking() {
    return Boolean(this.synth && this.synth.speaking);
  }

  isPaused() {
    return Boolean(this.synth && this.synth.paused);
  }

  /**
   * Chrome/Safari keep-alive hack:
   * Chrome silently pauses long speech synthesis utterances after ~15 seconds.
   * Periodically checking and resuming prevents the drop.
   */
  startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 12000);
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }
}

export const browserSpeechService = new BrowserSpeechService();
export default browserSpeechService;
