/* ReliefLink - authoritative live disaster cards.
 * Static demo impact figures are intentionally not used as real-world facts.
 */
(function () {
  'use strict';

  const USGS = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson';
  const EONET = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson?status=open&days=7&limit=100';
  const REFRESH = 60000;

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (v, fallback = 'Data unavailable') => v === undefined || v === null || v === '' ? fallback : String(v);

  function severityEq(p) {
    const a = String(p.alert || '').toLowerCase();
    if (a === 'red' || Number(p.sig) >= 800 || Number(p.mmi) >= 7) return ['critical', '#EF4444'];
    if (a === 'orange' || Number(p.sig) >= 600 || Number(p.mmi) >= 5) return ['high', '#F59E0B'];
    if (Number(p.mag) >= 4.5) return ['moderate', '#EAB308'];
    return ['low', '#22C55E'];
  }

  function severityEvent(p) {
    const title = String(p.title || '').toLowerCase();
    if (/volcan|eruption|severe storm|hurricane|typhoon|tropical cyclone/.test(title)) return ['high', '#F59E0B'];
    if (/wildfire|fire|flood|landslide|dust/.test(title)) return ['moderate', '#EAB308'];
    return ['info', '#64748B'];
  }

  function card(title, location, category, severity, color, details, time, source, url) {
    return `<article class="rl-live-truth-card" style="border-left:4px solid ${color}">
      <div class="rl-live-truth-head"><div><span class="rl-live-badge" style="color:${color}">${esc(severity.toUpperCase())}</span><h3>${esc(title)}</h3></div></div>
      <div class="rl-live-truth-grid">
        <div><small>LOCATION</small><strong>${esc(location)}</strong></div>
        <div><small>TYPE</small><strong>${esc(category)}</strong></div>
        ${details}
        <div><small>EVENT TIME</small><strong>${esc(time)}</strong></div>
      </div>
      <div class="rl-live-truth-foot">Source: <b>${esc(source)}</b>${url ? ` · <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">View source</a>` : ''}</div>
    </article>`;
  }

  function findHost() {
    return document.querySelector('#live-disaster-truth-list') || document.querySelector('[data-live-disaster-list]');
  }

  async function refresh() {
    const host = findHost();
    if (!host) return;
    try {
      const [er, nr] = await Promise.all([fetch(USGS, {cache:'no-store'}), fetch(EONET, {cache:'no-store'})]);
      if (!er.ok || !nr.ok) throw new Error('live feed unavailable');
      const [eq, no] = await Promise.all([er.json(), nr.json()]);
      const cards = [];

      (eq.features || []).slice(0, 8).forEach(f => {
        const p = f.properties || {}, c = f.geometry?.coordinates || [];
        const [sev, color] = severityEq(p);
        const details = `<div><small>MAGNITUDE</small><strong>M${Number.isFinite(Number(p.mag)) ? Number(p.mag).toFixed(1) : '—'}</strong></div>
          <div><small>DEPTH</small><strong>${Number.isFinite(Number(c[2])) ? Number(c[2]).toFixed(1) + ' km' : 'Data unavailable'}</strong></div>
          <div><small>TSUNAMI</small><strong>${p.tsunami === 1 ? 'Warning flag' : p.tsunami === 0 ? 'No flag' : 'Data unavailable'}</strong></div>
          <div><small>IMPACT</small><strong>Data unavailable</strong></div>`;
        cards.push(card('Earthquake', p.place || 'Unknown location', 'Earthquake', sev, color, details, p.time ? new Date(p.time).toLocaleString() : 'Data unavailable', 'USGS', p.url));
      });

      (no.features || []).slice(0, 12).forEach(f => {
        const p = f.properties || {}, g = f.geometry || {};
        if (g.type !== 'Point' || !Array.isArray(g.coordinates)) return;
        const [sev, color] = severityEvent(p);
        const cats = Array.isArray(p.categories) ? p.categories.map(x => x.title || x).join(', ') : text(p.categories, 'Natural event');
        const magnitude = p.magnitudeValue !== undefined ? `${p.magnitudeValue} ${p.magnitudeUnit || ''}`.trim() : 'Data unavailable';
        const details = `<div><small>CATEGORY</small><strong>${esc(cats)}</strong></div>
          <div><small>MAGNITUDE</small><strong>${esc(magnitude)}</strong></div>
          <div><small>IMPACT</small><strong>Data unavailable</strong></div>`;
        cards.push(card(p.title || 'Natural event', 'Live event coordinates', cats, sev, color, details, p.date ? new Date(p.date).toLocaleString() : 'Data unavailable', 'NASA EONET', p.link));
      });

      host.innerHTML = cards.length ? cards.join('') : '<div class="rl-live-empty">No current significant events returned by the live sources.</div>';
      const status = document.querySelector('#live-truth-status');
      if (status) status.textContent = `Authoritative feeds updated ${new Date().toLocaleTimeString()}`;
    } catch (e) {
      console.warn('Live truth layer:', e);
      const status = document.querySelector('#live-truth-status');
      if (status) status.textContent = 'Live authoritative feeds temporarily unavailable';
    }
  }

  function mount() {
    let host = findHost();
    if (!host) {
      const map = document.querySelector('#disaster-map-element');
      if (!map) return;
      host = document.createElement('div');
      host.id = 'live-disaster-truth-list';
      host.setAttribute('data-live-disaster-list', 'true');
      host.innerHTML = '<div id="live-truth-status">Loading authoritative disaster data…</div>';
      map.parentElement?.appendChild(host);
    }
    if (!document.getElementById('rl-live-truth-style')) {
      const s = document.createElement('style');
      s.id = 'rl-live-truth-style';
      s.textContent = `.rl-live-truth-card{background:var(--surface,#fff);border:1px solid rgba(100,116,139,.2);border-radius:10px;padding:12px;margin:8px 0;box-shadow:0 2px 8px rgba(0,0,0,.05)}.rl-live-truth-head h3{margin:3px 0 8px;font-size:.95rem}.rl-live-badge{font:700 .65rem JetBrains Mono,monospace;letter-spacing:.08em}.rl-live-truth-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.rl-live-truth-grid div{min-width:0}.rl-live-truth-grid small{display:block;color:#64748b;font-size:.62rem;font-weight:700}.rl-live-truth-grid strong{display:block;font-size:.78rem;margin-top:2px}.rl-live-truth-foot{margin-top:9px;font-size:.68rem;color:#64748b}.rl-live-truth-foot a{color:#2563eb}.rl-live-empty{padding:16px;color:#64748b}`;
      document.head.appendChild(s);
    }
    refresh();
    setInterval(refresh, REFRESH);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();
