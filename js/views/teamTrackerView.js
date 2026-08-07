// Screen 7: Volunteer & Team Deployment Tracker

import { store } from '../state.js';

export function renderTeamTrackerView() {
  const teams = store.teams;

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-users-gear" style="color: var(--color-primary);"></i>
            Volunteer & Squad Deployment Tracker
          </h1>
          <p class="view-subtitle">Real-time squad positioning, fatigue shift tracking & skill matrix matching</p>
        </div>
        <div class="view-actions">
          <button id="btn-deploy-new-squad" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-user-plus"></i>
            <span>Register Field Squad</span>
          </button>
        </div>
      </div>

      <div class="view-body">
        <!-- Team Matrix Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          ${teams.map(team => {
            const isDeployed = team.status === 'deployed';
            const statusBadgeClass = isDeployed ? 'badge-critical' : team.status === 'standby' ? 'badge-high' : 'badge-low';

            return `
              <div class="card" style="border-top: 4px solid ${isDeployed ? 'var(--color-critical)' : 'var(--color-low)'};">
                <div class="card-header" style="margin-bottom: 12px;">
                  <div>
                    <h3 class="card-title">${team.name}</h3>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${team.agency} • Lead: ${team.lead}</span>
                  </div>
                  <span class="badge ${statusBadgeClass}">${team.status}</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Personnel Count:</span>
                    <strong>${team.membersCount} Responders</strong>
                  </div>

                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Specialty Skill:</span>
                    <span class="badge badge-medium">${team.specialty}</span>
                  </div>

                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Current Field Position:</span>
                    <strong style="color: var(--color-primary);">${team.currentLocation}</strong>
                  </div>

                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);">Radio Frequency:</span>
                    <span style="font-family: var(--font-mono); font-size: 0.8rem;">${team.contactRadio}</span>
                  </div>

                  <!-- Fatigue Hours Progress -->
                  <div style="margin-top: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
                      <span>Shift Fatigue Timer:</span>
                      <strong style="${team.fatigueHours >= 8 ? 'color: var(--color-critical);' : ''}">${team.fatigueHours} hrs / 12 hrs</strong>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width: ${(team.fatigueHours / 12) * 100}%; background-color: ${team.fatigueHours >= 8 ? 'var(--color-critical)' : 'var(--color-primary)'};"></div>
                    </div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 16px;">
                  <button class="btn btn-secondary btn-sm btn-reassign-team" data-team-id="${team.id}" style="flex: 1;">
                    <i class="fa-solid fa-arrows-rotate"></i> Update Location
                  </button>
                  <button class="btn btn-primary btn-sm btn-toggle-status" data-team-id="${team.id}">
                    ${isDeployed ? 'Standby' : 'Deploy'}
                  </button>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function bindTeamTrackerViewEvents(container) {
  // Toggle Status
  container.querySelectorAll('.btn-toggle-status').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const teamId = e.currentTarget.getAttribute('data-team-id');
      const team = store.teams.find(t => t.id === teamId);
      if (team) {
        const nextStatus = team.status === 'deployed' ? 'standby' : 'deployed';
        store.updateTeamStatus(teamId, nextStatus);
      }
    });
  });

  // Reassign location
  container.querySelectorAll('.btn-reassign-team').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const teamId = e.currentTarget.getAttribute('data-team-id');
      const team = store.teams.find(t => t.id === teamId);
      if (team) {
        const newLoc = prompt(`Reassign location for ${team.name}:`, team.currentLocation);
        if (newLoc) {
          store.updateTeamStatus(teamId, team.status, newLoc);
        }
      }
    });
  });

  // Register New Squad
  const newSquadBtn = container.querySelector('#btn-deploy-new-squad');
  if (newSquadBtn) {
    newSquadBtn.addEventListener('click', () => {
      const squadName = prompt('Enter New Squad Name:', 'Volunteer Unit Epsilon');
      if (squadName) {
        store.teams.push({
          id: `team-${Date.now()}`,
          name: squadName,
          agency: store.currentUser.agency,
          lead: store.currentUser.name,
          membersCount: 10,
          specialty: 'General Relief & Logistics',
          status: 'standby',
          currentLocation: 'Sector D Staging Hub',
          fatigueHours: 0,
          contactRadio: 'CH-1 (140.00 MHz)'
        });
        store.notify();
      }
    });
  }
}
