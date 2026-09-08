// ReliefLink - replace the original Sign In branding with one custom logo.
(function () {
  'use strict';

  const LOGO_ID = 'relieflink-custom-signin-logo';
  const STYLE_ID = 'relieflink-custom-signin-logo-style';
  const OLD_SUBTITLE = 'Emergency Response Coordination Platform';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${LOGO_ID}{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;margin:0 auto 24px;text-align:center;animation:rlLogoIn .55s ease both}
      #${LOGO_ID} .rl-logo-mark{width:82px;height:82px;filter:drop-shadow(0 10px 20px rgba(15,23,42,.18));margin-bottom:10px}
      #${LOGO_ID} .rl-logo-name{font-size:27px;font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#f1f5f9}
      #${LOGO_ID} .rl-logo-name span{color:#60a5fa}
      #${LOGO_ID} .rl-logo-tag{margin-top:6px;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8}
      body.theme-light #${LOGO_ID} .rl-logo-name{color:#0f172a}
      body.theme-light #${LOGO_ID} .rl-logo-name span{color:#2563eb}
      body.theme-light #${LOGO_ID} .rl-logo-tag{color:#64748b}
      @keyframes rlLogoIn{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){#${LOGO_ID}{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function isSignInPage() {
    return !!(document.querySelector('#auth-email') && document.querySelector('#auth-password'));
  }

  function findOriginalBranding() {
    const subtitle = Array.from(document.querySelectorAll('*')).find((el) =>
      el.children.length === 0 && (el.textContent || '').trim() === OLD_SUBTITLE
    );
    if (!subtitle) return null;

    let parent = subtitle.parentElement;
    while (parent && parent !== document.body) {
      const text = (parent.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.includes('ReliefLink') && text.includes(OLD_SUBTITLE) && parent.children.length <= 6) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return subtitle.parentElement;
  }

  function createLogo() {
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
    return logo;
  }

  function mount() {
    if (!isSignInPage()) return;
    if (document.getElementById(LOGO_ID)) return;

    addStyles();
    const original = findOriginalBranding();
    if (!original || !original.parentNode) return;

    const logo = createLogo();
    original.parentNode.insertBefore(logo, original);
    original.remove();
  }

  function init() {
    mount();
    const observer = new MutationObserver(() => {
      if (!document.getElementById(LOGO_ID)) mount();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
