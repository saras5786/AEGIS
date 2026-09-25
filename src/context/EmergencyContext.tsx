import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Incident,
  ResponderUnit,
  Hospital,
  AuditLogItem,
  ToastMessage,
  AppRole,
  CitizenUser,
  LocationCoord,
  IncidentType
} from '../types';
import { getSeedHospitals, getSeedResponders, getSeedIncidents, getSeedAuditLogs } from '../services/seedData';
import { DEFAULT_DEMO_CENTER, calculateDistanceKm, generateRoutePoints, getBrowserCurrentPosition } from '../services/locationService';
import { analyzeEmergencyReport } from '../services/aiService';
import { sound } from '../services/audioService';

interface EmergencyContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  citizenUser: CitizenUser;
  setCitizenUser: React.Dispatch<React.SetStateAction<CitizenUser>>;
  
  incidents: Incident[];
  responders: ResponderUnit[];
  hospitals: Hospital[];
  auditLogs: AuditLogItem[];
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  userLocation: LocationCoord;
  setUserLocation: (loc: LocationCoord) => void;
  
  // Actions
  createIncidentReport: (params: {
    type: IncidentType;
    title: string;
    description: string;
    peopleInvolved: number;
    location: LocationCoord;
    photoUrl?: string;
  }) => Promise<Incident>;
  
  verifyIncident: (id: string, notes: string) => void;
  markAsFalseReport: (id: string, notes: string) => void;
  dispatchUnit: (incidentId: string, unitId: string) => void;
  alertHospital: (hospitalId: string, incidentId: string) => void;
  resolveIncident: (incidentId: string) => void;
  
  // Simulation Lab
  triggerScenario: (scenarioType: 'accident' | 'fire' | 'medical' | 'false_report') => void;
  resetSimulation: () => void;
  
  // Active selected incident helper
  selectedIncident: Incident | undefined;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = 'aegis_emergency_network';

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('LANDING');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<LocationCoord>(DEFAULT_DEMO_CENTER);

  const [citizenUser, setCitizenUser] = useState<CitizenUser>({
    phone: '+91 98765 43210',
    name: 'Citizen Demo',
    reputationStatus: 'Normal',
    falseReportCount: 0,
    simulatedPenaltyTotal: 0
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('aegis_incidents');
    return saved ? JSON.parse(saved) : getSeedIncidents();
  });

  const [responders, setResponders] = useState<ResponderUnit[]>(() => {
    const saved = localStorage.getItem('aegis_responders');
    return saved ? JSON.parse(saved) : getSeedResponders();
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('aegis_hospitals');
    return saved ? JSON.parse(saved) : getSeedHospitals();
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('aegis_audit');
    return saved ? JSON.parse(saved) : getSeedAuditLogs();
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>('INC-1042');

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Sound toggle handler
  const setSoundEnabled = (val: boolean) => {
    sound.enabled = val;
    setSoundEnabledState(val);
  };

  // Toast adder
  const addToast = useCallback((toast: Omit<ToastMessage, 'id' | 'time'>) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...toast
    };
    setToasts(prev => [newToast, ...prev.slice(0, 5)]);
    // Auto dismiss after 5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Broadcast helper
  const postBroadcast = useCallback((type: string, payload: unknown) => {
    try {
      broadcastChannelRef.current?.postMessage({ type, payload });
    } catch {
      // Ignore broadcast channel errors
    }
  }, []);

  // Try to acquire browser GPS once on mount in background
  useEffect(() => {
    getBrowserCurrentPosition()
      .then(pos => {
        setUserLocation(pos);
      })
      .catch(() => {
        // Fallback remains DEFAULT_DEMO_CENTER
      });
  }, []);

  // Sync to LocalStorage for persistence
  useEffect(() => {
    localStorage.setItem('aegis_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('aegis_responders', JSON.stringify(responders));
  }, [responders]);

  useEffect(() => {
    localStorage.setItem('aegis_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('aegis_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Broadcast channel for multi-tab synchronization
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_ALL') {
          if (payload.incidents) setIncidents(payload.incidents);
          if (payload.responders) setResponders(payload.responders);
          if (payload.hospitals) setHospitals(payload.hospitals);
          if (payload.auditLogs) setAuditLogs(payload.auditLogs);
        } else if (type === 'INCIDENT_CREATED') {
          setIncidents(prev => [payload, ...prev]);
          addToast({
            type: 'emergency',
            title: 'NEW EMERGENCY REPORT',
            message: `${payload.title} reported near ${payload.location.address || 'location'}.`
          });
          sound.playEmergencyAlert();
        } else if (type === 'INCIDENT_VERIFIED') {
          setIncidents(prev => prev.map(inc => inc.id === payload.id ? payload : inc));
          addToast({
            type: 'success',
            title: 'INCIDENT VERIFIED',
            message: `Incident #${payload.displayNumber} verified by Command Center.`
          });
          sound.playSuccessChime();
        } else if (type === 'UNIT_DISPATCHED') {
          setResponders(prev => prev.map(r => r.id === payload.unitId ? { ...r, ...payload.unitUpdate } : r));
          addToast({
            type: 'dispatch',
            title: 'UNIT DISPATCHED',
            message: `${payload.unitId} is responding to Incident #${payload.displayNumber}.`
          });
          sound.playDispatchChirp();
        }
      };

      return () => {
        channel.close();
      };
    } catch {
      // BroadcastChannel might not be supported in older test runtimes
    }
  }, [addToast]);

  // Log an audit trail item
  const addAuditLog = useCallback((action: string, details: string, actor: AuditLogItem['actor'], incidentId?: string, unitId?: string) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      details,
      incidentId,
      unitId,
      actor
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, []);

  // Citizen creates report
  const createIncidentReport = async (params: {
    type: IncidentType;
    title: string;
    description: string;
    peopleInvolved: number;
    location: LocationCoord;
    photoUrl?: string;
  }): Promise<Incident> => {
    const nextNumber = incidents.length > 0 ? Math.max(...incidents.map(i => i.displayNumber)) + 1 : 1050;
    const newId = `INC-${nextNumber}`;

    // Step 1: AI Verification Analysis
    const aiResult = await analyzeEmergencyReport({
      type: params.type,
      description: params.description,
      peopleCount: params.peopleInvolved,
      hasPhoto: !!params.photoUrl,
      photoUrl: params.photoUrl
    });

    const isSuspicious = aiResult.reliabilityScore < 50;

    const newIncident: Incident = {
      id: newId,
      displayNumber: nextNumber,
      citizenPhone: citizenUser.phone,
      type: params.type,
      title: params.title || `Emergency Report #${nextNumber}`,
      description: params.description,
      peopleInvolved: params.peopleInvolved,
      location: params.location,
      photoUrl: params.photoUrl,
      createdAt: new Date().toISOString(),
      aiStatus: isSuspicious ? 'REVIEW_REQUIRED' : 'VERIFIED',
      aiAnalysis: aiResult,
      humanStatus: 'PENDING',
      overallStatus: 'UNDER_REVIEW',
      assignedUnitIds: []
    };

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncidentId(newId);

    // Audio & Toast Alert
    sound.playEmergencyAlert();
    addToast({
      type: 'emergency',
      title: '🚨 NEW INCIDENT REPORTED',
      message: `#${nextNumber}: ${params.title || params.description.substring(0, 35)}`
    });

    // Audit logs
    addAuditLog('INCIDENT_CREATED', `Incident #${nextNumber} reported at ${params.location.address || 'GPS coordinates'}`, 'CITIZEN', newId);
    addAuditLog('AI_ANALYSIS_COMPLETED', `AI calculated ${aiResult.priority} priority with ${aiResult.confidence}% confidence`, 'AI_SYSTEM', newId);

    postBroadcast('INCIDENT_CREATED', newIncident);

    return newIncident;
  };

  // Executive verifies incident
  const verifyIncident = (id: string, notes: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          const updated: Incident = {
            ...inc,
            humanStatus: 'VERIFIED',
            humanNotes: notes,
            verifiedAt: new Date().toISOString(),
            overallStatus: inc.assignedUnitIds.length > 0 ? 'RESPONDING' : 'VERIFIED'
          };
          postBroadcast('INCIDENT_VERIFIED', updated);
          return updated;
        }
        return inc;
      })
    );

    sound.playSuccessChime();
    addToast({
      type: 'success',
      title: '✓ INCIDENT VERIFIED',
      message: `Human verification completed. Response units can now be dispatched.`
    });

    addAuditLog('EXECUTIVE_VERIFIED', `Incident ${id} verified. Note: "${notes || 'Confirmed with citizen'}"`, 'EXECUTIVE_123', id);
  };

  // Executive marks report as false/prank
  const markAsFalseReport = (id: string, notes: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            humanStatus: 'FALSE_REPORT',
            humanNotes: notes,
            overallStatus: 'CANCELLED'
          };
        }
        return inc;
      })
    );

    // Update simulated penalty for citizen
    setCitizenUser(prev => ({
      ...prev,
      falseReportCount: prev.falseReportCount + 1,
      simulatedPenaltyTotal: prev.simulatedPenaltyTotal + 1000,
      reputationStatus: prev.falseReportCount >= 2 ? 'Restricted' : 'Warning'
    }));

    addToast({
      type: 'warning',
      title: '⚠ FALSE REPORT RECORDED',
      message: `Incident ${id} marked as false report. Simulated warning penalty ₹1,000 issued.`
    });

    addAuditLog('FALSE_REPORT_FLAGGED', `Incident ${id} determined to be false/prank report. Notes: ${notes}`, 'EXECUTIVE_123', id);
  };

  // Executive dispatches simulated unit
  const dispatchUnit = (incidentId: string, unitId: string) => {
    const inc = incidents.find(i => i.id === incidentId);
    if (!inc) return;

    const unit = responders.find(r => r.id === unitId);
    if (!unit) return;

    // Calculate distance & route waypoints
    const distKm = calculateDistanceKm(unit.currentLocation, inc.location);
    const speed = unit.speedKmH || 50;
    const etaSeconds = Math.max(25, Math.round((distKm / speed) * 3600));
    const route = generateRoutePoints(unit.currentLocation, inc.location, 10);

    setResponders(prev =>
      prev.map(r => {
        if (r.id === unitId) {
          return {
            ...r,
            status: 'RESPONDING',
            assignedIncidentId: incidentId,
            distanceKm: distKm,
            etaSeconds,
            routePolyline: route
          };
        }
        return r;
      })
    );

    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          const assigned = Array.from(new Set([...i.assignedUnitIds, unitId]));
          return {
            ...i,
            assignedUnitIds: assigned,
            overallStatus: 'RESPONDING'
          };
        }
        return i;
      })
    );

    sound.playDispatchChirp();
    addToast({
      type: 'dispatch',
      title: '🚑 UNIT DISPATCHED',
      message: `${unit.name} is on the way to Incident #${inc.displayNumber}. (Distance: ${distKm} km)`
    });

    addAuditLog('UNIT_DISPATCHED', `${unit.id} dispatched to ${inc.title} (ETA: ${Math.round(etaSeconds / 60)} min)`, 'EXECUTIVE_123', incidentId, unitId);

    postBroadcast('UNIT_DISPATCHED', {
      unitId,
      displayNumber: inc.displayNumber,
      unitUpdate: {
        status: 'RESPONDING',
        assignedIncidentId: incidentId,
        distanceKm: distKm,
        etaSeconds
      }
    });
  };

  // Alert Hospital
  const alertHospital = (hospitalId: string, incidentId: string) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return;

    setHospitals(prev =>
      prev.map(h => {
        if (h.id === hospitalId) {
          const incs = Array.from(new Set([...h.incomingIncidents, incidentId]));
          return {
            ...h,
            status: 'PATIENT_INCOMING',
            incomingIncidents: incs
          };
        }
        return h;
      })
    );

    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          return { ...i, alertedHospitalId: hospitalId };
        }
        return i;
      })
    );

    sound.playSuccessChime();
    addToast({
      type: 'info',
      title: '🏥 HOSPITAL ALERTED',
      message: `${hospital.name} notified for incoming patient transport.`
    });

    addAuditLog('HOSPITAL_ALERTED', `${hospital.name} placed on alert for incident ${incidentId}`, 'EXECUTIVE_123', incidentId);
  };

  // Resolve incident
  const resolveIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(i => {
        if (i.id === incidentId) {
          return { ...i, overallStatus: 'RESOLVED' };
        }
        return i;
      })
    );

    // Free up responders
    setResponders(prev =>
      prev.map(r => {
        if (r.assignedIncidentId === incidentId) {
          return {
            ...r,
            status: 'AVAILABLE',
            assignedIncidentId: undefined,
            routePolyline: undefined,
            distanceKm: undefined,
            etaSeconds: undefined
          };
        }
        return r;
      })
    );

    // Clear hospital alert
    setHospitals(prev =>
      prev.map(h => {
        if (h.incomingIncidents.includes(incidentId)) {
          return {
            ...h,
            status: 'NORMAL',
            incomingIncidents: h.incomingIncidents.filter(id => id !== incidentId)
          };
        }
        return h;
      })
    );

    addToast({
      type: 'success',
      title: '✓ INCIDENT RESOLVED',
      message: `Incident ${incidentId} marked resolved. Units returned to available status.`
    });

    addAuditLog('INCIDENT_RESOLVED', `Incident ${incidentId} completed and closed by command center.`, 'EXECUTIVE_123', incidentId);
  };

  // Reset simulation to factory seed data
  const resetSimulation = () => {
    localStorage.removeItem('aegis_incidents');
    localStorage.removeItem('aegis_responders');
    localStorage.removeItem('aegis_hospitals');
    localStorage.removeItem('aegis_audit');

    setIncidents(getSeedIncidents(userLocation));
    setResponders(getSeedResponders(userLocation));
    setHospitals(getSeedHospitals(userLocation));
    setAuditLogs(getSeedAuditLogs());
    setSelectedIncidentId('INC-1042');

    addToast({
      type: 'info',
      title: 'SIMULATION RESET',
      message: 'All demo incidents, responder units, and logs reset to initial state.'
    });
  };

  // Quick Simulation Scenarios
  const triggerScenario = async (scenarioType: 'accident' | 'fire' | 'medical' | 'false_report') => {
    let title = '';
    let description = '';
    let type: IncidentType = 'accident';
    let people = 1;

    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;

    switch (scenarioType) {
      case 'accident':
        type = 'accident';
        title = 'Car Collision — West Junction';
        description = 'Two sedans collided at the traffic signal. One driver is disoriented and needs medical assistance.';
        people = 2;
        break;
      case 'fire':
        type = 'fire';
        title = 'Electrical Fire — Warehouse Sector 4';
        description = 'Thick black smoke and flames coming from storage room. Workers evacuated outside.';
        people = 0;
        break;
      case 'medical':
        type = 'medical';
        title = 'Severe Chest Pain — Public Transit Terminal';
        description = 'A passenger is having severe breathing distress and chest pressure on platform 2.';
        people = 1;
        break;
      case 'false_report':
        type = 'other';
        title = 'Unusual UFO report';
        description = 'Flying saucer landed in my garden haha testing the radar sirens.';
        people = 0;
        break;
    }

    await createIncidentReport({
      type,
      title,
      description,
      peopleInvolved: people,
      location: {
        lat: userLocation.lat + offsetLat,
        lng: userLocation.lng + offsetLng,
        address: `Simulated Zone: ${title}`
      }
    });
  };

  // Simulated responder live movement ticker:
  // Every 2.5 seconds, advance responding units towards incident along waypoints
  useEffect(() => {
    const interval = setInterval(() => {
      setResponders(prevResponders => {
        let changed = false;
        const updated = prevResponders.map(unit => {
          if (unit.status === 'RESPONDING' && unit.routePolyline && unit.routePolyline.length > 1) {
            changed = true;
            // Move to next point on the polyline
            const [nextLat, nextLng] = unit.routePolyline[1];
            const remainingRoute = unit.routePolyline.slice(1);
            
            // Check if arrived
            if (remainingRoute.length <= 1) {
              addToast({
                type: 'dispatch',
                title: '📍 UNIT ARRIVED ON SCENE',
                message: `${unit.name} has arrived at Incident #${unit.assignedIncidentId}.`
              });
              addAuditLog('UNIT_ARRIVED', `${unit.id} arrived on scene at incident ${unit.assignedIncidentId}`, 'EXECUTIVE_123', unit.assignedIncidentId, unit.id);
              
              return {
                ...unit,
                currentLocation: { lat: nextLat, lng: nextLng, address: 'On Scene' },
                status: 'ON_SCENE' as const,
                distanceKm: 0,
                etaSeconds: 0,
                routePolyline: undefined
              };
            }

            // Still traveling: update ETA and distance
            const remainingDist = Math.max(0.1, (unit.distanceKm || 1.5) - 0.2);
            const remainingEta = Math.max(10, (unit.etaSeconds || 60) - 15);

            return {
              ...unit,
              currentLocation: { lat: nextLat, lng: nextLng },
              distanceKm: Math.round(remainingDist * 10) / 10,
              etaSeconds: remainingEta,
              routePolyline: remainingRoute
            };
          }
          return unit;
        });

        return changed ? updated : prevResponders;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [addAuditLog, addToast]);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  return (
    <EmergencyContext.Provider
      value={{
        role,
        setRole,
        demoMode,
        setDemoMode,
        soundEnabled,
        setSoundEnabled,
        citizenUser,
        setCitizenUser,
        incidents,
        responders,
        hospitals,
        auditLogs,
        toasts,
        removeToast,
        selectedIncidentId,
        setSelectedIncidentId,
        userLocation,
        setUserLocation,
        createIncidentReport,
        verifyIncident,
        markAsFalseReport,
        dispatchUnit,
        alertHospital,
        resolveIncident,
        triggerScenario,
        resetSimulation,
        selectedIncident
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
