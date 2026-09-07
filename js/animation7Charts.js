/* ReliefLink Animation 7 - Dashboard chart entrance. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-7-charts';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a7-chart-enter {
        opacity: 0;
        transform: translateY(8px);
        animation: rlA7ChartIn .6s cubic-bezier(.2,.75,.2,1) forwards;
      }

      @keyframes rlA7ChartIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a7-chart-enter {
          opacity: 1;
          transform: none;
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function animateCharts() {
    const app = document.querySelector('#app');
    if (!app) return;

    app.querySelectorAll('canvas').forEach((canvas) => {
      const chart = canvas.closest('.card, .chart-card, .metric-card, .dashboard-card');
      const target = chart || canvas;
      if (target.dataset.rlA7Animated === '1') return;
      target.dataset.rlA7Animated = '1';
      target.classList.add('rl-a7-chart-enter');
    });
  }

  function init() {
    addStyles();
    animateCharts();
    const app = document.querySelector('#app');
    if (app) {
      new MutationObserver(() => requestAnimationFrame(animateCharts))
        .observe(app, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
