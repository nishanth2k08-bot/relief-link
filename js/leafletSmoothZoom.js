/* ReliefLink - smooth Leaflet zoom controller. */
(function () {
  'use strict';

  function optimize(map) {
    if (!map || map.__reliefLinkSmoothZoom) return;
    map.__reliefLinkSmoothZoom = true;

    // Keep Leaflet's native animated zoom, but make wheel input responsive.
    map.options.zoomAnimation = true;
    map.options.zoomAnimationThreshold = 8;
    map.options.fadeAnimation = true;
    map.options.markerZoomAnimation = false;
    map.options.wheelDebounceTime = 20;
    map.options.wheelPxPerZoomLevel = 90;

    const container = map.getContainer && map.getContainer();
    if (container) {
      container.style.willChange = 'transform';
      container.style.backfaceVisibility = 'hidden';
      container.style.webkitBackfaceVisibility = 'hidden';
      container.style.transform = 'translateZ(0)';
    }

    // Do not rebuild live data while the user is actively zooming.
    map.on('zoomstart', () => {
      map.__reliefLinkZooming = true;
      if (window.__reliefLinkPauseLiveRefresh) window.__reliefLinkPauseLiveRefresh(true);
    });
    map.on('zoomend', () => {
      map.__reliefLinkZooming = false;
      if (window.__reliefLinkPauseLiveRefresh) window.__reliefLinkPauseLiveRefresh(false);
    });
  }

  function findMap() {
    const map = window.__reliefLinkActiveMap;
    if (map) optimize(map);
  }

  const timer = setInterval(() => {
    findMap();
    if (window.__reliefLinkActiveMap && window.__reliefLinkActiveMap.__reliefLinkSmoothZoom) {
      clearInterval(timer);
    }
  }, 250);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', findMap, { once: true });
  else findMap();
})();
