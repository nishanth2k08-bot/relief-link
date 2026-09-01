// ReliefLink Standalone Bundled Script with Firebase Auth & Live Global Disaster Tracking

(function () {
  'use strict';

  // ==========================================
  // 1. DATA: LIVE WORLDWIDE DISASTERS & SECTORS
  // ==========================================
  const globalDisastersList = [
    {
      id: 'disaster-world-1',
      name: 'Cyclone Hector (Category 4)',
      region: 'Caribbean & US East Coast',
      type: 'cyclone',
      icon: 'fa-hurricane',
      severity: 'critical',
      affectedCount: '2.4M Civilians',
      coordinates: [25.7617, -80.1918],
      windSpeed: '215 km/h Wind',
      status: 'Active Landfall Warning',
      evacuated: '68%',
      color: '#EF4444'
    },
    {
      id: 'disaster-world-2',
      name: 'Pacific Ring Seismic Swarm (Mw 7.2)',
      region: 'Japan & East Asia Fault Line',
      type: 'earthquake',
      icon: 'fa-house-crack',
      severity: 'critical',
      affectedCount: '1.8M Civilians',
      coordinates: [35.6762, 139.6503],
      windSpeed: 'Depth: 12km • Tsunami Active',
      status: 'High Tsunami Risk',
      evacuated: '82%',
      color: '#EF4444'
    },
    {
      id: 'disaster-world-3',
      name: 'Monsoon Basin Inundation',
      region: 'South Asia / Ganges River Delta',
      type: 'flood',
      icon: 'fa-water',
      severity: 'high',
      affectedCount: '4.5M Civilians',
      coordinates: [23.8103, 90.4125],
      windSpeed: 'Water Level +4.2m',
      status: 'Mass Evacuation Operations',
      evacuated: '54%',
      color: '#F59E0B'
    },
    {
      id: 'disaster-world-4',
      name: 'Mediterranean Wildfire Complex',
      region: 'Southern Europe / Greece',
      type: 'wildfire',
      icon: 'fa-fire-flame-curved',
      severity: 'high',
      affectedCount: '340K Civilians',
      coordinates: [37.9838, 23.7275],
      windSpeed: 'High Thermal Propagation',
      status: 'Uncontained Perimeter',
      evacuated: '91%',
      color: '#F59E0B'
    },
    {
      id: 'disaster-world-5',
      name: 'Mount Semeru Volcanic Eruption',
      region: 'Java, Indonesia',
      type: 'volcano',
      icon: 'fa-volcano',
      severity: 'critical',
      affectedCount: '620K Civilians',
      coordinates: [-8.1080, 112.9220],
      windSpeed: 'Ash Plume Height 15km',
      status: 'Red Aviation Warning',
      evacuated: '76%',
      color: '#EF4444'
    },
    {
      id: 'disaster-world-6',
      name: 'Alpine Glacial Outburst Flood',
      region: 'Swiss Alps, Europe',
      type: 'flood',
      icon: 'fa-hill-rockslide',
      severity: 'medium',
      affectedCount: '85K Civilians',
      coordinates: [46.8182, 8.2275],
      windSpeed: 'Glacial Dam Breach',
      status: 'Controlled Evac Route',
      evacuated: '95%',
      color: '#EAB308'
    }
  ];

  const initialDisasterZones = [
    { id: 'zone-1', name: 'Sector A: Coastal Flood Basin', type: 'flood', severity: 'critical', populationAffected: 45000, coordinates: [25.7617, -80.1918], radius: 4500, color: '#EF4444', waterLevel: '3.4m above normal', sheltersActive: 6, evacuatedPercent: 68 },
    { id: 'zone-2', name: 'Sector B: Seismic Fault Line', type: 'earthquake', severity: 'high', populationAffected: 28000, coordinates: [25.7900, -80.1300], radius: 3200, color: '#F59E0B', magnitude: '6.4 Mw', sheltersActive: 4, evacuatedPercent: 82 },
    { id: 'zone-3', name: 'Sector C: Urban Landslide Corridor', type: 'landslide', severity: 'medium', populationAffected: 12500, coordinates: [25.7300, -80.2400], radius: 2100, color: '#EAB308', blockades: 8, sheltersActive: 2, evacuatedPercent: 91 }
  ];

  const initialIncidents = [
    { id: 'INC-8091', title: 'Hospital Backup Generator Failure', locationName: 'St. Jude Regional Medical Center', lat: 25.7650, lng: -80.1950, severity: 'critical', category: 'medical', status: 'unassigned', reportedBy: 'Dr. Aris Vance (Red Cross)', reportedTime: '10 mins ago', timestamp: Date.now() - 600000, casualties: 14, description: 'ICU ward lost main grid power. Backup diesel generator failed to initiate. 14 critical patients require emergency transport.', assignedSquad: null },
    { id: 'INC-8092', title: 'Bridge Collapse & Trapped Vehicles', locationName: 'East River Causeway Km 4.2', lat: 25.7850, lng: -80.1450, severity: 'critical', category: 'rescue', status: 'in_progress', reportedBy: 'Captain Miller (Local Fire Rescue)', reportedTime: '25 mins ago', timestamp: Date.now() - 1500000, casualties: 6, description: 'Severe structural failure of span 3. Three civilian vehicles submerged. Heavy extraction equipment deployed.', assignedSquad: 'Squad Alpha (SAR)' }
  ];

  const initialResources = [
    { id: 'res-1', category: 'Medical', name: 'Emergency Trauma Kits', unit: 'kits', available: 120, deployed: 380, total: 500, threshold: 150, status: 'warning' },
    { id: 'res-2', category: 'Food', name: 'MRE Food Rations (3-Day)', unit: 'boxes', available: 4200, deployed: 10800, total: 15000, threshold: 2000, status: 'normal' },
    { id: 'res-3', category: 'Water', name: 'Potable Water Bladders (1000L)', unit: 'units', available: 18, deployed: 62, total: 80, threshold: 25, status: 'warning' },
    { id: 'res-4', category: 'Shelter', name: 'All-Weather Emergency Tents', unit: 'tents', available: 45, deployed: 455, total: 500, threshold: 50, status: 'critical' }
  ];

  const initialTeams = [
    { id: 'team-1', name: 'Squad Alpha — Search & Rescue', agency: 'National Urban SAR', lead: 'Capt. Marcus Thorne', membersCount: 12, specialty: 'Heavy Extraction & Scuba', status: 'deployed', currentLocation: 'Causeway Km 4.2', fatigueHours: 6.5, contactRadio: 'CH-4 (142.85 MHz)' },
    { id: 'team-2', name: 'Medical Evac Unit 3', agency: 'Red Cross International', lead: 'Dr. Sarah Lin', membersCount: 8, specialty: 'Trauma & Triage Care', status: 'deployed', currentLocation: 'St. Jude Hospital', fatigueHours: 8.0, contactRadio: 'CH-2 (155.40 MHz)' }
  ];

  const initialChatMessages = [
    { id: 'msg-1', channel: 'global', sender: 'Command Ops Center', agency: 'FEMA', text: 'ALERT: Cyclone Hector wind speed increased to 215km/h. Live global disaster feed active.', time: '11:02 AM', isBroadcast: true, isEncrypted: true }
  ];

  const agencyUsers = [
    { id: 'usr-1', email: 'elena.vance@fema.gov', name: 'Commander Elena Vance', role: 'coordinator', agency: 'FEMA Regional Command', badgeId: 'FEMA-9921', avatar: 'EV' },
    { id: 'usr-2', email: 'jack.rodriguez@nationalguard.gov', name: 'Officer Jack Rodriguez', role: 'responder', agency: 'National Guard Search & Rescue', badgeId: 'NG-4012', avatar: 'JR' },
    { id: 'usr-3', email: 'admin@geoc.gov', name: 'Admin System Controller', role: 'admin', agency: 'Government Emergency Ops Center', badgeId: 'GEOC-001', avatar: 'AD' }
  ];

  const emergencyAlerts = [
    'LIVE TRACKING ACTIVE: 6 Major Worldwide Disasters being tracked live on Global Map.',
    'FIREBASE AUTH & FIRESTORE CONNECTED: Real-time user accounts & database active.',
    'URGENT: Flash Flood Warning extended for Sector A until 18:00 HRS.'
  ];

  const translations = {
    en: { appTitle: "ReliefLink", dashboard: "Command Overview", liveMap: "Global Disaster Map", resources: "Resource Allocation", reportIncident: "Report Incident", commsFeed: "Multi-Agency Comms", teamTracker: "Team Deployment", priorityQueue: "Priority Task Queue", sitRep: "SitRep Generator", settings: "Settings & Access", offlineMode: "OFFLINE - Sync Queued", onlineMode: "ONLINE - Synced" }
  };

  // ==========================================
  // 2. STATE STORE & FIREBASE ENGINE
  // ==========================================
  class StateStore {
    constructor() {
      this.listeners = [];
      this.firebaseDb = null;
      this.firebaseAuth = null;
      this.isAuthenticated = false;

      const savedState = localStorage.getItem('relieflink_state_v1');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          this.currentView = parsed.currentView || 'login';
          this.currentUser = parsed.currentUser || null;
          this.isAuthenticated = parsed.isAuthenticated || false;
          this.isOnline = parsed.isOnline !== undefined ? parsed.isOnline : true;
          this.isHighContrast = parsed.isHighContrast || false;
          this.hasThemePreference = parsed.hasThemePreference === true;
          this.theme = this.hasThemePreference && parsed.theme === 'dark' ? 'dark' : 'light';
          this.language = parsed.language || 'en';
          this.mapMode = parsed.mapMode || 'global';
          this.disasterZones = parsed.disasterZones || initialDisasterZones;
          this.incidents = parsed.incidents || initialIncidents;
          this.resources = parsed.resources || initialResources;
          this.teams = parsed.teams || initialTeams;
          this.chatMessages = parsed.chatMessages || initialChatMessages;
          this.alerts = parsed.alerts || emergencyAlerts;
          this.offlineQueue = parsed.offlineQueue || [];
          this.firebaseConfig = parsed.firebaseConfig && parsed.firebaseConfig.projectId !== 'relieflink-disaster-app' ? parsed.firebaseConfig : {
            apiKey: "AIzaSyDg4vCGwpongqLXQbZkCQLL4Qc5ZlsvLlY",
            authDomain: "relief-link-ff2a6.firebaseapp.com",
            projectId: "relief-link-ff2a6",
            storageBucket: "relief-link-ff2a6.firebasestorage.app",
            messagingSenderId: "522220048520",
            appId: "1:522220048520:web:e90fa9f3e906f2ad4a4f3d"
          };
        } catch (e) {
          this.resetToDefaults();
        }
      } else {
        this.resetToDefaults();
      }

      this.initFirebase();
    }

    initFirebase() {
      if (window.firebase && this.firebaseConfig && this.firebaseConfig.projectId) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(this.firebaseConfig);
          }
          this.firebaseDb = window.firebase.firestore();
          this.firebaseAuth = window.firebase.auth();

          // Listen to Firebase Auth changes
          this.firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
              this.isAuthenticated = true;
              if (!this.currentUser) {
                this.currentUser = {
                  id: user.uid,
                  email: user.email,
                  name: user.displayName || user.email.split('@')[0],
                  agency: 'Authorized Responder Agency',
                  role: 'coordinator',
                  badgeId: 'AUTH-100',
                  avatar: (user.email || 'US').slice(0, 2).toUpperCase()
                };
              }
            }
          });

        } catch (err) {
          console.warn('Firebase init note:', err.message);
        }
      }
    }

    resetToDefaults() {
      this.currentView = 'login';
      this.currentUser = null;
      this.isAuthenticated = false;
      this.isOnline = true;
      this.isHighContrast = false;
      this.theme = 'light'; this.hasThemePreference = false;
      this.language = 'en';
      this.mapMode = 'global';
      this.disasterZones = initialDisasterZones;
      this.incidents = initialIncidents;
      this.resources = initialResources;
      this.teams = initialTeams;
      this.chatMessages = initialChatMessages;
      this.alerts = emergencyAlerts;
      this.offlineQueue = [];
      this.firebaseConfig = {
        apiKey: "AIzaSyDg4vCGwpongqLXQbZkCQLL4Qc5ZlsvLlY",
        authDomain: "relief-link-ff2a6.firebaseapp.com",
        projectId: "relief-link-ff2a6"
      };
      this.saveState();
    }

    saveState() {
      try {
        localStorage.setItem('relieflink_state_v1', JSON.stringify({
          currentView: this.currentView,
          currentUser: this.currentUser,
          isAuthenticated: this.isAuthenticated,
          isOnline: this.isOnline,
          isHighContrast: this.isHighContrast,
          theme: this.theme,
          language: this.language,
          hasThemePreference: this.hasThemePreference,
          mapMode: this.mapMode,
          disasterZones: this.disasterZones,
          incidents: this.incidents,
          resources: this.resources,
          teams: this.teams,
          chatMessages: this.chatMessages,
          alerts: this.alerts,
          offlineQueue: this.offlineQueue,
          firebaseConfig: this.firebaseConfig
        }));
      } catch (e) {}
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    notify() {
      this.saveState();
      this.listeners.forEach(listener => listener(this));
    }

    t(key) {
      const langDict = translations[this.language] || translations.en;
      return langDict[key] || translations.en[key] || key;
    }

    setCurrentView(view) { this.currentView = view; this.notify(); }
    setCurrentUser(user) {
      this.currentUser = user;
      this.isAuthenticated = true;
      this.notify();
    }

    signOut() {
      if (this.firebaseAuth) {
        try { this.firebaseAuth.signOut(); } catch (e) {}
      }
      this.currentUser = null;
      this.isAuthenticated = false;
      this.currentView = 'login';
      this.notify();
    }

    setMapMode(mode) { this.mapMode = mode; this.notify(); }
    toggleNetworkStatus() { this.isOnline = !this.isOnline; this.notify(); }
    toggleHighContrast() { this.isHighContrast = !this.isHighContrast; this.notify(); }
    toggleTheme() { this.theme = this.theme === 'dark' ? 'light' : 'dark'; this.hasThemePreference = true; this.notify(); }
    setLanguage(langCode) { if (translations[langCode]) { this.language = langCode; this.notify(); } }

    addIncident(incidentData) {
      const newIncident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'unassigned',
        reportedTime: 'Just now',
        timestamp: Date.now(),
        reportedBy: this.currentUser ? `${this.currentUser.name} (${this.currentUser.agency})` : 'Anonymous Responder',
        assignedSquad: null,
        ...incidentData
      };
      this.incidents.unshift(newIncident);
      if (this.firebaseDb && this.isOnline) {
        try { this.firebaseDb.collection('incidents').doc(newIncident.id).set(newIncident); } catch (e) {}
      }
      this.notify();
      return newIncident;
    }

    updateIncidentStatus(incidentId, newStatus, squadName = null) {
      const incident = this.incidents.find(i => i.id === incidentId);
      if (incident) {
        incident.status = newStatus;
        if (squadName) incident.assignedSquad = squadName;
        this.notify();
      }
    }

    deployResource(resourceId, amount) {
      const res = this.resources.find(r => r.id === resourceId);
      if (res && res.available >= amount) {
        res.available -= amount;
        res.deployed += amount;
        this.notify();
      }
    }

    restockResource(resourceId, amount) {
      const res = this.resources.find(r => r.id === resourceId);
      if (res) {
        res.available += amount;
        res.total += amount;
        this.notify();
      }
    }

    sendChatMessage(channel, text) {
      const msg = {
        id: `msg-${Date.now()}`,
        channel: channel,
        sender: this.currentUser ? this.currentUser.name : 'Responder',
        agency: this.currentUser ? this.currentUser.agency : 'Field Corp',
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.chatMessages.push(msg);
      this.notify();
    }

    // Firebase Email/Password Sign In
    async signInWithEmail(email, password) {
      if (!this.firebaseAuth) return { success: false, error: 'Firebase not initialized. Go to Settings and enter your Firebase config first.' };
      try {
        const result = await this.firebaseAuth.signInWithEmailAndPassword(email, password);
        const user = result.user;
        this.setCurrentUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          agency: 'Firebase Authenticated',
          role: 'coordinator',
          badgeId: 'AUTH-' + user.uid.slice(0, 4).toUpperCase(),
          avatar: (user.email || 'U').slice(0, 2).toUpperCase(),
          authProvider: 'email'
        });
        this.isAuthenticated = true;
        this.setCurrentView('overview');
        if (typeof showToast === 'function') showToast('Signed in successfully with email.');
        return { success: true };
      } catch (err) {
        console.error('Email sign-in error:', err);
        return { success: false, error: err.message };
      }
    }

    // Firebase Email/Password Registration
    async registerWithEmail(email, password) {
      if (!this.firebaseAuth) return { success: false, error: 'Firebase not initialized. Go to Settings and enter your Firebase config first.' };
      try {
        const result = await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = result.user;
        this.setCurrentUser({
          id: user.uid,
          email: user.email,
          name: user.email.split('@')[0],
          agency: 'New Responder',
          role: 'responder',
          badgeId: 'NEW-' + user.uid.slice(0, 4).toUpperCase(),
          avatar: (user.email || 'U').slice(0, 2).toUpperCase(),
          authProvider: 'email'
        });
        this.isAuthenticated = true;
        this.setCurrentView('overview');
        if (typeof showToast === 'function') showToast('Account created and signed in.');
        return { success: true };
      } catch (err) {
        console.error('Registration error:', err);
        return { success: false, error: err.message };
      }
    }

    // Google Sign-In
    async signInWithGoogle() {
      if (!this.firebaseAuth) return { success: false, error: 'Firebase not initialized. Go to Settings and enter your Firebase config first.' };
      try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        const result = await this.firebaseAuth.signInWithPopup(provider);
        const user = result.user;
        this.setCurrentUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          agency: 'Google Authenticated',
          role: 'coordinator',
          badgeId: 'GOG-' + user.uid.slice(0, 4).toUpperCase(),
          avatar: (user.displayName || user.email || 'G').slice(0, 2).toUpperCase(),
          photoURL: user.photoURL || null,
          authProvider: 'google'
        });
        this.isAuthenticated = true;
        this.setCurrentView('overview');
        if (typeof showToast === 'function') showToast('Signed in successfully with Google.');
        return { success: true };
      } catch (err) {
        console.error('Google sign-in error:', err);
        return { success: false, error: err.message };
      }
    }

    // Apple Sign-In
    async signInWithApple() {
      if (!this.firebaseAuth) return { success: false, error: 'Firebase not initialized. Go to Settings and enter your Firebase config first.' };
      try {
        const provider = new window.firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        const result = await this.firebaseAuth.signInWithPopup(provider);
        const user = result.user;
        this.setCurrentUser({
          id: user.uid,
          email: user.email || 'private@apple.com',
          name: user.displayName || 'Apple User',
          agency: 'Apple Authenticated',
          role: 'coordinator',
          badgeId: 'APL-' + user.uid.slice(0, 4).toUpperCase(),
          avatar: (user.displayName || 'AP').slice(0, 2).toUpperCase(),
          authProvider: 'apple'
        });
        this.isAuthenticated = true;
        this.setCurrentView('overview');
        if (typeof showToast === 'function') showToast('Signed in successfully with Apple.');
        return { success: true };
      } catch (err) {
        console.error('Apple sign-in error:', err);
        return { success: false, error: err.message };
      }
    }

    // Update Firebase Config from Settings page
    updateFirebaseConfig(newConfig) {
      this.firebaseConfig = { ...this.firebaseConfig, ...newConfig };
      this.saveState();
      // Re-init Firebase with new config
      try {
        if (window.firebase && window.firebase.apps.length) {
          window.firebase.app().delete().then(() => {
            window.firebase.initializeApp(this.firebaseConfig);
            this.firebaseDb = window.firebase.firestore();
            this.firebaseAuth = window.firebase.auth();
            this.firebaseAuth.onAuthStateChanged((user) => {
              if (user && !this.currentUser) {
                this.currentUser = {
                  id: user.uid,
                  email: user.email,
                  name: user.displayName || user.email.split('@')[0],
                  agency: 'Authorized Responder Agency',
                  role: 'coordinator',
                  badgeId: 'AUTH-100',
                  avatar: (user.email || 'US').slice(0, 2).toUpperCase()
                };
              }
            });
          });
        } else if (window.firebase) {
          window.firebase.initializeApp(this.firebaseConfig);
          this.firebaseDb = window.firebase.firestore();
          this.firebaseAuth = window.firebase.auth();
        }
      } catch (err) {
        console.warn('Firebase re-init:', err.message);
      }
    }

    calculatePriorityScore(incident) {
      let score = 0;
      if (incident.severity === 'critical') score += 50;
      else if (incident.severity === 'high') score += 35;
      else score += 15;
      score += Math.min((incident.casualties || 0) * 5, 30);
      return Math.min(score, 99);
    }
  }

  const store = new StateStore();

  // ==========================================
  // 3. UI VIEWS & LOGIN AUTH SCREEN
  // ==========================================
  let activeMapInstance = null;

  function renderNavbar() {
    const user = store.currentUser || { name: 'Field Responder', agency: 'Emergency Response' };
    const isLightTheme = store.theme === 'light';

    return `
      <header class="app-header">
        <div class="brand-section">
          <div class="brand-logo"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="brand-title">ReliefLink <span class="brand-tag">GLOBAL 3.5</span></div>
        </div>

        <div class="header-center">
          <div class="role-badge-selector">
            ${agencyUsers.map(usr => `
              <button class="role-btn ${user.id === usr.id ? 'active' : ''}" data-user-id="${usr.id}">
                <i class="fa-solid ${usr.role === 'coordinator' ? 'fa-user-gear' : 'fa-user-shield'}"></i>
                ${usr.name.split(' ')[0]} (${usr.role})
              </button>
            `).join('')}
          </div>
        </div>

        <div class="header-actions">
          <button id="btn-toggle-theme" class="btn btn-secondary btn-sm" title="Switch between light and dark appearance" aria-label="${isLightTheme ? 'Light' : 'Dark'} mode enabled" aria-pressed="${isLightTheme}">
            <i class="fa-solid ${isLightTheme ? 'fa-sun' : 'fa-moon'}"></i>
            <span>${isLightTheme ? 'Light' : 'Dark'}</span>
          </button>

          <span style="font-size: 0.72rem; font-weight: 700; color: #10B981; background: rgba(16,185,129,0.15); padding: 4px 8px; border-radius: 12px;">
            <i class="fa-solid fa-user-check"></i> ${user.name.split(' ')[0]}
          </span>

          <button id="btn-sign-out" class="btn btn-secondary btn-sm" title="Sign out of responder account">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </header>
    `;
  }

  function renderSidebar() {
    const currentView = store.currentView;
    const navItems = [
      { id: 'overview', icon: 'fa-gauge-high', label: 'Command Overview' },
      { id: 'map', icon: 'fa-earth-americas', label: 'Global Disaster Map', badge: 'LIVE 6', badgeClass: 'critical' },
      { id: 'resources', icon: 'fa-boxes-stacked', label: 'Resource Allocation' },
      { id: 'report', icon: 'fa-triangle-exclamation', label: 'Report Incident' },
      { id: 'comms', icon: 'fa-walkie-talkie', label: 'Multi-Agency Feed' },
      { id: 'teams', icon: 'fa-users-gear', label: 'Team Deployment' },
      { id: 'queue', icon: 'fa-list-check', label: 'Priority Task Queue' },
      { id: 'sitrep', icon: 'fa-file-invoice-dollar', label: 'SitRep Generator' }
    ];

    return `
      <aside class="app-sidebar">
        <ul class="nav-menu">
          ${navItems.map(item => `
            <li>
              <button class="nav-item-btn ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
                <i class="fa-solid ${item.icon} nav-icon"></i>
                <span>${item.label}</span>
                ${item.badge ? `<span class="nav-badge ${item.badgeClass}">${item.badge}</span>` : ''}
              </button>
            </li>
          `).join('')}
        </ul>
      </aside>
    `;
  }

  function renderTicker() {
    return `
      <div class="alert-ticker-bar">
        <div class="ticker-label"><i class="fa-solid fa-globe"></i> <span>LIVE GLOBAL THREAT RADAR</span></div>
        <div class="ticker-content"><div class="ticker-text">${store.alerts.join('  •  ')}</div></div>
      </div>
    `;
  }

  function renderFAB() {
    return `<button id="fab-sos-button" class="fab-sos"><i class="fa-solid fa-truck-medical"></i></button>`;
  }

  // LOGIN & AUTH SCREEN
  function renderLoginView() {
    return `
      <div class="view-container" style="position: relative; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(239,68,68,0.08) 0%, transparent 50%), radial-gradient(circle at center, var(--bg-header) 0%, var(--bg-app) 100%);">
        <div class="card" style="width: 100%; max-width: 480px; padding: 40px 36px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 120px rgba(59,130,246,0.06); backdrop-filter: blur(20px);">
          
        <button id="btn-toggle-theme" class="btn btn-secondary btn-sm" style="position: absolute; top: 20px; right: 20px; z-index: 1;" title="Switch between light and dark appearance" aria-label="${store.theme === 'light' ? 'Light' : 'Dark'} mode enabled" aria-pressed="${store.theme === 'light'}">
          <i class="fa-solid ${store.theme === 'light' ? 'fa-sun' : 'fa-moon'}"></i>
          <span>${store.theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>

          <div style="text-align: center; margin-bottom: 28px;">
            <div class="brand-logo" style="width: 64px; height: 64px; font-size: 2rem; margin: 0 auto 16px auto; background: linear-gradient(135deg, #ff7a59 0%, #fbbf24 30%, #3b82f6 100%); box-shadow: 0 16px 32px rgba(59,130,246,0.28); border: 1px solid rgba(255,255,255,0.12);">
              <i class="fa-solid fa-shield-heart"></i>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">ReliefLink</h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 6px;">
              Emergency Response Coordination Platform
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:4px;">
              <span style="font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Sign in</span>
              <button id="btn-show-create-account" type="button" style="display:flex; align-items:center; justify-content:center; gap:6px; border-radius:999px; padding:8px 12px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:var(--text-main); font-size:0.72rem; font-weight:700; cursor:pointer; transition:all 0.2s ease; font-family:inherit;">Create account</button>
            </div>
            <button id="btn-google-signin" style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:var(--text-main); font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; font-family:inherit;">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <button id="btn-apple-signin" style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:var(--text-main); font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; font-family:inherit;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>

            <button id="btn-phone-signin" type="button" style="display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:12px 16px; border-radius:10px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:var(--text-main); font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.2s ease; font-family:inherit;">
              <i class="fa-solid fa-mobile-screen-button"></i>
              Sign in with Phone Number
            </button>
          </div>

          <div id="create-account-panel" style="display:none; margin-bottom:20px; padding:18px; border:1px solid rgba(255,255,255,0.08); border-radius:16px; background:rgba(59,130,246,0.06);">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px;">
              <h3 style="font-size:1.05rem; margin:0;">Create account</h3>
              <button id="btn-back-to-login" type="button" style="display:flex; align-items:center; justify-content:center; padding:7px 10px; border-radius:999px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); color:var(--text-main); font-size:0.72rem; font-weight:700; cursor:pointer; font-family:inherit;">Back</button>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label">Full Name</label>
              <input type="text" id="create-account-name" placeholder="Your full name" />
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label">Email Address</label>
              <input type="email" id="create-account-email" placeholder="name@agency.org" />
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label">Password</label>
              <input type="password" id="create-account-password" placeholder="Create a password" />
            </div>
            <button id="btn-submit-create-account" type="button" style="display:flex; align-items:center; justify-content:center; width:100%; padding:12px 16px; border-radius:10px; background:linear-gradient(135deg, var(--color-primary), #2563eb); color:white; font-size:0.9rem; font-weight:700; cursor:pointer; font-family:inherit;">Create Account</button>
          </div>

          <div id="phone-auth-panel" style="display:none; margin-bottom:20px;">
            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <div style="display:flex; border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; background:var(--bg-app); align-items:stretch;">
                <div style="position:relative; display:flex; align-items:center; background:var(--bg-card); border-right:1px solid var(--border-color);">
                  <select id="phone-country-code" aria-label="Country code" style="border:none; background:var(--bg-card); color:var(--text-main); padding:10px 28px 10px 10px; width:120px; min-width:120px; font-size:0.76rem; text-align:center; appearance:none; -webkit-appearance:none; -moz-appearance:none; cursor:pointer;">
                    <option value="+1" style="color:var(--text-main); background:var(--bg-card);">🇺🇸 +1</option>
                    <option value="+7" style="color:var(--text-main); background:var(--bg-card);">🇷🇺 +7</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+30">🇬🇷 +30</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+36">🇭🇺 +36</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+48">🇵🇱 +48</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+62">🇮🇩 +62</option>
                  <option value="+63">🇵🇭 +63</option>
                  <option value="+64">🇳🇿 +64</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+66">🇹🇭 +66</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+84">🇻🇳 +84</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+90">🇹🇷 +90</option>
                  <option value="+91" selected>🇮🇳 +91</option>
                  <option value="+92">🇵🇰 +92</option>
                  <option value="+94">🇱🇰 +94</option>
                  <option value="+98">🇮🇷 +98</option>
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+213">🇩🇿 +213</option>
                  <option value="+216">🇹🇳 +216</option>
                  <option value="+220">🇬🇲 +220</option>
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+234">🇳🇬 +234</option>
                  <option value="+254">🇰🇪 +254</option>
                  <option value="+255">🇹🇿 +255</option>
                  <option value="+256">🇺🇬 +256</option>
                  <option value="+263">🇿🇼 +263</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+353">🇮🇪 +353</option>
                  <option value="+355">🇦🇱 +355</option>
                  <option value="+358">🇫🇮 +358</option>
                  <option value="+370">🇱🇹 +370</option>
                  <option value="+371">🇱🇻 +371</option>
                  <option value="+372">🇪🇪 +372</option>
                  <option value="+375">🇧🇾 +375</option>
                  <option value="+380">🇺🇦 +380</option>
                  <option value="+385">🇭🇷 +385</option>
                  <option value="+420">🇨🇿 +420</option>
                  <option value="+421">🇸🇰 +421</option>
                  <option value="+500">🇫🇰 +500</option>
                  <option value="+501">🇧🇿 +501</option>
                  <option value="+502">🇬🇹 +502</option>
                  <option value="+503">🇸🇻 +503</option>
                  <option value="+504">🇭🇳 +504</option>
                  <option value="+507">🇵🇦 +507</option>
                  <option value="+509">🇭🇹 +509</option>
                  <option value="+591">🇧🇴 +591</option>
                  <option value="+592">🇬🇾 +592</option>
                  <option value="+593">🇪🇨 +593</option>
                  <option value="+595">🇵🇾 +595</option>
                  <option value="+597">🇸🇷 +597</option>
                  <option value="+598">🇺🇾 +598</option>
                  <option value="+599">🇨🇼 +599</option>
                  <option value="+673">🇧🇳 +673</option>
                  <option value="+674">🇳🇷 +674</option>
                  <option value="+675">🇵🇬 +675</option>
                  <option value="+676">🇹🇴 +676</option>
                  <option value="+677">🇸🇧 +677</option>
                  <option value="+678">🇻🇺 +678</option>
                  <option value="+679">🇫🇯 +679</option>
                  <option value="+680">🇵🇼 +680</option>
                  <option value="+682">🇨🇰 +682</option>
                  <option value="+852">🇭🇰 +852</option>
                  <option value="+853">🇲🇴 +853</option>
                  <option value="+855">🇰🇭 +855</option>
                  <option value="+856">🇱🇦 +856</option>
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+886">🇹🇼 +886</option>
                  <option value="+960">🇲🇻 +960</option>
                  <option value="+961">🇱🇧 +961</option>
                  <option value="+962">🇯🇴 +962</option>
                  <option value="+963">🇸🇾 +963</option>
                  <option value="+964">🇮🇶 +964</option>
                  <option value="+965">🇰🇼 +965</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+967">🇾🇪 +967</option>
                  <option value="+968">🇴🇲 +968</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+974">🇶🇦 +974</option>
                  <option value="+975">🇧🇹 +975</option>
                  <option value="+976">🇲🇳 +976</option>
                  <option value="+977">🇳🇵 +977</option>
                  <option value="+992">🇹🇯 +992</option>
                  <option value="+993">🇹🇲 +993</option>
                  <option value="+994">🇦🇿 +994</option>
                  <option value="+995">🇬🇪 +995</option>
                  <option value="+996">🇰🇬 +996</option>
                  <option value="+998">🇺🇿 +998</option>
                </select>
                <input type="tel" id="phone-number-input" placeholder="98765 43210" style="border:none; background:transparent; flex:1; min-width:0; padding:12px 14px; color:var(--text-main); font-size:0.95rem;" />
              </div>
            </div>

            <div id="otp-section" style="display:none; margin-top:12px;">
              <div class="form-group">
                <label class="form-label">Enter OTP</label>
                <input type="text" id="otp-input" maxlength="6" placeholder="6-digit code" style="letter-spacing:0.2em; text-align:center;" />
              </div>
            </div>

            <div style="display:flex; gap:8px; margin-top:12px;">
              <button type="button" id="btn-send-otp" class="btn btn-primary btn-sm" style="flex:1;">Send OTP</button>
              <button type="button" id="btn-verify-otp" class="btn btn-secondary btn-sm" style="flex:1; display:none;">Verify OTP</button>
            </div>
          </div>

          <!-- Divider -->
          <div style="display: flex; align-items: center; gap: 12px; margin: 20px 0;">
            <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">or sign in with agency credentials</span>
            <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
          </div>

          <div id="auth-tabs" style="display: flex; gap: 6px; background: var(--bg-app); padding: 6px; border-radius: var(--radius-md); margin-bottom: 18px;">
            <button type="button" id="tab-btn-login" class="btn btn-primary btn-sm" style="flex: 1; font-size: 0.8rem;">Sign In</button>
            <button type="button" id="tab-btn-register" class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.8rem;">Create Account</button>
          </div>

          <!-- Error Message -->
          <div id="auth-error-msg" style="display:none; padding:10px 14px; border-radius:8px; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; font-size:0.82rem; margin-bottom:14px; text-align:center; font-weight:500;">
          </div>

          <!-- Sign In Form -->
          <form id="auth-sign-in-form" data-auth-method="email">
            <div class="form-group">
              <label id="auth-identifier-label" class="form-label">Email Address</label>
              <input type="email" id="auth-email" placeholder="you@example.com" required style="font-size:0.9rem;" />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="auth-password" placeholder="Enter your password" required style="font-size:0.9rem;" />
            </div>

            <div class="form-group" id="auth-agency-group">
              <label class="form-label">Responding Agency Unit</label>
              <select id="auth-agency" style="font-size:0.9rem;">
                <option value="FEMA Regional Command">FEMA Regional Command</option>
                <option value="Red Cross International">Red Cross International</option>
                <option value="National Guard SAR">National Guard Search & Rescue</option>
                <option value="UNICEF Field Operations">UNICEF Field Operations</option>
                <option value="Local Government">Local Government Agency</option>
                <option value="Independent NGO">Independent NGO / Volunteer</option>
              </select>
            </div>

            <!-- Loading Spinner (hidden by default) -->
            <div id="auth-loading" style="display:none; text-align:center; padding:12px;">
              <i class="fa-solid fa-spinner fa-spin" style="font-size:1.4rem; color:var(--color-primary);"></i>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">Authenticating...</p>
            </div>

            <button type="submit" id="btn-email-signin" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px; font-size:0.92rem;">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In
            </button>
          </form>

          <!-- Quick Demo Access -->
          <div style="border-top: 1px solid var(--border-color); margin-top: 24px; padding-top: 16px; text-align: center;">
            <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
              Quick Demo Access
            </p>
            <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
              ${agencyUsers.map(usr => `
                <button class="btn btn-secondary btn-sm demo-sign-in-btn" data-user-id="${usr.id}" style="font-size:0.75rem; padding: 6px 10px;">
                  ${usr.name.split(' ')[0]} (${usr.role})
                </button>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // GLOBAL DISASTER MAP & TRACKING
  function renderMapView() {
    return `
      <div class="view-container" style="height: 100%;">
        <div class="view-header" style="padding: 12px 24px;">
          <div class="view-title-group">
            <h1><i class="fa-solid fa-earth-americas" style="color: var(--color-primary);"></i> Live Worldwide Disaster Radar & Tracking</h1>
            <p class="view-subtitle">Whole-Earth operational view with smooth live weather, wildfire and satellite intelligence layers</p>
          </div>
          <div class="view-actions">
            <button id="btn-global-map" class="btn btn-secondary btn-sm"><i class="fa-solid fa-globe"></i> Whole World</button>
            <button id="btn-map-report" class="btn btn-critical btn-sm"><i class="fa-solid fa-plus"></i> Pin Field Incident</button>
          </div>
        </div>

        <div class="view-body" style="padding: 12px 24px; flex: 1; display: flex; flex-direction: column;">
          <div class="map-view-layout" style="flex: 1;">
            
            <div class="gis-map-wrapper">
              <div id="disaster-map-element"></div>

              <div class="map-controls-floating map-live-controls">
                <strong><i class="fa-solid fa-satellite-dish"></i> LIVE INTELLIGENCE</strong>
                <label>
                  <input type="checkbox" id="layer-satellite" checked />
                  <span>High-resolution satellite view</span>
                </label>
                <label>
                  <input type="checkbox" id="layer-weather-alerts" checked />
                  <span>NOAA weather alerts <em id="weather-alert-count">Loading…</em></span>
                </label>
                <label>
                  <input type="checkbox" id="layer-wildfires" checked />
                  <span>NASA active wildfires <em id="wildfire-count">Loading…</em></span>
                </label>
                <small id="live-data-status" aria-live="polite">Connecting to public disaster feeds…</small>
              </div>
              
              <div class="map-legend-floating">
                <strong style="font-size: 0.75rem; display: block; margin-bottom: 6px;">WORLDWIDE DISASTER TRACKER</strong>
                <div class="legend-item"><div class="legend-color" style="background: #EF4444;"></div> Cat 4 Cyclone / Major Quake</div>
                <div class="legend-item"><div class="legend-color" style="background: #F59E0B;"></div> Monsoon Inundation / Volcano</div>
                <div class="legend-item"><div class="legend-color" style="background: #22C55E;"></div> NASA active wildfire event</div>
                <div class="legend-item"><div class="legend-color" style="background: #38BDF8;"></div> NOAA weather alert</div>
              </div>
            </div>

            <!-- Global Disasters List & Inspector -->
            <div class="card" style="display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fa-solid fa-globe" style="color: var(--color-primary);"></i>
                  Active Worldwide Disasters (${globalDisastersList.length})
                </h3>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${globalDisastersList.map(dis => `
                  <div class="card" style="padding: 12px; background: var(--bg-app); border-color: ${dis.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <strong style="font-size: 0.88rem;"><i class="fa-solid ${dis.icon}" style="color:${dis.color}; margin-right:4px;"></i> ${dis.name}</strong>
                      <span class="badge ${dis.severity === 'critical' ? 'badge-critical' : 'badge-high'}">${dis.severity}</span>
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                      <div>Region: <strong style="color: var(--text-main);">${dis.region}</strong></div>
                      <div>Impact: <strong style="color: var(--color-primary);">${dis.affectedCount}</strong></div>
                      <div>Metrics: <strong>${dis.windSpeed}</strong> • Status: <strong>${dis.status}</strong></div>
                    </div>
                    <button class="btn btn-primary btn-sm btn-fly-world-disaster" data-lat="${dis.coordinates[0]}" data-lng="${dis.coordinates[1]}" style="width: 100%; margin-top: 8px;">
                      <i class="fa-solid fa-crosshairs"></i> Track Live on Radar
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  function renderOverviewView() {
    return `
      <div class="view-container">
        <div class="view-header">
          <div class="view-title-group">
            <h1><i class="fa-solid fa-gauge-high" style="color: var(--color-primary);"></i> Command Overview</h1>
            <p class="view-subtitle">Authenticated Responder: <strong>${store.currentUser ? store.currentUser.name : 'Officer'}</strong> (${store.currentUser ? store.currentUser.agency : 'FEMA'})</p>
          </div>
          <div class="view-actions">
            <button id="btn-quick-report" class="btn btn-critical"><i class="fa-solid fa-plus"></i> Report Incident</button>
            <button id="btn-quick-sitrep" class="btn btn-secondary"><i class="fa-solid fa-file-invoice-dollar"></i> Instant SitRep</button>
          </div>
        </div>

        <div class="view-body">
          <div class="kpi-grid">
            <div class="kpi-card critical"><div class="kpi-icon"><i class="fa-solid fa-earth-americas"></i></div><div class="kpi-info"><span class="kpi-value">6 Active</span><span class="kpi-label">Worldwide Disasters</span></div></div>
            <div class="kpi-card warning"><div class="kpi-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><div class="kpi-info"><span class="kpi-value">${store.incidents.length}</span><span class="kpi-label">Field Incidents</span></div></div>
            <div class="kpi-card success"><div class="kpi-icon"><i class="fa-solid fa-user-shield"></i></div><div class="kpi-info"><span class="kpi-value">68</span><span class="kpi-label">Active Responders</span></div></div>
            <div class="kpi-card info"><div class="kpi-icon"><i class="fa-solid fa-boxes-packing"></i></div><div class="kpi-info"><span class="kpi-value">78%</span><span class="kpi-label">Supply Deployment</span></div></div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title"><i class="fa-solid fa-list-ol"></i> Live Incident Stream (Firebase Firestore Synced)</h3></div>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                  <th style="padding: 10px;">SEVERITY</th>
                  <th style="padding: 10px;">TITLE</th>
                  <th style="padding: 10px;">LOCATION</th>
                  <th style="padding: 10px;">STATUS</th>
                  <th style="padding: 10px; text-align: right;">ACTION</th>
                </tr>
              </thead>
              <tbody>
                ${store.incidents.map(inc => `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px;"><span class="badge ${inc.severity === 'critical' ? 'badge-critical' : 'badge-high'}">${inc.severity}</span></td>
                    <td style="padding: 10px;"><strong>${inc.title}</strong></td>
                    <td style="padding: 10px; color: var(--text-muted);">${inc.locationName}</td>
                    <td style="padding: 10px;">${inc.status}</td>
                    <td style="padding: 10px; text-align: right;"><button class="btn btn-secondary btn-sm btn-dispatch-inc" data-inc-id="${inc.id}">Dispatch</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderResourceView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-boxes-stacked"></i> Relief Resource Allocation</h1></div>
        <div class="view-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            ${store.resources.map(r => `
              <div class="card">
                <h3>${r.name}</h3>
                <span style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary);">${r.available} ${r.unit} available</span>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn btn-secondary btn-sm btn-quick-dispatch" data-res-id="${r.id}" style="flex:1;">Dispatch</button>
                  <button class="btn btn-secondary btn-sm btn-quick-restock" data-res-id="${r.id}">Restock</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderIncidentReportView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-triangle-exclamation"></i> Report Incident</h1></div>
        <div class="view-body">
          <div class="card" style="max-width: 650px; margin: 0 auto; padding: 24px;">
            <form id="form-incident-submit">
              <div class="form-group">
                <label class="form-label">Incident Title *</label>
                <input type="text" id="inc-title" placeholder="e.g. Flash Flood Evacuation" required />
              </div>
              <div class="form-group">
                <label class="form-label">Severity Level *</label>
                <select id="inc-severity"><option value="critical">CRITICAL</option><option value="high">HIGH</option></select>
              </div>
              <div class="form-group">
                <label class="form-label">Location Landmark *</label>
                <input type="text" id="inc-location-name" placeholder="Sector A Landmark" required />
              </div>
              <div class="form-group">
                <label class="form-label">Narrative</label>
                <textarea id="inc-description" rows="3" required></textarea>
              </div>
              <button type="submit" class="btn btn-critical btn-lg" style="width:100%; margin-top:10px;">Submit Incident (Sync to Firebase)</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderCommunicationView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-walkie-talkie"></i> Multi-Agency Communication Feed</h1></div>
        <div class="view-body" style="flex:1; display:flex; flex-direction:column;">
          <div class="chat-container">
            <div class="chat-main">
              <div class="chat-messages">
                ${store.chatMessages.map(m => `<div class="message-bubble"><div class="message-content"><strong>${m.sender}</strong> (${m.agency}): ${m.text}</div></div>`).join('')}
              </div>
              <form id="chat-form" class="chat-input-area">
                <input type="text" id="chat-text-input" placeholder="Type tactical message..." required style="flex:1;" />
                <button type="submit" class="btn btn-primary btn-sm">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderTeamTrackerView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-users-gear"></i> Squad & Volunteer Tracker</h1></div>
        <div class="view-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            ${store.teams.map(t => `<div class="card"><h3>${t.name}</h3><p>${t.agency} • ${t.currentLocation}</p></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderPriorityQueueView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-list-check"></i> Priority Task Triage Queue</h1></div>
        <div class="view-body">
          <div class="kanban-board">
            ${['unassigned', 'assigned', 'in_progress', 'resolved'].map(col => `
              <div class="kanban-column">
                <div class="column-header"><span style="text-transform:capitalize;">${col.replace('_', ' ')}</span></div>
                ${store.incidents.filter(i => i.status === col).map(inc => `
                  <div class="task-card">
                    <strong>${inc.title}</strong>
                    <button class="btn btn-secondary btn-sm btn-move-task" data-inc-id="${inc.id}" data-target="resolved" style="width:100%; margin-top:6px;">Resolve ✓</button>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderSitRepView() {
    return `
      <div class="view-container">
        <div class="view-header"><h1><i class="fa-solid fa-file-invoice-dollar"></i> Situation Report (SitRep) Generator</h1><button onclick="window.print()" class="btn btn-primary btn-sm">Print SitRep</button></div>
        <div class="view-body">
          <div class="card" style="max-width:800px; margin:0 auto; padding:32px; background:white; color:#111;">
            <h2>SITUATION REPORT (SITREP) #04</h2>
            <p>AUTHENTICATED RESPONDER: <strong>${store.currentUser ? store.currentUser.name : 'Officer'}</strong></p>
          </div>
        </div>
      </div>
    `;
  }

  // EVENT BINDINGS
  function showToast(message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) { toastContainer = document.createElement('div'); toastContainer.className = 'toast-container'; document.body.appendChild(toastContainer); }
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i><span></span>`;
    toast.querySelector('span').textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.remove(); if (!toastContainer.children.length) toastContainer.remove(); }, 4500);
  }
  function bindEvents(container) {
    function showNotification(message, type = 'success') {
      const existing = container.querySelector('.login-notification');
      if (existing) existing.remove();
      const notice = document.createElement('div');
      notice.className = 'login-notification';
      notice.textContent = message;
      notice.style.position = 'fixed';
      notice.style.bottom = '20px';
      notice.style.right = '20px';
      notice.style.zIndex = '9999';
      notice.style.padding = '12px 16px';
      notice.style.borderRadius = '10px';
      notice.style.fontSize = '0.8rem';
      notice.style.fontWeight = '700';
      notice.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
      notice.style.color = '#fff';
      notice.style.background = type === 'error' ? '#ef4444' : '#10b981';
      document.body.appendChild(notice);
      setTimeout(() => notice.remove(), 3500);
    }

    // Helper to show auth error
    function showAuthError(msg) {
      const errEl = container.querySelector('#auth-error-msg');
      if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
        setTimeout(() => { errEl.style.display = 'none'; }, 6000);
      }
    }

    // Helper to show/hide loading
    function setAuthLoading(loading) {
      const loadEl = container.querySelector('#auth-loading');
      const btnEl = container.querySelector('#btn-email-signin');
      if (loadEl) loadEl.style.display = loading ? 'block' : 'none';
      if (btnEl) btnEl.style.display = loading ? 'none' : 'block';
    }

    // Tab switching (Sign In / Create Account)
    let isRegisterMode = false;
    let generatedOtp = '';
    const tabLogin = container.querySelector('#tab-btn-login');
    const tabRegister = container.querySelector('#tab-btn-register');
    const btnSubmit = container.querySelector('#btn-email-signin');
    const phoneBtn = container.querySelector('#btn-phone-signin');
    const createAccountPanel = container.querySelector('#create-account-panel');
    const btnShowCreateAccount = container.querySelector('#btn-show-create-account');
    const btnBackToLogin = container.querySelector('#btn-back-to-login');
    const btnSubmitCreateAccount = container.querySelector('#btn-submit-create-account');
    const createAccountName = container.querySelector('#create-account-name');
    const createAccountEmail = container.querySelector('#create-account-email');
    const createAccountPassword = container.querySelector('#create-account-password');
    const phonePanel = container.querySelector('#phone-auth-panel');
    const phoneCountryCode = container.querySelector('#phone-country-code');
    const phoneNumberInput = container.querySelector('#phone-number-input');
    const otpSection = container.querySelector('#otp-section');
    const otpInput = container.querySelector('#otp-input');
    const sendOtpBtn = container.querySelector('#btn-send-otp');
    const verifyOtpBtn = container.querySelector('#btn-verify-otp');

    if (tabLogin) {
      tabLogin.onclick = () => {
        isRegisterMode = false;
        tabLogin.className = 'btn btn-primary btn-sm';
        tabRegister.className = 'btn btn-secondary btn-sm';
        tabLogin.style.flex = '1';
        tabRegister.style.flex = '1';
        if (btnSubmit) {
          btnSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
        }
      };
    }
    if (tabRegister) {
      tabRegister.onclick = () => {
        isRegisterMode = true;
        tabRegister.className = 'btn btn-primary btn-sm';
        tabLogin.className = 'btn btn-secondary btn-sm';
        tabRegister.style.flex = '1';
        tabLogin.style.flex = '1';
        if (btnSubmit) {
          btnSubmit.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
        }
      };
    }

    function getPhoneLengthLimit(countryCodeValue) {
      const limits = {
        '+1': 10, '+7': 10, '+20': 9, '+27': 9, '+30': 10, '+31': 10, '+32': 9, '+33': 9,
        '+34': 9, '+36': 9, '+39': 10, '+40': 9, '+41': 9, '+43': 10, '+44': 10, '+45': 8,
        '+46': 10, '+47': 8, '+48': 9, '+49': 11, '+51': 9, '+52': 10, '+53': 8, '+54': 10,
        '+55': 11, '+56': 9, '+57': 10, '+58': 10, '+60': 9, '+61': 9, '+62': 11, '+63': 10,
        '+64': 9, '+65': 8, '+66': 9, '+81': 10, '+82': 10, '+84': 9, '+86': 11, '+90': 10,
        '+91': 10, '+92': 10, '+93': 9, '+94': 9, '+95': 9, '+98': 10, '+211': 9, '+212': 9,
        '+213': 9, '+216': 8, '+218': 9, '+220': 7, '+221': 9, '+222': 9, '+223': 9, '+224': 9,
        '+225': 10, '+226': 8, '+227': 8, '+228': 8, '+229': 8, '+230': 8, '+231': 7, '+232': 8,
        '+233': 9, '+234': 10, '+235': 8, '+236': 8, '+237': 9, '+238': 7, '+239': 7, '+240': 9,
        '+241': 9, '+242': 9, '+243': 10, '+244': 9, '+245': 7, '+248': 7, '+249': 9, '+250': 9,
        '+251': 9, '+252': 8, '+253': 6, '+254': 9, '+255': 9, '+256': 9, '+257': 8, '+258': 9,
        '+260': 9, '+261': 9, '+262': 9, '+263': 9, '+264': 9, '+265': 9, '+266': 8, '+267': 7,
        '+268': 8, '+269': 7, '+352': 9, '+353': 9, '+354': 7, '+355': 9, '+356': 8, '+357': 8,
        '+358': 11, '+370': 8, '+371': 8, '+372': 8, '+373': 8, '+374': 8, '+375': 9, '+376': 6,
        '+377': 9, '+378': 9, '+380': 9, '+381': 9, '+382': 8, '+385': 9, '+386': 8, '+387': 8,
        '+389': 8, '+420': 9, '+421': 9, '+423': 9, '+500': 5, '+501': 7, '+502': 8, '+503': 8,
        '+504': 8, '+505': 8, '+506': 8, '+507': 8, '+508': 6, '+509': 8, '+590': 9, '+591': 8,
        '+592': 7, '+593': 9, '+594': 9, '+595': 9, '+596': 9, '+597': 7, '+598': 8, '+599': 8,
        '+670': 7, '+672': 5, '+673': 7, '+674': 7, '+675': 8, '+676': 5, '+677': 5, '+678': 5,
        '+679': 7, '+680': 7, '+681': 6, '+682': 5, '+683': 4, '+685': 7, '+687': 6, '+688': 5,
        '+689': 6, '+690': 5, '+691': 7, '+692': 7, '+850': 10, '+852': 8, '+853': 8, '+855': 9,
        '+856': 9, '+880': 10, '+886': 9, '+960': 7, '+961': 8, '+962': 9, '+963': 9, '+964': 10,
        '+965': 8, '+966': 9, '+967': 9, '+968': 8, '+971': 9, '+972': 9, '+973': 8, '+974': 8,
        '+975': 8, '+976': 8, '+977': 10, '+992': 9, '+993': 8, '+994': 9, '+995': 9, '+996': 9,
        '+998': 9
      };
      return limits[countryCodeValue] || 15;
    }

    function enforcePhoneValidation() {
      if (!phoneNumberInput || !phoneCountryCode) return true;
      const maxDigits = getPhoneLengthLimit(phoneCountryCode.value);
      const sanitized = phoneNumberInput.value.replace(/\D/g, '').slice(0, maxDigits);
      if (phoneNumberInput.value !== sanitized) {
        phoneNumberInput.value = sanitized;
        showNotification(`Invalid number. Maximum ${maxDigits} digits allowed for ${phoneCountryCode.value}.`, 'error');
        return false;
      }
      phoneNumberInput.maxLength = maxDigits;
      return true;
    }

    if (phoneCountryCode && phoneNumberInput) {
      phoneCountryCode.addEventListener('change', () => {
        phoneNumberInput.maxLength = getPhoneLengthLimit(phoneCountryCode.value);
        phoneNumberInput.value = phoneNumberInput.value.replace(/\D/g, '').slice(0, phoneNumberInput.maxLength);
      });
      phoneNumberInput.addEventListener('input', () => {
        enforcePhoneValidation();
      });
    }

    function showCreateAccountPanel(show) {
      if (createAccountPanel) {
        createAccountPanel.style.display = show ? 'block' : 'none';
      }
      if (show) {
        if (phonePanel) phonePanel.style.display = 'none';
        if (otpSection) otpSection.style.display = 'none';
        if (verifyOtpBtn) verifyOtpBtn.style.display = 'none';
        if (otpInput) otpInput.value = '';
      }
    }

    if (btnShowCreateAccount) {
      btnShowCreateAccount.onclick = () => showCreateAccountPanel(true);
    }

    if (btnBackToLogin) {
      btnBackToLogin.onclick = () => showCreateAccountPanel(false);
    }

    if (btnSubmitCreateAccount) {
      btnSubmitCreateAccount.onclick = () => {
        const name = createAccountName?.value.trim();
        const email = createAccountEmail?.value.trim();
        const password = createAccountPassword?.value.trim();

        if (!name || !email || !password) {
          showNotification('Please complete your name, email, and password.', 'error');
          return;
        }

        store.setCurrentUser({
          id: `usr-create-${Date.now()}`,
          name,
          role: 'admin',
          agency: 'New User Registration',
          badgeId: 'NEW-USER',
          avatar: name.slice(0, 2).toUpperCase(),
          authMethod: 'create-account',
          email,
          phone: null
        });

        showNotification(`Account created for ${email}. Welcome aboard!`, 'success');
        store.setCurrentView('overview');
      };
    }

    if (phoneBtn && phonePanel) {
      phoneBtn.onclick = () => {
        const isVisible = phonePanel.style.display === 'block';
        phonePanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
          if (otpSection) otpSection.style.display = 'none';
          if (verifyOtpBtn) verifyOtpBtn.style.display = 'none';
          if (otpInput) otpInput.value = '';
        }
      };
    }

    if (sendOtpBtn && phoneNumberInput && phoneCountryCode && otpSection && verifyOtpBtn && otpInput) {
      sendOtpBtn.onclick = () => {
        const value = phoneNumberInput.value.trim();
        if (!value) {
          phoneNumberInput.focus();
          showNotification('Please enter a mobile number first.', 'error');
          return;
        }

        if (!enforcePhoneValidation()) {
          phoneNumberInput.focus();
          return;
        }

        const maxDigits = getPhoneLengthLimit(phoneCountryCode.value);
        if (value.replace(/\D/g, '').length > maxDigits) {
          showNotification(`Invalid number. Maximum ${maxDigits} digits allowed for ${phoneCountryCode.value}.`, 'error');
          phoneNumberInput.focus();
          return;
        }

        generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        otpSection.style.display = 'block';
        verifyOtpBtn.style.display = 'inline-flex';
        sendOtpBtn.textContent = 'Resend OTP';
        otpInput.value = '';
        otpInput.setAttribute('placeholder', `OTP sent to ${phoneCountryCode.value} ${value}`);
        showNotification(`OTP sent to ${phoneCountryCode.value} ${value}. Demo code: ${generatedOtp}`, 'success');
      };
    }

    if (verifyOtpBtn && phoneNumberInput && phoneCountryCode && otpInput) {
      verifyOtpBtn.onclick = () => {
        const otpCode = otpInput.value.trim();
        if (!otpCode) {
          otpInput.focus();
          showNotification('Please enter the OTP.', 'error');
          return;
        }

        if (otpCode !== generatedOtp) {
          showNotification('Invalid OTP. Please use the generated code.', 'error');
          return;
        }

        const agency = container.querySelector('#auth-agency')?.value || 'FEMA Regional Command';
        const phoneValue = `${phoneCountryCode.value} ${phoneNumberInput.value.trim()}`;
        store.setCurrentUser({
          id: `usr-phone-${Date.now()}`,
          name: `Officer ${phoneValue}`,
          agency: agency,
          role: 'responder',
          badgeId: 'OTP-USER',
          avatar: 'PH',
          authMethod: 'phone',
          phone: phoneValue,
          email: null
        });
        showNotification(`Signed in successfully with phone number ${phoneValue}.`, 'success');
        store.setCurrentView('overview');
      };
    }

    // Google Sign-In
    const googleBtn = container.querySelector('#btn-google-signin');
    if (googleBtn) {
      googleBtn.onclick = async () => {
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting to Google...';
        const result = await store.signInWithGoogle();
        if (!result.success) {
          showAuthError(result.error);
          googleBtn.disabled = false;
          googleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Continue with Google';
        }
      };
    }

    // Apple Sign-In
    const appleBtn = container.querySelector('#btn-apple-signin');
    if (appleBtn) {
      appleBtn.onclick = async () => {
        appleBtn.disabled = true;
        appleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting to Apple...';
        const result = await store.signInWithApple();
        if (!result.success) {
          showAuthError(result.error);
          appleBtn.disabled = false;
          appleBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> Continue with Apple';
        }
      };
    }

    // Email/Password Auth Form
    const authForm = container.querySelector('#auth-sign-in-form');
    if (authForm) {
      authForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = container.querySelector('#auth-email').value.trim();
        const password = container.querySelector('#auth-password').value;
        const agency = container.querySelector('#auth-agency').value;

        if (!email || !password) {
          showAuthError('Please enter both email and password.');
          return;
        }

        setAuthLoading(true);

        // Try Firebase auth first
        if (store.firebaseAuth) {
          let result;
          if (isRegisterMode) {
            result = await store.registerWithEmail(email, password);
          } else {
            result = await store.signInWithEmail(email, password);
          }

          if (result.success) {
            if (store.currentUser) {
              store.currentUser.agency = agency;
              store.saveState();
            }
            showNotification(`Signed in successfully with ${email}.`, 'success');
            return;
          } else {
            showAuthError(result.error);
            setAuthLoading(false);
            return;
          }
        }

        // Fallback: Demo sign-in if Firebase not configured
        store.setCurrentUser({
          id: `usr-${Date.now()}`,
          email: email,
          name: email.split('@')[0].toUpperCase(),
          agency: agency,
          role: 'coordinator',
          avatar: email.slice(0, 2).toUpperCase(),
          authProvider: 'demo'
        });
        showNotification(`Signed in successfully with ${email}.`, 'success');
        store.setCurrentView('overview');
      };
    }

    // Firebase Config Save Form
    const fbConfigForm = container.querySelector('#form-firebase-config');
    if (fbConfigForm) {
      fbConfigForm.onsubmit = (e) => {
        e.preventDefault();
        const newConfig = {
          apiKey: container.querySelector('#fb-api-key').value.trim(),
          authDomain: container.querySelector('#fb-auth-domain').value.trim(),
          projectId: container.querySelector('#fb-project-id').value.trim(),
          storageBucket: container.querySelector('#fb-storage-bucket').value.trim(),
          messagingSenderId: container.querySelector('#fb-messaging-sender-id').value.trim(),
          appId: container.querySelector('#fb-app-id').value.trim()
        };

        if (!newConfig.apiKey || !newConfig.projectId) {
          alert('API Key and Project ID are required!');
          return;
        }

        store.updateFirebaseConfig(newConfig);
        const msg = container.querySelector('#firebase-save-msg');
        if (msg) {
          msg.style.display = 'block';
          setTimeout(() => { msg.style.display = 'none'; }, 5000);
        }
      };
    }

    // Demo Sign In
    container.querySelectorAll('.demo-sign-in-btn').forEach(btn => {
      btn.onclick = (e) => {
        const uId = e.currentTarget.getAttribute('data-user-id');
        const found = agencyUsers.find(u => u.id === uId);
        if (found) {
          store.setCurrentUser(found);
          store.setCurrentView('overview');
        }
      };
    });

    // Role switcher
    container.querySelectorAll('.role-btn').forEach(btn => {
      btn.onclick = (e) => {
        const uId = e.currentTarget.getAttribute('data-user-id');
        const found = agencyUsers.find(u => u.id === uId);
        if (found) store.setCurrentUser(found);
      };
    });

    // Sign Out button
    const signOutBtn = container.querySelector('#btn-sign-out');
    if (signOutBtn) signOutBtn.onclick = () => store.signOut();

    const contrastBtn = container.querySelector('#btn-toggle-contrast');
    if (contrastBtn) contrastBtn.onclick = () => store.toggleHighContrast();

    const syncBtn = container.querySelector('#btn-sync-status');
    const themeBtn = container.querySelector('#btn-toggle-theme');
    if (themeBtn) themeBtn.onclick = () => { store.toggleTheme(); showToast(`Appearance switched to ${store.theme === 'light' ? 'Light' : 'Dark'} mode.`); };

    if (syncBtn) syncBtn.onclick = () => store.toggleNetworkStatus();

    container.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.onclick = (e) => store.setCurrentView(e.currentTarget.getAttribute('data-view'));
    });

    const fab = container.querySelector('#fab-sos-button');
    if (fab) fab.onclick = () => store.setCurrentView('report');

    const btnQuickReport = container.querySelector('#btn-quick-report');
    if (btnQuickReport) btnQuickReport.onclick = () => store.setCurrentView('report');

    const btnQuickSitrep = container.querySelector('#btn-quick-sitrep');
    if (btnQuickSitrep) btnQuickSitrep.onclick = () => store.setCurrentView('sitrep');

    container.querySelectorAll('.btn-dispatch-inc').forEach(btn => {
      btn.onclick = (e) => store.updateIncidentStatus(e.currentTarget.getAttribute('data-inc-id'), 'in_progress', 'Squad Alpha (SAR)');
    });

    container.querySelectorAll('.btn-quick-dispatch').forEach(btn => {
      btn.onclick = (e) => store.deployResource(e.currentTarget.getAttribute('data-res-id'), 10);
    });

    container.querySelectorAll('.btn-quick-restock').forEach(btn => {
      btn.onclick = (e) => store.restockResource(e.currentTarget.getAttribute('data-res-id'), 50);
    });

    const incForm = container.querySelector('#form-incident-submit');
    if (incForm) {
      incForm.onsubmit = (e) => {
        e.preventDefault();
        store.addIncident({
          title: container.querySelector('#inc-title').value,
          severity: container.querySelector('#inc-severity').value,
          category: 'medical',
          locationName: container.querySelector('#inc-location-name').value,
          casualties: 0,
          lat: 25.7617,
          lng: -80.1918,
          description: container.querySelector('#inc-description').value
        });
        alert('Incident submitted & synced to Firebase!');
        store.setCurrentView('overview');
      };
    }

    const chatForm = container.querySelector('#chat-form');
    if (chatForm) {
      chatForm.onsubmit = (e) => {
        e.preventDefault();
        const input = container.querySelector('#chat-text-input');
        if (input.value.trim()) {
          store.sendChatMessage('global', input.value.trim());
          input.value = '';
        }
      };
    }

    container.querySelectorAll('.btn-move-task').forEach(btn => {
      btn.onclick = (e) => store.updateIncidentStatus(e.currentTarget.getAttribute('data-inc-id'), e.currentTarget.getAttribute('data-target'));
    });

    // MAP INITIALIZATION (LIVE WORLD DISASTERS)
    if (store.currentView === 'map') {
      setTimeout(() => {
        const mapEl = container.querySelector('#disaster-map-element');
        if (mapEl && window.L) {
          if (activeMapInstance) activeMapInstance.remove();
          const map = window.L.map('disaster-map-element', {
            zoomControl: false,
            minZoom: 1.5,
            maxZoom: 15,
            zoomSnap: 0.25,
            zoomDelta: 0.25,
            wheelPxPerZoomLevel: 110,
            inertia: true,
            inertiaDeceleration: 2800,
            worldCopyJump: true,
            preferCanvas: true,
            fadeAnimation: true,
            markerZoomAnimation: true,
            zoomAnimation: true
          }).setView([18, 0], 2.1);
          activeMapInstance = map;
          window.L.control.zoom({ position: 'topleft', zoomInTitle: 'Zoom in smoothly', zoomOutTitle: 'Zoom out smoothly' }).addTo(map);

          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

          // High-resolution global imagery and place labels, presented as a
          // Google-Earth-style hybrid view without copying Google's tiles.
          const satelliteLayer = window.L.layerGroup([
            window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              maxNativeZoom: 19,
              attribution: 'Tiles &copy; Esri'
            }),
            window.L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
              maxNativeZoom: 19,
              opacity: 0.9,
              attribution: 'Labels &copy; Esri'
            })
          ]);
          const weatherAlertsLayer = window.L.featureGroup();
          const wildfiresLayer = window.L.featureGroup();
          const liveStatus = container.querySelector('#live-data-status');
          const weatherCount = container.querySelector('#weather-alert-count');
          const wildfireCount = container.querySelector('#wildfire-count');
          const escapeHTML = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
          }[character]));
          const updateLiveStatus = () => {
            if (!liveStatus) return;
            const weatherText = weatherCount ? weatherCount.textContent : 'Unavailable';
            const fireText = wildfireCount ? wildfireCount.textContent : 'Unavailable';
            liveStatus.textContent = `Live feeds • Alerts: ${weatherText} • Wildfires: ${fireText}`;
          };
          const toggleLayer = (selector, layer) => {
            const input = container.querySelector(selector);
            if (!input) return;
            input.onchange = () => {
              if (input.checked) layer.addTo(map);
              else map.removeLayer(layer);
            };
          };
          toggleLayer('#layer-satellite', satelliteLayer);
          toggleLayer('#layer-weather-alerts', weatherAlertsLayer);
          toggleLayer('#layer-wildfires', wildfiresLayer);
          if (container.querySelector('#layer-satellite')?.checked) satelliteLayer.addTo(map);

          // NOAA National Weather Service: current U.S. public weather alerts.
          fetch('https://api.weather.gov/alerts/active?status=actual&message_type=alert')
            .then((response) => {
              if (!response.ok) throw new Error(`NOAA response ${response.status}`);
              return response.json();
            })
            .then((data) => {
              // Use lightweight alert beacons instead of large geometry outlines.
              // This keeps panning and fractional zoom smooth at a global scale.
              const alerts = (data.features || []).slice(0, 75);
              alerts.forEach((alert) => {
                const properties = alert.properties || {};
                const label = escapeHTML(properties.event || 'Weather alert');
                const area = escapeHTML(properties.areaDesc || 'Affected area');
                const severity = escapeHTML(properties.severity || 'Unknown');
                const popup = `<div style="color:#111; font-family:sans-serif; max-width:240px;"><h4 style="margin:0 0 4px;color:#0369A1;">${label}</h4><p style="margin:0 0 4px;font-size:.8rem;"><strong>Severity:</strong> ${severity}</p><p style="margin:0;font-size:.78rem;"><strong>Area:</strong> ${area}</p><p style="margin:6px 0 0;font-size:.72rem;">Source: NOAA National Weather Service</p></div>`;
                if (!alert.geometry) return;
                const alertShape = window.L.geoJSON(alert.geometry);
                const bounds = alertShape.getBounds();
                if (!bounds.isValid()) return;
                window.L.circleMarker(bounds.getCenter(), {
                  radius: 6,
                  color: '#7DD3FC',
                  weight: 2,
                  fillColor: '#0EA5E9',
                  fillOpacity: 0.75,
                  className: 'live-alert-beacon'
                }).bindPopup(popup).addTo(weatherAlertsLayer);
              });
              if (weatherCount) weatherCount.textContent = `${alerts.length} active`;
              if (container.querySelector('#layer-weather-alerts')?.checked) weatherAlertsLayer.addTo(map);
              updateLiveStatus();
            })
            .catch(() => {
              if (weatherCount) weatherCount.textContent = 'Unavailable';
              updateLiveStatus();
            });

          // NASA EONET: open natural-event records, filtered to active wildfires.
          fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires&limit=100')
            .then((response) => {
              if (!response.ok) throw new Error(`NASA response ${response.status}`);
              return response.json();
            })
            .then((data) => {
              const events = data.events || [];
              events.slice(0, 75).forEach((event) => {
                const geometry = event.geometry && event.geometry[0];
                if (!geometry || !Array.isArray(geometry.coordinates)) return;
                const [longitude, latitude] = geometry.coordinates;
                if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return;
                const marker = window.L.circleMarker([latitude, longitude], {
                  radius: 7, color: '#FDE047', fillColor: '#F97316', fillOpacity: 0.86, weight: 2, className: 'live-fire-beacon'
                }).bindPopup(`<div style="color:#111; font-family:sans-serif; max-width:220px;"><h4 style="margin:0 0 4px;color:#15803D;">${escapeHTML(event.title)}</h4><p style="margin:0;font-size:.78rem;">Active wildfire event</p><p style="margin:6px 0 0;font-size:.72rem;">Source: NASA EONET</p></div>`);
                marker.addTo(wildfiresLayer);
              });
              if (wildfireCount) wildfireCount.textContent = `${wildfiresLayer.getLayers().length} active`;
              if (container.querySelector('#layer-wildfires')?.checked) wildfiresLayer.addTo(map);
              updateLiveStatus();
            })
            .catch(() => {
              if (wildfireCount) wildfireCount.textContent = 'Unavailable';
              updateLiveStatus();
            });

          globalDisastersList.forEach(dis => {
            const iconClass = dis.type === 'cyclone' ? 'storm' :
              dis.type === 'earthquake' ? 'quake' :
              dis.type === 'flood' ? 'flood' :
              dis.type === 'wildfire' ? 'fire' :
              dis.type === 'volcano' ? 'volcano' : 'hazard';
            const marker = window.L.marker(dis.coordinates, {
              icon: window.L.divIcon({
                className: 'disaster-3d-icon',
                iconSize: [58, 70],
                iconAnchor: [29, 56],
                popupAnchor: [0, -52],
                html: `<div class="disaster-3d-marker ${iconClass}" style="--disaster-color:${dis.color};"><div class="disaster-3d-glow"></div><div class="disaster-3d-core"><i class="fa-solid ${dis.icon}"></i></div><div class="disaster-3d-shadow"></div><span>${dis.severity}</span></div>`
              })
            }).addTo(map);

            marker.bindPopup(`
              <div style="color:#111; font-family:sans-serif; max-width:200px;">
                <h4 style="margin:0 0 4px 0; color:${dis.color};">${dis.name}</h4>
                <p style="margin:0; font-size:0.8rem;"><strong>Region:</strong> ${dis.region}</p>
                <p style="margin:0; font-size:0.8rem;"><strong>Impact:</strong> ${dis.affectedCount}</p>
                <p style="margin:0 0 6px 0; font-size:0.8rem;"><strong>Status:</strong> ${dis.status}</p>
              </div>
            `);
          });

          const wholeWorldButton = container.querySelector('#btn-global-map');
          if (wholeWorldButton) {
            wholeWorldButton.onclick = () => map.flyTo([18, 0], 2.1, { duration: 1.15, easeLinearity: 0.25 });
          }

          const mapReportButton = container.querySelector('#btn-map-report');
          if (mapReportButton) mapReportButton.onclick = () => store.setCurrentView('report');

          container.querySelectorAll('.btn-fly-world-disaster').forEach(b => {
            b.onclick = (e) => {
              const lat = parseFloat(e.currentTarget.getAttribute('data-lat'));
              const lng = parseFloat(e.currentTarget.getAttribute('data-lng'));
              map.flyTo([lat, lng], 10);
            };
          });
        }
      }, 100);
    }
  }

  function renderApp() {
    const app = document.getElementById('app');
    if (!app) return;

    if (store.isHighContrast) document.body.classList.add('theme-high-contrast');
    else document.body.classList.remove('theme-high-contrast');
    document.body.classList.toggle('theme-light', store.theme === 'light');
    document.body.classList.toggle('theme-dark', store.theme !== 'light');

    if (store.currentView === 'login' || !store.currentUser) {
      app.innerHTML = renderLoginView();
      bindEvents(app);
      return;
    }

    app.innerHTML = `
      ${renderNavbar()}
      ${renderTicker()}
      <div class="app-main-layout">
        ${renderSidebar()}
        <main id="view-mount-point" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
          ${
            store.currentView === 'overview' ? renderOverviewView() :
            store.currentView === 'map' ? renderMapView() :
            store.currentView === 'resources' ? renderResourceView() :
            store.currentView === 'report' ? renderIncidentReportView() :
            store.currentView === 'comms' ? renderCommunicationView() :
            store.currentView === 'teams' ? renderTeamTrackerView() :
            store.currentView === 'queue' ? renderPriorityQueueView() :
            store.currentView === 'sitrep' ? renderSitRepView() :
            renderOverviewView()
          }
        </main>
      </div>
      ${renderFAB()}
    `;

    bindEvents(app);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderApp();
      store.subscribe(() => renderApp());
    });
  } else {
    renderApp();
    store.subscribe(() => renderApp());
  }

})();

