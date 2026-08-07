// Screen 5: Incident Report Submission Form (Quick Triage & Offline Drafts)

import { store } from '../state.js';

export function renderIncidentReportView() {
  const isOnline = store.isOnline;

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-triangle-exclamation" style="color: var(--color-critical);"></i>
            Rapid Incident Submission Form
          </h1>
          <p class="view-subtitle">High-speed field triage submission with automatic offline draft caching</p>
        </div>
      </div>

      <div class="view-body">
        <div class="card" style="max-width: 720px; margin: 0 auto; padding: 28px;">
          
          ${!isOnline ? `
            <div style="background: var(--color-high-bg); border: 1px solid var(--color-high); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
              <i class="fa-solid fa-wifi" style="color: var(--color-high); font-size: 1.2rem;"></i>
              <div>
                <strong style="color: var(--color-high); font-size: 0.9rem;">OFFLINE FIELD MODE ACTIVE</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                  Incident report will be stored in your offline draft queue and auto-synchronized upon network reconnection.
                </p>
              </div>
            </div>
          ` : ''}

          <form id="form-incident-submit">
            
            <div class="form-group">
              <label class="form-label">Incident Title / Brief Headline *</label>
              <input type="text" id="inc-title" placeholder="e.g. Flash Flood Evacuation Required / Power Generator Failure" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Severity Level *</label>
                <select id="inc-severity" required>
                  <option value="critical">CRITICAL — Immediate Life Threat</option>
                  <option value="high">HIGH — Urgent Medical / Infrastructure</option>
                  <option value="medium">MEDIUM — Moderate Disruption</option>
                  <option value="low">LOW — Minor Assistance Needed</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Category *</label>
                <select id="inc-category" required>
                  <option value="medical">Medical / Triage Emergency</option>
                  <option value="rescue">Search & Rescue Extraction</option>
                  <option value="water">Potable Water / Contamination</option>
                  <option value="shelter">Shelter Structural Damage</option>
                  <option value="hazmat">Hazardous Material Spill</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Location / Sector Landmark *</label>
                <input type="text" id="inc-location-name" placeholder="e.g. Sector A — Bridge Span 4" required />
              </div>

              <div class="form-group">
                <label class="form-label">Estimated Casualties / Trapped</label>
                <input type="number" id="inc-casualties" min="0" value="0" placeholder="0" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">GPS Coordinates</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="inc-gps" value="25.7617, -80.1918" readonly style="background: var(--bg-card-hover);" />
                <button type="button" id="btn-get-gps" class="btn btn-secondary btn-sm" style="white-space: nowrap;">
                  <i class="fa-solid fa-location-crosshairs"></i> Get Device GPS
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Incident Narrative</label>
              <textarea id="inc-description" rows="4" placeholder="Describe the scene, specific hazards, number of affected civilians, and required equipment..." required></textarea>
            </div>

            <!-- Photo Attachment Simulator -->
            <div class="form-group">
              <label class="form-label">Attach Scene Photograph (Optional)</label>
              <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 20px; text-align: center; background: var(--bg-app); cursor: pointer;" id="photo-drop-zone">
                <i class="fa-solid fa-camera" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 8px;"></i>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                  Click to capture photo or drop field evidence image
                </p>
                <span id="photo-status" style="font-size: 0.78rem; color: var(--color-low); font-weight: 700; margin-top: 6px; display: block;"></span>
              </div>
            </div>

            <button type="submit" class="btn btn-critical btn-lg" style="width: 100%; margin-top: 10px;">
              <i class="fa-solid fa-paper-plane"></i>
              <span>${isOnline ? 'Transmit Incident Report' : 'Save Offline Draft Queue'}</span>
            </button>

          </form>

        </div>
      </div>
    </div>
  `;
}

export function bindIncidentReportViewEvents(container) {
  let attachedPhotoUrl = null;

  // Photo Drop Zone Simulator
  const dropZone = container.querySelector('#photo-drop-zone');
  const photoStatus = container.querySelector('#photo-status');
  if (dropZone) {
    dropZone.addEventListener('click', () => {
      attachedPhotoUrl = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60';
      if (photoStatus) photoStatus.textContent = '✓ Scene Photo Attached (field_photo_09.jpg)';
    });
  }

  // Get Device GPS Simulator
  const gpsBtn = container.querySelector('#btn-get-gps');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
            container.querySelector('#inc-gps').value = coords;
          },
          () => {
            container.querySelector('#inc-gps').value = '25.7720, -80.1980';
          }
        );
      } else {
        container.querySelector('#inc-gps').value = '25.7720, -80.1980';
      }
    });
  }

  // Form Submit Handler
  const form = container.querySelector('#form-incident-submit');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = container.querySelector('#inc-title').value;
      const severity = container.querySelector('#inc-severity').value;
      const category = container.querySelector('#inc-category').value;
      const locationName = container.querySelector('#inc-location-name').value;
      const casualties = parseInt(container.querySelector('#inc-casualties').value, 10) || 0;
      const gpsRaw = container.querySelector('#inc-gps').value.split(',');
      const lat = parseFloat(gpsRaw[0]) || 25.7617;
      const lng = parseFloat(gpsRaw[1]) || -80.1918;
      const description = container.querySelector('#inc-description').value;

      store.addIncident({
        title,
        severity,
        category,
        locationName,
        casualties,
        lat,
        lng,
        description,
        photoUrl: attachedPhotoUrl
      });

      alert(store.isOnline ? 'Incident report transmitted to Command Center!' : 'Incident saved to Offline Queue! Will auto-sync when connected.');
      store.setCurrentView('overview');
    });
  }
}
