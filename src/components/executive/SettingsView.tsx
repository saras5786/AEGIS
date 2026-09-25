import React, { useState, useEffect } from 'react';
import { Settings, Key, Volume2, VolumeX, Shield, Trash2, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const SettingsView: React.FC = () => {
  const { demoMode, setDemoMode, soundEnabled, setSoundEnabled, resetSimulation } = useEmergency();

  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aegis_gemini_api_key');
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('aegis_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('aegis_gemini_api_key');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-4xl">
      <div className="border-b border-[#1E344F] pb-4">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
          Configuration
        </span>
        <h2 className="text-2xl font-black text-white mt-0.5">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure Gemini AI integration, sound feedback, demo controls, and local storage data.
        </p>
      </div>

      {/* AI Configuration */}
      <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Google Gemini API Key</h4>
            <p className="text-xs text-slate-400">
              Optional: Enter a Gemini API key for live LLM responses. If omitted, AEGIS uses the high-precision built-in offline engine.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveApiKey} className="space-y-3">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Stored securely in your local browser only. Never transmitted elsewhere.
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow"
            >
              {savedSuccess ? '✓ Saved!' : 'Save Key'}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Mode Toggle */}
      <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-white">Simulation Demo Mode</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Shows demo OTP helpers, auto-fills, and presentation scenario shortcuts.
          </p>
        </div>
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            demoMode
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(0,230,118,0.3)]'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {demoMode ? 'ENABLED' : 'DISABLED'}
        </button>
      </div>

      {/* Sound Toggle */}
      <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-white">Audio & Radio Effects</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Emergency alert beeps, incoming call chime, and radio dispatch sounds using Web Audio API.
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            soundEnabled
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {soundEnabled ? 'AUDIO ON' : 'MUTED'}
        </button>
      </div>

      {/* Privacy Notice and Reset */}
      <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Privacy & Simulation Storage
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          This educational simulation only stores sample reports and temporary location coordinates in your browser's local memory. You can wipe all demo records at any time.
        </p>

        <div className="pt-2">
          <button
            onClick={() => {
              if (confirm('Reset all demo incidents and responder units back to factory state?')) {
                resetSimulation();
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Demo Reports & Reset State
          </button>
        </div>
      </div>
    </div>
  );
};
