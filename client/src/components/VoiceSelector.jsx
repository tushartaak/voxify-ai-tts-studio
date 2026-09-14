import React, { useState } from 'react';
import { Mic2, User, Volume2, StopCircle, AlertCircle, Info } from 'lucide-react';
import browserSpeechService from '../services/browserSpeechService';

export const VoiceSelector = ({
  voice,
  setVoice,
  availableVoices = [],
  allBrowserVoices = [],
  loading = false,
  language
}) => {
  const [previewingVoice, setPreviewingVoice] = useState(null);

  const selectedVoiceObj = availableVoices.find((v) => v.name === voice);

  // Quick vocal preview using browser speech synthesis
  const handlePreview = (voiceItem) => {
    if (previewingVoice === voiceItem.name) {
      browserSpeechService.cancel();
      setPreviewingVoice(null);
      return;
    }

    setPreviewingVoice(voiceItem.name);
    const previewSample = `Hello! This is ${voiceItem.name}, speaking through your browser's speech synthesis engine.`;

    browserSpeechService.speak({
      text: previewSample,
      voice: voiceItem,
      lang: voiceItem.lang || language,
      rate: 1.0,
      pitch: 0.0,
      volume: 1.0,
      onEnd: () => setPreviewingVoice(null),
      onError: () => setPreviewingVoice(null)
    });
  };

  const hasNoGlobalVoices = !loading && allBrowserVoices.length === 0;
  const hasNoLanguageVoices = !loading && allBrowserVoices.length > 0 && availableVoices.length === 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="voxify-voice-select"
          className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Mic2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Select Voice ({availableVoices.length})</span>
        </label>
        {selectedVoiceObj && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-brand-300 border border-slate-750">
            {selectedVoiceObj.localService ? 'Local/Offline' : 'Remote'} • {selectedVoiceObj.lang}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id="voxify-voice-select"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          disabled={loading || availableVoices.length === 0}
          className="w-full bg-slate-950/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm border border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 focus:outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
        >
          {loading ? (
            <option value="">Loading installed browser voices...</option>
          ) : hasNoGlobalVoices ? (
            <option value="">No voices available in browser</option>
          ) : hasNoLanguageVoices ? (
            <option value="">No installed browser voice is available for this language.</option>
          ) : (
            availableVoices.map((v) => (
              <option key={v.name} value={v.name} className="bg-navy-900 text-slate-100 py-1">
                {v.name} ({v.lang}) {v.default ? '— [Default]' : ''}
              </option>
            ))
          )}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Global No-Voices Warning */}
      {hasNoGlobalVoices && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">No speech voices are available in this browser.</p>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              Please use Chrome, Edge, Safari, or ensure speech synthesis voices are installed in your OS.
            </p>
          </div>
        </div>
      )}

      {/* Language-Specific No-Voices Notice */}
      {hasNoLanguageVoices && (
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/60 text-xs text-blue-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-300">No installed browser voice is available for this language.</p>
            <p className="text-[11px] text-blue-200/80 mt-0.5">
              Voices depend on your operating system and browser's installed speech engines. You can install additional language voice packs in your OS Settings (macOS Voices, Windows Speech Language Packs).
            </p>
          </div>
        </div>
      )}

      {/* Selected Voice Details & Preview CTA */}
      {selectedVoiceObj && (
        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="font-semibold text-slate-200 truncate">{selectedVoiceObj.name}</div>
              <div className="text-[11px] text-slate-400">
                {selectedVoiceObj.lang} • {selectedVoiceObj.localService ? 'On-Device Speech Engine' : 'Network Speech Engine'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handlePreview(selectedVoiceObj)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all flex-shrink-0 ${
              previewingVoice === selectedVoiceObj.name
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Preview this voice in your browser"
          >
            {previewingVoice === selectedVoiceObj.name ? (
              <>
                <StopCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
