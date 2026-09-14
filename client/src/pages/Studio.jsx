import React, { useEffect } from 'react';
import { Sparkles, Info, ShieldAlert, Wifi, Cpu, CheckCircle } from 'lucide-react';
import browserSpeechService from '../services/browserSpeechService';
import { TextEditor } from '../components/TextEditor';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceSelector } from '../components/VoiceSelector';
import { AudioSettings } from '../components/AudioSettings';
import { GenerateButton } from '../components/GenerateButton';
import { AudioPlayer } from '../components/AudioPlayer';
import { ErrorMessage } from '../components/ErrorMessage';
import { Toast } from '../components/Toast';

export const Studio = ({ ttsState }) => {
  const {
    text,
    setText,
    characterCount,
    wordCount,
    maxCharacters,
    isApproachingLimit,
    isOverLimit,
    language,
    setLanguage,
    languages,
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
    isGenerating,
    isSpeaking,
    isPaused,
    speakingStatus,
    spokenProgress,
    activeSpeech,
    generatedAudio,
    error,
    setError,
    toast,
    dismissToast,
    serverStatus,
    handleClearText,
    handleApplySample,
    handleResetSettings,
    handleClearAudio,
    handleSpeak,
    handlePause,
    handleResume,
    handleStop
  } = ttsState;

  // Cleanup speech synthesis on page unmount
  useEffect(() => {
    return () => {
      browserSpeechService.cancel();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Studio Header & Provider Mode Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Voxify Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Live Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Convert text scripts into natural spoken audio directly in your browser with zero cloud keys, zero billing, and complete privacy.
          </p>
        </div>

        {/* Browser Engine & Server Connectivity Status Tag */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-medium ${
              serverStatus.browserSupported
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {serverStatus.browserSupported
                ? `Browser Speech Engine: Ready (${allBrowserVoices?.length || serverStatus.voiceCount || 0} voices)`
                : 'Web Speech API Unsupported'}
            </span>
          </div>
        </div>
      </div>

      {/* Browser Native Speech Architecture Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 backdrop-blur-sm">
        <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-200">Browser-Native Speech Synthesis:</span> Speech is generated locally by your browser using voices available on your device. Voice and language availability may vary by browser and operating system.
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError(null)}
          onRetry={handleSpeak}
        />
      )}

      {/* Main Studio Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (8 cols): Text Editor */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <TextEditor
            text={text}
            setText={setText}
            characterCount={characterCount}
            wordCount={wordCount}
            maxCharacters={maxCharacters}
            isApproachingLimit={isApproachingLimit}
            isOverLimit={isOverLimit}
            onClearText={handleClearText}
            onApplySample={handleApplySample}
          />

          {/* Dedicated Speech Controller Display when active */}
          {(activeSpeech || generatedAudio) && (
            <div className="space-y-2">
              <AudioPlayer
                activeSpeech={activeSpeech || generatedAudio}
                speakingStatus={speakingStatus}
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                spokenProgress={spokenProgress}
                onPlay={handleSpeak}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
                onClear={handleClearAudio}
                volume={volume}
                onVolumeChange={setVolume}
              />
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Voice, Settings, and Action Controls */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Voice Configuration Card */}
          <div className="bg-navy-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white border-b border-slate-850 pb-3">
              Voice Configuration
            </h3>

            {/* Language Selector */}
            <LanguageSelector
              language={language}
              setLanguage={setLanguage}
              languages={languages}
              loading={loadingVoices}
            />

            {/* Voice Selector */}
            <VoiceSelector
              voice={voice}
              setVoice={setVoice}
              availableVoices={availableVoices}
              allBrowserVoices={allBrowserVoices}
              loading={loadingVoices}
              language={language}
            />
          </div>

          {/* Audio Adjustments Card */}
          <AudioSettings
            speakingRate={speakingRate}
            setSpeakingRate={setSpeakingRate}
            pitch={pitch}
            setPitch={setPitch}
            volume={volume}
            setVolume={setVolume}
            onReset={handleResetSettings}
          />

          {/* Primary Action Button */}
          <div className="pt-1">
            <GenerateButton
              onClick={handleSpeak}
              isGenerating={isSpeaking}
              disabled={!text.trim() || isOverLimit}
              textLength={characterCount}
            />
          </div>
        </div>
      </div>

      {/* Floating Toast Alerts */}
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default Studio;
