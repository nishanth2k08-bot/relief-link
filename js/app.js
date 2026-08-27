// ReliefLink Main Web Application Entry Point & Reactive View Router

import { store } from './state.js';
import { renderNavbar, bindNavbarEvents } from './components/navbar.js';
import { renderSidebar, bindSidebarEvents } from './components/sidebar.js';
import { renderTicker, bindTickerEvents } from './components/ticker.js';
import { renderFAB, bindFABEvents } from './components/fab.js';

// View Imports
import { renderLoginView, bindLoginViewEvents } from './views/loginView.js';
import { renderOverviewView, bindOverviewViewEvents } from './views/overviewView.js';
import { renderMapView, bindMapViewEvents } from './views/mapView.js';
import { renderResourceView, bindResourceViewEvents } from './views/resourceView.js';
import { renderIncidentReportView, bindIncidentReportViewEvents } from './views/incidentReportView.js';
import { renderCommunicationView, bindCommunicationViewEvents } from './views/communicationView.js';
import { renderTeamTrackerView, bindTeamTrackerViewEvents } from './views/teamTrackerView.js';
import { renderPriorityQueueView, bindPriorityQueueViewEvents } from './views/priorityQueueView.js';
import { renderSitRepView, bindSitRepViewEvents } from './views/sitRepView.js';
import { renderSettingsView, bindSettingsViewEvents } from './views/settingsView.js';

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const currentView = store.currentView;

  // Check High Contrast Theme state on body
  if (store.isHighContrast) {
    document.body.classList.add('theme-high-contrast');
  } else {
    document.body.classList.remove('theme-high-contrast');
  }

  document.body.classList.toggle('theme-light', store.theme === 'light');
  document.body.classList.toggle('theme-dark', store.theme !== 'light');
  // If view is 'login', render standalone login screen
  if (currentView === 'login') {
    appContainer.innerHTML = renderLoginView();
    bindLoginViewEvents(appContainer);
    return;
  }

  // Render Full Application Layout Shell
  appContainer.innerHTML = `
    ${renderNavbar()}
    ${renderTicker()}
    <div class="app-main-layout">
      ${renderSidebar()}
      <main id="view-mount-point" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
        <!-- Active Screen Rendered Here -->
      </main>
    </div>
    ${renderFAB()}
  `;

  // Bind Shell Events
  bindNavbarEvents(appContainer);
  bindTickerEvents(appContainer);
  bindSidebarEvents(appContainer);
  bindFABEvents(appContainer);

  // Mount Active View Component
  const mountPoint = document.getElementById('view-mount-point');
  if (!mountPoint) return;

  switch (currentView) {
    case 'overview':
      mountPoint.innerHTML = renderOverviewView();
      bindOverviewViewEvents(mountPoint);
      break;
    case 'map':
      mountPoint.innerHTML = renderMapView();
      bindMapViewEvents(mountPoint);
      break;
    case 'resources':
      mountPoint.innerHTML = renderResourceView();
      bindResourceViewEvents(mountPoint);
      break;
    case 'report':
      mountPoint.innerHTML = renderIncidentReportView();
      bindIncidentReportViewEvents(mountPoint);
      break;
    case 'comms':
      mountPoint.innerHTML = renderCommunicationView();
      bindCommunicationViewEvents(mountPoint);
      break;
    case 'teams':
      mountPoint.innerHTML = renderTeamTrackerView();
      bindTeamTrackerViewEvents(mountPoint);
      break;
    case 'queue':
      mountPoint.innerHTML = renderPriorityQueueView();
      bindPriorityQueueViewEvents(mountPoint);
      break;
    case 'sitrep':
      mountPoint.innerHTML = renderSitRepView();
      bindSitRepViewEvents(mountPoint);
      break;
    case 'settings':
      mountPoint.innerHTML = renderSettingsView();
      bindSettingsViewEvents(mountPoint);
      break;
    default:
      mountPoint.innerHTML = renderOverviewView();
      bindOverviewViewEvents(mountPoint);
      break;
  }
}

// Initial Boot & Store Subscription
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
});

