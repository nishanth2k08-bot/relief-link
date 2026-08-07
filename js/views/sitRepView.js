// Screen 9: Situation Report (SitRep) Generator for Government Authorities

import { store } from '../state.js';

export function renderSitRepView() {
  const incidents = store.incidents;
  const resources = store.resources;
  const teams = store.teams;
  const user = store.currentUser;
  
  const nowStr = new Date().toLocaleString();
  const criticalCount = incidents.filter(i => i.severity === 'critical').length;
  const totalCasualties = incidents.reduce((sum, i) => sum + (i.casualties || 0), 0);
  const totalRescuers = teams.reduce((sum, t) => sum + t.membersCount, 0);

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-file-invoice-dollar" style="color: var(--color-primary);"></i>
            Automated Situation Report (SitRep) Generator
          </h1>
          <p class="view-subtitle">Official emergency report compiled from real-time operational data for government authorities</p>
        </div>
        <div class="view-actions">
          <button id="btn-print-sitrep" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-print"></i>
            <span>Print / Export PDF</span>
          </button>
          <button id="btn-email-sitrep" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Transmit to GEOC</span>
          </button>
        </div>
      </div>

      <div class="view-body">
        <!-- Document Container -->
        <div class="card" id="printable-sitrep-document" style="max-width: 840px; margin: 0 auto; padding: 40px; background: #FFFFFF; color: #111111; border-radius: 8px;">
          
          <!-- Report Document Header -->
          <div style="border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #111827; margin: 0;">SITUATION REPORT (SITREP) #04</h2>
              <p style="font-size: 0.9rem; color: #4B5563; margin-top: 4px;">
                DISASTER COMMAND OPERATIONS CENTER • RELIEFLINK PLATFORM
              </p>
            </div>
            <div style="text-align: right; font-size: 0.8rem; color: #4B5563;">
              <div><strong>DATE/TIME:</strong> ${nowStr}</div>
              <div><strong>PREPARED BY:</strong> ${user.name} (${user.agency})</div>
              <div><strong>SECURITY CLASS:</strong> OFFICIAL USE ONLY</div>
            </div>
          </div>

          <!-- Section 1: Executive Summary -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; color: #1F2937; margin-bottom: 10px;">
              1. EXECUTIVE OPERATIONAL SUMMARY
            </h3>
            <p style="font-size: 0.9rem; line-height: 1.6; color: #374151;">
              Disaster response operations remain active across 4 designated sectors. Heavy flooding and seismic activity have impacted an estimated 85,500 residents. Response agencies are prioritizing medical triage at St. Jude Hospital, structural extraction on Causeway Bridge, and potable water distribution in Sector C.
            </p>
          </div>

          <!-- Section 2: Key Operational Metrics -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; color: #1F2937; margin-bottom: 10px;">
              2. CRITICAL FIELD METRICS
            </h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
              <div style="border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px; background: #F9FAFB;">
                <div style="font-size: 1.5rem; font-weight: 800; color: #DC2626;">${criticalCount}</div>
                <div style="font-size: 0.75rem; color: #6B7280;">Critical Incidents</div>
              </div>
              <div style="border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px; background: #F9FAFB;">
                <div style="font-size: 1.5rem; font-weight: 800; color: #D97706;">${totalCasualties}</div>
                <div style="font-size: 0.75rem; color: #6B7280;">Reported Casualties</div>
              </div>
              <div style="border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px; background: #F9FAFB;">
                <div style="font-size: 1.5rem; font-weight: 800; color: #2563EB;">${totalRescuers}</div>
                <div style="font-size: 0.75rem; color: #6B7280;">Deployed Responders</div>
              </div>
              <div style="border: 1px solid #D1D5DB; border-radius: 6px; padding: 12px; background: #F9FAFB;">
                <div style="font-size: 1.5rem; font-weight: 800; color: #059669;">15,500</div>
                <div style="font-size: 0.75rem; color: #6B7280;">Sheltered Civilians</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Active Incidents Breakdown -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; color: #1F2937; margin-bottom: 10px;">
              3. INCIDENT STATUS LOG
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: #F3F4F6; text-align: left;">
                  <th style="padding: 8px; border: 1px solid #E5E7EB;">ID</th>
                  <th style="padding: 8px; border: 1px solid #E5E7EB;">Title & Location</th>
                  <th style="padding: 8px; border: 1px solid #E5E7EB;">Severity</th>
                  <th style="padding: 8px; border: 1px solid #E5E7EB;">Status</th>
                  <th style="padding: 8px; border: 1px solid #E5E7EB;">Assigned Unit</th>
                </tr>
              </thead>
              <tbody>
                ${incidents.map(inc => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #E5E7EB; font-weight: 700;">${inc.id}</td>
                    <td style="padding: 8px; border: 1px solid #E5E7EB;">${inc.title} (${inc.locationName})</td>
                    <td style="padding: 8px; border: 1px solid #E5E7EB; text-transform: uppercase; font-weight: 700; color: ${inc.severity === 'critical' ? '#DC2626' : '#D97706'};">${inc.severity}</td>
                    <td style="padding: 8px; border: 1px solid #E5E7EB;">${inc.status}</td>
                    <td style="padding: 8px; border: 1px solid #E5E7EB;">${inc.assignedSquad || 'Unassigned'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Section 4: Resource Supply Deficit -->
          <div>
            <h3 style="font-size: 1.1rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; color: #1F2937; margin-bottom: 10px;">
              4. RESOURCE INVENTORY DEFICIT REPORT
            </h3>
            <ul style="font-size: 0.85rem; line-height: 1.6; color: #374151; padding-left: 20px;">
              ${resources.map(r => `
                <li><strong>${r.name}:</strong> ${r.available} ${r.unit} available in reserve (${r.deployed} deployed to field). ${r.available <= r.threshold ? '<span style="color: #DC2626; font-weight: 700;">[CRITICAL STOCK WARNING]</span>' : ''}</li>
              `).join('')}
            </ul>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function bindSitRepViewEvents(container) {
  const printBtn = container.querySelector('#btn-print-sitrep');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const emailBtn = container.querySelector('#btn-email-sitrep');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      alert('Situation Report SitRep #04 transmitted to Government Emergency Operations Center (GEOC).');
    });
  }
}
