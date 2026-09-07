/* ReliefLink - lightweight Leaflet map bridge.
 * Exposes the existing map instance without changing Leaflet behavior.
 */
(function () {
  'use strict';

  function bridge() {
    if (!window.L || window.L.__reliefLinkMapBridged) return !!window.L;
    const originalMap = window.L.map;
    window.L.map = function () {
      const map = originalMap.apply(this, arguments);
      window.__reliefLinkActiveMap = map;
      return map;
    };
    window.L.__reliefLinkMapBridged = true;
    return true;
  }

  if (bridge()) return;
  const timer = setInterval(() => {
    if (bridge()) clearInterval(timer);
  }, 100);
})();
