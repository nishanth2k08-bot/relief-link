/* ReliefLink - expose the real Leaflet map instance for live disaster feeds. */
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
