/* ReliefLink Animation 5 - Live status and metric emphasis. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-5-live-status';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a5-live-status {
        position: relative;
      }

      .rl-a5-live-status::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        border: 1px solid currentColor;
        opacity: 0;
        pointer-events: none;
        animation: rlA5StatusPulse 2s ease-out infinite;
      }

      .rl-a5-metric-update {
        animation: rlA5MetricUpdate .45s ease-out;
      }

      @keyframes rlA5StatusPulse {
        0% { opacity: .35; transform: scale(.98); }
        70%, 100% { opacity: 0; transform: scale(1.035); }
      }

      @keyframes rlA5MetricUpdate {
        0% { transform: scale(1); }
        45% { transform: scale(1.045); }
        100% { transform: scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a5-live-status::after,
        .rl-a5-metric-update {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function enhanceLiveIndicators() {
    document.querySelectorAll('.rl-live-dot:not(.offline)').forEach((dot) => {
      dot.classList.add('rl-a5-live-status');
    });
  }

  function mountObserver() {
    enhanceLiveIndicators();
    const app = document.querySelector('#app');
    if (app) {
      new MutationObserver(() => requestAnimationFrame(enhanceLiveIndicators))
        .observe(app, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mount();
      mountObserver();
    }, { once: true });
  } else {
    mount();
    mountObserver();
  }
})();
