import React from 'react';
import { MapPin, Gauge } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { ResponderUnit } from '../../types';

export const RespondersView: React.FC = () => {
  const { responders } = useEmergency();

  const getStatusBadge = (status: ResponderUnit['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">AVAILABLE</span>;
      case 'RESPONDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40 animate-pulse">RESPONDING</span>;
      case 'ON_SCENE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40">ON SCENE</span>;
      case 'NOTIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">NOTIFIED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getUnitIcon = (type: ResponderUnit['type']) => {
    switch (type) {
      case 'AMBULANCE':
        return <span className="text-2xl">🚑</span>;
      case 'POLICE':
        return <span className="text-2xl">🚓</span>;
      case 'FIRE':
        return <span className="text-2xl">🚒</span>;
      case 'TRAFFIC':
        return <span className="text-2xl">🚧</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E344F] pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">Emergency Responders</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            {responders.filter(r => r.status === 'AVAILABLE').length} Available
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            {responders.filter(r => r.status === 'RESPONDING').length} Responding
          </span>
        </div>
      </div>

      {/* Grid of Responders */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {responders.map(unit => (
          <div
            key={unit.id}
            className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#101C2B] border border-[#1E344F]">
                    {getUnitIcon(unit.type)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{unit.id}</h4>
                    <span className="text-[11px] text-slate-400 block">{unit.name}</span>
                  </div>
                </div>
                {getStatusBadge(unit.status)}
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300 bg-[#060D15] p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> Location:
                  </span>
                  <span className="font-mono text-slate-200">
                    {unit.currentLocation.address || `${unit.currentLocation.lat.toFixed(3)}, ${unit.currentLocation.lng.toFixed(3)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-emerald-400" /> Speed:
                  </span>
                  <span className="font-mono text-slate-200">{unit.speedKmH} km/h</span>
                </div>

                {unit.assignedIncidentId && (
                  <div className="flex items-center justify-between text-cyan-300 text-[11px] pt-1 border-t border-slate-800">
                    <span>Mission:</span>
                    <span className="font-mono font-bold">{unit.assignedIncidentId}</span>
                  </div>
                )}

                {unit.status === 'RESPONDING' && unit.etaSeconds && (
                  <div className="flex items-center justify-between text-amber-400 text-[11px] pt-1 font-bold">
                    <span>ETA:</span>
                    <span>{Math.ceil(unit.etaSeconds / 60)} min ({unit.distanceKm || 1.2} km)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
