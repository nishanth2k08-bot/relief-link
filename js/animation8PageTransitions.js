/* ReliefLink Animation 8 - Smooth page/view transitions. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-8-page-transitions';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a8-view-enter {
        animation: rlA8ViewIn .28s cubic-bezier(.2,.75,.2,1) both;
      }

      @keyframes rlA8ViewIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a8-view-enter { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function animateView() {
    const app = document.querySelector('#app');
    if (!app) return;

    const candidates = app.querySelectorAll('.main-content, .content-area, .view-content, .page-content');
    candidates.forEach((el) => {
      if (el.dataset.rlA8Animated === '1') return;
      el.dataset.rlA8Animated = '1';
      el.classList.add('rl-a8-view-enter');
    });
  }

  function init() {
    mount();
    animateView();
    const app = document.querySelector('#app');
    if (!app) return;

    let timer;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(animateView, 0);
    }).observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
