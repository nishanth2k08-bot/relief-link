// ReliefLink - custom logo for the Sign In page only.
(function () {
  'use strict';

  const LOGO_ID = 'relieflink-custom-signin-logo';
  const STYLE_ID = 'relieflink-custom-signin-logo-style';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${LOGO_ID}{display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 22px;text-align:center;animation:rlLogoIn .55s ease both}
      #${LOGO_ID} .rl-logo-mark{width:76px;height:76px;filter:drop-shadow(0 10px 20px rgba(15,23,42,.16));margin-bottom:11px}
      #${LOGO_ID} .rl-logo-name{font-size:25px;font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#0f172a}
      #${LOGO_ID} .rl-logo-name span{color:#2563eb}
      #${LOGO_ID} .rl-logo-tag{margin-top:5px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#64748b}
      @keyframes rlLogoIn{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){#${LOGO_ID}{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function isSignInPage() {
    return !!(document.querySelector('#auth-email') && document.querySelector('#auth-password'));
  }

  function mount() {
    if (!isSignInPage() || document.getElementById(LOGO_ID)) return;
    const email = document.querySelector('#auth-email');
    const form = email && email.closest('form');
    if (!form) return;

    addStyles();
    const logo = document.createElement('div');
    logo.id = LOGO_ID;
    logo.setAttribute('aria-label', 'ReliefLink');
    logo.innerHTML = `
      <svg class="rl-logo-mark" viewBox="0 0 96 96" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="rlShieldGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#2563eb"/>
            <stop offset="1" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <path d="M48 5 82 18v25c0 23-14 39-34 48C28 82 14 66 14 43V18L48 5Z" fill="url(#rlShieldGradient)"/>
        <path d="M48 15 72 24v19c0 16-9 28-24 36-15-8-24-20-24-36V24l24-9Z" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>
        <path d="M29 49h12l7-14 8 25 7-12h8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="29" cy="49" r="3.5" fill="#fff"/><circle cx="41" cy="49" r="3.5" fill="#fff"/><circle cx="56" cy="60" r="3.5" fill="#fff"/><circle cx="71" cy="48" r="3.5" fill="#fff"/>
      </svg>
      <div class="rl-logo-name">Relief<span>Link</span></div>
      <div class="rl-logo-tag">Emergency Response Network</div>
    `;

    form.insertBefore(logo, form.firstChild);
  }

  function init() {
    mount();
    const observer = new MutationObserver(mount);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(mount, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
