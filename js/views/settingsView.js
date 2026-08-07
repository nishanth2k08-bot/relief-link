// Screen 10: Settings & Access Control

import { store } from '../state.js';

export function renderSettingsView() {
  const user = store.currentUser;
  const isHighContrast = store.isHighContrast;
  const pendingCount = store.offlineQueue.length;

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-gears" style="color: var(--color-primary);"></i>
            System Settings & Access Control
          </h1>
          <p class="view-subtitle">Manage operational roles, WCAG 2.1 AA field accessibility, offline caching & inter-agency permissions</p>
        </div>
      </div>

      <div class="view-body" style="max-width: 840px;">
        
        <!-- Role Permission Matrix -->
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fa-solid fa-user-shield" style="color: var(--color-primary);"></i>
              Role Access & Operational Permissions Matrix
            </h3>
          </div>
          <div style="font-size: 0.88rem; margin-bottom: 14px;">
            Current Authenticated User: <strong style="color: var(--color-primary);">${user.name}</strong> (${user.agency}) — Role: <span class="badge badge-low">${user.role.toUpperCase()}</span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                  <th style="padding: 8px;">PERMISSION ACTION</th>
                  <th style="padding: 8px;">FIELD RESPONDER</th>
                  <th style="padding: 8px;">COORDINATOR</th>
                  <th style="padding: 8px;">SYSTEM ADMIN</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 10px 8px; font-weight: 600;">Report New Field Incident</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 10px 8px; font-weight: 600;">Dispatch Responders & Resources</td>
                  <td style="padding: 10px 8px; color: var(--text-muted);">View Only</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 10px 8px; font-weight: 600;">Broadcast High-Priority Alert</td>
                  <td style="padding: 10px 8px; color: var(--text-muted);">Request Only</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Allowed</td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; font-weight: 600;">System Access & Data Reset</td>
                  <td style="padding: 10px 8px; color: var(--color-critical);">✕ Denied</td>
                  <td style="padding: 10px 8px; color: var(--color-critical);">✕ Denied</td>
                  <td style="padding: 10px 8px; color: var(--color-low);">✓ Full Control</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Field Accessibility & High Contrast -->
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fa-solid fa-circle-half-stroke" style="color: var(--color-high);"></i>
              WCAG 2.1 AA Field Accessibility Settings
            </h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>High Contrast Mode (Direct Sunlight / Blinding Conditions)</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">
                  Increases border width, enforces stark yellow/white text on pure obsidian black background for maximum legibility under stress.
                </p>
              </div>
              <button id="btn-toggle-contrast-settings" class="btn btn-secondary btn-sm">
                ${isHighContrast ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>

        <!-- Offline Storage Inspector -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fa-solid fa-database" style="color: var(--color-low);"></i>
              Offline Cache & Sync Inspector
            </h3>
          </div>
          <div style="font-size: 0.85rem;">
            <div>Pending Offline Queue Items: <strong>${pendingCount} items</strong></div>
            <div>Local Storage Engine: <strong style="color: var(--color-low);">Active (HTML5 LocalStorage / IndexedDB)</strong></div>
            
            <div style="display: flex; gap: 10px; margin-top: 14px;">
              <button id="btn-force-sync" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-rotate"></i> Force Manual Sync
              </button>
              <button id="btn-reset-data" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-trash-can"></i> Reset State to Defaults
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function bindSettingsViewEvents(container) {
  const contrastBtn = container.querySelector('#btn-toggle-contrast-settings');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => store.toggleHighContrast());
  }

  const forceSyncBtn = container.querySelector('#btn-force-sync');
  if (forceSyncBtn) {
    forceSyncBtn.addEventListener('click', () => {
      store.syncOfflineQueue();
      alert('Manual Synchronization completed.');
    });
  }

  const resetBtn = container.querySelector('#btn-reset-data');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset ReliefLink operational data to initial defaults?')) {
        store.resetToDefaults();
        alert('System state restored to defaults.');
      }
    });
  }
}
