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

        <div style="display: flex; gap: 8px; background: var(--bg-app); padding: 6px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <button type="button" class="btn btn-primary btn-sm auth-method-btn active" data-auth-method="email" style="flex: 1;">Email</button>
          <button type="button" class="btn btn-secondary btn-sm auth-method-btn" data-auth-method="phone" style="flex: 1;">Phone Number</button>
        </div>

        <form id="agency-login-form" data-auth-method="email">
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
            <label class="form-label" id="login-identifier-label">Agency Email Address</label>
            <input type="email" id="login-identifier" value="elena.vance@fema.gov" placeholder="responder@agency.gov" required />
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
  const identifierInput = container.querySelector('#login-identifier');
  const label = container.querySelector('#login-identifier-label');

  function setAuthMethod(method) {
    if (!form || !identifierInput || !label) return;
    form.dataset.authMethod = method;
    const isPhone = method === 'phone';
    identifierInput.type = isPhone ? 'tel' : 'email';
    identifierInput.value = isPhone ? '+1 555 010 2048' : 'elena.vance@fema.gov';
    identifierInput.placeholder = isPhone ? '+1 (555) 010-2048' : 'responder@agency.gov';
    label.textContent = isPhone ? 'Mobile Phone Number' : 'Agency Email Address';

    container.querySelectorAll('.auth-method-btn').forEach(btn => {
      const active = btn.dataset.authMethod === method;
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-secondary', !active);
    });
  }

  container.querySelectorAll('.auth-method-btn').forEach(btn => {
    btn.addEventListener('click', () => setAuthMethod(btn.dataset.authMethod));
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const agency = container.querySelector('#login-agency-select').value;
      const badgeId = container.querySelector('#login-badge-id').value;
      const role = container.querySelector('#login-role-select').value;
      const authMethod = form.dataset.authMethod || 'email';
      const identifier = identifierInput.value.trim();

      store.setCurrentUser({
        id: `usr-custom-${Date.now()}`,
        name: authMethod === 'phone' ? `Officer ${identifier}` : `Officer ${badgeId}`,
        role: role,
        agency: agency,
        badgeId: badgeId,
        avatar: badgeId.slice(0, 2).toUpperCase(),
        authMethod,
        phone: authMethod === 'phone' ? identifier : null,
        email: authMethod === 'email' ? identifier : null
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
