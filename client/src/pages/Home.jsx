import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Globe2,
  Mic,
  PlayCircle,
  Download,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  FileText,
  Sliders,
  Radio,
  Volume2
} from 'lucide-react';

export const Home = ({ serverStatus }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/how-it-works' || location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const features = [
    {
      icon: Globe2,
      title: 'Global Multilingual Reach',
      description: 'Synthesize speech across dozens of world languages and regional Indian accents including Hindi, Gujarati, Marathi, and English variants.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: Mic,
      title: 'Installed Browser Voices',
      description: 'Access natural installed operating-system voices across macOS, Windows, iOS, Android, and Linux speech engines.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      icon: PlayCircle,
      title: 'Real-time Studio Playback',
      description: 'Listen, pause, resume, and control voice playback in real time with live speech boundary progress feedback.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: ShieldCheck,
      title: '100% Free & Zero Cloud Keys',
      description: 'Completely free with no Google Cloud account, no credit card, no API keys, and zero cloud billing surprises.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: 'Complete Device Privacy',
      description: 'Text is spoken directly through your device audio hardware. No scripts or audio files are ever uploaded or stored remotely.',
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20'
    },
    {
      icon: Smartphone,
      title: 'Fluid Responsive UX',
      description: 'Meticulously crafted for mobile, tablet, and widescreen desktop monitors with dark-mode aesthetic and keyboard accessibility.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Enter or Paste Text',
      description: 'Type your script or choose from curated multilingual presets with instant character and word counting.',
      icon: FileText
    },
    {
      step: '02',
      title: 'Pick Language & Voice',
      description: 'Select your target language, audition installed system voices, and customize speech rate, pitch, and volume.',
      icon: Sliders
    },
    {
      step: '03',
      title: 'Speak Instantly',
      description: 'The browser Web Speech engine vocalizes your text in real time with instant response and zero latency.',
      icon: Sparkles
    },
    {
      step: '04',
      title: 'Control & Replay',
      description: 'Pause, resume, replay, or stop speech anytime with full on-screen progress synchronization.',
      icon: PlayCircle
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Live Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-750 text-xs font-medium text-slate-300 shadow-md mb-6 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span className="text-brand-300 font-semibold">Voxify Studio 1.0</span>
          <span className="text-slate-500">•</span>
          <span>Internship Project Showcase</span>
        </div>

        {/* Primary Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Give Your Words <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            a Natural Voice.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Convert written content into natural-sounding speech with flexible language and voice
          options. Engineered with modular cloud APIs and a modern studio experience.
        </p>

        {/* CTA Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/studio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
          >
            <Sparkles className="w-5 h-5 text-brand-200" />
            <span>Start Creating</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-sm sm:text-base"
          >
            <span>Explore Features</span>
          </a>
        </div>

        {/* Visual Preview Card (Realistic Studio Interface Mockup) */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-750 shadow-2xl shadow-navy-950/80 backdrop-blur-xl">
          <div className="rounded-xl bg-navy-950/90 border border-slate-850 p-4 sm:p-6 text-left">
            {/* Mockup Top Window Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">voxify.studio/synthesize</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Interactive Studio Preview
              </span>
            </div>

            {/* Mockup Interior Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
              <div className="lg:col-span-2 bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Script Editor</span>
                  <span className="text-[11px] text-slate-500 font-mono">142 chars • 24 words</span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-lg text-xs sm:text-sm text-slate-300 font-mono leading-relaxed border border-slate-850">
                  "Welcome to Voxify, the premier AI Text-to-Speech Studio. Experience crisp, lifelike synthetic speech across global languages."
                </div>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold text-slate-300">Active Parameters</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Language:</span>
                    <span className="text-slate-200 font-medium">English (US)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Voice:</span>
                    <span className="text-brand-300 font-medium">System Native Voice</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Engine:</span>
                    <span className="text-slate-200 font-medium">Web Speech API (Local)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup Audio Bar */}
            <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Audition Player Ready</span>
                  <span className="text-slate-400 text-[11px]">Click 'Start Creating' to synthesize live audio</span>
                </div>
              </div>
              <Link
                to="/studio"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors"
              >
                Launch Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-2">
            Engineered Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything you need in an audio studio
          </p>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Built from scratch to demonstrate full-stack architecture, secure API orchestration, and accessible UX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm group"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-navy-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-2">
              Simple 4-Step Process
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              How Voxify Converts Text to Speech
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative p-5 rounded-2xl bg-slate-950/60 border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-extrabold text-brand-500/40">{s.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try the Studio Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
