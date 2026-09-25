import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertCircle,
  Clock,
  MapPin,
  Ambulance,
  CheckCircle2,
  User,
  LogOut,
  Radio,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { ReportEmergencyModal } from './ReportEmergencyModal';
import { CommandMap } from '../maps/CommandMap';

export const CitizenDashboard: React.FC = () => {
  const {
    citizenUser,
    incidents,
    responders,
    setRole,
    soundEnabled,
    setSoundEnabled,
    selectedIncidentId,
    setSelectedIncidentId
  } = useEmergency();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'LIST' | 'MAP'>('LIST');

  // Filter incidents for this citizen
  const myIncidents = incidents.filter(
    i => i.citizenPhone === citizenUser.phone || i.id === 'INC-1042'
  );

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col pb-16">
      {/* Top Mobile/Desktop Navigation */}
      <header className="sticky top-0 z-30 bg-[#0A1420]/90 backdrop-blur-md border-b border-[#1E344F] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-wide">AEGIS</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/40">
                Citizen Portal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setRole('EXECUTIVE')}
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-[#1E344F] text-cyan-400 font-medium transition-colors"
          >
            <Radio className="w-3.5 h-3.5" />
            Command Center
          </button>

          <button
            onClick={() => setRole('LANDING')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* User Status Bar */}
        <div className="p-3 rounded-xl bg-[#09121D] border border-[#1E344F] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-mono">{citizenUser.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              {citizenUser.reputationStatus}
            </span>
          </div>
        </div>

        {/* Primary Action Card: REPORT EMERGENCY */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#1A0E15] via-[#121B27] to-[#0D1824] border border-red-500/40 shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Witnessing an emergency?
          </h2>

          <button
            onClick={() => setReportModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-lg sm:text-xl shadow-[0_0_30px_rgba(255,51,75,0.45)] flex items-center justify-center gap-3 mx-auto transition-all transform hover:scale-[1.02] active:scale-95 my-3"
          >
            <AlertCircle className="w-6 h-6 animate-pulse" />
            🚨 REPORT EMERGENCY
          </button>
        </motion.div>

        {/* Tab switch */}
        <div className="flex items-center justify-between border-b border-[#1E344F] pb-2">
          <h3 className="font-bold text-base text-white">Emergency Reports</h3>
          <div className="flex items-center gap-1 bg-[#09121D] p-1 rounded-lg border border-[#1E344F]">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'LIST'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'MAP'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Map
            </button>
          </div>
        </div>

        {/* Tab 1: Incident List Cards */}
        {activeTab === 'LIST' ? (
          <div className="space-y-4">
            {myIncidents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#09121D] border border-[#1E344F] text-slate-400 text-xs">
                No emergencies reported yet.
              </div>
            ) : (
              myIncidents.map(inc => {
                const assignedResponders = responders.filter(r => inc.assignedUnitIds.includes(r.id));
                const isSelected = inc.id === selectedIncidentId;

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#122336] border-cyan-500 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                        : 'bg-[#09121D] border-[#1E344F] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white">
                          INCIDENT #{inc.displayNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                          {inc.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-sm mb-1">{inc.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {inc.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{inc.location.address || 'GPS Location'}</span>
                    </div>

                    {/* Verification Badges */}
                    <div className="pt-3 border-t border-[#1E344F] grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">AI Check:</span>
                        {inc.aiStatus === 'VERIFIED' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">Review Needed</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Operator:</span>
                        {inc.humanStatus === 'VERIFIED' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">Pending Call</span>
                        )}
                      </div>
                    </div>

                    {/* Response Status Banner */}
                    <div className="mt-3 p-2.5 rounded-lg bg-[#07111F] border border-[#1E344F] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-bold text-white">
                          {inc.overallStatus === 'RESPONDING'
                            ? 'TEAM RESPONDING'
                            : inc.overallStatus === 'VERIFIED'
                            ? 'CONFIRMED'
                            : inc.overallStatus === 'ON_SCENE'
                            ? 'ON SCENE'
                            : inc.overallStatus === 'RESOLVED'
                            ? 'RESOLVED'
                            : 'UNDER REVIEW'}
                        </span>
                      </div>

                      {assignedResponders.length > 0 && assignedResponders[0].etaSeconds ? (
                        <span className="text-xs font-mono font-bold text-amber-400">
                          ETA {Math.ceil(assignedResponders[0].etaSeconds / 60)} min
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Tab 2: Live Map View */
          <div className="h-[450px] rounded-xl overflow-hidden border border-[#1E344F]">
            <CommandMap onSelectIncident={(id) => setSelectedIncidentId(id)} />
          </div>
        )}
      </main>

      {/* Emergency Report Modal */}
      {reportModalOpen && (
        <ReportEmergencyModal
          onClose={() => setReportModalOpen(false)}
          onSuccess={(inc) => {
            setReportModalOpen(false);
            setSelectedIncidentId(inc.id);
          }}
        />
      )}
    </div>
  );
};
