import React from 'react';
import { BarChart3, Clock, ShieldCheck, AlertTriangle, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const AnalyticsView: React.FC = () => {
  const { incidents, responders, hospitals } = useEmergency();

  const totalIncidents = incidents.length;
  const resolvedCount = incidents.filter(i => i.overallStatus === 'RESOLVED').length;
  const falseReportsCount = incidents.filter(i => i.humanStatus === 'FALSE_REPORT').length;
  const activeCount = incidents.filter(i => i.overallStatus !== 'RESOLVED' && i.overallStatus !== 'CANCELLED').length;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E344F] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Performance Intelligence
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40">
              DEMO DATA
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-0.5">Command Center Analytics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulated response times, resource utilization, and verification efficiency metrics.
          </p>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F]">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Avg Verification Time
          </div>
          <div className="text-2xl font-black text-white">34 Sec</div>
          <span className="text-[11px] text-emerald-400 font-medium">92% faster with AI scan</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F]">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Avg Dispatch Time
          </div>
          <div className="text-2xl font-black text-emerald-400">1m 12s</div>
          <span className="text-[11px] text-slate-400">From call verify to moving unit</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F]">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            False Reports Filtered
          </div>
          <div className="text-2xl font-black text-amber-400">{falseReportsCount} Flagged</div>
          <span className="text-[11px] text-slate-400">Protected simulated units</span>
        </div>

        <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F]">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Total Resolved
          </div>
          <div className="text-2xl font-black text-purple-400">{resolvedCount} Completed</div>
          <span className="text-[11px] text-slate-400">Out of {totalIncidents} total reports</span>
        </div>
      </div>

      {/* Breakdown Charts (CSS Bar Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident by Type */}
        <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Incidents by Category (Demo)
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>🚗 Road Accidents</span>
                <span className="font-mono text-cyan-300">45%</span>
              </div>
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>🏥 Medical Emergencies</span>
                <span className="font-mono text-cyan-300">25%</span>
              </div>
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>🔥 Fire Incidents</span>
                <span className="font-mono text-cyan-300">15%</span>
              </div>
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>👮 Police / Safety Alerts</span>
                <span className="font-mono text-cyan-300">10%</span>
              </div>
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>🚧 Road & Hazard Clearance</span>
                <span className="font-mono text-cyan-300">5%</span>
              </div>
              <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Responders Utilization */}
        <div className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Resource Utilization
          </h4>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#060D15] border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Ambulance Fleet Readiness</span>
              <span className="font-mono font-bold text-emerald-400">80% Available</span>
            </div>

            <div className="p-3 rounded-lg bg-[#060D15] border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Fire Engines In Depot</span>
              <span className="font-mono font-bold text-emerald-400">100% Ready</span>
            </div>

            <div className="p-3 rounded-lg bg-[#060D15] border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">Hospital Trauma Bed Occupancy</span>
              <span className="font-mono font-bold text-amber-400">62% Occupied</span>
            </div>

            <div className="p-3 rounded-lg bg-[#060D15] border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">AI Triage Accuracy Rate</span>
              <span className="font-mono font-bold text-cyan-300">94.8% Match</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
