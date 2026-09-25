import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Mic, CheckCircle2, AlertTriangle, X, ShieldAlert, Sparkles } from 'lucide-react';
import { sound } from '../../services/audioService';
import { Incident } from '../../types';

interface SimulatedCallModalProps {
  incident: Incident;
  onClose: () => void;
  onVerify: (notes: string) => void;
  onMarkFalseReport: (notes: string) => void;
}

export const SimulatedCallModal: React.FC<SimulatedCallModalProps> = ({
  incident,
  onClose,
  onVerify,
  onMarkFalseReport
}) => {
  const [callDuration, setCallDuration] = useState<number>(0);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const [verificationNotes, setVerificationNotes] = useState<string>(
    `Citizen confirmed emergency at ${incident.location.address || 'location'}. Priority confirmed.`
  );

  // Audio ringtone loop
  useEffect(() => {
    const stopAudio = sound.playPhoneRing();
    const connectTimer = setTimeout(() => {
      stopAudio();
      setCallConnected(true);
    }, 2800);

    return () => {
      stopAudio();
      clearTimeout(connectTimer);
    };
  }, []);

  // Timer counter
  useEffect(() => {
    if (!callConnected) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callConnected]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#101C2B] border border-[#1E344F] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#1E344F] bg-[#0A1420] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Phone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Simulated Operator Call
              </span>
              <h3 className="font-bold text-white text-sm">
                Incident #{incident.displayNumber} Verification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Call Animation Body */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-3">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                callConnected ? 'bg-emerald-950/80 border-2 border-emerald-500 shadow-[0_0_25px_rgba(0,230,118,0.3)]' : 'bg-cyan-950/80 border-2 border-cyan-500 animate-pulse shadow-[0_0_20px_rgba(0,229,255,0.3)]'
              }`}>
                {callConnected ? (
                  <Mic className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Phone className="w-8 h-8 text-cyan-400 animate-bounce" />
                )}
              </div>
            </div>

            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
              {callConnected ? 'Call Connected (Simulated)' : 'Ringing Citizen Phone...'}
            </span>
            <h4 className="text-lg font-bold text-white mt-0.5">{incident.citizenPhone}</h4>
            <div className="font-mono text-cyan-300 font-bold text-sm mt-1">
              {callConnected ? formatTimer(callDuration) : 'Dialing...'}
            </div>
          </div>

          {/* Simulated Speech Transcript */}
          {callConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#09121D] border border-cyan-500/30 text-xs space-y-2"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulated Citizen Voice Transcript:</span>
              </div>
              <p className="text-slate-300 italic leading-relaxed bg-[#060D15] p-3 rounded-lg border border-slate-800">
                “Hello, AEGIS? Yes, I am right here at {incident.location.address || 'the scene'}! {incident.description} We need immediate emergency support!”
              </p>
            </motion.div>
          )}

          {/* Call Verification Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Operator Verification Notes:
            </label>
            <textarea
              rows={2}
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Decision Buttons */}
        <div className="p-4 border-t border-[#1E344F] bg-[#0A1420] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onMarkFalseReport(verificationNotes)}
            className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Mark as False Report
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              End Call
            </button>
            <button
              onClick={() => onVerify(verificationNotes)}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,230,118,0.4)] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify Incident
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
