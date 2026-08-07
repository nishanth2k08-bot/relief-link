// ReliefLink Initial Disaster & Emergency Response Mock Dataset

export const initialDisasterZones = [
  {
    id: 'zone-1',
    name: 'Sector A: Coastal Flood Basin',
    type: 'flood',
    severity: 'critical', // critical, high, medium, low
    populationAffected: 45000,
    coordinates: [25.7617, -80.1918], // Miami Coastal reference
    radius: 4500, // meters
    color: '#EF4444',
    waterLevel: '3.4m above normal',
    sheltersActive: 6,
    evacuatedPercent: 68
  },
  {
    id: 'zone-2',
    name: 'Sector B: Seismic Fault Line',
    type: 'earthquake',
    severity: 'high',
    populationAffected: 28000,
    coordinates: [25.7900, -80.1300],
    radius: 3200,
    color: '#F59E0B',
    magnitude: '6.4 Mw',
    sheltersActive: 4,
    evacuatedPercent: 82
  },
  {
    id: 'zone-3',
    name: 'Sector C: Urban Landslide Corridor',
    type: 'landslide',
    severity: 'medium',
    populationAffected: 12500,
    coordinates: [25.7300, -80.2400],
    radius: 2100,
    color: '#EAB308',
    blockades: 8,
    sheltersActive: 2,
    evacuatedPercent: 91
  },
  {
    id: 'zone-4',
    name: 'Sector D: Staging & Evac Hub',
    type: 'safe_zone',
    severity: 'low',
    populationAffected: 5000,
    coordinates: [25.7100, -80.1700],
    radius: 1500,
    color: '#10B981',
    capacityAvailable: '4,200 beds',
    sheltersActive: 3,
    evacuatedPercent: 100
  }
];

export const initialIncidents = [
  {
    id: 'INC-8091',
    title: 'Hospital Backup Generator Failure',
    locationName: 'St. Jude Regional Medical Center',
    lat: 25.7650,
    lng: -80.1950,
    severity: 'critical', // critical, high, medium, low
    category: 'medical',
    status: 'unassigned', // unassigned, assigned, in_progress, resolved
    reportedBy: 'Dr. Aris Vance (Red Cross)',
    reportedTime: '10 mins ago',
    timestamp: Date.now() - 600000,
    casualties: 14,
    description: 'ICU ward lost main grid power. Backup diesel generator failed to initiate. 14 critical patients require emergency transport or portable power units.',
    assignedSquad: null,
    photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'INC-8092',
    title: 'Bridge Collapse & Trapped Vehicles',
    locationName: 'East River Causeway Km 4.2',
    lat: 25.7850,
    lng: -80.1450,
    severity: 'critical',
    category: 'rescue',
    status: 'in_progress',
    reportedBy: 'Captain Miller (Local Fire Rescue)',
    reportedTime: '25 mins ago',
    timestamp: Date.now() - 1500000,
    casualties: 6,
    description: 'Severe structural failure of span 3. Three civilian vehicles submerged. Heavy extraction equipment and scuba rescue teams deployed.',
    assignedSquad: 'Squad Alpha (SAR)',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'INC-8093',
    title: 'Clean Water Contamination Alert',
    locationName: 'Community Relief Camp Delta',
    lat: 25.7250,
    lng: -80.2350,
    severity: 'high',
    category: 'water',
    status: 'assigned',
    reportedBy: 'Sarah Jenkins (UNICEF Field)',
    reportedTime: '40 mins ago',
    timestamp: Date.now() - 2400000,
    casualties: 0,
    description: 'Main storage bladder punctured. 3,000 displaced residents without potable drinking water. Urgent request for 10 water purification bladders.',
    assignedSquad: 'Logistics Unit 4',
    photoUrl: null
  },
  {
    id: 'INC-8094',
    title: 'Shelter Roof Structural Rupture',
    locationName: 'Lincoln High School Gymnasium',
    lat: 25.7400,
    lng: -80.1800,
    severity: 'medium',
    category: 'shelter',
    status: 'in_progress',
    reportedBy: 'Officer Torres (National Guard)',
    reportedTime: '1 hr ago',
    timestamp: Date.now() - 3600000,
    casualties: 2,
    description: 'High winds damaged north roofing panels. Rain entering main sleeping quarters. Relocating 150 evacuees to West Wing.',
    assignedSquad: 'Volunteer Corp 2',
    photoUrl: null
  },
  {
    id: 'INC-8095',
    title: 'Medical Supplies Shortage',
    locationName: 'Field Clinic Bravo',
    lat: 25.7150,
    lng: -80.1650,
    severity: 'high',
    category: 'medical',
    status: 'unassigned',
    reportedBy: 'Nurse Elena Rostova',
    reportedTime: '1.5 hrs ago',
    timestamp: Date.now() - 5400000,
    casualties: 0,
    description: 'Depleted stock of trauma bandages, IV saline bags, and antibiotics following morning triage wave.',
    assignedSquad: null,
    photoUrl: null
  }
];

