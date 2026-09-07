/* ReliefLink - stable Leaflet zoom controller. */
(function () {
  'use strict';

  function optimize(map) {
    if (!map || map.__reliefLinkStableZoom) return;
    map.__reliefLinkStableZoom = true;

    // Do not transform the map container itself. Leaflet must own the map
    // transforms so geographic overlays stay locked to their coordinates.
    map.options.zoomAnimation = false;
    map.options.fadeAnimation = false;
    map.options.markerZoomAnimation = false;
    map.options.wheelDebounceTime = 40;
    map.options.wheelPxPerZoomLevel = 120;

    const container = map.getContainer && map.getContainer();
    if (container) {
      container.style.willChange = 'auto';
      container.style.backfaceVisibility = 'visible';
      container.style.webkitBackfaceVisibility = 'visible';
      container.style.transform = '';
    }

    map.on('zoomstart', () => {
      map.__reliefLinkZooming = true;
    });
    map.on('zoomend', () => {
      map.__reliefLinkZooming = false;
      if (typeof map.invalidateSize === 'function') map.invalidateSize({ animate: false, pan: false });
    });
  }

  function findMap() {
    const map = window.__reliefLinkActiveMap;
    if (map) optimize(map);
  }

  const timer = setInterval(() => {
    findMap();
    if (window.__reliefLinkActiveMap && window.__reliefLinkActiveMap.__reliefLinkStableZoom) clearInterval(timer);
  }, 250);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', findMap, { once: true });
  else findMap();
})();
