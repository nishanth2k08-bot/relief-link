// Screen 3: Live Disaster Zone Map with Severity Overlay (Leaflet GIS)

import { store } from '../state.js';

let activeMapInstance = null;

export function renderMapView() {
  return `
    <div class="view-container" style="height: 100%;">
      <div class="view-header" style="padding: 14px 24px;">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-map-location-dot" style="color: var(--color-critical);"></i>
            Live Disaster Zone GIS Map
          </h1>
          <p class="view-subtitle">Interactive severity heatmaps, sector polygons, responder tracking & live incident pins</p>
        </div>
        <div class="view-actions">
          <button id="btn-recenter-map" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-crosshairs"></i>
            <span>Recenter Command Sector</span>
          </button>
          <button id="btn-map-report" class="btn btn-critical btn-sm">
            <i class="fa-solid fa-plus"></i>
            <span>Pin New Incident</span>
          </button>
        </div>
      </div>

      <div class="view-body" style="padding: 16px 24px; flex: 1; display: flex; flex-direction: column;">
        <div class="map-view-layout" style="flex: 1;">
          
          <!-- Leaflet Canvas Map Wrapper -->
          <div class="gis-map-wrapper">
            <div id="disaster-map-element"></div>
            
            <!-- Map Controls Panel -->
            <div class="map-controls-floating">
              <strong style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Map Layers</strong>
              <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="layer-zones" checked />
                <span>Sector Polygons</span>
              </label>
              <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="layer-incidents" checked />
                <span>Active Incidents</span>
              </label>
              <label style="font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="layer-teams" checked />
                <span>Responder Units</span>
              </label>
            </div>

            <!-- Map Legend -->
            <div class="map-legend-floating">
              <strong style="font-size: 0.75rem; display: block; margin-bottom: 6px;">SEVERITY LEGEND</strong>
              <div class="legend-item">
                <div class="legend-color" style="background: #EF4444;"></div>
                <span>Critical Flood / Hazard</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #F59E0B;"></div>
                <span>High Seismic Danger</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #EAB308;"></div>
                <span>Medium Landslide Risk</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #10B981;"></div>
                <span>Safe Staging Hub</span>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Interactive Incident & Sector Inspector -->
          <div class="card" style="display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fa-solid fa-layer-group" style="color: var(--color-primary);"></i>
                Sector Radar Inspector
              </h3>
            </div>

            <div id="sector-details-list" style="display: flex; flex-direction: column; gap: 14px;">
              ${store.disasterZones.map(zone => `
                <div class="card" style="padding: 14px; background: var(--bg-app); border-color: ${zone.color};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 0.9rem;">${zone.name}</strong>
                    <span class="badge ${zone.severity === 'critical' ? 'badge-critical' : zone.severity === 'high' ? 'badge-high' : 'badge-medium'}">
                      ${zone.severity}
                    </span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
                    <div>Population Affected: <strong>${zone.populationAffected.toLocaleString()}</strong></div>
                    <div>Evacuation: <strong>${zone.evacuatedPercent}% Complete</strong></div>
                    <div>Shelters Operating: <strong>${zone.sheltersActive} Units</strong></div>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-focus-zone" data-lat="${zone.coordinates[0]}" data-lng="${zone.coordinates[1]}" style="width: 100%; margin-top: 10px;">
                    <i class="fa-solid fa-expand"></i> Focus Sector
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function bindMapViewEvents(container) {
  // Initialize Leaflet Map after DOM rendering
  setTimeout(() => {
    const mapElement = container.querySelector('#disaster-map-element');
    if (!mapElement) return;

    if (activeMapInstance) {
      activeMapInstance.remove();
    }

    // Default center: Miami reference (25.7617, -80.1918)
    const map = L.map('disaster-map-element', {
      zoomControl: true
    }).setView([25.7617, -80.1918], 12);

    activeMapInstance = map;

    // Dark Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    // Render Disaster Zone Circles / Polygons
    const zoneLayers = [];
    store.disasterZones.forEach(zone => {
      const circle = L.circle(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.35,
        radius: zone.radius
      }).addTo(map);

      circle.bindPopup(`
        <div style="color: #111; font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 1rem;">${zone.name}</h4>
          <p style="margin: 0; font-size: 0.82rem;"><strong>Severity:</strong> ${zone.severity.toUpperCase()}</p>
          <p style="margin: 0; font-size: 0.82rem;"><strong>Affected:</strong> ${zone.populationAffected.toLocaleString()}</p>
          <p style="margin: 0; font-size: 0.82rem;"><strong>Evacuation:</strong> ${zone.evacuatedPercent}%</p>
        </div>
      `);

      zoneLayers.push(circle);
    });

    // Render Incidents Markers
    const incidentMarkers = [];
    store.incidents.forEach(inc => {
      const markerColor = inc.severity === 'critical' ? '#EF4444' : inc.severity === 'high' ? '#F59E0B' : '#EAB308';
      
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: ${markerColor}; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; box-shadow: 0 0 10px ${markerColor};">
                 <i class="fa-solid fa-triangle-exclamation"></i>
               </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([inc.lat, inc.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="color: #111; font-family: sans-serif; max-width: 220px;">
          <h4 style="margin: 0 0 4px 0; color: ${markerColor};">${inc.title}</h4>
          <p style="margin: 0 0 4px 0; font-size: 0.8rem;">${inc.description}</p>
          <p style="margin: 0; font-size: 0.78rem;"><strong>Casualties:</strong> ${inc.casualties}</p>
          <p style="margin: 0 0 8px 0; font-size: 0.78rem;"><strong>Status:</strong> ${inc.status}</p>
          <button id="pop-dispatch-${inc.id}" style="background: #3B82F6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; width: 100%;">
            Dispatch Team
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pop-dispatch-${inc.id}`);
        if (btn) {
          btn.onclick = () => {
            const squad = prompt('Enter squad to dispatch:', 'Squad Alpha (SAR)');
            if (squad) {
              store.updateIncidentStatus(inc.id, 'in_progress', squad);
              map.closePopup();
            }
          };
        }
      });

      incidentMarkers.push(marker);
    });

    // Recenter Map
    const recenterBtn = container.querySelector('#btn-recenter-map');
    if (recenterBtn) {
      recenterBtn.onclick = () => map.setView([25.7617, -80.1918], 12);
    }

    // Pin New Incident Button
    const pinReportBtn = container.querySelector('#btn-map-report');
    if (pinReportBtn) {
      pinReportBtn.onclick = () => store.setCurrentView('report');
    }

    // Focus Sector buttons
    container.querySelectorAll('.btn-focus-zone').forEach(btn => {
      btn.onclick = (e) => {
        const lat = parseFloat(e.currentTarget.getAttribute('data-lat'));
        const lng = parseFloat(e.currentTarget.getAttribute('data-lng'));
        map.flyTo([lat, lng], 14);
      };
    });

  }, 100);
}
