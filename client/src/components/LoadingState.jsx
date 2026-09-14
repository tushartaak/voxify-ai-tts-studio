import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingState = ({ message = 'Processing speech...' }) => {
  return (
    <div className="p-8 rounded-2xl bg-navy-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-brand-400" />
        </div>
        <Loader2 className="w-16 h-16 absolute -top-1 -left-1 text-brand-500 animate-spin opacity-80" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white">{message}</h4>
        <p className="text-xs text-slate-400">
          Synthesizing audio frequencies, cadence, and prosody
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
