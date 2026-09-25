import React from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Flame,
  HeartPulse,
  AlertTriangle,
  Car
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const SimulationLab: React.FC = () => {
  const { triggerScenario, resetSimulation, setSelectedIncidentId } = useEmergency();

  const handleLaunchPrebuiltScenario = async () => {
    setSelectedIncidentId('INC-1042');
    alert('Loaded Demo Scenario: "Road Accident — East Gate Road".');
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E344F] pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Test Center
          </span>
          <h2 className="text-2xl font-black text-white mt-0.5">Simulation Control Lab</h2>
        </div>

        <button
          onClick={resetSimulation}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors shadow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Simulation
        </button>
      </div>

      {/* Featured Scenario Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#132236] to-[#0A1420] border border-cyan-500/50 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              DEMO SCENARIO
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Road Accident — East Gate Road
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Two vehicles collided. 2 injured. Units AMB-07 (1.4 km) and POL-12 (2.1 km) nearby.
            </p>
          </div>
          <button
            onClick={handleLaunchPrebuiltScenario}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            Load Scenario #1042
          </button>
        </div>

        {/* Step Guide without paragraph clutter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#1E344F]/80">
          <div className="bg-[#09121D] p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold text-[10px] block mb-0.5">01</span>
            <span className="font-semibold text-white block">AI Triage</span>
          </div>

          <div className="bg-[#09121D] p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold text-[10px] block mb-0.5">02</span>
            <span className="font-semibold text-white block">Voice Call</span>
          </div>

          <div className="bg-[#09121D] p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold text-[10px] block mb-0.5">03</span>
            <span className="font-semibold text-white block">Dispatch Unit</span>
          </div>

          <div className="bg-[#09121D] p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-cyan-400 font-bold text-[10px] block mb-0.5">04</span>
            <span className="font-semibold text-white block">Alert Hospital</span>
          </div>
        </div>
      </div>

      {/* Scenario Trigger Buttons - clean without descriptions */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          Trigger Scenarios
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => triggerScenario('accident')}
            className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-red-500/50 hover:bg-red-950/20 text-center transition-all group flex flex-col items-center justify-center gap-2"
          >
            <Car className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-xs text-white">Road Accident</h5>
            <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/40">TRIGGER</span>
          </button>

          <button
            onClick={() => triggerScenario('fire')}
            className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-amber-500/50 hover:bg-amber-950/20 text-center transition-all group flex flex-col items-center justify-center gap-2"
          >
            <Flame className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-xs text-white">Fire Incident</h5>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/40">TRIGGER</span>
          </button>

          <button
            onClick={() => triggerScenario('medical')}
            className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-rose-500/50 hover:bg-rose-950/20 text-center transition-all group flex flex-col items-center justify-center gap-2"
          >
            <HeartPulse className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-xs text-white">Medical Emergency</h5>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/40">TRIGGER</span>
          </button>

          <button
            onClick={() => triggerScenario('false_report')}
            className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-slate-500 hover:bg-slate-900 text-center transition-all group flex flex-col items-center justify-center gap-2"
          >
            <AlertTriangle className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
            <h5 className="font-bold text-xs text-white">False Report</h5>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">TRIGGER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
