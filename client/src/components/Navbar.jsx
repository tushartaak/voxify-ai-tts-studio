import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, Sparkles, Menu, X, Radio, Settings as SettingsIcon, Info, HelpCircle } from 'lucide-react';

export const Navbar = ({ serverStatus }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Studio', path: '/studio' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-navy-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white bg-clip-text">
                  Voxify
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Transform your words into a voice
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action & Status Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Status Pill */}
            {serverStatus && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  serverStatus.browserSupported
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                    : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                }`}
                title={
                  serverStatus.browserSupported
                    ? 'Browser Web Speech Engine is active and ready (zero cloud keys, 100% free)'
                    : 'Web Speech API is not supported in this browser'
                }
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    serverStatus.browserSupported
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-rose-500'
                  }`}
                />
                <span className="hidden lg:inline">
                  {serverStatus.browserSupported ? 'Web Speech: Ready' : 'Speech Unsupported'}
                </span>
              </div>
            )}

            {/* Open Studio CTA Button */}
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-lg shadow-md shadow-brand-600/20 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Studio</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/studio"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-md"
            >
              Studio
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-navy-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <div className="text-xs text-slate-400 py-1 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  serverStatus?.browserSupported ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
              Speech Engine:{' '}
              {serverStatus?.browserSupported ? 'Browser Web Speech Ready' : 'Unsupported'}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