export const initialResources = [
  {
    id: 'res-1',
    category: 'Medical',
    name: 'Emergency Trauma Kits',
    unit: 'kits',
    available: 120,
    deployed: 380,
    total: 500,
    threshold: 150, // critical stock warning
    status: 'warning'
  },
  {
    id: 'res-2',
    category: 'Food',
    name: 'MRE Food Rations (3-Day)',
    unit: 'boxes',
    available: 4200,
    deployed: 10800,
    total: 15000,
    threshold: 2000,
    status: 'normal'
  },
  {
    id: 'res-3',
    category: 'Water',
    name: 'Potable Water Bladders (1000L)',
    unit: 'units',
    available: 18,
    deployed: 62,
    total: 80,
    threshold: 25,
    status: 'warning'
  },
  {
    id: 'res-4',
    category: 'Shelter',
    name: 'All-Weather Emergency Tents',
    unit: 'tents',
    available: 45,
    deployed: 455,
    total: 500,
    threshold: 50,
    status: 'critical'
  },
  {
    id: 'res-5',
    category: 'Equipment',
    name: 'Hydraulic Rescue Cutters',
    unit: 'sets',
    available: 14,
    deployed: 16,
    total: 30,
    threshold: 10,
    status: 'normal'
  },
  {
    id: 'res-6',
    category: 'Personnel',
    name: 'Certified EMT Responders',
    unit: 'personnel',
    available: 28,
    deployed: 92,
    total: 120,
    threshold: 30,
    status: 'warning'
  }
];

export const initialTeams = [
  {
    id: 'team-1',
    name: 'Squad Alpha — Search & Rescue',
    agency: 'National Urban SAR',
    lead: 'Capt. Marcus Thorne',
    membersCount: 12,
    specialty: 'Heavy Extraction & Scuba',
    status: 'deployed', // deployed, standby, resting
    currentLocation: 'Causeway Km 4.2',
    fatigueHours: 6.5,
    contactRadio: 'CH-4 (142.85 MHz)'
  },
  {
    id: 'team-2',
    name: 'Medical Evac Unit 3',
    agency: 'Red Cross International',
    lead: 'Dr. Sarah Lin',
    membersCount: 8,
    specialty: 'Trauma & Triage Care',
    status: 'deployed',
    currentLocation: 'St. Jude Hospital',
    fatigueHours: 8.0,
    contactRadio: 'CH-2 (155.40 MHz)'
  },
  {
    id: 'team-3',
    name: 'Logistics Convoy Bravo',
    agency: 'FEMA Disaster Corp',
    lead: 'Lt. Dan Ramirez',
    membersCount: 15,
    specialty: 'Supply Transport & Water Purification',
    status: 'standby',
    currentLocation: 'Staging Hub Sector D',
    fatigueHours: 2.0,
    contactRadio: 'CH-7 (168.20 MHz)'
  },
  {
    id: 'team-4',
    name: 'Volunteer Rapid Response Corp',
    agency: 'Civil Defense Volunteers',
    lead: 'Maya Patel',
    membersCount: 34,
    specialty: 'Evacuation & Shelter Setup',
    status: 'deployed',
    currentLocation: 'Lincoln Gymnasium Shelter',
    fatigueHours: 4.5,
    contactRadio: 'CH-9 (149.10 MHz)'
  }
];

export const initialChatMessages = [
  {
    id: 'msg-1',
    channel: 'global',
    sender: 'Command Center Ops',
    agency: 'FEMA',
    text: 'ALERT: Cyclone Hector wind speed increased to 120km/h. All coastal units pull back to secondary perimeter line.',
    time: '11:02 AM',
    isBroadcast: true,
    isEncrypted: true
  },
  {
    id: 'msg-2',
    channel: 'global',
    sender: 'Capt. Marcus Thorne',
    agency: 'Urban SAR',
    text: 'Squad Alpha on scene at Causeway Km 4.2 bridge collapse. Commencing underwater sonar sweep for submerged vehicles.',
    time: '11:05 AM',
    isBroadcast: false,
    isEncrypted: false
  },
  {
    id: 'msg-3',
    channel: 'medical',
    sender: 'Dr. Sarah Lin',
    agency: 'Red Cross',
    text: 'Field Clinic Bravo urgently needs 50 units of O-Negative blood and 20 trauma bandage kits. Stock depleted.',
    time: '11:12 AM',
    isBroadcast: false,
    isEncrypted: false
  },
  {
    id: 'msg-4',
    channel: 'logistics',
    sender: 'Lt. Dan Ramirez',
    agency: 'FEMA Logistics',
    text: 'Supply truck Convoy Bravo departing Staging Hub Sector D with 2,000 MRE food boxes and 10 water bladders.',
    time: '11:18 AM',
    isBroadcast: false,
    isEncrypted: false
  }
];

export const agencyUsers = [
  {
    id: 'usr-1',
    name: 'Commander Elena Vance',
    role: 'coordinator', // coordinator, responder, admin
    agency: 'FEMA Regional Command',
    badgeId: 'FEMA-9921',
    avatar: 'EV'
  },
  {
    id: 'usr-2',
    name: 'Officer Jack Rodriguez',
    role: 'responder',
    agency: 'National Guard Search & Rescue',
    badgeId: 'NG-4012',
    avatar: 'JR'
  },
  {
    id: 'usr-3',
    name: 'Admin System Controller',
    role: 'admin',
    agency: 'Government Emergency Ops Center',
    badgeId: 'GEOC-001',
    avatar: 'AD'
  }
];

export const emergencyAlerts = [
  'URGENT: Flash Flood Warning extended for Sector A until 18:00 HRS.',
  'CRITICAL: Hospital backup generator down at St. Jude Medical Center. Rescue units requested.',
  'NOTICE: Multi-Agency Radio Channel switched to CH-4 for Search & Rescue units.'
];
