/* ReliefLink: disable the legacy Leaflet renderer for the Global Disaster Map.
 * The application still loads Leaflet for compatibility, but the map view is owned by Cesium.
 */
(function () {
  'use strict';
  if (!window.L || window.L.__reliefLink3DGuard) return;

  const originalMap = window.L.map;

  function makeNoopMap() {
    const map = {
      _layers: [],
      _container: null,
      addLayer(layer) {
        if (layer && this._layers.indexOf(layer) === -1) this._layers.push(layer);
        return this;
      },
      removeLayer(layer) {
        this._layers = this._layers.filter(item => item !== layer);
        return this;
      },
      addControl() { return this; },
      removeControl() { return this; },
      on() { return this; },
      off() { return this; },
      once() { return this; },
      invalidateSize() { return this; },
      setView() { return this; },
      flyTo() { return this; },
      panTo() { return this; },
      fitBounds() { return this; },
      getCenter() { return { lat: 18, lng: 0 }; },
      getZoom() { return 2.1; },
      remove() {
        this._layers.length = 0;
        return this;
      }
    };
    return map;
  }

  window.L.map = function (target) {
    const el = typeof target === 'string' ? document.getElementById(target) : target;
    if (el && el.id === 'disaster-map-element') {
      el.classList.add('relieflink-cesium-only');
      el.style.setProperty('background', '#02050a', 'important');
      return makeNoopMap();
    }
    return originalMap.apply(this, arguments);
  };

  window.L.__reliefLink3DGuard = true;
})();
