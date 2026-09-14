import React from 'react';
import {
  Code2,
  Server,
  Cpu,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title & Introduction */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Project Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Voxify AI Studio
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Voxify is a production-ready, full-stack text-to-speech studio engineered as an internship capstone
          project. It illustrates modern full-stack web architecture, cloud API orchestration, and accessible UX design.
        </p>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400" />
            Problem Statement
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Content creators, educators, and developers often face friction converting written prose into high-fidelity
            synthetic speech. Many existing tools are either bloated with paywalls, lack regional language support (like Hindi, Gujarati, or Marathi),
            or fail to provide modular architectural clean separation between frontend presentation and backend services.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Project Objectives
          </h2>
          <ul className="text-xs sm:text-sm text-slate-400 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Deliver real-time text-to-speech with character & word analytics.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Browser-native Web Speech API with zero cloud billing, zero API keys, and no credit card required.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Implement custom accessible speech controls with boundary tracking and pause/resume.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Ensure complete on-device privacy with zero external voice transmission.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Full-Stack Architecture Diagram */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" />
          Full-Stack Architectural Design
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Client Tier */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-brand-500/30 space-y-2">
            <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
              <Code2 className="w-4 h-4" /> Client Layer
            </div>
            <ul className="text-slate-400 space-y-1">
              <li>• React 18 SPA + Vite</li>
              <li>• Tailwind CSS Design System</li>
              <li>• React Router Dom</li>
              <li>• Web Speech API Service</li>
              <li>• Dynamic Voice Enumeration</li>
              <li>• Accessible ARIA States</li>
            </ul>
          </div>

          {/* Backend Tier */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Server className="w-4 h-4" /> Express API Gateway
            </div>
            <ul className="text-slate-400 space-y-1">
              <li>• Health Check (/api/health)</li>
              <li>• Input Validation</li>
              <li>• Express-Rate-Limit</li>
              <li>• Helmet Security Headers</li>
              <li>• CORS Policy Protection</li>
              <li>• Lightweight Node Service</li>
            </ul>
          </div>

          {/* Engine Tier */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Cpu className="w-4 h-4" /> Speech Engine Layer
            </div>
            <ul className="text-slate-400 space-y-1">
              <li>• window.speechSynthesis</li>
              <li>• SpeechSynthesisUtterance</li>
              <li>• Operating System Voice Library</li>
              <li>• 100% Free / Zero Cloud Billing</li>
              <li>• Zero Remote Latency</li>
              <li>• Complete Audio Privacy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Internship Learning Outcomes */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Internship Key Learning Outcomes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-850">
            <span className="font-semibold text-white block mb-1">Browser Speech API Architecture</span>
            Seamless integration with browser-native speech synthesis, asynchronous voice loading (`onvoiceschanged`), and keep-alive controllers.
          </div>
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-850">
            <span className="font-semibold text-white block mb-1">Defense-in-Depth Security</span>
            Rate limiting, strict length caps, Helmet security headers, and zero secret leakage.
          </div>
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-850">
            <span className="font-semibold text-white block mb-1">Local-First Privacy</span>
            Processing and speaking text locally on the client machine with zero third-party transmission or cloud storage.
          </div>
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-850">
            <span className="font-semibold text-white block mb-1">Accessible Frontend Engineering</span>
            Semantic HTML5, custom interactive speech controllers, reactive counters, and screen-reader compatibility.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
