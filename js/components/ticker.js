// ReliefLink Emergency Alert Broadcast Ticker Component

import { store } from '../state.js';

export function renderTicker() {
  const latestAlerts = store.alerts;
  const marqueeText = latestAlerts.join('  •  ');

  return `
    <div class="alert-ticker-bar">
      <div class="ticker-label">
        <i class="fa-solid fa-bullhorn"></i>
        <span>DISASTER BROADCAST</span>
      </div>
      <div class="ticker-content">
        <div class="ticker-text">${marqueeText}</div>
      </div>
      <button id="btn-broadcast-trigger" class="btn btn-critical btn-sm" style="font-size:0.7rem; padding: 2px 8px;">
        <i class="fa-solid fa-tower-broadcast"></i>
        <span>Broadcast</span>
      </button>
    </div>
  `;
}

export function bindTickerEvents(container) {
  const broadcastBtn = container.querySelector('#btn-broadcast-trigger');
  if (broadcastBtn) {
    broadcastBtn.addEventListener('click', () => {
      const msg = prompt('Enter High-Priority Multi-Agency Broadcast Message:');
      if (msg && msg.trim()) {
        store.broadcastAlert(msg.trim());
      }
    });
  }
}
