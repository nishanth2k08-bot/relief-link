// Screen 1: Login / Agency Verification Screen

import { store } from '../state.js';
import { agencyUsers } from '../data/mockData.js';

export function renderLoginView() {
  return `
    <div class="view-container" style="display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 120px);">
      <div class="card" style="width: 100%; max-width: 480px; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div class="brand-logo" style="width: 56px; height: 56px; font-size: 1.8rem; margin: 0 auto 16px auto;">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">Agency Authentication</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
            Secure multi-agency access for emergency responders & command units
          </p>
        </div>

        <form id="agency-login-form">
          <div class="form-group">
            <label class="form-label">Responding Agency</label>
            <select id="login-agency-select">
              <option value="FEMA Regional Command">FEMA Regional Command</option>
              <option value="Red Cross International">Red Cross International</option>
              <option value="Local Fire & Rescue Ops">Local Fire & Rescue Ops</option>
              <option value="National Guard Command">National Guard Command</option>
              <option value="Civil Defense Volunteers">Civil Defense Volunteers</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Agency Badge ID / Passcode</label>
            <input type="text" id="login-badge-id" value="FEMA-9921" placeholder="e.g. FEMA-9921 or NG-4012" required />
          </div>

          <div class="form-group">
            <label class="form-label">Operational Role</label>
            <select id="login-role-select">
              <option value="coordinator">Disaster Relief Coordinator</option>
              <option value="responder">Field Responder / Team Lead</option>
              <option value="admin">System Operations Admin</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 12px;">
            <i class="fa-solid fa-key"></i>
            <span>Authenticate & Launch Ops</span>
          </button>
        </form>

        <div style="border-top: 1px solid var(--border-color); margin-top: 24px; padding-top: 16px; text-align: center;">
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px; font-weight: 600;">
            QUICK FIELD DEMO ACCESS
          </p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            ${agencyUsers.map(usr => `
              <button class="btn btn-secondary btn-sm demo-user-btn" data-user-id="${usr.id}">
                ${usr.name.split(' ')[0]} (${usr.role})
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindLoginViewEvents(container) {
  const form = container.querySelector('#agency-login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const agency = container.querySelector('#login-agency-select').value;
      const badgeId = container.querySelector('#login-badge-id').value;
      const role = container.querySelector('#login-role-select').value;

      store.setCurrentUser({
        id: `usr-custom-${Date.now()}`,
        name: `Officer ${badgeId}`,
        role: role,
        agency: agency,
        badgeId: badgeId,
        avatar: badgeId.slice(0, 2).toUpperCase()
      });

      store.setCurrentView('overview');
    });
  }

  container.querySelectorAll('.demo-user-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const uId = e.currentTarget.getAttribute('data-user-id');
      const found = agencyUsers.find(u => u.id === uId);
      if (found) {
        store.setCurrentUser(found);
        store.setCurrentView('overview');
      }
    });
  });
}
