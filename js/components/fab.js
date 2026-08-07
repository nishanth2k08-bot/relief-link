// ReliefLink Quick Action Floating SOS Button

import { store } from '../state.js';

export function renderFAB() {
  return `
    <button id="fab-sos-button" class="fab-sos" title="Rapid SOS Incident Submission">
      <i class="fa-solid fa-truck-medical"></i>
    </button>
  `;
}

export function bindFABEvents(container) {
  const fab = container.querySelector('#fab-sos-button');
  if (fab) {
    fab.addEventListener('click', () => {
      store.setCurrentView('report');
    });
  }
}
