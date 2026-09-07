/* ReliefLink Animation 9 - Subtle incident marker emphasis without moving the Leaflet map. */
(function () {
  'use strict';

  const STYLE_ID = 'relieflink-animation-9-map-markers';

  function mount() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .rl-a9-marker-pulse {
        animation: rlA9MarkerPulse 1.8s ease-in-out infinite;
        transform-origin: center;
      }

      @keyframes rlA9MarkerPulse {
        0%, 100% { filter: drop-shadow(0 0 0 rgba(239,68,68,0)); }
        50% { filter: drop-shadow(0 0 7px rgba(239,68,68,.42)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .rl-a9-marker-pulse { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function animateCriticalMarkers() {
    document.querySelectorAll('.leaflet-marker-icon, .leaflet-marker-pane img').forEach((marker) => {
      if (marker.dataset.rlA9Bound === '1') return;
      const label = `${marker.alt || ''} ${marker.title || ''} ${marker.getAttribute('aria-label') || ''}`.toLowerCase();
      if (/critical|severe|emergency|major/.test(label)) {
        marker.dataset.rlA9Bound = '1';
        marker.classList.add('rl-a9-marker-pulse');
      }
    });
  }

  function init() {
    mount();
    animateCriticalMarkers();
    const observer = new MutationObserver(() => requestAnimationFrame(animateCriticalMarkers));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['alt', 'title', 'aria-label'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
