import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Radio, X, ArrowRight, Lock, Phone, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

interface RoleSelectionModalProps {
  initialRole: 'CITIZEN' | 'EXECUTIVE';
  onClose: () => void;
  onSuccess: (role: 'CITIZEN' | 'EXECUTIVE') => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  initialRole,
  onClose,
  onSuccess
}) => {
  const { demoMode, citizenUser, setCitizenUser } = useEmergency();
  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'EXECUTIVE'>(initialRole);

  // Citizen OTP Flow State
  const [citizenStep, setCitizenStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneInput, setPhoneInput] = useState(citizenUser.phone || '+91 98765 43210');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Executive Flow State
  const [execId, setExecId] = useState('');
  const [execPassword, setExecPassword] = useState('');
  const [execError, setExecError] = useState('');

  // Handle citizen phone submit
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 7) {
      setOtpError('Please enter a valid phone number');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setCitizenStep('OTP');
      if (demoMode) {
        setOtpInput('123456');
      }
    }, 400);
  };

  // Handle citizen OTP submit
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456' || !demoMode) {
      setCitizenUser(prev => ({
        ...prev,
        phone: phoneInput
      }));
      onSuccess('CITIZEN');
    } else {
      setOtpError('Invalid OTP. Use demo code 123456.');
    }
  };

  // Handle Executive login
  const handleExecutiveLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (execId.trim() === '123' && execPassword.trim() === '123') {
      setExecError('');
      onSuccess('EXECUTIVE');
    } else {
      setExecError('Invalid credentials. Use ID: 123 and Password: 123');
    }
  };

  const useDemoCredentials = () => {
    setExecId('123');
    setExecPassword('123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#101C2B] border border-[#1E344F] rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E344F] bg-[#0A1420]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Select Access Role</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 p-3 gap-2 bg-[#09121D] border-b border-[#1E344F]">
          <button
            type="button"
            onClick={() => setSelectedRole('CITIZEN')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'CITIZEN'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <User className="w-4 h-4" />
            Citizen Portal
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('EXECUTIVE')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'EXECUTIVE'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-4 h-4" />
            Command Center
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {selectedRole === 'CITIZEN' ? (
            /* Citizen OTP Login */
            <div>
              {citizenStep === 'PHONE' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {demoMode && (
                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Demo OTP: <strong>123456</strong></span>
                    </div>
                  )}

                  {otpError && (
                    <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Enter OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setCitizenStep('PHONE')}
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl pl-10 pr-4 py-2.5 text-base tracking-widest font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {otpError && (
                    <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    Enter Citizen Portal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Executive Login */
            <div>
              <form onSubmit={handleExecutiveLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Operator ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={execId}
                      onChange={(e) => setExecId(e.target.value)}
                      placeholder="123"
                      className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={execPassword}
                      onChange={(e) => setExecPassword(e.target.value)}
                      placeholder="123"
                      className="w-full bg-[#0A1420] border border-[#1E344F] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span className="font-mono text-cyan-400 font-semibold">123 / 123</span>
                  <button
                    type="button"
                    onClick={useDemoCredentials}
                    className="text-xs px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors font-medium"
                  >
                    Auto Fill
                  </button>
                </div>

                {execError && (
                  <div className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{execError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 transition-all"
                >
                  Enter Command Center
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
