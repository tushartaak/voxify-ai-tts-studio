import React from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
  Radio,
  Mic2,
  Sparkles,
  Info,
  HelpCircle
} from 'lucide-react';

export const AudioPlayer = ({
  generatedAudio,
  activeSpeech,
  speakingStatus = 'idle',
  isSpeaking = false,
  isPaused = false,
  spokenProgress = 0,
  onPlay,
  onPause,
  onResume,
  onStop,
  onClear,
  volume = 1.0,
  onVolumeChange
}) => {
  const speechData = activeSpeech || generatedAudio;

  if (!speechData) return null;

  const currentStatus =
    speakingStatus !== 'idle'
      ? speakingStatus
      : isSpeaking
      ? 'speaking'
      : isPaused
      ? 'paused'
      : 'ready';

  return (
    <div className="bg-gradient-to-b from-slate-900/95 to-navy-900/95 rounded-2xl border border-brand-500/40 p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-all space-y-4">
      {/* Top Banner & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Speech Controls</h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 border ${
                  currentStatus === 'speaking'
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 animate-pulse'
                    : currentStatus === 'paused'
                    ? 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                    : currentStatus === 'completed'
                    ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                }`}
              >
                {currentStatus === 'speaking' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Speaking
                  </>
                ) : currentStatus === 'paused' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Paused
                  </>
                ) : currentStatus === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    Speech Completed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Ready
                  </>
                )}
              </span>
            </div>

            {/* Voice & Settings Strip */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
              <span className="font-medium text-slate-200 truncate max-w-[200px]">
                {speechData.voice || 'Default Voice'}
              </span>
              <span>•</span>
              <span className="font-mono text-brand-300">{speechData.language || 'en-US'}</span>
              <span>•</span>
              <span>{Number(speechData.speakingRate || 1.0).toFixed(2)}x Speed</span>
              <span>•</span>
              <span>Pitch: {Number(speechData.pitch || 0) > 0 ? `+${speechData.pitch}` : speechData.pitch || 0} st</span>
            </div>
          </div>
        </div>

        {/* Clear / Stop Action */}
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition-colors"
          title="Clear speech and reset controls"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Speech</span>
        </button>
      </div>

      {/* Real-time Spoken Progress Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium flex items-center gap-1.5 text-slate-300">
            <Radio className={`w-3.5 h-3.5 ${currentStatus === 'speaking' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Spoken Progress</span>
          </span>
          <span className="font-mono text-brand-300 font-semibold">{spokenProgress}%</span>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-200"
            style={{ width: `${spokenProgress}%` }}
          />
        </div>
      </div>

      {/* Main Playback Buttons & Volume Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Play / Pause / Resume / Stop Controls */}
        <div className="flex items-center gap-3">
          {currentStatus === 'speaking' ? (
            <button
              type="button"
              onClick={onPause}
              className="w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Pause speech"
              title="Pause speech"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : currentStatus === 'paused' ? (
            <button
              type="button"
              onClick={onResume}
              className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400"
              aria-label="Resume speech"
              title="Resume speech"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlay}
              className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-400"
              aria-label="Replay speech"
              title="Replay speech"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Stop Button */}
          <button
            type="button"
            onClick={onStop}
            disabled={currentStatus === 'idle' || currentStatus === 'completed'}
            className="p-3 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Stop speech immediately"
            aria-label="Stop speech"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Volume Controls */}
        {onVolumeChange && (
          <div className="flex items-center gap-2 min-w-[140px] max-w-[180px]">
            <span className="p-1.5 text-slate-300">
              {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Adjust speech volume"
            />
          </div>
        )}
      </div>

      {/* Honest Technical Disclosures (Seeking & Download) */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
        {/* Honest Download Notice */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block">Device-Direct Playback:</span>
            <span>Audio download is unavailable in browser-only mode. Speech is played directly through your device's audio hardware with zero latency and complete privacy.</span>
          </div>
        </div>

        {/* Honest Seeking Notice */}
        <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Browser Web Speech API renders speech in real-time. Seeking scrubbers are disabled because speech is synthesized on the fly without a static audio file.</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
