// Screen 4: Resource Allocation Panel (Medical, Food, Shelter, Personnel)

import { store } from '../state.js';

export function renderResourceView() {
  const resources = store.resources;

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-boxes-stacked" style="color: var(--color-primary);"></i>
            Relief Resource Allocation Panel
          </h1>
          <p class="view-subtitle">Real-time supply tracking, inventory depletion alerts & field deployment dispatch</p>
        </div>
        <div class="view-actions">
          <button id="btn-restock-modal" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-truck-ramp-box"></i>
            <span>Restock Inventory</span>
          </button>
          <button id="btn-dispatch-resource-modal" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Dispatch Supplies</span>
          </button>
        </div>
      </div>

      <div class="view-body">
        <!-- Resource Stock Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          ${resources.map(res => {
            const percentAvailable = Math.round((res.available / res.total) * 100);
            const isCritical = res.status === 'critical' || res.available <= res.threshold;
            const isWarning = res.status === 'warning';
            const barColor = isCritical ? 'var(--color-critical)' : isWarning ? 'var(--color-high)' : 'var(--color-low)';

            return `
              <div class="card resource-progress-card" style="border-left: 4px solid ${barColor};">
                <div class="card-header" style="margin-bottom: 8px;">
                  <div>
                    <span class="badge ${isCritical ? 'badge-critical' : isWarning ? 'badge-high' : 'badge-low'}" style="margin-bottom: 4px; display: inline-block;">
                      ${res.category}
                    </span>
                    <h3 class="card-title">${res.name}</h3>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-mono); color: ${barColor};">
                      ${res.available.toLocaleString()}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${res.unit} available</span>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">
                  <span>Deployed: <strong style="color: var(--text-main);">${res.deployed.toLocaleString()} ${res.unit}</strong></span>
                  <span>Total Reserve: <strong style="color: var(--text-main);">${res.total.toLocaleString()} ${res.unit}</strong></span>
                </div>

                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${percentAvailable}%; background-color: ${barColor};"></div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 14px;">
                  <button class="btn btn-secondary btn-sm btn-quick-dispatch" data-res-id="${res.id}" style="flex: 1;">
                    <i class="fa-solid fa-dolly"></i> Dispatch
                  </button>
                  <button class="btn btn-secondary btn-sm btn-quick-restock" data-res-id="${res.id}">
                    <i class="fa-solid fa-plus"></i> Add
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function bindResourceViewEvents(container) {
  // Quick Dispatch Button
  container.querySelectorAll('.btn-quick-dispatch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resId = e.currentTarget.getAttribute('data-res-id');
      const res = store.resources.find(r => r.id === resId);
      if (res) {
        const qtyStr = prompt(`Enter quantity of ${res.name} to dispatch (Available: ${res.available} ${res.unit}):`, '10');
        const qty = parseInt(qtyStr, 10);
        if (qty && qty > 0 && qty <= res.available) {
          store.deployResource(resId, qty);
          alert(`Successfully dispatched ${qty} ${res.unit} of ${res.name} to field operations.`);
        } else if (qty > res.available) {
          alert(`Error: Requested quantity exceeds available reserve (${res.available} ${res.unit}).`);
        }
      }
    });
  });

  // Quick Restock Button
  container.querySelectorAll('.btn-quick-restock').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const resId = e.currentTarget.getAttribute('data-res-id');
      const res = store.resources.find(r => r.id === resId);
      if (res) {
        const qtyStr = prompt(`Enter quantity of ${res.name} to add to reserve:`, '50');
        const qty = parseInt(qtyStr, 10);
        if (qty && qty > 0) {
          store.restockResource(resId, qty);
          alert(`Successfully added ${qty} ${res.unit} to ${res.name} inventory.`);
        }
      }
    });
  });

  // Global Restock Button
  const restockModalBtn = container.querySelector('#btn-restock-modal');
  if (restockModalBtn) {
    restockModalBtn.addEventListener('click', () => {
      alert('Inventory Restock Order sent to Central Warehouse staging unit.');
    });
  }

  // Global Dispatch Button
  const dispatchModalBtn = container.querySelector('#btn-dispatch-resource-modal');
  if (dispatchModalBtn) {
    dispatchModalBtn.addEventListener('click', () => {
      const firstRes = store.resources[0];
      if (firstRes) {
        store.deployResource(firstRes.id, 20);
        alert(`Dispatched 20 ${firstRes.unit} of ${firstRes.name} to Sector A.`);
      }
    });
  }
}
