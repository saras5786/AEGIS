import React from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { SimulationBanner } from './components/common/SimulationBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ExecutiveDashboard } from './components/executive/ExecutiveDashboard';

const MainAppContent: React.FC = () => {
  const { role } = useEmergency();

  return (
    <div className="flex flex-col min-h-screen bg-[#07111F]">
      <SimulationBanner />
      <ToastContainer />

      {role === 'LANDING' && <LandingPage />}
      {role === 'CITIZEN' && <CitizenDashboard />}
      {role === 'EXECUTIVE' && <ExecutiveDashboard />}
    </div>
  );
};

export default function App() {
  return (
    <EmergencyProvider>
      <MainAppContent />
    </EmergencyProvider>
  );
}
