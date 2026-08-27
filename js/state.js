// ReliefLink Centralized Event-Driven Reactive State Manager
// Supports Offline Queueing, Persistence, and Priority SLA Scoring

import {
  initialDisasterZones,
  initialIncidents,
  initialResources,
  initialTeams,
  initialChatMessages,
  agencyUsers,
  emergencyAlerts
} from './data/mockData.js';
import { translations } from './data/i18n.js';

class StateStore {
  constructor() {
    this.listeners = [];

    // Load persisted state or load initial dataset
    const savedState = localStorage.getItem('relieflink_state_v1');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        this.currentView = parsed.currentView || 'overview';
        this.currentUser = parsed.currentUser || agencyUsers[0];
        this.isOnline = parsed.isOnline !== undefined ? parsed.isOnline : true;
        this.isHighContrast = parsed.isHighContrast || false;
        this.hasThemePreference = parsed.hasThemePreference === true;
        this.theme = this.hasThemePreference && parsed.theme === 'dark' ? 'dark' : 'light';
        this.language = parsed.language || 'en';
        this.disasterZones = parsed.disasterZones || initialDisasterZones;
        this.incidents = parsed.incidents || initialIncidents;
        this.resources = parsed.resources || initialResources;
        this.teams = parsed.teams || initialTeams;
        this.chatMessages = parsed.chatMessages || initialChatMessages;
        this.alerts = parsed.alerts || emergencyAlerts;
        this.offlineQueue = parsed.offlineQueue || [];
      } catch (e) {
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    this.currentView = 'overview';
    this.currentUser = agencyUsers[0]; // Elena Vance (Coordinator)
    this.isOnline = true;
    this.isHighContrast = false;
    this.theme = 'light'; this.hasThemePreference = false;
    this.language = 'en';
    this.disasterZones = initialDisasterZones;
    this.incidents = initialIncidents;
    this.resources = initialResources;
    this.teams = initialTeams;
    this.chatMessages = initialChatMessages;
    this.alerts = emergencyAlerts;
    this.offlineQueue = [];
    this.saveState();
  }

  saveState() {
    localStorage.setItem('relieflink_state_v1', JSON.stringify({
      currentView: this.currentView,
      currentUser: this.currentUser,
      isOnline: this.isOnline,
      isHighContrast: this.isHighContrast,
      theme: this.theme,
      hasThemePreference: this.hasThemePreference,
      language: this.language,
      disasterZones: this.disasterZones,
      incidents: this.incidents,
      resources: this.resources,
      teams: this.teams,
      chatMessages: this.chatMessages,
      alerts: this.alerts,
      offlineQueue: this.offlineQueue
    }));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(listener => listener(this));
  }

  // Translation Helper
  t(key) {
    const langDict = translations[this.language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  }

  // Setters & Actions
  setCurrentView(view) {
    this.currentView = view;
    this.notify();
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.notify();
  }

  toggleNetworkStatus() {
    this.isOnline = !this.isOnline;
    if (this.isOnline && this.offlineQueue.length > 0) {
      this.syncOfflineQueue();
    } else {
      this.notify();
    }
  }

  toggleHighContrast() {
    this.isHighContrast = !this.isHighContrast;
    if (this.isHighContrast) {
      document.body.classList.add('theme-high-contrast');
    } else {
      document.body.classList.remove('theme-high-contrast');
    }
    this.notify();
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'; this.hasThemePreference = true;
    this.notify();
  }

  setLanguage(langCode) {
    if (translations[langCode]) {
      this.language = langCode;
      this.notify();
    }
  }

  // Incident Actions
  addIncident(incidentData) {
    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'unassigned',
      reportedTime: 'Just now',
      timestamp: Date.now(),
      reportedBy: `${this.currentUser.name} (${this.currentUser.agency})`,
      assignedSquad: null,
      ...incidentData
    };

    if (!this.isOnline) {
      this.offlineQueue.push({
        type: 'addIncident',
        payload: newIncident,
        timestamp: Date.now()
      });
      newIncident.isOfflineDraft = true;
    }

    this.incidents.unshift(newIncident);
    
    // Auto broadcast chat alert if critical
    if (newIncident.severity === 'critical') {
      this.chatMessages.unshift({
        id: `msg-${Date.now()}`,
        channel: 'global',
        sender: 'SYSTEM CRITICAL',
        agency: 'ReliefLink Core',
        text: `NEW CRITICAL INCIDENT REPORTED: ${newIncident.title} at ${newIncident.locationName}. Responders needed immediately.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBroadcast: true,
        isEncrypted: false
      });
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

  // Sync Offline Drafts when back online
  syncOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    const count = this.offlineQueue.length;
    this.offlineQueue.forEach(item => {
      if (item.type === 'addIncident') {
        const inc = this.incidents.find(i => i.id === item.payload.id);
        if (inc) delete inc.isOfflineDraft;
      }
    });

    this.offlineQueue = [];
    
    // Add system notification message
    this.alerts.unshift(`SYSTEM: ${count} offline pending item(s) successfully synchronized with central command.`);
    this.notify();
  }

  // Resource Management Actions
  deployResource(resourceId, amount) {
    const res = this.resources.find(r => r.id === resourceId);
    if (res && res.available >= amount) {
      res.available -= amount;
      res.deployed += amount;
      if (res.available <= res.threshold) {
        res.status = res.available === 0 ? 'critical' : 'warning';
      }
      this.notify();
    }
  }

  restockResource(resourceId, amount) {
    const res = this.resources.find(r => r.id === resourceId);
    if (res) {
      res.available += amount;
      res.total += amount;
      if (res.available > res.threshold) {
        res.status = 'normal';
      }
      this.notify();
    }
  }

  // Team Deployment Actions
  updateTeamStatus(teamId, status, location = null) {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      team.status = status;
      if (location) team.currentLocation = location;
      this.notify();
    }
  }

  // Chat Actions
  sendChatMessage(channel, text, isEncrypted = false) {
    const newMessage = {
      id: `msg-${Date.now()}`,
      channel: channel,
      sender: this.currentUser.name,
      agency: this.currentUser.agency,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBroadcast: false,
      isEncrypted: isEncrypted
    };
    this.chatMessages.push(newMessage);
    this.notify();
  }

  broadcastAlert(alertText) {
    this.alerts.unshift(alertText);
    this.chatMessages.push({
      id: `msg-${Date.now()}`,
      channel: 'global',
      sender: `ALERT BROADCAST [${this.currentUser.name}]`,
      agency: this.currentUser.agency,
      text: alertText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBroadcast: true,
      isEncrypted: true
    });
    this.notify();
  }

  // AI Priority Score Calculator
  calculatePriorityScore(incident) {
    let score = 0;
    // Severity weight
    if (incident.severity === 'critical') score += 50;
    else if (incident.severity === 'high') score += 35;
    else if (incident.severity === 'medium') score += 20;
    else score += 10;

    // Casualty weight
    score += Math.min(incident.casualties * 5, 30);

    // Elapsed time urgency SLA
    const minutesElapsed = (Date.now() - incident.timestamp) / 60000;
    if (incident.status !== 'resolved') {
      score += Math.min(Math.floor(minutesElapsed / 10) * 3, 20);
    }

    return Math.min(score, 99);
  }
}

export const store = new StateStore();

