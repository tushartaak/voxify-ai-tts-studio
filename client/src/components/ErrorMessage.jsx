import React from 'react';
import { AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-200 text-sm flex items-start justify-between gap-3 shadow-lg animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-rose-300">Action Failed</h4>
          <p className="text-rose-200/90 text-xs leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-2.5 py-1 text-xs rounded bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-rose-400 hover:text-white transition-colors"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
