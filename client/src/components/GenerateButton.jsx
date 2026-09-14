import React from 'react';
import { Volume2, Sparkles, Loader2, Square } from 'lucide-react';

export const GenerateButton = ({
  onClick,
  isGenerating,
  disabled,
  textLength
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl relative overflow-hidden group ${
        disabled
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
          : isGenerating
          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-500/25 border border-emerald-400/40 animate-pulse'
          : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0 border border-brand-400/30'
      }`}
      aria-live="polite"
      aria-label={isGenerating ? 'Speech is actively playing' : 'Speak entered text'}
    >
      {isGenerating ? (
        <>
          <Volume2 className="w-5 h-5 animate-bounce text-emerald-200" />
          <span className="font-semibold text-white">Speaking Text Aloud...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-brand-300 group-hover:rotate-12 transition-transform duration-300" />
          <span>Speak Text</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
