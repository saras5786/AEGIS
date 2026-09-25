import { Incident, ResponderUnit, Hospital, AuditLogItem } from '../types';
import { DEFAULT_DEMO_CENTER } from './locationService';

export function getSeedHospitals(center = DEFAULT_DEMO_CENTER): Hospital[] {
  return [
    {
      id: 'HOSP-01',
      name: 'City General Hospital',
      location: {
        lat: center.lat + 0.015,
        lng: center.lng + 0.012,
        address: '42 Health Boulevard, Sector 1'
      },
      capacityLevel: 'MEDIUM',
      totalBeds: 120,
      availableBeds: 24,
      traumaCenterAvailable: true,
      status: 'NORMAL',
      incomingIncidents: []
    },
    {
      id: 'HOSP-02',
      name: 'Metro Trauma & Emergency Center',
      location: {
        lat: center.lat - 0.018,
        lng: center.lng + 0.022,
        address: '88 Ring Road Medical Park'
      },
      capacityLevel: 'HIGH',
      totalBeds: 200,
      availableBeds: 12,
      traumaCenterAvailable: true,
      status: 'NORMAL',
      incomingIncidents: []
    },
    {
      id: 'HOSP-03',
      name: 'St. Jude Emergency Hospital',
      location: {
        lat: center.lat + 0.024,
        lng: center.lng - 0.015,
        address: '15 North Cross Road'
      },
      capacityLevel: 'LOW',
      totalBeds: 80,
      availableBeds: 35,
      traumaCenterAvailable: false,
      status: 'NORMAL',
      incomingIncidents: []
    },
    {
      id: 'HOSP-04',
      name: 'North Hills Medical Center',
      location: {
        lat: center.lat + 0.032,
        lng: center.lng + 0.008,
        address: '77 Hill View Expressway'
      },
      capacityLevel: 'MEDIUM',
      totalBeds: 150,
      availableBeds: 18,
      traumaCenterAvailable: true,
      status: 'NORMAL',
      incomingIncidents: []
    },
    {
      id: 'HOSP-05',
      name: 'Apex Critical Care Clinic',
      location: {
        lat: center.lat - 0.025,
        lng: center.lng - 0.02,
        address: '102 Industrial Corridor'
      },
      capacityLevel: 'FULL',
      totalBeds: 60,
      availableBeds: 2,
      traumaCenterAvailable: true,
      status: 'AT_CAPACITY',
      incomingIncidents: []
    }
  ];
}

