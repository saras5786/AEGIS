import React, { useState } from 'react';
import {
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  Ambulance,
  Building2,
  Shield,
  Send,
  CheckCircle
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Incident } from '../../types';
import { calculateDistanceKm } from '../../services/locationService';
import { SimulatedCallModal } from './SimulatedCallModal';

interface IncidentDetailsPanelProps {
  incident: Incident | undefined;
}

export const IncidentDetailsPanel: React.FC<IncidentDetailsPanelProps> = ({ incident }) => {
  const {
    responders,
    hospitals,
    verifyIncident,
    markAsFalseReport,
    dispatchUnit,
    alertHospital,
    resolveIncident
  } = useEmergency();

  const [callModalOpen, setCallModalOpen] = useState(false);

  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-[#0A1420] border-l border-[#1E344F]">
        <Shield className="w-10 h-10 text-slate-600 mb-2" />
        <h4 className="text-white font-bold text-sm">No Incident Selected</h4>
        <p className="text-xs text-slate-400 mt-1">
          Select an incident to view details and dispatch units.
        </p>
      </div>
    );
  }

  // Calculate nearby responders sorted by distance
  const nearbyUnits = responders
    .map(unit => ({
      ...unit,
      calculatedDistance: calculateDistanceKm(unit.currentLocation, incident.location)
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance);

  // Calculate nearby hospitals
  const nearbyHospitals = hospitals
    .map(hosp => ({
      ...hosp,
      calculatedDistance: calculateDistanceKm(hosp.location, incident.location)
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance);

  const isVerified = incident.humanStatus === 'VERIFIED' && incident.aiStatus === 'VERIFIED';
  const isFalse = incident.humanStatus === 'FALSE_REPORT';

  return (
    <div className="h-full flex flex-col bg-[#0A1420] border-l border-[#1E344F] overflow-y-auto">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 border-b border-[#1E344F] bg-[#0E1A29]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                INCIDENT #{incident.displayNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  incident.aiAnalysis?.priority === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border border-red-500/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                }`}
              >
                {incident.aiAnalysis?.priority || 'HIGH'}
              </span>
            </div>
            <h3 className="font-extrabold text-white text-base sm:text-lg mt-0.5 leading-snug">
              {incident.title}
            </h3>
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{incident.location.address || 'Reported Location'}</span>
        </div>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-[#07111F] p-2.5 rounded-xl border border-[#1E344F]">
          "{incident.description}"
        </p>

        {incident.photoUrl && (
          <div className="mt-2.5 rounded-xl overflow-hidden border border-[#1E344F] max-h-36 bg-black">
            <img src={incident.photoUrl} alt="Evidence" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-5 flex-1">
        {/* TWO-STEP VERIFICATION SYSTEM */}
        <div className="p-4 rounded-xl bg-[#09121D] border border-[#1E344F] space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E344F] pb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Two-Step Verification
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isVerified
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : isFalse
                  ? 'bg-red-950 text-red-300 border border-red-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isVerified ? 'CONFIRMED' : isFalse ? 'FALSE REPORT' : 'PENDING'}
            </span>
          </div>

          {/* 1. AI Verification Result */}
          <div className="flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">1. AI Analysis</span>
              <span className="text-slate-300 text-[11px]">
                Confidence: <strong className="text-cyan-400 font-mono">{incident.aiAnalysis?.confidence || 88}%</strong>
              </span>
            </div>
            <div className="text-right">
              {incident.aiStatus === 'VERIFIED' ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 font-bold text-[10px]">
                  REVIEW
                </span>
              )}
            </div>
          </div>

          {/* 2. Operator Verification */}
          <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-[#1E344F]/60">
            <div>
              <span className="text-slate-400 block font-medium">2. Operator Call</span>
              <span className="text-slate-300 text-[11px]">
                Citizen: <strong className="font-mono text-white">{incident.citizenPhone}</strong>
              </span>
            </div>
            <div>
              {incident.humanStatus === 'VERIFIED' ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                </span>
              ) : incident.humanStatus === 'FALSE_REPORT' ? (
                <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-bold text-[10px]">
                  FALSE REPORT
                </span>
              ) : (
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  CALL CITIZEN
                </button>
              )}
            </div>
          </div>
        </div>

        {/* NEARBY UNITS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Ambulance className="w-3.5 h-3.5" />
              Nearby Units
            </span>
          </div>

          <div className="space-y-2">
            {nearbyUnits.slice(0, 3).map(unit => {
              const isAssigned = incident.assignedUnitIds.includes(unit.id);
              const isResponding = unit.status === 'RESPONDING';
              const isOnScene = unit.status === 'ON_SCENE';

              return (
                <div
                  key={unit.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isAssigned
                      ? 'bg-cyan-950/30 border-cyan-500/50'
                      : 'bg-[#09121D] border-[#1E344F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">
                      {unit.type === 'AMBULANCE'
                        ? '🚑'
                        : unit.type === 'POLICE'
                        ? '🚓'
                        : unit.type === 'FIRE'
                        ? '🚒'
                        : '🚧'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{unit.id}</span>
                        <span className="text-[10px] text-slate-400">
                          {unit.calculatedDistance} km
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <strong
                          className={
                            isResponding
                              ? 'text-cyan-400 font-bold'
                              : isOnScene
                              ? 'text-emerald-400 font-bold'
                              : 'text-slate-300'
                          }
                        >
                          {unit.status}
                        </strong>
                        {isResponding && unit.etaSeconds ? (
                          <span className="text-amber-400 font-mono ml-1 font-bold">
                            (ETA {Math.ceil(unit.etaSeconds / 60)}m)
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAssigned ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold">
                        {unit.status}
                      </span>
                    ) : (
                      <button
                        onClick={() => dispatchUnit(incident.id, unit.id)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-all"
                      >
                        <Send className="w-3 h-3" />
                        DISPATCH
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEARBY HOSPITALS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Nearby Hospitals
            </span>
          </div>

          <div className="space-y-2">
            {nearbyHospitals.slice(0, 2).map(hosp => {
              const isAlerted = incident.alertedHospitalId === hosp.id || hosp.incomingIncidents.includes(incident.id);

              return (
                <div
                  key={hosp.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isAlerted
                      ? 'bg-teal-950/30 border-teal-500/50'
                      : 'bg-[#09121D] border-[#1E344F]'
                  }`}
                >
                  <div>
                    <h5 className="font-bold text-xs text-white">{hosp.name}</h5>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{hosp.calculatedDistance} km</span>
                      <span>•</span>
                      <span className="text-teal-300 font-mono font-bold">
                        {hosp.availableBeds} beds
                      </span>
                    </div>
                  </div>

                  <div>
                    {isAlerted ? (
                      <span className="px-2.5 py-1 rounded-lg bg-teal-950 text-teal-300 border border-teal-800/40 text-[10px] font-bold">
                        ALERTED
                      </span>
                    ) : (
                      <button
                        onClick={() => alertHospital(hosp.id, incident.id)}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
                      >
                        ALERT
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Actions */}
        <div className="pt-2 border-t border-[#1E344F] flex items-center justify-between gap-3">
          {incident.overallStatus !== 'RESOLVED' && incident.overallStatus !== 'CANCELLED' ? (
            <button
              onClick={() => resolveIncident(incident.id)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Complete & Resolve Incident
            </button>
          ) : (
            <div className="w-full text-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Closed ({incident.overallStatus})
            </div>
          )}
        </div>
      </div>

      {/* Simulated Call Dialog */}
      {callModalOpen && (
        <SimulatedCallModal
          incident={incident}
          onClose={() => setCallModalOpen(false)}
          onVerify={(notes) => {
            setCallModalOpen(false);
            verifyIncident(incident.id, notes);
          }}
          onMarkFalseReport={(notes) => {
            setCallModalOpen(false);
            markAsFalseReport(incident.id, notes);
          }}
        />
      )}
    </div>
  );
};
