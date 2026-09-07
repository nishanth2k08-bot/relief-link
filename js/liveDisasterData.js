/* ReliefLink - Live Disaster Data Overlay
 * Adds official live USGS earthquakes and NASA EONET events to the existing map.
 * Does not modify existing incidents, Firebase state, or response workflows.
 */
(function () {
  'use strict';

  const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php?format=geojson&feed=all_hour';
  const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open&days=7';
  const REFRESH_MS = 60 * 1000;

  let liveTimer = null;
  let liveMap = null;
  let liveEarthquakes = null;
  let liveEonet = null;

  const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));

  const severityForMagnitude = (mag) => {
    if (mag >= 6) return { label: 'critical', color: '#EF4444' };
    if (mag >= 4.5) return { label: 'high', color: '#F59E0B' };
    if (mag >= 2.5) return { label: 'medium', color: '#EAB308' };
    return { label: 'low', color: '#22C55E' };
  };

  function updateStatus(text) {
    const el = document.querySelector('#live-data-status');
    if (el) el.textContent = text;
  }

  function updateEarthquakeCount(count) {
    const el = document.querySelector('#earthquake-count');
    if (el) el.textContent = `${count} active`;
  }

  function updateEonetCount(count) {
    const el = document.querySelector('#eonet-count');
    if (el) el.textContent = `${count} active`;
  }

  function getCoordinates(feature) {
    const geometry = feature && feature.geometry;
    if (!geometry) return null;
    if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
      const [lng, lat] = geometry.coordinates;
      if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
    }
    return null;
  }

  async function refresh(map) {
    if (!map || !window.L) return;
    liveMap = map;

    try {
      const [eqResponse, eonetResponse] = await Promise.all([
        fetch(USGS_URL, { cache: 'no-store' }),
        fetch(EONET_URL, { cache: 'no-store' })
      ]);
      if (!eqResponse.ok) throw new Error(`USGS ${eqResponse.status}`);
      if (!eonetResponse.ok) throw new Error(`NASA EONET ${eonetResponse.status}`);

      const [eqData, eonetData] = await Promise.all([
        eqResponse.json(),
        eonetResponse.json()
      ]);

      if (!liveEarthquakes) liveEarthquakes = window.L.layerGroup().addTo(map);
      if (!liveEonet) liveEonet = window.L.layerGroup().addTo(map);
      liveEarthquakes.clearLayers();
      liveEonet.clearLayers();

      const earthquakes = Array.isArray(eqData.features) ? eqData.features : [];
      earthquakes.forEach((feature) => {
        const coords = getCoordinates(feature);
        if (!coords) return;
        const props = feature.properties || {};
        const mag = Number(props.mag);
        const severity = severityForMagnitude(Number.isFinite(mag) ? mag : 0);
        const place = safe(props.place || 'Unknown location');
        const when = props.time ? new Date(props.time).toLocaleString() : 'Unknown time';
        const depth = feature.geometry.coordinates.length > 2 ? Number(feature.geometry.coordinates[2]) : null;

        window.L.circleMarker(coords, {
          radius: Math.max(5, Math.min(13, 5 + (Number.isFinite(mag) ? mag : 0))),
          color: severity.color,
          weight: 2,
          fillColor: severity.color,
          fillOpacity: 0.72,
          className: 'live-earthquake-beacon'
        }).bindPopup(`
          <div style="color:#111;font-family:sans-serif;max-width:250px;">
            <h4 style="margin:0 0 5px;color:${severity.color};">Live Earthquake · M${Number.isFinite(mag) ? mag.toFixed(1) : '—'}</h4>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Location:</strong> ${place}</p>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Severity:</strong> ${severity.label}</p>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Time:</strong> ${safe(when)}</p>
            <p style="margin:0;font-size:.78rem;"><strong>Depth:</strong> ${Number.isFinite(depth) ? depth + ' km' : '—'}</p>
            <p style="margin:6px 0 0;font-size:.72rem;">Source: USGS Earthquake Hazards Program</p>
          </div>
        `).addTo(liveEarthquakes);
      });
      updateEarthquakeCount(earthquakes.length);

      const eonetFeatures = Array.isArray(eonetData.features) ? eonetData.features : [];
      let eonetPointCount = 0;
      eonetFeatures.forEach((feature) => {
        const coords = getCoordinates(feature);
        if (!coords) return;
        eonetPointCount += 1;
        const props = feature.properties || {};
        const title = safe(props.title || 'NASA natural event');
        const category = safe(props.categories || 'Natural event');
        const date = props.date ? new Date(props.date).toLocaleString() : 'Unknown date';

        window.L.circleMarker(coords, {
          radius: 6,
          color: '#A78BFA',
          weight: 2,
          fillColor: '#7C3AED',
          fillOpacity: 0.78,
          className: 'live-eonet-beacon'
        }).bindPopup(`
          <div style="color:#111;font-family:sans-serif;max-width:250px;">
            <h4 style="margin:0 0 5px;color:#6D28D9;">${title}</h4>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Category:</strong> ${category}</p>
            <p style="margin:0;font-size:.8rem;"><strong>Reported:</strong> ${safe(date)}</p>
            <p style="margin:6px 0 0;font-size:.72rem;">Source: NASA EONET</p>
          </div>
        `).addTo(liveEonet);
      });
      updateEonetCount(eonetPointCount);

      updateStatus(`Live feeds • USGS: ${earthquakes.length} earthquakes • NASA: ${eonetPointCount} events • Updated ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.warn('Live disaster feed refresh failed:', error);
      updateStatus('Live feeds • Unable to refresh public disaster feeds right now');
    }
  }

  function attachToMap() {
    const map = window.__reliefLinkActiveMap;
    if (!map || !window.L) return false;

    if (liveMap !== map) {
      liveMap = map;
      refresh(map);
      if (liveTimer) clearInterval(liveTimer);
      liveTimer = setInterval(() => refresh(liveMap), REFRESH_MS);
    }
    return true;
  }

  const originalSetInterval = window.setInterval;

  function waitForMap() {
    if (attachToMap()) return;
    originalSetInterval(waitForMap, 500);
  }

  document.addEventListener('DOMContentLoaded', waitForMap);
  waitForMap();

  // The existing bundle doesn't expose its Leaflet map globally.
  // Observe the map container and detect the Leaflet instance through DOM internals.
  originalSetInterval(() => {
    const mapEl = document.querySelector('#disaster-map-element');
    if (!mapEl || !window.L) return;
    const map = mapEl._leaflet_map_instance || mapEl._leaflet_id && window.L.DomUtil.get(mapEl)._leaflet_map;
    if (map && map !== liveMap) {
      window.__reliefLinkActiveMap = map;
      attachToMap();
    }
  }, 500);
})();
