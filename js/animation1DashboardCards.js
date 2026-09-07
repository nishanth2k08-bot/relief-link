/* ReliefLink Animation 1 - Dashboard card entrance + hover polish. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-1-dashboard-cards';

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a1-dashboard-card {
        opacity: 0;
        transform: translateY(14px) scale(.985);
        animation: rlA1CardIn .42s cubic-bezier(.2,.75,.2,1) forwards;
        animation-delay: var(--rl-a1-delay, 0ms);
      }

      .rl-a1-dashboard-card:hover {
        transform: translateY(-3px) scale(1.002);
        box-shadow: var(--shadow-md);
      }

      @keyframes rlA1CardIn {
        from { opacity: 0; transform: translateY(14px) scale(.985); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a1-dashboard-card {
          opacity: 1;
          transform: none;
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function animateCards() {
    const app = document.querySelector('#app');
    if (!app) return;

    const selectors = [
      '.stat-card',
      '.metric-card',
      '.dashboard-card'
    ];

    const cards = app.querySelectorAll(selectors.join(','));
    cards.forEach((card, index) => {
      if (card.dataset.rlA1Animated === '1') return;
      card.dataset.rlA1Animated = '1';
      card.classList.add('rl-a1-dashboard-card');
      card.style.setProperty('--rl-a1-delay', Math.min(index * 70, 420) + 'ms');
    });
  }

  function mount() {
    addStyles();
    animateCards();
    const app = document.querySelector('#app');
    if (app) {
      new MutationObserver(() => requestAnimationFrame(animateCards))
        .observe(app, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
