/* ReliefLink - Live Disaster Data Overlay
 * Optimized official USGS earthquakes + NASA EONET events.
 * Network refreshes never run while the map is being zoomed/panned.
 */
(function () {
  'use strict';

  const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php?format=geojson&feed=all_hour';
  const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open&days=7';
  const REFRESH_MS = 60 * 1000;
  const MAX_EARTHQUAKES = 100;
  const MAX_EONET = 100;

  let liveMap = null;
  let liveEarthquakes = null;
  let liveEonet = null;
  let refreshTimer = null;
  let refreshQueued = false;
  let isInteracting = false;
  let requestInFlight = false;

  const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));

  const severityForMagnitude = (mag) => {
    if (mag >= 6) return { label: 'critical', color: '#EF4444' };
    if (mag >= 4.5) return { label: 'high', color: '#F59E0B' };
    if (mag >= 2.5) return { label: 'medium', color: '#EAB308' };
    return { label: 'low', color: '#22C55E' };
  };

  function status(text) {
    const el = document.querySelector('#live-data-status');
    if (el) el.textContent = text;
  }

  function point(feature) {
    const g = feature && feature.geometry;
    if (!g || g.type !== 'Point' || !Array.isArray(g.coordinates)) return null;
    const lng = Number(g.coordinates[0]);
    const lat = Number(g.coordinates[1]);
    return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
  }

  function bindInteraction(map) {
    if (!map || map.__reliefLinkLiveInteractionBound) return;
    map.__reliefLinkLiveInteractionBound = true;
    map.on('zoomstart movestart', () => { isInteracting = true; });
    map.on('zoomend moveend', () => {
      isInteracting = false;
      if (refreshQueued) {
        refreshQueued = false;
        window.setTimeout(() => refresh(map), 300);
      }
    });
  }

  async function refresh(map) {
    if (!map || !window.L || requestInFlight) return;
    if (isInteracting) {
      refreshQueued = true;
      return;
    }

    requestInFlight = true;
    try {
      const [eqResponse, eonetResponse] = await Promise.all([
        fetch(USGS_URL, { cache: 'no-store' }),
        fetch(EONET_URL, { cache: 'no-store' })
      ]);
      if (!eqResponse.ok) throw new Error(`USGS ${eqResponse.status}`);
      if (!eonetResponse.ok) throw new Error(`NASA EONET ${eonetResponse.status}`);
      const [eqData, eonetData] = await Promise.all([eqResponse.json(), eonetResponse.json()]);

      const nextEarthquakes = window.L.layerGroup();
      const nextEonet = window.L.layerGroup();

      const earthquakes = Array.isArray(eqData.features) ? eqData.features.slice(0, MAX_EARTHQUAKES) : [];
      earthquakes.forEach((feature) => {
        const coords = point(feature);
        if (!coords) return;
        const props = feature.properties || {};
        const mag = Number(props.mag);
        const sev = severityForMagnitude(Number.isFinite(mag) ? mag : 0);
        const place = safe(props.place || 'Unknown location');
        const when = props.time ? new Date(props.time).toLocaleString() : 'Unknown time';
        const depth = feature.geometry.coordinates.length > 2 ? Number(feature.geometry.coordinates[2]) : null;

        window.L.circleMarker(coords, {
          radius: Math.max(4, Math.min(11, 4 + (Number.isFinite(mag) ? mag * 0.8 : 0))),
          color: sev.color,
          weight: 2,
          fillColor: sev.color,
          fillOpacity: 0.72,
          bubblingMouseEvents: false,
          className: 'live-earthquake-beacon'
        }).bindPopup(`
          <div style="color:#111;font-family:sans-serif;max-width:250px;">
            <h4 style="margin:0 0 5px;color:${sev.color};">Live Earthquake · M${Number.isFinite(mag) ? mag.toFixed(1) : '—'}</h4>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Location:</strong> ${place}</p>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Severity:</strong> ${sev.label}</p>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Time:</strong> ${safe(when)}</p>
            <p style="margin:0;font-size:.78rem;"><strong>Depth:</strong> ${Number.isFinite(depth) ? depth + ' km' : '—'}</p>
            <p style="margin:6px 0 0;font-size:.72rem;">Source: USGS Earthquake Hazards Program</p>
          </div>
        `).addTo(nextEarthquakes);
      });

      const eonetFeatures = Array.isArray(eonetData.features) ? eonetData.features.slice(0, MAX_EONET) : [];
      let eonetCount = 0;
      eonetFeatures.forEach((feature) => {
        const coords = point(feature);
        if (!coords) return;
        eonetCount++;
        const props = feature.properties || {};
        const title = safe(props.title || 'NASA natural event');
        const category = safe(Array.isArray(props.categories) ? props.categories.map(c => c.title || c).join(', ') : (props.categories || 'Natural event'));
        const date = props.date ? new Date(props.date).toLocaleString() : 'Unknown date';

        window.L.circleMarker(coords, {
          radius: 5,
          color: '#A78BFA',
          weight: 2,
          fillColor: '#7C3AED',
          fillOpacity: 0.78,
          bubblingMouseEvents: false,
          className: 'live-eonet-beacon'
        }).bindPopup(`
          <div style="color:#111;font-family:sans-serif;max-width:250px;">
            <h4 style="margin:0 0 5px;color:#6D28D9;">${title}</h4>
            <p style="margin:0 0 4px;font-size:.8rem;"><strong>Category:</strong> ${category}</p>
            <p style="margin:0;font-size:.8rem;"><strong>Reported:</strong> ${safe(date)}</p>
            <p style="margin:6px 0 0;font-size:.72rem;">Source: NASA EONET</p>
          </div>
        `).addTo(nextEonet);
      });

      if (!liveEarthquakes) liveEarthquakes = window.L.layerGroup();
      if (!liveEonet) liveEonet = window.L.layerGroup();
      const oldEarthquakes = liveEarthquakes;
      const oldEonet = liveEonet;
      if (map.hasLayer(oldEarthquakes)) map.removeLayer(oldEarthquakes);
      if (map.hasLayer(oldEonet)) map.removeLayer(oldEonet);
      liveEarthquakes = nextEarthquakes;
      liveEonet = nextEonet;

      if (!isInteracting) {
        liveEarthquakes.addTo(map);
        liveEonet.addTo(map);
      } else {
        refreshQueued = true;
      }

      const eqEl = document.querySelector('#earthquake-count');
      const eonetEl = document.querySelector('#eonet-count');
      if (eqEl) eqEl.textContent = `${earthquakes.length} active`;
      if (eonetEl) eonetEl.textContent = `${eonetCount} active`;
      status(`Live feeds • USGS: ${earthquakes.length} earthquakes • NASA: ${eonetCount} events • Updated ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.warn('Live disaster feed refresh failed:', error);
      status('Live feeds • Unable to refresh public disaster feeds right now');
    } finally {
      requestInFlight = false;
    }
  }

  function attach() {
    const map = window.__reliefLinkActiveMap;
    if (!map || !window.L || liveMap === map) return;
    liveMap = map;
    bindInteraction(map);
    refresh(map);
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(() => refresh(liveMap), REFRESH_MS);
  }

  setInterval(attach, 1000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
