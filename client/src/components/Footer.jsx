import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, Heart, Shield, Terminal, Cpu, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-850 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Voxify</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Voxify is a professional AI Text-to-Speech Studio designed to convert written
              content into expressive, natural-sounding voiceovers across global languages.
              Engineered with full-stack best practices for an internship demonstration.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                <Code2 className="w-3 h-3 text-brand-400" /> React 18 + Vite
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                <Terminal className="w-3 h-3 text-emerald-400" /> Node.js Express
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                <Cpu className="w-3 h-3 text-purple-400" /> Web Speech API
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-white transition-colors">
                  TTS Studio
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Architecture & Docs
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Engine Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Security & Standards
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Client-side Secret Exposure</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Express Rate-limiting & Helmet</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Temporary Audio Auto-Cleanup</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Semantic & Accessible HTML5</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Voxify AI Text-to-Speech Studio. Built for Internship Submission.</p>
          <p className="flex items-center gap-1.5">
            Architected with precision & modern web standards
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
