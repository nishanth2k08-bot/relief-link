// ReliefLink Header Navigation Bar Component

import { store } from '../state.js';
import { agencyUsers } from '../data/mockData.js';

export function renderNavbar() {
  const user = store.currentUser;
  const isOnline = store.isOnline;
  const pendingCount = store.offlineQueue.length;
  const isHighContrast = store.isHighContrast;
  const isLightTheme = store.theme === 'light';

  return `
    <header class="app-header">
      <div class="brand-section">
        <div class="brand-logo">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="brand-title">
          ReliefLink
          <span class="brand-tag">OPS 2.4</span>
        </div>
      </div>

      <div class="header-center">
        <!-- Role Selector -->
        <div class="role-badge-selector" title="Switch active operational role">
          ${agencyUsers.map(usr => `
            <button class="role-btn ${user.id === usr.id ? 'active' : ''}" data-user-id="${usr.id}">
              <i class="fa-solid ${usr.role === 'coordinator' ? 'fa-user-gear' : usr.role === 'responder' ? 'fa-person-walking-luggage' : 'fa-user-shield'}"></i>
              ${usr.role.charAt(0).toUpperCase() + usr.role.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="header-actions">
        <button id="btn-toggle-theme" class="btn btn-secondary btn-sm" title="Switch between light and dark appearance" aria-label="${isLightTheme ? 'Light' : 'Dark'} mode enabled" aria-pressed="${isLightTheme}">
          <i class="fa-solid ${isLightTheme ? 'fa-sun' : 'fa-moon'}"></i>
          <span>${isLightTheme ? 'Light' : 'Dark'}</span>
        </button>

        <!-- High Contrast Mode Toggle -->
        <button id="btn-toggle-contrast" class="btn btn-secondary btn-sm" title="Toggle WCAG 2.1 AA High Contrast Mode for sunlight visibility">
          <i class="fa-solid ${isHighContrast ? 'fa-eye' : 'fa-circle-half-stroke'}"></i>
          <span>${isHighContrast ? 'Standard Mode' : 'High Contrast'}</span>
        </button>

        <!-- Multi-Language Selector -->
        <select id="select-language" class="btn btn-secondary btn-sm" style="width: auto; padding: 4px 8px;">
          <option value="en" ${store.language === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
          <option value="es" ${store.language === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
          <option value="fr" ${store.language === 'fr' ? 'selected' : ''}>🇫🇷 FR</option>
          <option value="ar" ${store.language === 'ar' ? 'selected' : ''}>🇸🇦 AR</option>
          <option value="hi" ${store.language === 'hi' ? 'selected' : ''}>🇮🇳 HI</option>
        </select>

        <!-- Network Sync Indicator Pill -->
        <button id="btn-sync-status" class="sync-indicator-pill ${isOnline ? 'online' : 'offline'}" title="Click to simulate Online / Offline field sync queue">
          <span class="status-dot ${isOnline ? 'online' : 'offline'}"></span>
          <span>${isOnline ? store.t('onlineMode') : store.t('offlineMode')}</span>
          ${pendingCount > 0 ? `<span class="sync-count-badge">${pendingCount}</span>` : ''}
        </button>
      </div>
    </header>
  `;
}

export function bindNavbarEvents(container) {
  // Role switcher handler
  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const usrId = e.currentTarget.getAttribute('data-user-id');
      const found = agencyUsers.find(u => u.id === usrId);
      if (found) store.setCurrentUser(found);
    });
  });

  // High contrast toggle
  const contrastBtn = container.querySelector('#btn-toggle-contrast');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => store.toggleHighContrast());
  }
  const themeBtn = container.querySelector('#btn-toggle-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => store.toggleTheme());
  }


  // Language selector
  const langSelect = container.querySelector('#select-language');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => store.setLanguage(e.target.value));
  }

  // Network sync status button
  const syncBtn = container.querySelector('#btn-sync-status');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => store.toggleNetworkStatus());
  }
}

