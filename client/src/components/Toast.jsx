import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div
        className={`p-4 rounded-xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            : isError
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : 'bg-navy-900/95 text-slate-200 border-slate-700'
        }`}
        role="status"
        aria-live="polite"
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
        {isInfo && <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />}

        <div className="flex-1 text-xs sm:text-sm leading-snug">
          {toast.message}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-0.5 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