export function getSeedResponders(center = DEFAULT_DEMO_CENTER): ResponderUnit[] {
  return [
    {
      id: 'AMB-07',
      name: 'Ambulance 07 (Advanced Life Support)',
      type: 'AMBULANCE',
      currentLocation: { lat: center.lat + 0.008, lng: center.lng + 0.006, address: 'Near East Gate Ave' },
      baseLocation: { lat: center.lat + 0.008, lng: center.lng + 0.006 },
      status: 'AVAILABLE',
      speedKmH: 55
    },
    {
      id: 'AMB-01',
      name: 'Ambulance 01 (Paramedic Unit)',
      type: 'AMBULANCE',
      currentLocation: { lat: center.lat - 0.012, lng: center.lng - 0.009, address: 'South Station Point' },
      baseLocation: { lat: center.lat - 0.012, lng: center.lng - 0.009 },
      status: 'AVAILABLE',
      speedKmH: 50
    },
    {
      id: 'AMB-14',
      name: 'Ambulance 14 (Mobile ICU)',
      type: 'AMBULANCE',
      currentLocation: { lat: center.lat + 0.018, lng: center.lng - 0.014, address: 'West Ring Junction' },
      baseLocation: { lat: center.lat + 0.018, lng: center.lng - 0.014 },
      status: 'AVAILABLE',
      speedKmH: 52
    },
    {
      id: 'POL-12',
      name: 'Police Patrol 12 (Rapid Response)',
      type: 'POLICE',
      currentLocation: { lat: center.lat + 0.004, lng: center.lng - 0.011, address: 'Civic Center West' },
      baseLocation: { lat: center.lat + 0.004, lng: center.lng - 0.011 },
      status: 'AVAILABLE',
      speedKmH: 60
    },
    {
      id: 'POL-04',
      name: 'Police Patrol 04 (Highway Interceptor)',
      type: 'POLICE',
      currentLocation: { lat: center.lat - 0.016, lng: center.lng + 0.015, address: 'South Expressway' },
      baseLocation: { lat: center.lat - 0.016, lng: center.lng + 0.015 },
      status: 'AVAILABLE',
      speedKmH: 65
    },
    {
      id: 'POL-19',
      name: 'Police Unit 19 (Downtown Sector)',
      type: 'POLICE',
      currentLocation: { lat: center.lat + 0.022, lng: center.lng + 0.019, address: 'East Market Checkpoint' },
      baseLocation: { lat: center.lat + 0.022, lng: center.lng + 0.019 },
      status: 'AVAILABLE',
      speedKmH: 55
    },
    {
      id: 'FIRE-03',
      name: 'Fire & Rescue Engine 03',
      type: 'FIRE',
      currentLocation: { lat: center.lat - 0.007, lng: center.lng + 0.021, address: 'East Station 3' },
      baseLocation: { lat: center.lat - 0.007, lng: center.lng + 0.021 },
      status: 'AVAILABLE',
      speedKmH: 45
    },
    {
      id: 'FIRE-08',
      name: 'Fire Ladder Truck 08',
      type: 'FIRE',
      currentLocation: { lat: center.lat + 0.028, lng: center.lng - 0.008, address: 'North Fire Depot' },
      baseLocation: { lat: center.lat + 0.028, lng: center.lng - 0.008 },
      status: 'AVAILABLE',
      speedKmH: 40
    },
    {
      id: 'TRF-02',
      name: 'Traffic Response Unit 02',
      type: 'TRAFFIC',
      currentLocation: { lat: center.lat + 0.005, lng: center.lng + 0.002, address: 'Central Flyover' },
      baseLocation: { lat: center.lat + 0.005, lng: center.lng + 0.002 },
      status: 'AVAILABLE',
      speedKmH: 48
    },
    {
      id: 'TRF-06',
      name: 'Traffic Hazard Clearance 06',
      type: 'TRAFFIC',
      currentLocation: { lat: center.lat - 0.022, lng: center.lng - 0.012, address: 'South Bypass Road' },
      baseLocation: { lat: center.lat - 0.022, lng: center.lng - 0.012 },
      status: 'AVAILABLE',
      speedKmH: 45
    }
  ];
}

