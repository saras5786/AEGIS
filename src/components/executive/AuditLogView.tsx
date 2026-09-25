import React, { useState } from 'react';
import { History, Shield, Filter, Search, User, Sparkles, Radio } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { AuditLogItem } from '../../types';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActor, setFilterActor] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (filterActor !== 'ALL' && log.actor !== filterActor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.incidentId && log.incidentId.toLowerCase().includes(q)) ||
        (log.unitId && log.unitId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getActorBadge = (actor: AuditLogItem['actor']) => {
    switch (actor) {
      case 'CITIZEN':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/40 flex items-center gap-1">
            <User className="w-3 h-3" /> Citizen
          </span>
        );
      case 'AI_SYSTEM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Engine
          </span>
        );
      case 'EXECUTIVE_123':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40 flex items-center gap-1">
            <Radio className="w-3 h-3" /> Operator 123
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E344F] pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            System Accountability
          </span>
          <h2 className="text-2xl font-black text-white mt-0.5">Audit & Event Logs</h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log trail of all incident creations, AI scores, human verifications, and dispatches.
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Logged Actions: <strong className="text-white">{auditLogs.length}</strong>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#09121D] p-3 rounded-xl border border-[#1E344F]">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, incident ID, or notes..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['ALL', 'CITIZEN', 'AI_SYSTEM', 'EXECUTIVE_123'].map(act => (
            <button
              key={act}
              onClick={() => setFilterActor(act)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                filterActor === act
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {act === 'ALL' ? 'All Actors' : act}
            </button>
          ))}
        </div>
      </div>

      {/* Log Entries Table/List */}
      <div className="space-y-2">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="p-3.5 rounded-xl bg-[#09121D] border border-[#1E344F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start sm:items-center gap-3">
              <span className="font-mono text-slate-400 shrink-0 text-[11px] bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {log.timestamp}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white tracking-wide">
                    {log.action}
                  </span>
                  {log.incidentId && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {log.incidentId}
                    </span>
                  )}
                  {log.unitId && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {log.unitId}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs mt-0.5">{log.details}</p>
              </div>
            </div>

            <div className="shrink-0">{getActorBadge(log.actor)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
