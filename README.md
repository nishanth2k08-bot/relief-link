# ReliefLink — Real-Time Disaster Coordination Platform

> Emergency Response & Coordination System for Responders, NGOs & Government Agencies

## 🌐 Live Demo
[View on Netlify →](https://your-site.netlify.app)

## Features
- 🗺️ Live World Disaster Map (Leaflet.js)
- 📊 Incident Command Dashboard
- 🔥 Priority Queue & Triage System
- 💬 Multi-Agency Communication Feed
- 👥 Team Tracker & GPS Positioning
- 📝 Situation Report Generator
- 🔐 Firebase Authentication
- 🌍 Multi-language Support (EN/ES/FR/AR/HI)
- ♿ WCAG 2.1 AA High Contrast Mode
- 📶 Offline Queue with Auto-Sync

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript (ES6)
- **Maps**: Leaflet.js + OpenStreetMap
- **Charts**: Chart.js
- **Auth/Database**: Firebase (Auth + Firestore)
- **Hosting**: Netlify

## Setup

### 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Copy your Firebase config keys
6. In the Settings page of the app, paste your Firebase config

### 2. Local Development
Simply open `index.html` in a browser — no build step required!

### 3. Deploy to Netlify
See the deployment guide below.

## File Structure
```
relief-link/
├── index.html          # Main entry point
├── css/
│   └── styles.css      # Full design system
├── js/
│   └── bundle.js       # Complete app bundle
├── netlify.toml        # Netlify deployment config
├── _redirects          # SPA routing rules
└── .gitignore
```
