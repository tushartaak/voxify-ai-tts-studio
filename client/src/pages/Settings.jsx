import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Shield,
  Volume2,
  StopCircle,
  Globe,
  Radio,
  Check
} from 'lucide-react';
import { checkHealth } from '../services/api';
import browserSpeechService from '../services/browserSpeechService';

export const Settings = ({ serverStatus, onRefreshStatus }) => {
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState(null);
  const [browserVoices, setBrowserVoices] = useState([]);
  const [testingVoice, setTestingVoice] = useState(false);
  const [voiceFilter, setVoiceFilter] = useState('');

  const isSupported = browserSpeechService.isSupported();

  useEffect(() => {
    const loadVoices = () => {
      setBrowserVoices(browserSpeechService.getVoices());
    };
    loadVoices();
    const unsubscribe = browserSpeechService.onVoicesChanged((voices) => {
      setBrowserVoices(voices);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const runDiagnostics = async () => {
    setTestingHealth(true);
    try {
      const data = await checkHealth();
      setHealthResult({ success: true, data });
    } catch (err) {
      setHealthResult({ success: false, error: err.message });
    } finally {
      setTestingHealth(false);
      if (onRefreshStatus) onRefreshStatus();
    }
  };

  const handleTestVoice = () => {
    if (testingVoice) {
      browserSpeechService.cancel();
      setTestingVoice(false);
      return;
    }

    setTestingVoice(true);
    browserSpeechService.speak({
      text: 'Web Speech API is functioning normally on your device.',
      rate: 1.0,
      pitch: 0.0,
      volume: 1.0,
      onEnd: () => setTestingVoice(false),
      onError: () => setTestingVoice(false)
    });
  };

  const filteredVoices = browserVoices.filter((v) =>
    v.name.toLowerCase().includes(voiceFilter.toLowerCase()) ||
    (v.lang || '').toLowerCase().includes(voiceFilter.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-brand-400" />
          <span>Speech Engine & Diagnostics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect browser-native speech synthesis, view installed device voices, and test audio playback with zero cloud keys.
        </p>
      </div>

      {/* Web Speech API Diagnostic Status */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-brand-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Browser Speech Engine Diagnostics</h2>
              <p className="text-xs text-slate-400">Operating System & Browser SpeechSynthesis Controller</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={!isSupported || browserVoices.length === 0}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
              testingVoice
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            {testingVoice ? (
              <>
                <StopCircle className="w-3.5 h-3.5 animate-pulse" />
                <span>Stop Test Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Test Phrase</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 block mb-1">Speech API Support</span>
            <span className={`font-semibold flex items-center gap-1.5 ${isSupported ? 'text-emerald-400' : 'text-rose-400'}`}>
              <CheckCircle2 className="w-4 h-4" />
              {isSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 block mb-1">Installed Voices</span>
            <span className="font-semibold text-brand-300 font-mono text-sm">
              {browserVoices.length} detected
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 block mb-1">Billing & Cloud Keys</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              100% Free / Zero Keys
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850">
            <span className="text-slate-500 block mb-1">Express Backend Health</span>
            <span className={`font-semibold flex items-center gap-1.5 ${serverStatus.isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${serverStatus.isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              {serverStatus.isOnline ? 'Healthy' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Backend Connectivity Ping */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Need to test backend communication?
          </span>
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={testingHealth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
            <span>Ping Backend (/api/health)</span>
          </button>
        </div>

        {healthResult && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block mb-1">Backend Ping Response:</span>
            <pre className="text-emerald-300 whitespace-pre-wrap">
              {JSON.stringify(healthResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Installed Voices Directory */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-400" />
              <span>Installed Device Voices ({browserVoices.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Voices installed on your operating system (macOS, Windows, Linux, iOS, Android) available to Voxify.
            </p>
          </div>
          <input
            type="text"
            value={voiceFilter}
            onChange={(e) => setVoiceFilter(e.target.value)}
            placeholder="Search voices or lang..."
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-500 w-full sm:w-56"
          />
        </div>

        {browserVoices.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-400 text-center">
            No voices detected in your browser yet. Ensure your browser supports speech synthesis or wait a moment for voices to populate.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-850 rounded-xl bg-slate-950/50 border border-slate-850">
            {filteredVoices.slice(0, 50).map((v, idx) => (
              <div key={`${v.name}-${v.lang}-${idx}`} className="p-3 flex items-center justify-between text-xs hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-slate-200 mr-2">{v.name}</span>
                    {v.default && (
                      <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">
                        DEFAULT
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 flex-shrink-0 font-mono text-[11px]">
                  <span>{v.lang}</span>
                  <span>•</span>
                  <span>{v.localService ? 'Local/Offline' : 'Network'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy & Zero-Billing Architecture Card */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Privacy & Architecture Guarantee</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Voxify uses the browser-native <strong className="text-slate-200">Web Speech API (<code className="font-mono text-brand-300">window.speechSynthesis</code>)</strong>. Text is vocalized entirely through your local operating system audio hardware. No audio waveforms or spoken scripts are transmitted to Google Cloud, external payment processors, or cloud servers.
        </p>
      </div>
    </div>
  );
};

export default Settings;
