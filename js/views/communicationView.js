// Screen 6: Multi-Agency Communication Feed

import { store } from '../state.js';

let activeChannel = 'global';

export function renderCommunicationView() {
  const messages = store.chatMessages.filter(m => activeChannel === 'global' || m.channel === activeChannel);

  const channels = [
    { id: 'global', name: 'Global Command Channel', icon: 'fa-globe' },
    { id: 'medical', name: 'Medical & Evac Unit', icon: 'fa-user-doctor' },
    { id: 'logistics', name: 'Logistics & Supply', icon: 'fa-truck-ramp-box' },
    { id: 'sar', name: 'Search & Rescue Ops', icon: 'fa-person-shelter' }
  ];

  return `
    <div class="view-container">
      <div class="view-header">
        <div class="view-title-group">
          <h1>
            <i class="fa-solid fa-walkie-talkie" style="color: var(--color-primary);"></i>
            Multi-Agency Encrypted Communication Feed
          </h1>
          <p class="view-subtitle">Inter-agency radio dispatch, instant status updates & broadcast warnings</p>
        </div>
      </div>

      <div class="view-body" style="flex: 1; display: flex; flex-direction: column;">
        <div class="chat-container">
          
          <!-- Channels Sidebar -->
          <div class="chat-channels-list">
            <strong style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; padding: 6px 10px;">
              Agencies Channels
            </strong>
            ${channels.map(ch => `
              <button class="channel-btn ${activeChannel === ch.id ? 'active' : ''}" data-channel-id="${ch.id}">
                <i class="fa-solid ${ch.icon}"></i>
                <span>${ch.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Chat Stream & Input -->
          <div class="chat-main">
            <div class="chat-messages" id="chat-messages-container">
              ${messages.map(msg => `
                <div class="message-bubble" style="${msg.isBroadcast ? 'max-width: 100%; border-left: 4px solid var(--color-critical);' : ''}">
                  <div class="message-avatar" style="${msg.isBroadcast ? 'background: var(--color-critical);' : ''}">
                    ${msg.sender.slice(0, 2).toUpperCase()}
                  </div>
                  <div class="message-content" style="${msg.isBroadcast ? 'background: var(--color-critical-bg); border-color: rgba(239,68,68,0.4);' : ''}">
                    <div class="message-header">
                      <span class="sender-name">${msg.sender}</span>
                      <span class="badge badge-low" style="font-size: 0.65rem;">${msg.agency}</span>
                      ${msg.isEncrypted ? '<i class="fa-solid fa-lock" title="Encrypted Inter-Agency Channel" style="color: var(--color-high); font-size: 0.7rem;"></i>' : ''}
                      <span class="message-time">${msg.time}</span>
                    </div>
                    <div style="font-size: 0.88rem; margin-top: 2px;">
                      ${msg.text}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Chat Input Area -->
            <form id="chat-form" class="chat-input-area">
              <input type="text" id="chat-text-input" placeholder="Type dispatch message or tactical update..." required style="flex: 1;" />
              
              <label style="display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); cursor: pointer; white-space: nowrap;">
                <input type="checkbox" id="chat-encrypt-flag" />
                <i class="fa-solid fa-lock"></i> Encrypt
              </label>

              <button type="submit" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function bindCommunicationViewEvents(container) {
  // Scroll chat to bottom
  const msgContainer = container.querySelector('#chat-messages-container');
  if (msgContainer) {
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // Channel switcher
  container.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeChannel = e.currentTarget.getAttribute('data-channel-id');
      store.notify();
    });
  });

  // Chat Form Submit
  const form = container.querySelector('#chat-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = container.querySelector('#chat-text-input');
      const isEncrypted = container.querySelector('#chat-encrypt-flag').checked;
      
      if (input.value.trim()) {
        store.sendChatMessage(activeChannel, input.value.trim(), isEncrypted);
        input.value = '';
      }
    });
  }
}
