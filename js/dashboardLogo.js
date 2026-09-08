// ReliefLink - keep the signed-in dashboard branding identical to the Sign In logo.
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-dashboard-logo-style';
  const LOGO_MARK = `
    <svg viewBox="0 0 96 96" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="rlDashboardShieldGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#2563eb"/>
          <stop offset="1" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <path d="M48 5 82 18v25c0 23-14 39-34 48C28 82 14 66 14 43V18L48 5Z" fill="url(#rlDashboardShieldGradient)"/>
      <path d="M48 15 72 24v19c0 16-9 28-24 36-15-8-24-20-24-36V24l24-9Z" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>
      <path d="M29 49h12l7-14 8 25 7-12h8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="29" cy="49" r="3.5" fill="#fff"/><circle cx="41" cy="49" r="3.5" fill="#fff"/><circle cx="56" cy="60" r="3.5" fill="#fff"/><circle cx="71" cy="48" r="3.5" fill="#fff"/>
    </svg>`;

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .app-header .brand-logo.rl-dashboard-logo {
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        padding: 0 !important;
      }
      .app-header .brand-logo.rl-dashboard-logo svg {
        width: 38px !important;
        height: 38px !important;
        display: block !important;
      }
    `;
    document.head.appendChild(style);
  }

  function apply() {
    const logo = document.querySelector('.app-header .brand-logo');
    if (!logo) return;
    if (logo.classList.contains('rl-dashboard-logo')) return;
    addStyles();
    logo.classList.add('rl-dashboard-logo');
    logo.setAttribute('aria-label', 'ReliefLink');
    logo.innerHTML = LOGO_MARK;
  }

  function init() {
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
