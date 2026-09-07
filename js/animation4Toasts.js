/* ReliefLink Animation 4 - Toast and status feedback. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-4-toasts';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .toast, .notification, .alert, [role="alert"] {
        animation: rlA4ToastIn .28s cubic-bezier(.2,.75,.2,1) both;
      }

      .toast:hover, .notification:hover, .alert:hover, [role="alert"]:hover {
        transform: translateY(-2px);
        transition: transform .18s ease, box-shadow .18s ease;
      }

      @keyframes rlA4ToastIn {
        from { opacity: 0; transform: translateY(12px) scale(.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .toast, .notification, .alert, [role="alert"] {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function mount() {
    addStyles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
