import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertCircle,
  PhoneCall,
  Ambulance,
  Navigation,
  Building2,
  CheckCircle,
  ArrowRight,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { RoleSelectionModal } from '../auth/RoleSelectionModal';

export const LandingPage: React.FC = () => {
  const { setRole } = useEmergency();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'CITIZEN' | 'EXECUTIVE'>('CITIZEN');

  const openAuth = (roleType: 'CITIZEN' | 'EXECUTIVE') => {
    setAuthDefaultRole(roleType);
    setAuthModalOpen(true);
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Clean, punchy pipeline steps with no extra paragraph clutter
  const pipelineSteps = [
    { num: '01', title: 'Report Incident', icon: <AlertCircle className="w-5 h-5 text-red-400" /> },
    { num: '02', title: 'AI Verification', icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
    { num: '03', title: 'Call Confirmation', icon: <PhoneCall className="w-5 h-5 text-amber-400" /> },
    { num: '04', title: 'Command Center', icon: <Radio className="w-5 h-5 text-blue-400" /> },
    { num: '05', title: 'Dispatch Team', icon: <Ambulance className="w-5 h-5 text-emerald-400" /> },
    { num: '06', title: 'Live Movement', icon: <Navigation className="w-5 h-5 text-purple-400" /> },
    { num: '07', title: 'Hospital Alert', icon: <Building2 className="w-5 h-5 text-teal-400" /> },
    { num: '08', title: 'Resolution', icon: <CheckCircle className="w-5 h-5 text-green-400" /> }
  ];

  return (
    <div className="relative min-h-screen bg-[#07111F] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.12),rgba(255,255,255,0))]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-[#1E344F]/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-white">AEGIS</span>
            <span className="block text-[10px] tracking-widest text-cyan-400 font-mono uppercase">AI Command OS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth('CITIZEN')}
            className="text-xs sm:text-sm px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all border border-slate-700/60"
          >
            Citizen Login
          </button>
          <button
            onClick={() => openAuth('EXECUTIVE')}
            className="text-xs sm:text-sm px-4 py-2 rounded-lg font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
          >
            Command Center
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 flex-1 flex flex-col items-center text-center justify-center">
        {/* SLOW, SMOOTH AEGIS LOGO REVEAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-6"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl animate-pulse-subtle" />
            <div className="relative p-5 rounded-2xl bg-gradient-to-b from-[#162536] to-[#0A1420] border border-cyan-500/40 shadow-[0_0_40px_rgba(0,229,255,0.25)]">
              <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-2">
            AEGIS
          </h1>
          <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-cyan-400 font-mono">
            AI Emergency Command & Response System
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-3 tracking-tight leading-snug">
            “Seconds Matter. Information Should Move Faster.”
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Coordinated emergency response powered by real-time geolocation and AI triage.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
        >
          <button
            onClick={() => openAuth('CITIZEN')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-base shadow-[0_0_25px_rgba(255,51,75,0.4)] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <AlertCircle className="w-5 h-5 animate-pulse" />
            REPORT EMERGENCY
          </button>

          <button
            onClick={() => openAuth('EXECUTIVE')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-base border border-cyan-500/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Radio className="w-5 h-5" />
            COMMAND CENTER
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-6"
        >
          <button
            onClick={scrollToHowItWorks}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors underline underline-offset-4"
          >
            See response workflow
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Stats Banner - clean, without extra descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-14 max-w-4xl"
        >
          <div className="glass-panel p-4 rounded-xl border border-[#1E344F] text-left">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Verification Speed
            </div>
            <div className="text-2xl font-black text-white">~35 Sec</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#1E344F] text-left">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
              <Ambulance className="w-3.5 h-3.5 text-emerald-400" />
              Fleet Units
            </div>
            <div className="text-2xl font-black text-emerald-400">10 Active</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#1E344F] text-left">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Hospital Network
            </div>
            <div className="text-2xl font-black text-blue-400">5 Centers</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-[#1E344F] text-left">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              False Alarm Filter
            </div>
            <div className="text-2xl font-black text-amber-400">Active</div>
          </div>
        </motion.div>
      </main>

      {/* Visual Pipeline Section - Clean, no paragraphs */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-16 border-t border-[#1E344F]/60 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">Workflow</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Incident Response Pipeline</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pipelineSteps.map((step) => (
            <div
              key={step.num}
              className="glass-panel rounded-xl p-4 border border-[#1E344F] hover:border-cyan-500/40 transition-all flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {step.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 block">
                  {step.num}
                </span>
                <h4 className="font-bold text-slate-100 text-xs sm:text-sm">{step.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-[#1E344F] bg-[#050D18] py-6 px-6 text-center text-xs text-slate-500">
        <p>AEGIS Command OS • Emergency Coordination Platform</p>
      </footer>

      {/* Role Selection Modal */}
      {authModalOpen && (
        <RoleSelectionModal
          initialRole={authDefaultRole}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(selectedRole) => {
            setAuthModalOpen(false);
            setRole(selectedRole);
          }}
        />
      )}
    </div>
  );
};