export function getSeedIncidents(center = DEFAULT_DEMO_CENTER): Incident[] {
  const now = Date.now();
  const formatTime = (minusMinutes: number) => new Date(now - minusMinutes * 60000).toISOString();

  return [
    // Prebuilt Demo Scenario: Road Accident — East Gate Road
    {
      id: 'INC-1042',
      displayNumber: 1042,
      citizenPhone: '+91 98765 43210',
      type: 'accident',
      title: 'Road Accident — East Gate Road',
      description: 'Two cars collided near East Gate Road intersection. Traffic is backed up, 2 passengers appear injured and need medical attention.',
      peopleInvolved: 2,
      location: {
        lat: center.lat + 0.003,
        lng: center.lng + 0.004,
        address: 'East Gate Road, Near Crossway'
      },
      createdAt: formatTime(5),
      aiStatus: 'VERIFIED',
      aiAnalysis: {
        detectedType: 'accident',
        priority: 'HIGH',
        confidence: 91,
        summary: 'Road crash involving two cars with two reported injuries. Traffic is blocked.',
        risks: ['Road blocked for other drivers', 'Injuries require immediate paramedic help'],
        recommendedUnits: ['Ambulance', 'Traffic Unit'],
        peopleCountEstimated: 2,
        reliabilityScore: 94,
        analyzedAt: formatTime(4)
      },
      humanStatus: 'PENDING',
      overallStatus: 'UNDER_REVIEW',
      assignedUnitIds: []
    },
    {
      id: 'INC-1041',
      displayNumber: 1041,
      citizenPhone: '+91 91234 56780',
      type: 'medical',
      title: 'Elderly Person Collapsed at Metro Gate',
      description: 'An elderly commuter lost consciousness on the sidewalk. Bystanders are assisting.',
      peopleInvolved: 1,
      location: {
        lat: center.lat - 0.008,
        lng: center.lng - 0.005,
        address: 'Metro Gate 3, Station Square'
      },
      createdAt: formatTime(15),
      aiStatus: 'VERIFIED',
      aiAnalysis: {
        detectedType: 'medical',
        priority: 'CRITICAL',
        confidence: 96,
        summary: 'Unconscious person in public area. Requires urgent ambulance transport.',
        risks: ['Possible cardiac or heat stroke emergency'],
        recommendedUnits: ['Ambulance'],
        peopleCountEstimated: 1,
        reliabilityScore: 98,
        analyzedAt: formatTime(14)
      },
      humanStatus: 'VERIFIED',
      humanNotes: 'Call verified with station security guard.',
      verifiedAt: formatTime(12),
      overallStatus: 'RESPONDING',
      assignedUnitIds: ['AMB-01']
    },
    {
      id: 'INC-1040',
      displayNumber: 1040,
      citizenPhone: '+91 98888 11111',
      type: 'fire',
      title: 'Kitchen Smoke at Restaurant Block',
      description: 'Smoke coming from rooftop ventilation at Food Court B. No visible flames yet, building is being evacuated.',
      peopleInvolved: 0,
      location: {
        lat: center.lat + 0.016,
        lng: center.lng - 0.008,
        address: 'Food Court B, North Plaza'
      },
      createdAt: formatTime(28),
      aiStatus: 'VERIFIED',
      aiAnalysis: {
        detectedType: 'fire',
        priority: 'HIGH',
        confidence: 93,
        summary: 'Commercial kitchen smoke with evacuation underway. Fire truck dispatched.',
        risks: ['Smoke inhalation', 'Risk of fire spreading to adjacent shops'],
        recommendedUnits: ['Fire Truck', 'Police Patrol'],
        peopleCountEstimated: 0,
        reliabilityScore: 92,
        analyzedAt: formatTime(27)
      },
      humanStatus: 'VERIFIED',
      humanNotes: 'Verified with building maintenance supervisor.',
      verifiedAt: formatTime(25),
      overallStatus: 'ON_SCENE',
      assignedUnitIds: ['FIRE-08', 'POL-19']
    },
    {
      id: 'INC-1039',
      displayNumber: 1039,
      citizenPhone: '+91 97777 22222',
      type: 'hazard',
      title: 'Fallen Electric Cable on Roadway',
      description: 'High voltage wire snapped and hanging across lane 2. Sparking noticed during rain.',
      peopleInvolved: 0,
      location: {
        lat: center.lat - 0.015,
        lng: center.lng + 0.009,
        address: 'Bypass Avenue, Pole 14'
      },
      createdAt: formatTime(45),
      aiStatus: 'VERIFIED',
      aiAnalysis: {
        detectedType: 'hazard',
        priority: 'HIGH',
        confidence: 89,
        summary: 'Live wire dangling across road. Extreme shock danger.',
        risks: ['Electric shock hazard', 'Vehicles driving over wire'],
        recommendedUnits: ['Traffic Unit', 'Police Patrol'],
        peopleCountEstimated: 0,
        reliabilityScore: 90,
        analyzedAt: formatTime(44)
      },
      humanStatus: 'VERIFIED',
      humanNotes: 'Traffic diverted. Power company notified.',
      verifiedAt: formatTime(40),
      overallStatus: 'RESOLVED',
      assignedUnitIds: ['TRF-02']
    },
    {
      id: 'INC-1038',
      displayNumber: 1038,
      citizenPhone: '+91 96666 33333',
      type: 'police',
      title: 'Bicycle Theft Reported with Minor Scuffle',
      description: 'Owner caught someone tampering with lock. Suspect fled toward park.',
      peopleInvolved: 1,
      location: {
        lat: center.lat + 0.012,
        lng: center.lng + 0.014,
        address: 'Public Library Park Entrance'
      },
      createdAt: formatTime(75),
      aiStatus: 'VERIFIED',
      aiAnalysis: {
        detectedType: 'police',
        priority: 'MEDIUM',
        confidence: 84,
        summary: 'Theft incident reported. Suspect fled, no weapons reported.',
        risks: ['Suspect at large in neighborhood'],
        recommendedUnits: ['Police Patrol'],
        peopleCountEstimated: 1,
        reliabilityScore: 88,
        analyzedAt: formatTime(74)
      },
      humanStatus: 'VERIFIED',
      humanNotes: 'Citizen provided description. Patrol informed.',
      verifiedAt: formatTime(70),
      overallStatus: 'RESOLVED',
      assignedUnitIds: ['POL-12']
    },
    {
      id: 'INC-1037',
      displayNumber: 1037,
      citizenPhone: '+91 95555 44444',
      type: 'accident',
      title: 'Suspicious Report: "Flying saucer crashed"',
      description: 'Alien spaceship crashed into water tank haha just checking if app works.',
      peopleInvolved: 0,
      location: {
        lat: center.lat - 0.02,
        lng: center.lng - 0.018,
        address: 'Green Meadows Layout'
      },
      createdAt: formatTime(110),
      aiStatus: 'REVIEW_REQUIRED',
      aiAnalysis: {
        detectedType: 'other',
        priority: 'LOW',
        confidence: 35,
        summary: 'Text contains joke keywords (alien, haha, checking). High chance of fake report.',
        risks: ['Waste of emergency resources'],
        recommendedUnits: [],
        peopleCountEstimated: 0,
        reliabilityScore: 28,
        analyzedAt: formatTime(109)
      },
      humanStatus: 'FALSE_REPORT',
      humanNotes: 'Prank confirmed via call. Issued automated simulated warning.',
      verifiedAt: formatTime(105),
      overallStatus: 'CANCELLED',
      assignedUnitIds: []
    }
  ];
}

