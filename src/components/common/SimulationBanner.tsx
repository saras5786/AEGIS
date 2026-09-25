import React from 'react';

export const SimulationBanner: React.FC = () => {
  // Discreet, non-intrusive bottom footer badge
  return (
    <div className="fixed bottom-1 right-2 z-40 pointer-events-none select-none opacity-40 hover:opacity-100 transition-opacity">
      <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
        Demo Project Simulation
      </span>
    </div>
  );
};
