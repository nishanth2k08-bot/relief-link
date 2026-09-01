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

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <button type="button" class="btn btn-secondary btn-sm" style="justify-content: center; width: 100%;">Continue with Google</button>
          <button type="button" class="btn btn-secondary btn-sm" style="justify-content: center; width: 100%;">Continue with Apple</button>
          <button type="button" id="btn-phone-signin" class="btn btn-secondary btn-sm" style="justify-content: center; width: 100%;">Sign in with Phone Number</button>
        </div>

        <div id="phone-auth-panel" style="display: none; margin-bottom: 18px;">
          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-app);">
              <select id="phone-country-code" aria-label="Country code" style="border: none; background: transparent; padding: 12px 10px; color: var(--text-main); min-width: 120px; border-right: 1px solid var(--border-color);">
                <option value="+91" selected>India (+91)</option>
                <option value="+1">USA (+1)</option>
                <option value="+44">UK (+44)</option>
              </select>
              <input type="tel" id="phone-number-input" placeholder="98765 43210" style="border: none; background: transparent; flex: 1; padding: 12px 14px; color: var(--text-main);" />
            </div>
          </div>

          <div id="otp-section" style="display: none; margin-top: 12px;">
            <div class="form-group">
              <label class="form-label">Enter OTP</label>
              <input type="text" id="otp-input" maxlength="6" placeholder="6-digit code" style="letter-spacing: 0.2em; text-align: center;" />
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button type="button" id="btn-send-otp" class="btn btn-primary btn-sm" style="flex: 1;">Send OTP</button>
            <button type="button" id="btn-verify-otp" class="btn btn-secondary btn-sm" style="flex: 1; display: none;">Verify OTP</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; margin: 20px 0;">
          <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">or sign in with email</span>
          <div style="flex: 1; height: 1px; background: var(--border-color);"></div>
        </div>

        <div id="auth-tabs" style="display: flex; gap: 6px; background: var(--bg-app); padding: 6px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <button type="button" id="tab-btn-login" class="btn btn-primary btn-sm" style="flex: 1;">Sign In</button>
          <button type="button" id="tab-btn-register" class="btn btn-secondary btn-sm" style="flex: 1;">Create Account</button>
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
            <label class="form-label">Agency Email Address</label>
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
  const phonePanel = container.querySelector('#phone-auth-panel');
  const phoneBtn = container.querySelector('#btn-phone-signin');
  const countryCode = container.querySelector('#phone-country-code');
  const phoneInput = container.querySelector('#phone-number-input');
  const otpSection = container.querySelector('#otp-section');
  const otpInput = container.querySelector('#otp-input');
  const sendOtpBtn = container.querySelector('#btn-send-otp');
  const verifyOtpBtn = container.querySelector('#btn-verify-otp');
  const tabLogin = container.querySelector('#tab-btn-login');
  const tabRegister = container.querySelector('#tab-btn-register');
  const submitBtn = form?.querySelector('button[type="submit"]');

  let isRegisterMode = false;

  function setRegisterMode(mode) {
    isRegisterMode = mode;
    if (!tabLogin || !tabRegister || !submitBtn) return;
    tabLogin.classList.toggle('btn-primary', !mode);
    tabLogin.classList.toggle('btn-secondary', mode);
    tabRegister.classList.toggle('btn-primary', mode);
    tabRegister.classList.toggle('btn-secondary', !mode);
    submitBtn.innerHTML = mode
      ? '<i class="fa-solid fa-user-plus"></i><span>Create Account</span>'
      : '<i class="fa-solid fa-key"></i><span>Authenticate & Launch Ops</span>';
  }

  if (tabLogin) {
    tabLogin.addEventListener('click', () => setRegisterMode(false));
  }

  if (tabRegister) {
    tabRegister.addEventListener('click', () => setRegisterMode(true));
  }

  if (phoneBtn && phonePanel) {
    phoneBtn.addEventListener('click', () => {
      phonePanel.style.display = phonePanel.style.display === 'none' ? 'block' : 'none';
      if (phonePanel.style.display === 'block') {
        otpSection.style.display = 'none';
        verifyOtpBtn.style.display = 'none';
        if (otpInput) otpInput.value = '';
      }
    });
  }

  if (sendOtpBtn && otpSection && verifyOtpBtn && phoneInput && countryCode) {
    sendOtpBtn.addEventListener('click', () => {
      const phoneNumber = phoneInput.value.trim();
      if (!phoneNumber) {
        phoneInput.focus();
        return;
      }
      const fullNumber = `${countryCode.value} ${phoneNumber}`;
      otpSection.style.display = 'block';
      verifyOtpBtn.style.display = 'inline-flex';
      sendOtpBtn.textContent = 'Resend OTP';
      if (otpInput) {
        otpInput.value = '123456';
        otpInput.setAttribute('placeholder', `OTP sent to ${fullNumber}`);
      }
    });
  }

  if (verifyOtpBtn && otpInput && form) {
    verifyOtpBtn.addEventListener('click', () => {
      const otpCode = otpInput.value.trim();
      if (!otpCode) {
        otpInput.focus();
        return;
      }

      const agency = container.querySelector('#login-agency-select').value;
      const badgeId = container.querySelector('#login-badge-id').value;
      const role = container.querySelector('#login-role-select').value;
      const phoneNumber = `${countryCode.value} ${phoneInput.value.trim()}`;

      store.setCurrentUser({
        id: `usr-phone-${Date.now()}`,
        name: `Officer ${phoneNumber}`,
        role: role,
        agency: agency,
        badgeId: badgeId,
        avatar: badgeId.slice(0, 2).toUpperCase(),
        authMethod: 'phone',
        phone: phoneNumber,
        email: null
      });

      store.setCurrentView('overview');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const agency = container.querySelector('#login-agency-select').value;
      const identifier = container.querySelector('#login-identifier').value.trim();
      const badgeId = container.querySelector('#login-badge-id').value;
      const role = container.querySelector('#login-role-select').value;

      store.setCurrentUser({
        id: `usr-custom-${Date.now()}`,
        name: `Officer ${badgeId}`,
        role: role,
        agency: agency,
        badgeId: badgeId,
        avatar: badgeId.slice(0, 2).toUpperCase(),
        authMethod: isRegisterMode ? 'create-account' : 'email',
        email: identifier,
        phone: null
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
