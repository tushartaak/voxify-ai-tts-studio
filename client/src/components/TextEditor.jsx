import React, { useState } from 'react';
import { FileText, Trash2, Sparkles, AlertCircle, ChevronDown } from 'lucide-react';
import { SAMPLE_TEXTS } from '../utils/sampleTexts';

export const TextEditor = ({
  text,
  setText,
  characterCount,
  wordCount,
  maxCharacters,
  isApproachingLimit,
  isOverLimit,
  onClearText,
  onApplySample,
  error
}) => {
  const [samplesOpen, setSamplesOpen] = useState(false);
  const remainingChars = maxCharacters - characterCount;
  const percentUsed = Math.min(100, (characterCount / maxCharacters) * 100);

  return (
    <div className="bg-navy-900/90 rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-xl relative backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Header section with heading and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <span>What would you like to say?</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Type or paste your script below. The engine synthesizes pauses, commas, and punctuation naturally.
          </p>
        </div>

        {/* Action buttons: Samples dropdown & Clear */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Sample text picker dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSamplesOpen(!samplesOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-750 hover:text-white border border-slate-700/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={samplesOpen}
              aria-haspopup="true"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Sample Texts</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${samplesOpen ? 'rotate-180' : ''}`} />
            </button>

            {samplesOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-navy-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-30 divide-y divide-slate-800"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select a Sample Script
                </div>
                {SAMPLE_TEXTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onApplySample(sample);
                      setSamplesOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group"
                    role="menuitem"
                  >
                    <span className="truncate">{sample.label}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-brand-300 uppercase">
                      {sample.language}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear text button */}
          <button
            type="button"
            onClick={onClearText}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-slate-400 bg-slate-800/40 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            title="Clear all text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <label htmlFor="voxify-text-input" className="sr-only">
          Text to convert to speech
        </label>
        <textarea
          id="voxify-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste the text you want to convert into speech..."
          rows={9}
          className={`w-full bg-slate-950/70 text-slate-100 rounded-xl p-4 text-sm sm:text-base leading-relaxed border transition-all resize-y font-normal focus:outline-none focus:ring-2 placeholder:text-slate-500 ${
            isOverLimit
              ? 'border-rose-500/80 focus:ring-rose-500/60 focus:border-rose-500'
              : isApproachingLimit
              ? 'border-amber-500/80 focus:ring-amber-500/60 focus:border-amber-500'
              : 'border-slate-850 focus:border-brand-500 focus:ring-brand-500/40'
          }`}
          aria-invalid={isOverLimit}
          aria-describedby="char-count-desc"
        />

        {/* Floating remaining characters pill when typing */}
        {characterCount > 0 && (
          <div
            className={`absolute bottom-3 right-3 px-2 py-0.5 rounded text-[11px] font-mono font-medium backdrop-blur-sm transition-opacity ${
              isOverLimit
                ? 'bg-rose-950/90 text-rose-300 border border-rose-800'
                : isApproachingLimit
                ? 'bg-amber-950/90 text-amber-300 border border-amber-800'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800'
            }`}
          >
            {remainingChars >= 0 ? `${remainingChars} left` : `${Math.abs(remainingChars)} over limit`}
          </div>
        )}
      </div>

      {/* Progress line indicator */}
      <div className="w-full bg-slate-800/80 rounded-full h-1 mt-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOverLimit
              ? 'bg-rose-500'
              : isApproachingLimit
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-brand-500 to-indigo-500'
          }`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      {/* Footer Counters and Warnings */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs text-slate-400" id="char-count-desc">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-200">{characterCount.toLocaleString()}</span> /{' '}
            <span>{maxCharacters.toLocaleString()} characters</span>
          </span>
          <span className="border-l border-slate-800 pl-4">
            <span className="font-semibold text-slate-200">{wordCount.toLocaleString()}</span> words
          </span>
        </div>

        {/* Warning messages if approaching or over limit */}
        {isOverLimit ? (
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Exceeds maximum limit of {maxCharacters.toLocaleString()} characters</span>
          </div>
        ) : isApproachingLimit ? (
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Approaching maximum character limit</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">Max limit: 5,000 chars per generation</span>
        )}
      </div>

      {/* Inline text validation error */}
      {error && (
        <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
