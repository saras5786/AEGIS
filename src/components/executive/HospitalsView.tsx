import React from 'react';
import { MapPin } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const HospitalsView: React.FC = () => {
  const { hospitals } = useEmergency();

  const getCapacityColor = (cap: string) => {
    switch (cap) {
      case 'LOW':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40';
      case 'MEDIUM':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/40';
      case 'FULL':
        return 'text-red-400 bg-red-950/60 border-red-800/40';
      default:
        return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E344F] pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">Hospital Emergency Network</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xs font-semibold">
            {hospitals.reduce((acc, h) => acc + h.availableBeds, 0)} Total Free Beds
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map(hosp => (
          <div
            key={hosp.id}
            className="p-5 rounded-xl bg-[#09121D] border border-[#1E344F] hover:border-teal-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-300 text-xl">
                    🏥
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-white">{hosp.name}</h4>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {hosp.location.address || 'Medical Sector'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCapacityColor(hosp.capacityLevel)}`}>
                  {hosp.capacityLevel} LOAD
                </span>
              </div>

              {/* Bed metrics */}
              <div className="grid grid-cols-3 gap-2 my-3 p-3 rounded-xl bg-[#060D15] border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Available Beds</span>
                  <span className="font-mono font-black text-lg text-teal-300">{hosp.availableBeds}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Total Beds</span>
                  <span className="font-mono font-bold text-lg text-slate-300">{hosp.totalBeds}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Trauma Facility</span>
                  <span className="font-bold text-xs mt-1 block text-slate-200">
                    {hosp.traumaCenterAvailable ? '✓ Ready' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Alert Status:</span>
                <span className={`font-bold ${
                  hosp.status === 'PATIENT_INCOMING' ? 'text-amber-400 animate-pulse' : 'text-slate-300'
                }`}>
                  {hosp.status === 'PATIENT_INCOMING' ? 'PATIENT INCOMING' : hosp.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
