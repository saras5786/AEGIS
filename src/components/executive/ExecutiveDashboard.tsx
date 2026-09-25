import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  MapPin,
  Ambulance,
  Building2,
  BarChart3,
  FlaskConical,
  History,
  Settings,
  LogOut,
  Volume2,
  VolumeX,
  AlertCircle,
  Clock,
  Menu,
  X,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { CommandMap } from '../maps/CommandMap';
import { IncidentDetailsPanel } from './IncidentDetailsPanel';
import { RespondersView } from './RespondersView';
import { HospitalsView } from './HospitalsView';
import { AnalyticsView } from './AnalyticsView';
import { AuditLogView } from './AuditLogView';
import { SimulationLab } from '../simulation/SimulationLab';
import { SettingsView } from './SettingsView';

type SidebarTab =
  | 'MAP'
  | 'INCIDENTS'
  | 'RESPONDERS'
  | 'HOSPITALS'
  | 'ANALYTICS'
  | 'SIMULATION'
  | 'AUDIT'
  | 'SETTINGS';

export const ExecutiveDashboard: React.FC = () => {
  const {
    incidents,
    responders,
    hospitals,
    selectedIncidentId,
    setSelectedIncidentId,
    selectedIncident,
    setRole,
    soundEnabled,
    setSoundEnabled,
    demoMode
  } = useEmergency();

  const [activeTab, setActiveTab] = useState<SidebarTab>('MAP');
  const [mapFilter, setMapFilter] = useState<string>('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Metrics counts
  const activeIncidentsCount = incidents.filter(i => i.overallStatus !== 'RESOLVED' && i.overallStatus !== 'CANCELLED').length;
  const respondingUnitsCount = responders.filter(r => r.status === 'RESPONDING').length;
  const availableAmbulanceCount = responders.filter(r => r.type === 'AMBULANCE' && r.status === 'AVAILABLE').length;
  const availableFireCount = responders.filter(r => r.type === 'FIRE' && r.status === 'AVAILABLE').length;
  const availablePoliceCount = responders.filter(r => r.type === 'POLICE' && r.status === 'AVAILABLE').length;
  const hospitalsAlertedCount = hospitals.filter(h => h.status === 'PATIENT_INCOMING' || h.incomingIncidents.length > 0).length;

  return (
    <div className="h-screen w-screen bg-[#07111F] text-slate-100 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-[#0A1420] border-b border-[#1E344F] px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider text-white">AEGIS</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  COMMAND CENTER
                </span>
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  SYSTEM ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Metrics Ticker */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="text-slate-400">ACTIVE:</span>
            <span className="font-bold text-white">{activeIncidentsCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <Ambulance className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">RESPONDING:</span>
            <span className="font-bold text-cyan-300">{respondingUnitsCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <span className="text-slate-400">AMBULANCES:</span>
            <span className="font-bold text-emerald-400">{availableAmbulanceCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <span className="text-slate-400">FIRE:</span>
            <span className="font-bold text-emerald-400">{availableFireCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <span className="text-slate-400">POLICE:</span>
            <span className="font-bold text-emerald-400">{availablePoliceCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A28] border border-[#1E344F]">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-400">HOSPITALS:</span>
            <span className="font-bold text-teal-300">{hospitalsAlertedCount}</span>
          </div>
        </div>

        {/* Right Tools & Clock */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setRole('CITIZEN')}
            className="hidden sm:block text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            Citizen View
          </button>

          <button
            onClick={() => setRole('LANDING')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Center View + Right Command Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <nav
          className={`w-60 bg-[#0A1420] border-r border-[#1E344F] flex flex-col justify-between shrink-0 transition-all z-20 ${
            sidebarOpen ? 'absolute inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'
          }`}
        >
          <div className="p-3 space-y-1">
            <button
              onClick={() => { setActiveTab('MAP'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'MAP'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              Command Map
            </button>

            <button
              onClick={() => { setActiveTab('INCIDENTS'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'INCIDENTS'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Live Incidents
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/40">
                {activeIncidentsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('RESPONDERS'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'RESPONDERS'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Ambulance className="w-4 h-4" />
                Responders
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {responders.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('HOSPITALS'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'HOSPITALS'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                Hospitals
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/40">
                {hospitals.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('SIMULATION'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'SIMULATION'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              Simulation Lab
            </button>

            <button
              onClick={() => { setActiveTab('ANALYTICS'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ANALYTICS'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>

            <button
              onClick={() => { setActiveTab('AUDIT'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'AUDIT'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              Audit Log
            </button>

            <button
              onClick={() => { setActiveTab('SETTINGS'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'SETTINGS'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Bottom user profile info */}
          <div className="p-3 border-t border-[#1E344F] bg-[#07111F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs">
                OP
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block">Operator 123</span>
                <span className="text-[10px] text-slate-400 font-mono">ID: 123 • Active</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'MAP' && (
            <div className="h-full flex flex-col">
              {/* Map Filter Bar */}
              <div className="px-4 py-2.5 bg-[#0A1420] border-b border-[#1E344F] flex items-center justify-between gap-2 overflow-x-auto shrink-0">
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {['ALL', 'ACCIDENTS', 'MEDICAL', 'FIRE', 'POLICE', 'CRITICAL', 'RESPONDING'].map(f => (
                    <button
                      key={f}
                      onClick={() => setMapFilter(f)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                        mapFilter === f
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.25)]'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-400 hidden xl:block font-mono">
                  {incidents.length} Reported Incidents
                </div>
              </div>

              {/* Interactive Leaflet Map */}
              <div className="flex-1 relative">
                <CommandMap
                  filterType={mapFilter}
                  onSelectIncident={(id) => {
                    setSelectedIncidentId(id);
                    setRightPanelOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'INCIDENTS' && (
            <div className="p-6 space-y-4 overflow-y-auto h-full">
              <div className="border-b border-[#1E344F] pb-4">
                <h2 className="text-2xl font-black text-white">All Emergency Incidents</h2>
                <p className="text-xs text-slate-400 mt-1">Review active, responding, and completed incidents.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncidentId(inc.id);
                      setActiveTab('MAP');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      inc.id === selectedIncidentId
                        ? 'bg-cyan-950/40 border-cyan-500'
                        : 'bg-[#09121D] border-[#1E344F] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        INCIDENT #{inc.displayNumber}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{inc.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{inc.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E344F]/60">
                      <span>Status: <strong className="text-white">{inc.overallStatus}</strong></span>
                      <span className="text-cyan-400 font-semibold">Open on Map ➔</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'RESPONDERS' && <RespondersView />}
          {activeTab === 'HOSPITALS' && <HospitalsView />}
          {activeTab === 'ANALYTICS' && <AnalyticsView />}
          {activeTab === 'SIMULATION' && <SimulationLab />}
          {activeTab === 'AUDIT' && <AuditLogView />}
          {activeTab === 'SETTINGS' && <SettingsView />}
        </div>

        {/* Right Side Incident Details Command Panel */}
        <div
          className={`w-80 md:w-96 shrink-0 transition-all border-l border-[#1E344F] ${
            rightPanelOpen ? 'block' : 'hidden'
          }`}
        >
          <IncidentDetailsPanel incident={selectedIncident} />
        </div>
      </div>
    </div>
  );
};
