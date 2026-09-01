// ReliefLink Sidebar Component - 10 Screen Navigation Menu

import { store } from '../state.js';

export function renderSidebar() {
  const currentView = store.currentView;
  const user = store.currentUser;
  const criticalCount = store.incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const unassignedCount = store.incidents.filter(i => i.status === 'unassigned').length;

  const navItems = [
    { id: 'overview', icon: 'fa-gauge-high', label: store.t('dashboard') },
    { id: 'map', icon: 'fa-map-location-dot', label: store.t('liveMap'), badge: criticalCount > 0 ? `${criticalCount} Crit` : null, badgeClass: 'critical' },
    { id: 'resources', icon: 'fa-boxes-stacked', label: store.t('resources') },
    { id: 'report', icon: 'fa-triangle-exclamation', label: store.t('reportIncident') },
    { id: 'comms', icon: 'fa-walkie-talkie', label: store.t('commsFeed') },
    { id: 'teams', icon: 'fa-users-gear', label: store.t('teamTracker') },
    { id: 'queue', icon: 'fa-list-check', label: store.t('priorityQueue'), badge: unassignedCount > 0 ? `${unassignedCount}` : null, badgeClass: 'info' },
    { id: 'sitrep', icon: 'fa-file-invoice-dollar', label: store.t('sitRep') }
  ];

  return `
    <aside class="app-sidebar">
      <ul class="nav-menu">
        ${navItems.map(item => `
          <li>
            <button class="nav-item-btn ${currentView === item.id ? 'active' : ''}" data-view="${item.id}">
              <i class="fa-solid ${item.icon} nav-icon"></i>
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge ${item.badgeClass}">${item.badge}</span>` : ''}
            </button>
          </li>
        `).join('')}
      </ul>

      <div class="sidebar-footer">
        <div class="agency-user-info">
          <div class="user-avatar">${user.avatar}</div>
          <div class="user-details">
            <span class="user-name">${user.name}</span>
            <span class="user-agency">${user.agency}</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function bindSidebarEvents(container) {
  container.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const viewId = e.currentTarget.getAttribute('data-view');
      store.setCurrentView(viewId);
    });
  });
}
