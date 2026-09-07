/* ReliefLink Animation 10 - Smooth incident-list updates and priority emphasis. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-10-incident-list';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a10-incident-item {
        animation: rlA10IncidentIn .34s cubic-bezier(.2,.75,.2,1) both;
        will-change: transform, opacity;
      }

      .rl-a10-incident-item:hover {
        transform: translateX(4px);
      }

      .rl-a10-critical-item {
        box-shadow: inset 3px 0 0 rgba(239,68,68,.7);
      }

      @keyframes rlA10IncidentIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a10-incident-item { animation: none; }
        .rl-a10-incident-item:hover { transform: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function enhance() {
    document.querySelectorAll(
      '.incident-item, .incident-card, .incident-row, [data-incident-id], [data-incident]'
    ).forEach((item) => {
      if (!(item instanceof Element) || item.dataset.rlA10Bound === '1') return;
      item.dataset.rlA10Bound = '1';
      item.classList.add('rl-a10-incident-item');

      const text = (item.textContent || '').toLowerCase();
      if (/critical|severe|emergency/.test(text)) {
        item.classList.add('rl-a10-critical-item');
      }
    });
  }

  function init() {
    mount();
    enhance();
    const observer = new MutationObserver(() => requestAnimationFrame(enhance));
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