export function getSeedAuditLogs(): AuditLogItem[] {
  const now = Date.now();
  const formatTime = (minusMinutes: number) => new Date(now - minusMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return [
    {
      id: 'LOG-001',
      timestamp: formatTime(15),
      action: 'INCIDENT_CREATED',
      details: 'Incident #1041 reported via Citizen App from Station Square',
      incidentId: 'INC-1041',
      actor: 'CITIZEN'
    },
    {
      id: 'LOG-002',
      timestamp: formatTime(14),
      action: 'AI_ANALYSIS_COMPLETED',
      details: 'AI analyzed Incident #1041. Urgency: CRITICAL. Recommended: Ambulance',
      incidentId: 'INC-1041',
      actor: 'AI_SYSTEM'
    },
    {
      id: 'LOG-003',
      timestamp: formatTime(12),
      action: 'EXECUTIVE_VERIFIED',
      details: 'Operator 123 verified Incident #1041 after phone check',
      incidentId: 'INC-1041',
      actor: 'EXECUTIVE_123'
    },
    {
      id: 'LOG-004',
      timestamp: formatTime(11),
      action: 'AMB-01_DISPATCHED',
      details: 'Simulated unit AMB-01 dispatched to Station Square',
      incidentId: 'INC-1041',
      unitId: 'AMB-01',
      actor: 'EXECUTIVE_123'
    },
    {
      id: 'LOG-005',
      timestamp: formatTime(5),
      action: 'INCIDENT_CREATED',
      details: 'Incident #1042 reported: Road Accident — East Gate Road',
      incidentId: 'INC-1042',
      actor: 'CITIZEN'
    },
    {
      id: 'LOG-006',
      timestamp: formatTime(4),
      action: 'AI_ANALYSIS_COMPLETED',
      details: 'AI analyzed Incident #1042. Urgency: HIGH. Confidence: 91%',
      incidentId: 'INC-1042',
      actor: 'AI_SYSTEM'
    }
  ];
}
