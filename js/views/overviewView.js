// Screen 2: Incident Command Dashboard (Overview)

import { store } from '../state.js';

export function renderOverviewView() {
  const incidents = store.incidents;
  const resources = store.resources;
  const teams = store.teams;
  
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const highCount = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;
  const totalCasualties = incidents.reduce((sum, i) => sum + (i.casualties || 0), 0);
  const activeRescuers = teams.filter(t => t.status === 'deployed').reduce((sum, t) => sum + t.membersCount, 0);

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-gauge-high" style="color: var(--color-primary);"></i>
            Incident Command Overview
          </h1>
          <p class="view-subtitle">Real-time emergency operational state & multi-agency response metrics</p>
        </div>
        <div class="view-actions">
          <button id="btn-quick-report" class="btn btn-critical">
            <i class="fa-solid fa-plus"></i>
            <span>Report Incident</span>
          </button>
          <button id="btn-quick-sitrep" class="btn btn-secondary">
            <i class="fa-solid fa-file-invoice-dollar"></i>
            <span>Instant SitRep</span>
          </button>
        </div>
      </div>

      <div class="view-body">
        <!-- KPI Metrics Grid -->
        <div class="kpi-grid">
          <div class="kpi-card critical">
            <div class="kpi-icon">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">${criticalCount}</span>
              <span class="kpi-label">Critical Active Incidents</span>
            </div>
          </div>

          <div class="kpi-card warning">
            <div class="kpi-icon">
              <i class="fa-solid fa-person-circle-exclamation"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">${totalCasualties}</span>
              <span class="kpi-label">Reported Casualties</span>
            </div>
          </div>

          <div class="kpi-card success">
            <div class="kpi-icon">
              <i class="fa-solid fa-user-shield"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">${activeRescuers}</span>
              <span class="kpi-label">Deployed Field Responders</span>
            </div>
          </div>

          <div class="kpi-card info">
            <div class="kpi-icon">
              <i class="fa-solid fa-boxes-packing"></i>
            </div>
            <div class="kpi-info">
              <span class="kpi-value">78%</span>
              <span class="kpi-label">Resource Deployment Rate</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Main Grid: Active Triage Table & Disaster Zones Summary -->
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start;">
          
          <!-- Recent Incidents Triage Stream -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fa-solid fa-list-ol" style="color: var(--color-primary);"></i>
                Active Incident Triage Stream
              </h3>
              <button id="btn-view-all-queue" class="btn btn-secondary btn-sm">
                <span>View Task Queue</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.78rem;">
                    <th style="padding: 10px;">SEVERITY</th>
                    <th style="padding: 10px;">ID & TITLE</th>
                    <th style="padding: 10px;">LOCATION</th>
                    <th style="padding: 10px;">CASUALTIES</th>
                    <th style="padding: 10px;">STATUS</th>
                    <th style="padding: 10px; text-align: right;">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  ${incidents.map(inc => {
                    const badgeClass = inc.severity === 'critical' ? 'badge-critical' : inc.severity === 'high' ? 'badge-high' : inc.severity === 'medium' ? 'badge-medium' : 'badge-low';
                    const priorityScore = store.calculatePriorityScore(inc);

                    return `
                      <tr style="border-bottom: 1px solid var(--border-color); ${inc.isOfflineDraft ? 'background: rgba(245, 158, 11, 0.08);' : ''}">
                        <td style="padding: 12px 10px;">
                          <span class="badge ${badgeClass}">${inc.severity}</span>
                          <span style="font-size:0.7rem; font-weight:800; color:var(--text-muted); display:block; margin-top:2px;">AI SLA: ${priorityScore}</span>
                        </td>
                        <td style="padding: 12px 10px;">
                          <div style="font-weight: 700;">${inc.title}</div>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">${inc.id} • ${inc.reportedTime}</div>
                        </td>
                        <td style="padding: 12px 10px; color: var(--text-muted);">
                          <i class="fa-solid fa-location-dot" style="margin-right: 4px; color: var(--color-primary);"></i>
                          ${inc.locationName}
                        </td>
                        <td style="padding: 12px 10px; font-weight: 700; ${inc.casualties > 0 ? 'color: var(--color-critical);' : ''}">
                          ${inc.casualties}
                        </td>
                        <td style="padding: 12px 10px;">
                          <span style="font-size: 0.8rem; font-weight: 600; text-transform: capitalize;">
                            ${inc.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style="padding: 12px 10px; text-align: right;">
                          <button class="btn btn-secondary btn-sm btn-dispatch-inc" data-inc-id="${inc.id}">
                            <i class="fa-solid fa-truck-fast"></i>
                            <span>Dispatch</span>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Sidebar: Active Disaster Zones & Resource Alerts -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- Disaster Zones Widget -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fa-solid fa-layer-group" style="color: var(--color-high);"></i>
                  Affected Sectors
                </h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${store.disasterZones.map(zone => `
                  <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <strong style="font-size: 0.85rem;">${zone.name}</strong>
                      <span class="badge ${zone.severity === 'critical' ? 'badge-critical' : zone.severity === 'high' ? 'badge-high' : 'badge-medium'}">
                        ${zone.severity}
                      </span>
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">
                      Evacuated: <strong style="color: var(--text-main);">${zone.evacuatedPercent}%</strong> • Shelters: ${zone.sheltersActive}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Critical Stock Warnings Widget -->
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  <i class="fa-solid fa-battery-quarter" style="color: var(--color-critical);"></i>
                  Stock Warnings
                </h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${resources.filter(r => r.status !== 'normal').map(r => `
                  <div style="background: var(--color-critical-bg); border: 1px solid rgba(239,68,68,0.3); border-radius: var(--radius-md); padding: 10px 12px;">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.82rem;">
                      <span>${r.name}</span>
                      <span style="color: var(--color-critical);">${r.available} ${r.unit} left</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${(r.available / r.total) * 100}%; background-color: var(--color-critical);"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindOverviewViewEvents(container) {
  const quickReportBtn = container.querySelector('#btn-quick-report');
  if (quickReportBtn) {
    quickReportBtn.addEventListener('click', () => store.setCurrentView('report'));
  }

  const quickSitRepBtn = container.querySelector('#btn-quick-sitrep');
  if (quickSitRepBtn) {
    quickSitRepBtn.addEventListener('click', () => store.setCurrentView('sitrep'));
  }

  const queueBtn = container.querySelector('#btn-view-all-queue');
  if (queueBtn) {
    queueBtn.addEventListener('click', () => store.setCurrentView('queue'));
  }

  container.querySelectorAll('.btn-dispatch-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const incId = e.currentTarget.getAttribute('data-inc-id');
      const squadName = prompt('Enter Squad Name to Dispatch (e.g., Squad Alpha, Evac Unit 3):', 'Squad Alpha (SAR)');
      if (squadName) {
        store.updateIncidentStatus(incId, 'in_progress', squadName);
      }
    });
  });
}
