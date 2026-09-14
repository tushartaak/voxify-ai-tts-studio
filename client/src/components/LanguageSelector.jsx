import React from 'react';
import { Globe, Loader2 } from 'lucide-react';

export const LanguageSelector = ({
  language,
  setLanguage,
  languages,
  loading
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="voxify-language-select"
          className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-brand-400" />
          <span>Select Language</span>
        </label>
        {loading && (
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin text-brand-400" />
            <span>Updating voices...</span>
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id="voxify-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={loading}
          className="w-full bg-slate-950/80 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm border border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 focus:outline-none appearance-none cursor-pointer transition-all disabled:opacity-50"
        >
          {languages.map((lang) => {
            const count = lang.installedVoicesCount ?? 0;
            return (
              <option key={lang.code} value={lang.code} className="bg-navy-900 text-slate-100 py-1">
                {lang.flag} {lang.name} ({lang.code}) {count > 0 ? `• ${count} voice${count === 1 ? '' : 's'}` : '• No installed voice'}
              </option>
            );
          })}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
