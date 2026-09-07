/* ReliefLink AI Coordinator — visible only on the Multi-Agency Feed as a side panel. */
(function () {
  'use strict';
  if (window.__reliefLinkAICoordinator) return;
  window.__reliefLinkAICoordinator = true;

  const STYLE_ID = 'relief-link-ai-coordinator-style';
  const PANEL_ID = 'relief-link-ai-coordinator';
  const state = { messages: [] };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function getAppState() {
    try { return JSON.parse(localStorage.getItem('relieflink_state_v1') || '{}'); }
    catch (_) { return {}; }
  }

  function isAgencyFeed() {
    const s = getAppState();
    return s.currentView === 'comms' || s.currentView === 'commsFeed' || s.currentView === 'multi-agency';
  }

  function operationalContext() {
    const s = getAppState();
    return {
      incidents: Array.isArray(s.incidents) ? s.incidents : [],
      resources: Array.isArray(s.resources) ? s.resources : [],
      teams: Array.isArray(s.teams) ? s.teams : [],
      user: s.currentUser || null
    };
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} { position:fixed; right:24px; top:96px; z-index:99999; font-family:Inter,system-ui,sans-serif; }
      #${PANEL_ID} .rl-ai-launch { border:0; border-radius:12px; padding:13px 18px; background:#2563eb; color:#fff; font-weight:800; cursor:pointer; box-shadow:0 10px 30px rgba(0,0,0,.22); display:flex; align-items:center; gap:9px; }
      #${PANEL_ID} .rl-ai-window { display:none; width:min(420px,calc(100vw - 32px)); height:min(620px,calc(100vh - 130px)); background:#0f172a; color:#e5e7eb; border:1px solid rgba(148,163,184,.25); border-radius:18px; overflow:hidden; box-shadow:0 25px 70px rgba(0,0,0,.45); }
      #${PANEL_ID}.open .rl-ai-window { display:flex; flex-direction:column; }
      #${PANEL_ID}.open .rl-ai-launch { display:none; }
      #${PANEL_ID} .rl-ai-head { padding:15px 16px; background:#172554; border-bottom:1px solid rgba(148,163,184,.2); display:flex; align-items:center; justify-content:space-between; }
      #${PANEL_ID} .rl-ai-title { font-weight:800; font-size:15px; }
      #${PANEL_ID} .rl-ai-sub { font-size:11px; opacity:.7; margin-top:3px; }
      #${PANEL_ID} .rl-ai-close { border:0; background:transparent; color:#cbd5e1; font-size:20px; cursor:pointer; }
      #${PANEL_ID} .rl-ai-messages { flex:1; overflow:auto; padding:14px; display:flex; flex-direction:column; gap:10px; }
      #${PANEL_ID} .rl-ai-msg { max-width:88%; padding:10px 12px; border-radius:12px; line-height:1.45; font-size:13px; white-space:pre-wrap; }
      #${PANEL_ID} .rl-ai-msg.ai { align-self:flex-start; background:#1e293b; }
      #${PANEL_ID} .rl-ai-msg.user { align-self:flex-end; background:#2563eb; color:#fff; }
      #${PANEL_ID} .rl-ai-input { border-top:1px solid rgba(148,163,184,.2); padding:12px; background:#111827; }
      #${PANEL_ID} textarea { width:100%; box-sizing:border-box; resize:none; min-height:54px; max-height:120px; border:1px solid #334155; border-radius:10px; padding:10px; background:#020617; color:#fff; outline:none; font:inherit; }
      #${PANEL_ID} .rl-ai-actions { display:flex; gap:8px; margin-top:8px; }
      #${PANEL_ID} .rl-ai-send { flex:1; border:0; border-radius:9px; padding:10px; background:#22c55e; color:#052e16; font-weight:800; cursor:pointer; }
      #${PANEL_ID} .rl-ai-clear { border:1px solid #334155; border-radius:9px; padding:10px 12px; background:#0f172a; color:#cbd5e1; cursor:pointer; }
      #${PANEL_ID} .rl-ai-suggestions { display:flex; flex-wrap:wrap; gap:6px; padding:10px 14px 0; }
      #${PANEL_ID} .rl-ai-suggestion { border:1px solid #334155; border-radius:999px; padding:6px 9px; background:#111827; color:#cbd5e1; font-size:11px; cursor:pointer; }
      #${PANEL_ID} .rl-ai-status { font-size:10px; opacity:.65; margin-top:5px; }
    `;
    document.head.appendChild(style);
  }

  function renderMessages(container) {
    container.innerHTML = state.messages.map(m => `<div class="rl-ai-msg ${m.role === 'user' ? 'user' : 'ai'}">${escapeHtml(m.content)}</div>`).join('');
    container.scrollTop = container.scrollHeight;
  }

  async function sendMessage(text, ui) {
    const value = String(text || '').trim();
    if (!value || ui.sending) return;
    ui.sending = true;
    state.messages.push({ role:'user', content:value });
    renderMessages(ui.messages);
    ui.input.value = '';
    ui.status.textContent = 'AI coordinator is analyzing the operational picture…';
    ui.send.disabled = true;
    try {
      const response = await fetch('/api/agency-ai', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ messages:state.messages, context:operationalContext() })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `AI service returned ${response.status}`);
      state.messages.push({ role:'assistant', content:data.text || 'I could not produce a response.' });
      renderMessages(ui.messages);
      ui.status.textContent = 'AI support active • human confirmation required for real-world actions';
    } catch (error) {
      state.messages.push({ role:'assistant', content:`AI coordinator unavailable: ${error.message}` });
      renderMessages(ui.messages);
      ui.status.textContent = 'AI service unavailable';
    } finally {
      ui.sending = false;
      ui.send.disabled = false;
      ui.input.focus();
    }
  }

  function mount() {
    if (!document.body || !isAgencyFeed() || document.getElementById(PANEL_ID)) return;
    addStyles();
    const root = document.createElement('div');
    root.id = PANEL_ID;
    root.innerHTML = `
      <button class="rl-ai-launch" type="button"><span>✦</span> AI Coordinator</button>
      <section class="rl-ai-window" aria-label="ReliefLink AI Coordinator">
        <header class="rl-ai-head"><div><div class="rl-ai-title">✦ ReliefLink AI Coordinator</div><div class="rl-ai-sub">Multi-agency operational support</div></div><button class="rl-ai-close" type="button" aria-label="Close">×</button></header>
        <div class="rl-ai-suggestions"><button class="rl-ai-suggestion" type="button">What needs attention first?</button><button class="rl-ai-suggestion" type="button">Find resource gaps</button><button class="rl-ai-suggestion" type="button">Draft an agency alert</button></div>
        <div class="rl-ai-messages"></div>
        <div class="rl-ai-input"><textarea placeholder="Ask about incidents, teams, resources, priorities…"></textarea><div class="rl-ai-actions"><button class="rl-ai-clear" type="button">Clear</button><button class="rl-ai-send" type="button">Send</button></div><div class="rl-ai-status">AI suggestions are advisory. A human coordinator must approve real-world actions.</div></div>
      </section>`;
    document.body.appendChild(root);

    const ui = { root, launch:root.querySelector('.rl-ai-launch'), close:root.querySelector('.rl-ai-close'), messages:root.querySelector('.rl-ai-messages'), input:root.querySelector('textarea'), send:root.querySelector('.rl-ai-send'), clear:root.querySelector('.rl-ai-clear'), status:root.querySelector('.rl-ai-status'), sending:false };
    state.messages = [{ role:'assistant', content:'Hello. I\'m the ReliefLink AI Coordinator. I can analyze the current incidents, teams and resources, help prioritize work, and draft messages for the agencies. I will not claim that a real-world action happened unless the system confirms it.' }];
    renderMessages(ui.messages);
    ui.launch.addEventListener('click', () => root.classList.add('open'));
    ui.close.addEventListener('click', () => root.classList.remove('open'));
    ui.send.addEventListener('click', () => sendMessage(ui.input.value, ui));
    ui.input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(ui.input.value, ui); } });
    ui.clear.addEventListener('click', () => { state.messages = []; renderMessages(ui.messages); });
    root.querySelectorAll('.rl-ai-suggestion').forEach(btn => btn.addEventListener('click', () => sendMessage(btn.textContent, ui)));
  }

  function remove() {
    const root = document.getElementById(PANEL_ID);
    if (root) root.remove();
  }

  function syncVisibility() {
    if (isAgencyFeed()) mount();
    else remove();
  }

  function init() {
    syncVisibility();
    const app = document.querySelector('#app');
    if (app) new MutationObserver(() => requestAnimationFrame(syncVisibility)).observe(app, { childList:true, subtree:true });
    window.addEventListener('popstate', syncVisibility);
    setInterval(syncVisibility, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
