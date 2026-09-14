import { useState, useEffect, useCallback, useMemo } from 'react';
import browserSpeechService from '../services/browserSpeechService';
import { checkHealth } from '../services/api';

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧' },
  { code: 'hi-IN', name: 'Hindi (भारत)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાત)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (महाराष्ट्र)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (España)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutschland)', flag: '🇩🇪' }
];

export function useTTS() {
  // Input text state
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [voice, setVoice] = useState('');
  const [allBrowserVoices, setAllBrowserVoices] = useState([]);
  const [loadingVoices, setLoadingVoices] = useState(true);

  // Audio settings
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volume, setVolume] = useState(1.0);

  // Speaking state: 'idle' | 'speaking' | 'paused' | 'completed'
  const [speakingStatus, setSpeakingStatus] = useState('idle');
  const [spokenProgress, setSpokenProgress] = useState(0); // 0 to 100%
  const [currentSpokenCharIndex, setCurrentSpokenCharIndex] = useState(0);

  // Active speech metadata displayed in the controller
  const [activeSpeech, setActiveSpeech] = useState(null);

  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Server health & browser engine status
  const [serverStatus, setServerStatus] = useState({
    isOnline: false,
    activeEngine: 'Browser Web Speech API',
    browserSupported: browserSpeechService.isSupported(),
    voiceCount: 0,
    maxCharacters: 5000
  });

  // Calculate character & word counters reactively
  const characterCount = text.length;
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [text]);

  const maxCharacters = serverStatus.maxCharacters || 5000;
  const isApproachingLimit = characterCount >= maxCharacters * 0.85;
  const isOverLimit = characterCount > maxCharacters;

  // Show temporary toast message
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Check backend server health
  const refreshServerStatus = useCallback(() => {
    return checkHealth()
      .then((data) => {
        setServerStatus((prev) => ({
          ...prev,
          isOnline: true,
          activeEngine: 'Browser Web Speech API',
          browserSupported: browserSpeechService.isSupported()
        }));
      })
      .catch(() => {
        setServerStatus((prev) => ({
          ...prev,
          isOnline: false,
          activeEngine: 'Browser Web Speech API',
          browserSupported: browserSpeechService.isSupported()
        }));
      });
  }, []);

  useEffect(() => {
    refreshServerStatus();
  }, [refreshServerStatus]);

  // Load genuine browser voices via window.speechSynthesis
  useEffect(() => {
    if (!browserSpeechService.isSupported()) {
      setLoadingVoices(false);
      setError('Web Speech API is not supported in this browser. Please use Chrome, Edge, Safari, or Firefox.');
      return;
    }

    const updateVoices = (voices) => {
      const loaded = voices || browserSpeechService.getVoices();
      setAllBrowserVoices(loaded);
      setLoadingVoices(false);
      setServerStatus((prev) => ({
        ...prev,
        voiceCount: loaded.length,
        browserSupported: true
      }));
    };

    // Initial fetch
    updateVoices(browserSpeechService.getVoices());

    // Listen for asynchronous onvoiceschanged event
    const unsubscribe = browserSpeechService.onVoicesChanged((voices) => {
      updateVoices(voices);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filter available voices for selected language
  const availableVoices = useMemo(() => {
    if (!language || allBrowserVoices.length === 0) return [];
    const cleanLang = language.toLowerCase();
    const prefix = cleanLang.split('-')[0];

    // Priority 1: Exact language match (e.g. en-US)
    const exact = allBrowserVoices.filter(
      (v) => (v.lang || '').toLowerCase().replace(/_/g, '-') === cleanLang
    );
    if (exact.length > 0) return exact;

    // Priority 2: Prefix match (e.g. en)
    return allBrowserVoices.filter((v) =>
      (v.lang || '').toLowerCase().startsWith(prefix)
    );
  }, [language, allBrowserVoices]);

  // Available languages: show all supported, but highlight ones with installed voices
  const languagesWithVoices = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((lang) => {
      const clean = lang.code.toLowerCase();
      const prefix = clean.split('-')[0];
      const matchCount = allBrowserVoices.filter((v) => {
        const vl = (v.lang || '').toLowerCase().replace(/_/g, '-');
        return vl === clean || vl.startsWith(prefix);
      }).length;
      return {
        ...lang,
        installedVoicesCount: matchCount,
        hasInstalledVoice: matchCount > 0
      };
    });
  }, [allBrowserVoices]);

  // Auto-select first voice when language changes or voices load
  useEffect(() => {
    if (availableVoices.length > 0) {
      // If currently selected voice is in available voices, keep it
      const currentExists = availableVoices.some((v) => v.name === voice);
      if (!currentExists) {
        // Default to first available voice or one marked default
        const defaultVoice = availableVoices.find((v) => v.default) || availableVoices[0];
        setVoice(defaultVoice.name);
      }
    } else {
      setVoice('');
    }
  }, [language, availableVoices]);

  // Handle changing language
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setError(null);
  };

  // Clear text
  const handleClearText = () => {
    setText('');
    setError(null);
  };

  // Insert sample text
  const handleApplySample = (sample) => {
    setText(sample.text);
    if (sample.language && sample.language !== language) {
      setLanguage(sample.language);
    }
    setError(null);
    showToast(`Loaded "${sample.label}" sample script`, 'info');
  };

  // Reset audio settings
  const handleResetSettings = () => {
    setSpeakingRate(1.0);
    setPitch(0.0);
    setVolume(1.0);
    showToast('Audio settings reset to defaults', 'info');
  };

  // Stop ongoing speech
  const handleStopSpeech = () => {
    browserSpeechService.stop();
    setSpeakingStatus('idle');
    setSpokenProgress(0);
    showToast('Speech stopped', 'info');
  };

  // Pause speech
  const handlePauseSpeech = () => {
    browserSpeechService.pause();
    setSpeakingStatus('paused');
  };

  // Resume speech
  const handleResumeSpeech = () => {
    browserSpeechService.resume();
    setSpeakingStatus('speaking');
  };

  // Clear speech controller
  const handleClearSpeech = () => {
    browserSpeechService.stop();
    setActiveSpeech(null);
    setSpeakingStatus('idle');
    setSpokenProgress(0);
  };

  // Primary Action: Speak Text using browser SpeechSynthesis
  const handleSpeak = async () => {
    // 1. Text validation
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter some text before speaking.');
      return;
    }
    if (trimmed.length > maxCharacters) {
      setError(`Text exceeds the maximum limit of ${maxCharacters.toLocaleString()} characters.`);
      return;
    }

    // 2. Browser Speech Support Check
    if (!browserSpeechService.isSupported()) {
      setError('Web Speech API is not supported in this browser. Please check your browser speech settings.');
      return;
    }

    // 3. Voice availability check
    if (allBrowserVoices.length === 0) {
      setError('No speech voices are available in this browser. Please check your browser or operating-system speech settings.');
      return;
    }

    if (!voice || availableVoices.length === 0) {
      setError('No installed browser voice is available for this language.');
      return;
    }

    const selectedVoiceObj = availableVoices.find((v) => v.name === voice) || availableVoices[0];

    setError(null);
    setSpeakingStatus('speaking');
    setSpokenProgress(0);
    setCurrentSpokenCharIndex(0);

    const speechMeta = {
      text: trimmed,
      voice: selectedVoiceObj ? selectedVoiceObj.name : voice,
      language,
      speakingRate,
      pitch,
      volume,
      startedAt: new Date()
    };
    setActiveSpeech(speechMeta);

    showToast('Speaking text via browser speech synthesis...', 'info');

    browserSpeechService.speak({
      text: trimmed,
      voice: selectedVoiceObj,
      lang: language,
      rate: speakingRate,
      pitch,
      volume,
      onStart: () => {
        setSpeakingStatus('speaking');
      },
      onPause: () => {
        setSpeakingStatus('paused');
      },
      onResume: () => {
        setSpeakingStatus('speaking');
      },
      onBoundary: (event) => {
        if (event.charIndex !== undefined && trimmed.length > 0) {
          setCurrentSpokenCharIndex(event.charIndex);
          const pct = Math.min(100, Math.round((event.charIndex / trimmed.length) * 100));
          setSpokenProgress(pct);
        }
      },
      onEnd: () => {
        setSpeakingStatus('completed');
        setSpokenProgress(100);
        showToast('Speech completed', 'success');
      },
      onError: (err) => {
        console.error('[Speech Error]', err);
        setSpeakingStatus('idle');
        setError(err.message || 'Speech synthesis failed. Please try again.');
      }
    });
  };

  return {
    text,
    setText,
    characterCount,
    wordCount,
    maxCharacters,
    isApproachingLimit,
    isOverLimit,
    language,
    setLanguage: handleLanguageChange,
    languages: languagesWithVoices,
    voice,
    setVoice,
    availableVoices,
    allBrowserVoices,
    loadingVoices,
    speakingRate,
    setSpeakingRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    speakingStatus,
    isSpeaking: speakingStatus === 'speaking',
    isPaused: speakingStatus === 'paused',
    isCompleted: speakingStatus === 'completed',
    spokenProgress,
    currentSpokenCharIndex,
    activeSpeech,
    generatedAudio: activeSpeech, // Map activeSpeech so existing parent components receive active metadata
    isGenerating: speakingStatus === 'speaking',
    error,
    setError,
    toast,
    showToast,
    dismissToast,
    serverStatus,
    refreshServerStatus,
    handleClearText,
    handleApplySample,
    handleResetSettings,
    handleSpeak,
    handleGenerate: handleSpeak,
    handlePause: handlePauseSpeech,
    handleResume: handleResumeSpeech,
    handleStop: handleStopSpeech,
    handleClearAudio: handleClearSpeech
  };
}

export default useTTS;
