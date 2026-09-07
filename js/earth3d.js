/* ReliefLink 3D Earth
 * CesiumJS globe with satellite imagery and live USGS/NASA disaster events.
 */
(function () {
  'use strict';

  const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson';
  const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open&days=7';
  const REFRESH_MS = 60 * 1000;
  const MAX_EONET = 80;

  let viewer = null;
  let host = null;
  let refreshTimer = null;
  let refreshInFlight = false;

  const safe = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));

  const severity = (mag) => {
    if (mag >= 6) return { color: '#ff3b30', label: 'Critical' };
    if (mag >= 5) return { color: '#ff9500', label: 'High' };
    return { color: '#ffd60a', label: 'Moderate' };
  };

  function setStatus(text) {
    const el = document.querySelector('#live-data-status');
    if (el) el.textContent = text;
  }

  function setCount(id, value) {
    const el = document.querySelector(id);
    if (el) el.textContent = `${value} active`;
  }

  function prepareHost(mapEl) {
    if (!mapEl) return null;
    mapEl.classList.add('relieflink-3d-host');
    mapEl.style.position = 'relative';
    mapEl.style.overflow = 'hidden';

    let globeEl = mapEl.querySelector('#relieflink-3d-earth');
    if (!globeEl) {
      globeEl = document.createElement('div');
      globeEl.id = 'relieflink-3d-earth';
      globeEl.setAttribute('aria-label', 'ReliefLink interactive 3D Earth');
      mapEl.appendChild(globeEl);
    }

    const leaflet = mapEl.querySelector('.leaflet-container');
    if (leaflet) leaflet.style.display = 'none';
    return globeEl;
  }

  function createViewer(globeEl) {
    if (!window.Cesium || !globeEl) return null;

    const imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maximumLevel: 19,
      enablePickFeatures: false,
      credit: 'Esri World Imagery'
    });

    const v = new Cesium.Viewer(globeEl, {
      baseLayerPicker: false,
      baseLayer: new Cesium.ImageryLayer(imageryProvider),
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: true,
      sceneModePicker: true,
      navigationHelpButton: false,
      fullscreenButton: true,
      vrButton: false,
      shadows: false,
      scene3DOnly: true,
      shouldAnimate: false,
      requestRenderMode: false,
      selectionIndicator: true,
      infoBox: true
    });

    v.scene.globe.enableLighting = true;
    v.scene.globe.showGroundAtmosphere = true;
    v.scene.skyAtmosphere.show = true;
    v.scene.fog.enabled = true;
    v.scene.fog.density = 0.00008;
    v.scene.backgroundColor = Cesium.Color.BLACK;
    v.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.5);

    v.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(78, 18, 17000000),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-62),
        roll: 0
      }
    });

    return v;
  }

  function addEarthquake(entityCollection, feature) {
    const coords = feature.geometry && feature.geometry.coordinates;
    if (!Array.isArray(coords)) return false;
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    const mag = Number(feature.properties && feature.properties.mag);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

    const s = severity(Number.isFinite(mag) ? mag : 0);
    const props = feature.properties || {};
    const place = safe(props.place || 'Unknown location');
    const when = props.time ? new Date(props.time).toLocaleString() : 'Unknown time';
    const depth = Number.isFinite(Number(coords[2])) ? `${Number(coords[2]).toFixed(1)} km` : '—';

    entityCollection.add({
      position: Cesium.Cartesian3.fromDegrees(lng, lat, 18000),
      point: {
        pixelSize: Number.isFinite(mag) ? Math.max(8, Math.min(20, 7 + mag * 1.7)) : 10,
        color: Cesium.Color.fromCssColorString(s.color),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(1.0e5, 1.4, 2.5e7, 0.65)
      },
      label: {
        text: `M${Number.isFinite(mag) ? mag.toFixed(1) : '—'}`,
        font: '600 13px Inter, sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        pixelOffset: new Cesium.Cartesian2(0, -24),
        showBackground: true,
        backgroundColor: Cesium.Color.fromAlpha(Cesium.Color.BLACK, 0.65),
        scaleByDistance: new Cesium.NearFarScalar(5.0e5, 1, 1.5e7, 0.45),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      description: `
        <div style="font-family:Inter,Arial,sans-serif;padding:4px 2px;">
          <h3 style="margin:0 0 8px;color:${s.color};">Live Earthquake · M${Number.isFinite(mag) ? mag.toFixed(1) : '—'}</h3>
          <p><b>Location:</b> ${place}</p>
          <p><b>Severity:</b> ${s.label}</p>
          <p><b>Depth:</b> ${depth}</p>
          <p><b>Time:</b> ${safe(when)}</p>
          <small>Source: USGS Earthquake Hazards Program</small>
        </div>`
    });
    return true;
  }

  function addEonet(entityCollection, feature) {
    const geometry = feature.geometry;
    if (!geometry || geometry.type !== 'Point' || !Array.isArray(geometry.coordinates)) return false;
    const lng = Number(geometry.coordinates[0]);
    const lat = Number(geometry.coordinates[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

    const props = feature.properties || {};
    const title = safe(props.title || 'NASA natural event');
    const categories = Array.isArray(props.categories)
      ? props.categories.map(c => safe(c.title || c.id || '')).filter(Boolean).join(', ')
      : safe(props.categories || 'Natural event');
    const date = props.date ? new Date(props.date).toLocaleString() : 'Unknown date';

    entityCollection.add({
      position: Cesium.Cartesian3.fromDegrees(lng, lat, 12000),
      point: {
        pixelSize: 9,
        color: Cesium.Color.fromCssColorString('#9b7cff'),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(1.0e5, 1.2, 2.5e7, 0.6)
      },
      description: `
        <div style="font-family:Inter,Arial,sans-serif;padding:4px 2px;">
          <h3 style="margin:0 0 8px;color:#9b7cff;">${title}</h3>
          <p><b>Category:</b> ${categories || 'Natural event'}</p>
          <p><b>Reported:</b> ${safe(date)}</p>
          <small>Source: NASA EONET</small>
        </div>`
    });
    return true;
  }

  async function refresh() {
    if (!viewer || viewer.isDestroyed() || refreshInFlight) return;
    refreshInFlight = true;
    try {
      const [eqResponse, eonetResponse] = await Promise.all([
        fetch(USGS_URL, { cache: 'no-store' }),
        fetch(EONET_URL, { cache: 'no-store' })
      ]);
      if (!eqResponse.ok) throw new Error(`USGS ${eqResponse.status}`);
      if (!eonetResponse.ok) throw new Error(`NASA EONET ${eonetResponse.status}`);

      const [eqData, eonetData] = await Promise.all([eqResponse.json(), eonetResponse.json()]);
      viewer.entities.removeAll();

      const earthquakes = Array.isArray(eqData.features) ? eqData.features : [];
      let earthquakeCount = 0;
      earthquakes.forEach((feature) => {
        if (addEarthquake(viewer.entities, feature)) earthquakeCount++;
      });

      const eonetFeatures = Array.isArray(eonetData.features) ? eonetData.features : [];
      let eonetCount = 0;
      for (const feature of eonetFeatures) {
        if (eonetCount >= MAX_EONET) break;
        if (addEonet(viewer.entities, feature)) eonetCount++;
      }

      setCount('#earthquake-count', earthquakeCount);
      setCount('#eonet-count', eonetCount);
      setStatus(`3D Earth • USGS: ${earthquakeCount} earthquakes • NASA: ${eonetCount} events • Updated ${new Date().toLocaleTimeString()}`);
      viewer.scene.requestRender();
    } catch (error) {
      console.warn('3D disaster feed refresh failed:', error);
      setStatus('3D Earth • Live feeds temporarily unavailable');
    } finally {
      refreshInFlight = false;
    }
  }

  function destroy() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (viewer && !viewer.isDestroyed()) viewer.destroy();
    viewer = null;
    host = null;
  }

  function ensure() {
    const mapEl = document.querySelector('#disaster-map-element');
    if (!mapEl || !window.Cesium) {
      if (!mapEl && viewer) destroy();
      return;
    }

    if (host !== mapEl || !viewer || viewer.isDestroyed()) {
      destroy();
      host = mapEl;
      const globeEl = prepareHost(mapEl);
      viewer = createViewer(globeEl);
      if (!viewer) return;
      refresh();
      refreshTimer = setInterval(refresh, REFRESH_MS);
    }
  }

  function installStyles() {
    if (document.getElementById('relieflink-3d-earth-style')) return;
    const style = document.createElement('style');
    style.id = 'relieflink-3d-earth-style';
    style.textContent = `
      #disaster-map-element.relieflink-3d-host { background:#02050a !important; }
      #relieflink-3d-earth { position:absolute; inset:0; z-index:2; background:#02050a; }
      #relieflink-3d-earth .cesium-viewer-bottom { font-size:10px; }
      #relieflink-3d-earth .cesium-viewer-toolbar { top:12px; right:12px; }
      #relieflink-3d-earth .cesium-viewer-fullscreenContainer { display:none; }
      #relieflink-3d-earth .cesium-selection-wrapper { z-index:30; }
    `;
    document.head.appendChild(style);
  }

  function start() {
    installStyles();
    ensure();
    const observer = new MutationObserver(() => ensure());
    observer.observe(document.body, { childList: true, subtree: true });
    window.ReliefLink3DEarth = { refresh, getViewer: () => viewer };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
