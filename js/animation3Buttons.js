/* ReliefLink Animation 3 - Button interaction polish. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-3-buttons';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .btn, button:not(.nav-item-btn) {
        transition: transform .18s cubic-bezier(.2,.7,.2,1),
                    box-shadow .18s ease,
                    filter .18s ease;
      }

      .btn:not(:disabled):hover, button:not(:disabled):not(.nav-item-btn):hover {
        transform: translateY(-2px);
        filter: brightness(1.035);
        box-shadow: 0 5px 14px rgba(15, 23, 42, .12);
      }

      .btn:not(:disabled):active, button:not(:disabled):not(.nav-item-btn):active {
        transform: translateY(0) scale(.975);
        box-shadow: none;
      }

      .btn:focus-visible, button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .btn, button:not(.nav-item-btn) {
          transition: none;
        }
        .btn:not(:disabled):hover, button:not(:disabled):not(.nav-item-btn):hover,
        .btn:not(:disabled):active, button:not(:disabled):not(.nav-item-btn):active {
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
