import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Ambulance, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEmergency();

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />;
      case 'dispatch':
        return <Ambulance className="w-5 h-5 text-cyan-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'border-red-500/50 bg-red-950/80 shadow-red-950/40';
      case 'dispatch':
        return 'border-cyan-500/50 bg-cyan-950/80 shadow-cyan-950/40';
      case 'success':
        return 'border-emerald-500/50 bg-emerald-950/80 shadow-emerald-950/40';
      case 'warning':
        return 'border-amber-500/50 bg-amber-950/80 shadow-amber-950/40';
      default:
        return 'border-blue-500/50 bg-[#101C2B] shadow-black/50';
    }
  };

  return (
    <div className="fixed top-12 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto rounded-xl p-3.5 border backdrop-blur-xl shadow-xl flex items-start justify-between gap-3 ${getBorderColor(toast.type)}`}
          >
            <div className="flex items-start gap-2.5">
              {getIcon(toast.type)}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold tracking-wider uppercase text-white">{toast.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{toast.time}</span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
