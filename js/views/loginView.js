// Screen 1: Login / Agency Verification Screen

import { store } from '../state.js';
import { agencyUsers } from '../data/mockData.js';

const phoneCountryOptions = [
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+7', label: '🇷🇺 +7' },
  { value: '+20', label: '🇪🇬 +20' },
  { value: '+27', label: '🇿🇦 +27' },
  { value: '+30', label: '🇬🇷 +30' },
  { value: '+31', label: '🇳🇱 +31' },
  { value: '+32', label: '🇧🇪 +32' },
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+34', label: '🇪🇸 +34' },
  { value: '+36', label: '🇭🇺 +36' },
  { value: '+39', label: '🇮🇹 +39' },
  { value: '+40', label: '🇷🇴 +40' },
  { value: '+41', label: '🇨🇭 +41' },
  { value: '+43', label: '🇦🇹 +43' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+45', label: '🇩🇰 +45' },
  { value: '+46', label: '🇸🇪 +46' },
  { value: '+47', label: '🇳🇴 +47' },
  { value: '+48', label: '🇵🇱 +48' },
  { value: '+49', label: '🇩🇪 +49' },
  { value: '+51', label: '🇵🇪 +51' },
  { value: '+52', label: '🇲🇽 +52' },
  { value: '+53', label: '🇨🇺 +53' },
  { value: '+54', label: '🇦🇷 +54' },
  { value: '+55', label: '🇧🇷 +55' },
  { value: '+56', label: '🇨🇱 +56' },
  { value: '+57', label: '🇨🇴 +57' },
  { value: '+58', label: '🇻🇪 +58' },
  { value: '+60', label: '🇲🇾 +60' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+62', label: '🇮🇩 +62' },
  { value: '+63', label: '🇵🇭 +63' },
  { value: '+64', label: '🇳🇿 +64' },
  { value: '+65', label: '🇸🇬 +65' },
  { value: '+66', label: '🇹🇭 +66' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+82', label: '🇰🇷 +82' },
  { value: '+84', label: '🇻🇳 +84' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+90', label: '🇹🇷 +90' },
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+92', label: '🇵🇰 +92' },
  { value: '+93', label: '🇦🇫 +93' },
  { value: '+94', label: '🇱🇰 +94' },
  { value: '+95', label: '🇲🇲 +95' },
  { value: '+98', label: '🇮🇷 +98' },
  { value: '+211', label: '🇸🇸 +211' },
  { value: '+212', label: '🇲🇦 +212' },
  { value: '+213', label: '🇩🇿 +213' },
  { value: '+216', label: '🇹🇳 +216' },
  { value: '+218', label: '🇱🇾 +218' },
  { value: '+220', label: '🇬🇲 +220' },
  { value: '+221', label: '🇸🇳 +221' },
  { value: '+222', label: '🇲🇷 +222' },
  { value: '+223', label: '🇲🇱 +223' },
  { value: '+224', label: '🇬🇳 +224' },
  { value: '+225', label: '🇨🇮 +225' },
  { value: '+226', label: '🇧🇫 +226' },
  { value: '+227', label: '🇳🇪 +227' },
  { value: '+228', label: '🇹🇬 +228' },
  { value: '+229', label: '🇧🇯 +229' },
  { value: '+230', label: '🇲🇺 +230' },
  { value: '+231', label: '🇱🇷 +231' },
  { value: '+232', label: '🇸🇱 +232' },
  { value: '+233', label: '🇬🇭 +233' },
  { value: '+234', label: '🇳🇬 +234' },
  { value: '+235', label: '🇹🇩 +235' },
  { value: '+236', label: '🇨🇫 +236' },
  { value: '+237', label: '🇨🇲 +237' },
  { value: '+238', label: '🇨🇻 +238' },
  { value: '+239', label: '🇸🇹 +239' },
  { value: '+240', label: '🇬🇶 +240' },
  { value: '+241', label: '🇬🇦 +241' },
  { value: '+242', label: '🇨🇬 +242' },
  { value: '+243', label: '🇨🇩 +243' },
  { value: '+244', label: '🇦🇴 +244' },
  { value: '+245', label: '🇬🇼 +245' },
  { value: '+246', label: '🇮🇴 +246' },
  { value: '+248', label: '🇸🇨 +248' },
  { value: '+249', label: '🇸🇩 +249' },
  { value: '+250', label: '🇷🇼 +250' },
  { value: '+251', label: '🇪🇹 +251' },
  { value: '+252', label: '🇸🇴 +252' },
  { value: '+253', label: '🇩🇯 +253' },
  { value: '+254', label: '🇰🇪 +254' },
  { value: '+255', label: '🇹🇿 +255' },
  { value: '+256', label: '🇺🇬 +256' },
  { value: '+257', label: '🇧🇮 +257' },
  { value: '+258', label: '🇲🇿 +258' },
  { value: '+260', label: '🇿🇲 +260' },
  { value: '+261', label: '🇲🇬 +261' },
  { value: '+262', label: '🇾🇹 +262' },
  { value: '+263', label: '🇿🇼 +263' },
  { value: '+264', label: '🇳🇦 +264' },
  { value: '+265', label: '🇲🇼 +265' },
  { value: '+266', label: '🇱🇸 +266' },
  { value: '+267', label: '🇧🇼 +267' },
  { value: '+268', label: '🇸🇿 +268' },
  { value: '+269', label: '🇰🇲 +269' },
  { value: '+352', label: '🇱🇺 +352' },
  { value: '+353', label: '🇮🇪 +353' },
  { value: '+354', label: '🇮🇸 +354' },
  { value: '+355', label: '🇦🇱 +355' },
  { value: '+356', label: '🇲🇹 +356' },
  { value: '+357', label: '🇨🇾 +357' },
  { value: '+358', label: '🇫🇮 +358' },
  { value: '+370', label: '🇱🇹 +370' },
  { value: '+371', label: '🇱🇻 +371' },
  { value: '+372', label: '🇪🇪 +372' },
  { value: '+373', label: '🇲🇩 +373' },
  { value: '+374', label: '🇦🇲 +374' },
  { value: '+375', label: '🇧🇾 +375' },
  { value: '+376', label: '🇦🇩 +376' },
  { value: '+377', label: '🇲🇨 +377' },
  { value: '+378', label: '🇸🇲 +378' },
  { value: '+380', label: '🇺🇦 +380' },
  { value: '+381', label: '🇷🇸 +381' },
  { value: '+382', label: '🇲🇪 +382' },
  { value: '+385', label: '🇭🇷 +385' },
  { value: '+386', label: '🇸🇮 +386' },
  { value: '+387', label: '🇧🇦 +387' },
  { value: '+389', label: '🇲🇰 +389' },
  { value: '+420', label: '🇨🇿 +420' },
  { value: '+421', label: '🇸🇰 +421' },
  { value: '+423', label: '🇱🇮 +423' },
  { value: '+500', label: '🇫🇰 +500' },
  { value: '+501', label: '🇧🇿 +501' },
  { value: '+502', label: '🇬🇹 +502' },
  { value: '+503', label: '🇸🇻 +503' },
  { value: '+504', label: '🇭🇳 +504' },
  { value: '+505', label: '🇳🇮 +505' },
  { value: '+506', label: '🇨🇷 +506' },
  { value: '+507', label: '🇵🇦 +507' },
  { value: '+508', label: '🇵🇲 +508' },
  { value: '+509', label: '🇭🇹 +509' },
  { value: '+590', label: '🇬🇵 +590' },
  { value: '+591', label: '🇧🇴 +591' },
  { value: '+592', label: '🇬🇾 +592' },
  { value: '+593', label: '🇪🇨 +593' },
  { value: '+594', label: '🇬🇫 +594' },
  { value: '+595', label: '🇵🇾 +595' },
  { value: '+596', label: '🇲🇶 +596' },
  { value: '+597', label: '🇸🇷 +597' },
  { value: '+598', label: '🇺🇾 +598' },
  { value: '+599', label: '🇨🇼 +599' },
  { value: '+670', label: '🇹🇱 +670' },
  { value: '+672', label: '🇳🇫 +672' },
  { value: '+673', label: '🇧🇳 +673' },
  { value: '+674', label: '🇳🇷 +674' },
  { value: '+675', label: '🇵🇬 +675' },
  { value: '+676', label: '🇹🇴 +676' },
  { value: '+677', label: '🇸🇧 +677' },
  { value: '+678', label: '🇻🇺 +678' },
  { value: '+679', label: '🇫🇯 +679' },
  { value: '+680', label: '🇵🇼 +680' },
  { value: '+681', label: '🇼🇫 +681' },
  { value: '+682', label: '🇨🇰 +682' },
  { value: '+683', label: '🇳🇺 +683' },
  { value: '+685', label: '🇼🇸 +685' },
  { value: '+687', label: '🇳🇨 +687' },
  { value: '+688', label: '🇹🇻 +688' },
  { value: '+689', label: '🇵🇫 +689' },
  { value: '+690', label: '🇹🇰 +690' },
  { value: '+691', label: '🇫🇲 +691' },
  { value: '+692', label: '🇲🇭 +692' },
  { value: '+850', label: '🇰🇵 +850' },
  { value: '+852', label: '🇭🇰 +852' },
  { value: '+853', label: '🇲🇴 +853' },
  { value: '+855', label: '🇰🇭 +855' },
  { value: '+856', label: '🇱🇦 +856' },
  { value: '+880', label: '🇧🇩 +880' },
  { value: '+886', label: '🇹🇼 +886' },
  { value: '+960', label: '🇲🇻 +960' },
  { value: '+961', label: '🇱🇧 +961' },
  { value: '+962', label: '🇯🇴 +962' },
  { value: '+963', label: '🇸🇾 +963' },
  { value: '+964', label: '🇮🇶 +964' },
  { value: '+965', label: '🇰🇼 +965' },
  { value: '+966', label: '🇸🇦 +966' },
  { value: '+967', label: '🇾🇪 +967' },
  { value: '+968', label: '🇴🇲 +968' },
  { value: '+971', label: '🇦🇪 +971' },
  { value: '+972', label: '🇮🇱 +972' },
  { value: '+973', label: '🇧🇭 +973' },
  { value: '+974', label: '🇶🇦 +974' },
  { value: '+975', label: '🇧🇹 +975' },
  { value: '+976', label: '🇲🇳 +976' },
  { value: '+977', label: '🇳🇵 +977' },
  { value: '+992', label: '🇹🇯 +992' },
  { value: '+993', label: '🇹🇲 +993' },
  { value: '+994', label: '🇦🇿 +994' },
  { value: '+995', label: '🇬🇪 +995' },
  { value: '+996', label: '🇰🇬 +996' },
  { value: '+998', label: '🇺🇿 +998' }
];

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
            <div style="display: flex; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-app); align-items: stretch;">
              <select id="phone-country-code" aria-label="Country code" style="border: none; background: transparent; padding: 10px 8px 10px 10px; color: var(--text-main); width: 120px; min-width: 120px; font-size: 0.76rem; text-align: center; border-right: 1px solid var(--border-color);">
                ${phoneCountryOptions.map(option => `
                  <option value="${option.value}" ${option.value === '+91' ? 'selected' : ''}>${option.label}</option>
                `).join('')}
              </select>
              <input type="tel" id="phone-number-input" placeholder="98765 43210" style="border: none; background: transparent; flex: 1; min-width: 0; padding: 12px 14px; color: var(--text-main); font-size: 0.95rem;" />
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
  let generatedOtp = '';

  function showNotification(message, type = 'success') {
    const existing = container.querySelector('.login-notification');
    if (existing) existing.remove();

    const notice = document.createElement('div');
    notice.className = 'login-notification';
    notice.textContent = message;
    notice.style.position = 'fixed';
    notice.style.bottom = '20px';
    notice.style.right = '20px';
    notice.style.zIndex = '9999';
    notice.style.padding = '12px 16px';
    notice.style.borderRadius = '10px';
    notice.style.fontSize = '0.8rem';
    notice.style.fontWeight = '700';
    notice.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
    notice.style.color = '#fff';
    notice.style.background = type === 'error' ? '#ef4444' : '#10b981';
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 3500);
  }

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

  if (sendOtpBtn && otpSection && verifyOtpBtn && phoneInput && countryCode && otpInput) {
    sendOtpBtn.addEventListener('click', () => {
      const phoneNumber = phoneInput.value.trim();
      if (!phoneNumber) {
        phoneInput.focus();
        showNotification('Please enter a mobile number first.', 'error');
        return;
      }

      generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      const fullNumber = `${countryCode.value} ${phoneNumber}`;
      otpSection.style.display = 'block';
      verifyOtpBtn.style.display = 'inline-flex';
      sendOtpBtn.textContent = 'Resend OTP';
      otpInput.value = '';
      otpInput.setAttribute('placeholder', `OTP sent to ${fullNumber}`);
      showNotification(`OTP sent to ${fullNumber}. Demo code: ${generatedOtp}`, 'success');
    });
  }

  if (verifyOtpBtn && otpInput && form && countryCode && phoneInput) {
    verifyOtpBtn.addEventListener('click', () => {
      const otpCode = otpInput.value.trim();
      if (!otpCode) {
        otpInput.focus();
        showNotification('Please enter the OTP.', 'error');
        return;
      }

      if (otpCode !== generatedOtp) {
        showNotification('Invalid OTP. Please use the generated code.', 'error');
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

      showNotification(`Signed in successfully with phone number ${phoneNumber}.`, 'success');
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

      showNotification(`Signed in successfully with ${identifier}.`, 'success');
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
