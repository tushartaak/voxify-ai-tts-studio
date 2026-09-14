import React from 'react';
import { Sliders, RotateCcw, FastForward, Activity, VolumeX, Volume2 } from 'lucide-react';

export const AudioSettings = ({
  speakingRate,
  setSpeakingRate,
  pitch,
  setPitch,
  volume,
  setVolume,
  onReset
}) => {
  return (
    <div className="bg-navy-900/90 rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-4 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-400" />
          <span>Speech Customization</span>
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Speaking Rate / Speed slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="voxify-rate-slider" className="font-medium text-slate-300 flex items-center gap-1.5">
            <FastForward className="w-3.5 h-3.5 text-indigo-400" />
            <span>Speaking Speed</span>
          </label>
          <span className="font-mono text-brand-300 font-semibold">{speakingRate.toFixed(2)}x</span>
        </div>
        <input
          id="voxify-rate-slider"
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={speakingRate}
          onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Adjust speaking speed"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0.5x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>2.0x (Fast)</span>
        </div>
      </div>

      {/* Pitch Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="voxify-pitch-slider" className="font-medium text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Pitch Adjustment</span>
          </label>
          <span className="font-mono text-purple-300 font-semibold">
            {pitch > 0 ? `+${pitch.toFixed(1)}` : pitch.toFixed(1)} st
          </span>
        </div>
        <input
          id="voxify-pitch-slider"
          type="range"
          min="-10.0"
          max="10.0"
          step="0.5"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Adjust voice pitch"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>-10 (Deeper)</span>
          <span>0 (Natural)</span>
          <span>+10 (Higher)</span>
        </div>
      </div>

      {/* Volume Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="voxify-volume-slider" className="font-medium text-slate-300 flex items-center gap-1.5">
            {volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Master Volume</span>
          </label>
          <span className="font-mono text-emerald-300 font-semibold">{Math.round(volume * 100)}%</span>
        </div>
        <input
          id="voxify-volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Adjust master output volume"
        />
      </div>
    </div>
  );
};

export default AudioSettings;
