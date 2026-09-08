// ReliefLink - quick login profile selector for protected accounts.
// Selecting a profile ONLY fills the email. The password must still be entered manually.
(function () {
  'use strict';

  const PROFILES = [
    { label: 'Administrator', email: 'administrator@relieflink.app', icon: 'fa-user-shield' },
    { label: 'Admin', email: 'admin@relieflink.app', icon: 'fa-user-gear' },
    { label: 'Coordinator', email: 'coordinator@relieflink.app', icon: 'fa-headset' }
  ];

  const STYLE_ID = 'relieflink-protected-login-profiles-style';
  const PANEL_ID = 'relieflink-protected-login-profiles';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID}{margin:14px 0 4px;padding:14px;border:1px solid rgba(59,130,246,.22);border-radius:14px;background:rgba(15,23,42,.04)}
      #${PANEL_ID} .rlp-title{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-bottom:10px;opacity:.75}
      #${PANEL_ID} .rlp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      #${PANEL_ID} button{border:1px solid rgba(100,116,139,.28);background:transparent;border-radius:10px;padding:10px 6px;cursor:pointer;font:inherit;font-size:12px;font-weight:600;transition:transform .15s ease,background .15s ease,border-color .15s ease}
      #${PANEL_ID} button:hover{transform:translateY(-1px);background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.45)}
      #${PANEL_ID} button.active{background:rgba(59,130,246,.12);border-color:rgba(59,130,246,.65)}
      #${PANEL_ID} i{display:block;margin-bottom:5px;font-size:15px}
      @media(max-width:520px){#${PANEL_ID} .rlp-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function getEmailInput() {
    return document.querySelector('#auth-email') ||
      document.querySelector('input[type="email"]');
  }

  function getPasswordInput() {
    return document.querySelector('#auth-password') ||
      document.querySelector('input[type="password"]');
  }

  function mount() {
    if (document.getElementById(PANEL_ID)) return;

    const emailInput = getEmailInput();
    const passwordInput = getPasswordInput();
    if (!emailInput || !passwordInput) return;

    addStyles();

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="rlp-title">Official access profiles</div>
      <div class="rlp-grid"></div>
    `;

    const grid = panel.querySelector('.rlp-grid');
    PROFILES.forEach((profile) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<i class="fa-solid ${profile.icon}"></i>${profile.label}`;
      button.addEventListener('click', () => {
        emailInput.value = profile.email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        passwordInput.focus();
        grid.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        button.classList.add('active');
      });
      grid.appendChild(button);
    });

    emailInput.closest('form')?.insertBefore(panel, emailInput.closest('form').querySelector('button[type="submit"]') || null);
  }

  function init() {
    mount();
    new MutationObserver(mount).observe(document.body, { childList: true, subtree: true });
    setInterval(mount, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
