export type IncidentType =
  | 'accident'
  | 'fire'
  | 'medical'
  | 'police'
  | 'hazard'
  | 'natural'
  | 'other';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AIVerificationStatus = 'PENDING' | 'VERIFIED' | 'REVIEW_REQUIRED';

export type HumanVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FALSE_REPORT';

export type IncidentOverallStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'DISPATCHED'
  | 'RESPONDING'
  | 'ON_SCENE'
  | 'RESOLVED'
  | 'CANCELLED';

export interface LocationCoord {
  lat: number;
  lng: number;
  address?: string;
  accuracy?: number; // in meters
}

export interface AIVerificationResult {
  detectedType: IncidentType;
  priority: PriorityLevel;
  confidence: number; // 0 to 100
  summary: string;
  risks: string[];
  recommendedUnits: ('Ambulance' | 'Fire Truck' | 'Police Patrol' | 'Traffic Unit')[];
  peopleCountEstimated?: number;
  reliabilityScore: number; // 0 to 100
  analyzedAt: string;
}

export interface Incident {
  id: string;
  displayNumber: number; // e.g. 1042
  citizenPhone: string;
  type: IncidentType;
  customTypeLabel?: string;
  title: string;
  description: string;
  peopleInvolved: number;
  location: LocationCoord;
  photoUrl?: string;
  createdAt: string;
  
  // Two-step verification
  aiStatus: AIVerificationStatus;
  aiAnalysis?: AIVerificationResult;
  humanStatus: HumanVerificationStatus;
  humanNotes?: string;
  verifiedAt?: string;
  
  overallStatus: IncidentOverallStatus;
  
  // Assigned resources
  assignedUnitIds: string[];
  alertedHospitalId?: string;
}

export type ResponderType = 'AMBULANCE' | 'POLICE' | 'FIRE' | 'TRAFFIC';

export type ResponderStatus =
  | 'AVAILABLE'
  | 'NOTIFIED'
  | 'RESPONDING'
  | 'ARRIVED'
  | 'ON_SCENE'
  | 'COMPLETED';

export interface ResponderUnit {
  id: string; // e.g. AMB-07
  name: string;
  type: ResponderType;
  currentLocation: LocationCoord;
  baseLocation: LocationCoord;
  status: ResponderStatus;
  assignedIncidentId?: string;
  speedKmH: number;
  etaSeconds?: number;
  distanceKm?: number;
  routePolyline?: [number, number][]; // array of [lat, lng]
}

export interface Hospital {
  id: string;
  name: string;
  location: LocationCoord;
  capacityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
  totalBeds: number;
  availableBeds: number;
  traumaCenterAvailable: boolean;
  status: 'NORMAL' | 'ALERTED' | 'PATIENT_INCOMING' | 'AT_CAPACITY';
  incomingIncidents: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  incidentId?: string;
  unitId?: string;
  actor: 'CITIZEN' | 'AI_SYSTEM' | 'EXECUTIVE_123';
}

export interface CitizenUser {
  phone: string;
  name: string;
  reputationStatus: 'Normal' | 'Warning' | 'Under Review' | 'Restricted';
  falseReportCount: number;
  simulatedPenaltyTotal: number;
}

export type AppRole = 'LANDING' | 'CITIZEN' | 'EXECUTIVE';

export interface ToastMessage {
  id: string;
  type: 'emergency' | 'dispatch' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
}
