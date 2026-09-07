/* ReliefLink Animation 2 - Sidebar/navigation motion. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-2-sidebar';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .nav-item-btn {
        transition: transform .2s cubic-bezier(.2,.7,.2,1),
                    background-color .2s ease,
                    color .2s ease,
                    box-shadow .2s ease;
      }

      .nav-item-btn:hover {
        transform: translateX(5px);
      }

      .nav-item-btn:active {
        transform: translateX(3px) scale(.985);
      }

      .nav-item-btn.active {
        animation: rlA2ActiveNav .3s cubic-bezier(.2,.75,.2,1) both;
      }

      .nav-item-btn .nav-icon {
        transition: transform .2s ease;
      }

      .nav-item-btn:hover .nav-icon {
        transform: scale(1.08);
      }

      @keyframes rlA2ActiveNav {
        from { opacity: .7; transform: translateX(-4px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .nav-item-btn,
        .nav-item-btn .nav-icon {
          transition: none;
          transform: none !important;
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
