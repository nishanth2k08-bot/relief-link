// Screen 8: Priority Task Queue (Kanban & List Triage System)

import { store } from '../state.js';

export function renderPriorityQueueView() {
  const incidents = store.incidents;

  const columns = [
    { id: 'unassigned', title: 'Unassigned Queue', color: 'var(--color-critical)' },
    { id: 'assigned', title: 'Assigned & Dispatched', color: 'var(--color-high)' },
    { id: 'in_progress', title: 'Rescue Operations In Progress', color: 'var(--color-primary)' },
    { id: 'resolved', title: 'Resolved & Stabilized', color: 'var(--color-low)' }
  ];

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-list-check" style="color: var(--color-primary);"></i>
            Priority Task Triage Queue
          </h1>
          <p class="view-subtitle">AI-calculated SLA urgency queue for rapid resource allocation under stress</p>
        </div>
      </div>

      <div class="view-body">
        <!-- Kanban Triage Columns -->
        <div class="kanban-board">
          ${columns.map(col => {
            const colIncidents = incidents.filter(i => i.status === col.id);

            return `
              <div class="kanban-column">
                <div class="column-header" style="border-top: 3px solid ${col.color};">
                  <span>${col.title}</span>
                  <span class="badge badge-medium">${colIncidents.length}</span>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                  ${colIncidents.map(inc => {
                    const priorityScore = store.calculatePriorityScore(inc);
                    const badgeClass = inc.severity === 'critical' ? 'badge-critical' : inc.severity === 'high' ? 'badge-high' : 'badge-medium';

                    return `
                      <div class="task-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                          <span class="badge ${badgeClass}">${inc.severity}</span>
                          <span style="font-size: 0.72rem; font-weight: 800; color: var(--color-primary); background: var(--color-primary-bg); padding: 2px 6px; border-radius: 4px;">
                            AI SLA: ${priorityScore}
                          </span>
                        </div>

                        <strong style="font-size: 0.88rem; display: block; margin-bottom: 4px;">${inc.title}</strong>
                        <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">${inc.locationName}</p>

                        ${inc.casualties > 0 ? `
                          <div style="font-size: 0.75rem; color: var(--color-critical); font-weight: 700; margin-bottom: 8px;">
                            <i class="fa-solid fa-user-injured"></i> ${inc.casualties} Casualties Reported
                          </div>
                        ` : ''}

                        ${inc.assignedSquad ? `
                          <div style="font-size: 0.75rem; color: var(--color-low); font-weight: 600; margin-bottom: 8px;">
                            <i class="fa-solid fa-truck-fast"></i> ${inc.assignedSquad}
                          </div>
                        ` : ''}

                        <div style="display: flex; gap: 4px; border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 6px;">
                          ${col.id !== 'unassigned' ? `
                            <button class="btn btn-secondary btn-sm btn-move-task" data-inc-id="${inc.id}" data-target="unassigned" title="Move back to Unassigned" style="padding: 2px 6px; font-size: 0.7rem;">
                              ←
                            </button>
                          ` : ''}

                          ${col.id !== 'assigned' ? `
                            <button class="btn btn-secondary btn-sm btn-move-task" data-inc-id="${inc.id}" data-target="assigned" style="flex: 1; font-size: 0.72rem;">
                              Assign
                            </button>
                          ` : ''}

                          ${col.id !== 'in_progress' ? `
                            <button class="btn btn-secondary btn-sm btn-move-task" data-inc-id="${inc.id}" data-target="in_progress" style="flex: 1; font-size: 0.72rem;">
                              Progress
                            </button>
                          ` : ''}

                          ${col.id !== 'resolved' ? `
                            <button class="btn btn-primary btn-sm btn-move-task" data-inc-id="${inc.id}" data-target="resolved" style="font-size: 0.72rem;">
                              Resolve ✓
                            </button>
                          ` : ''}
                        </div>

                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function bindPriorityQueueViewEvents(container) {
  container.querySelectorAll('.btn-move-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const incId = e.currentTarget.getAttribute('data-inc-id');
      const targetStatus = e.currentTarget.getAttribute('data-target');
      
      let squadName = null;
      if (targetStatus === 'assigned' || targetStatus === 'in_progress') {
        squadName = prompt('Enter Squad to assign:', 'Squad Alpha (SAR)');
      }

      store.updateIncidentStatus(incId, targetStatus, squadName);
    });
  });
}
